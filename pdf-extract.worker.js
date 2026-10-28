"use strict";

const PDF_ASSET_VERSION = "start-links-blue-underlined-ui-20260720";

function normalizeText(value) {
  return String(value || "").normalize("NFKC").replace(/\s+/g, " ").trim();
}

function visibleError(error) {
  return {
    code: String(error?.code || "PDF_WORKER_FAILED"),
    message: normalizeText(error?.message) || "PDFの文字を読み取れませんでした。",
  };
}

function loadPdfJs() {
  try {
    Object.defineProperty(self, "Worker", { value: undefined, configurable: true, writable: true });
  } catch {
    try { self.Worker = undefined; } catch { /* Dedicated worker remains isolated even if nested Worker cannot be hidden. */ }
  }
  importScripts(`./vendor/pdf.min.js?v=${PDF_ASSET_VERSION}`);
  importScripts(`./vendor/pdf.worker.min.js?v=${PDF_ASSET_VERSION}`);
  const pdfLib = self.pdfjsLib || self["pdfjs-dist/build/pdf"];
  if (!pdfLib?.getDocument) throw new Error("PDF解析ライブラリを読み込めませんでした。");
  if (pdfLib.GlobalWorkerOptions) {
    pdfLib.GlobalWorkerOptions.workerSrc = `./vendor/pdf.worker.min.js?v=${PDF_ASSET_VERSION}`;
  }
  return pdfLib;
}

let pdfLib = null;

self.addEventListener("message", async (event) => {
  if (event.data?.type !== "extract") return;
  let pdf = null;
  try {
    pdfLib ||= loadPdfJs();
    const bytes = new Uint8Array(event.data.buffer);
    const maxPages = Number(event.data.maxPages || 5);
    pdf = await pdfLib.getDocument({ data: bytes, disableWorker: true }).promise;
    const readPages = Math.min(pdf.numPages, maxPages);
    const truncated = pdf.numPages > readPages;
    self.postMessage({ type: "document", numPages: pdf.numPages });
    for (let pageNo = 1; pageNo <= readPages; pageNo += 1) {
      self.postMessage({ type: "page-start", pageNo, numPages: pdf.numPages });
      const page = await pdf.getPage(pageNo);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      const items = content.items
        .map((item) => ({
          text: normalizeText(item.str),
          x: item.transform[4],
          y: viewport.height - item.transform[5],
        }))
        .filter((item) => item.text);
      self.postMessage({ type: "page", pageNo, numPages: pdf.numPages, items });
      try { page.cleanup?.(); } catch { /* Best effort. */ }
    }
    self.postMessage({ type: "done", numPages: pdf.numPages, readPages, truncated });
  } catch (error) {
    self.postMessage({ type: "error", error: visibleError(error) });
  } finally {
    try { await pdf?.destroy?.(); } catch { /* The outer worker will be terminated by the page. */ }
  }
});
