const RETIRED_BUILD = "start-links-blue-underlined-ui-20260720";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    await self.registration.unregister().catch(() => false);
    await self.clients.claim().catch(() => undefined);
  })());
});
