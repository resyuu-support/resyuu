const RELEASE_BUILD = "start-links-blue-underlined-ui-20260720";
const initialHashPage = location.hash.slice(1).split("/")[0];
const initialPage = location.hash === "#planning"
  ? "requirements"
  : (["dashboard", "requirements", "courses"].includes(initialHashPage) ? initialHashPage : "dashboard");

if (location.hash === "#planning") history.replaceState(null, "", "#requirements");
try {
  localStorage.removeItem("rishu_support_plans");
} catch {
  // Storage can be unavailable in private browsing; the removed data is never read.
}

const state = {
  faculty: "business",
  department: "",
  lawCourse: "",
  literatureMajor: "",
  ihsGspRoute: "gsp",
  teachingEnabled: false,
  teachingSchool: "",
  teachingSubject: "",
  teachingAssessmentStarted: false,
  teachingRequirements: {},
  teachingAvailability: {},
  retakeRequirements: {},
  retakePoolMaster: {},
  retakeEligibilityMaster: {},
  retakeCompletenessMaster: {},
  finalP0Rules: {},
  facultyResultRequirements: {},
  profileAvailabilityMatrix: [],
  releaseSupportMatrix: [],
  releaseSupportVariants: [],
  releaseSupportMatrixVersion: "",
  releaseSourceCatalog: {},
  profileFixtureCatalog: {},
  regressionFixtureCatalog: {},
  courseIdentityMaster: {},
  businessCourseCreditCorrectionMaster: {},
  accuracyLedgerPolicy: {},
  goldenFixtureSpecifications: {},
  accuracyReleaseGate: {},
  semesterWorkloadMaster: {},
  semesterWorkloadProfileKey: "",
  semesterWorkloadToggle: true,
  semesterWorkloadRemainingSemesters: null,
  semesterWorkloadRemainingSemestersEdited: false,
  rulesVersion: "",
  resultView: "graduation",
  courseSortMode: "year",
  courseSortDirection: "desc",
  rules: {},
  faculties: {},
  year: "2024",
  activePage: initialPage,
  restoredNavigationHash: "",
  profileSource: "default",
  diagnosisId: "",
  decoratedProfileKey: "",
  integrityIssue: null,
  fixtureRunResult: null,
  runtimeStop: null,
  pdfDiagnostics: null,
  data: null,
  homeScreenNudgeDismissed: false,
};

const DEPARTMENT_LABELS = {
  globalCulture: "グローバル文化学科",
  humanDevelopment: "発達コミュニティ学科",
  environment: "環境共生学科",
  childEducation: "子ども教育学科",
};

const LAW_COURSE_LABELS = {
  justice: "司法コース",
  corporate: "企業・行政コース",
  politics: "政治・国際コース",
};

const API_BASE = location.protocol === "file:" ? "http://127.0.0.1:8780" : location.origin;
const APP_BUILD = (() => {
  try {
    return new URL(document.currentScript?.src || location.href).searchParams.get("v") || RELEASE_BUILD;
  } catch {
    return RELEASE_BUILD;
  }
})();
const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/uri_support/";
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_PDF_PAGES = 5;
const PDF_RUNTIME = Object.freeze({
  isIosLike: () => /iPad|iPhone|iPod/.test(navigator.userAgent || "")
    || (navigator.platform === "MacIntel" && Number(navigator.maxTouchPoints || 0) > 1),
  isInstagramBrowser: () => /Instagram/i.test(navigator.userAgent || ""),
});
const PDFJS_VERSION = "3.11.174";
const PDF_EXTRACT_WORKER_URL = "./pdf-extract.worker.js?v=start-links-blue-underlined-ui-20260720";
const PDF_FILE_READ_TIMEOUT_MS = 20000;
const PDF_WORKER_STALL_TIMEOUT_MS = 15000;
const PDF_WORKER_HARD_TIMEOUT_MS = 35000;
const INSTAGRAM_RECOVERY_MESSAGE = "読み取りが止まる場合は、右上のメニューから「外部ブラウザーで開く」を選んでください。";

function getPdfJs() {
  const candidates = [
    window.pdfjsLib,
    window["pdfjs-dist/build/pdf"],
    globalThis.pdfjsLib,
    globalThis["pdfjs-dist/build/pdf"],
    globalThis.exports?.["pdfjs-dist/build/pdf"],
    globalThis.module?.exports,
  ];
  return candidates.find((candidate) => typeof candidate?.getDocument === "function");
}

const PDFJS = getPdfJs();
document.documentElement.dataset.pdfReady = typeof Worker === "function" ? "true" : "false";

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

const el = {
  topbar: document.getElementById("topbar"),
  profileControls: document.getElementById("profileControls"),
  profileSummary: document.getElementById("profileSummary"),
  profileSource: document.getElementById("profileSource"),
  facultySelect: document.getElementById("facultySelect"),
  departmentSelect: document.getElementById("departmentSelect"),
  ihsGspRouteSelect: document.getElementById("ihsGspRouteSelect"),
  lawCourseSelect: document.getElementById("lawCourseSelect"),
  literatureMajorSelect: document.getElementById("literatureMajorSelect"),
  yearSelect: document.getElementById("yearSelect"),
  viewTabs: document.getElementById("viewTabs"),
  resultModeTabs: document.getElementById("resultModeTabs"),
  teachingResultTab: document.getElementById("teachingResultTab"),
  programResultTab: document.getElementById("programResultTab"),
  startScreen: document.getElementById("startScreen"),
  pdfInput: document.getElementById("pdfInput"),
  uploadStatus: document.getElementById("uploadStatus"),
  uploadProgressContainer: document.getElementById("uploadProgressContainer"),
  uploadProgress: document.getElementById("uploadProgress"),
  uploadProgressBar: document.getElementById("uploadProgressBar"),
  browserHint: document.getElementById("browserHint"),
  pdfDiagnosticDetails: document.getElementById("pdfDiagnosticDetails"),
  pdfDiagnosticCode: document.getElementById("pdfDiagnosticCode"),
  copyPdfDiagnosticButton: document.getElementById("copyPdfDiagnosticButton"),
  pdfDiagnosticCopyStatus: document.getElementById("pdfDiagnosticCopyStatus"),
  profileStopPanel: document.getElementById("profileStopPanel"),
  profileStopTitle: document.getElementById("profileStopTitle"),
  profileStopMessage: document.getElementById("profileStopMessage"),
  profileSupportRange: document.getElementById("profileSupportRange"),
  profileStopReportButton: document.getElementById("profileStopReportButton"),
  studentName: document.getElementById("studentName"),
  studentMeta: document.getElementById("studentMeta"),
  modeBadge: document.getElementById("modeBadge"),
  ruleBadge: document.getElementById("ruleBadge"),
  readingNoticeSection: document.getElementById("readingNoticeSection"),
  readingNoticeCount: document.getElementById("readingNoticeCount"),
  readingNoticeList: document.getElementById("readingNoticeList"),
  evidenceDetails: document.getElementById("evidenceDetails"),
  evidenceList: document.getElementById("evidenceList"),
  officialSourceList: document.getElementById("officialSourceList"),
  reportIssueButton: document.getElementById("reportIssueButton"),
  reportStatus: document.getElementById("reportStatus"),
  issueReportPreview: document.getElementById("issueReportPreview"),
  graduationRemainingValue: document.getElementById("graduationRemainingValue"),
  resultProfileLine: document.getElementById("resultProfileLine"),
  graduationRemainingCredits: document.getElementById("graduationRemainingCredits"),
  graduationRemainingUnit: document.getElementById("graduationRemainingUnit"),
  graduationCountedCredits: document.getElementById("graduationCountedCredits"),
  graduationProgress: document.getElementById("graduationProgress"),
  graduationProgressBar: document.getElementById("graduationProgressBar"),
  transcriptEarnedCredits: document.getElementById("transcriptEarnedCredits"),
  excludedCreditsRow: document.getElementById("excludedCreditsRow"),
  excludedCredits: document.getElementById("excludedCredits"),
  semesterWorkloadSection: document.getElementById("semesterWorkloadSection"),
  semesterWorkloadValue: document.getElementById("semesterWorkloadValue"),
  semesterWorkloadDisclosure: document.getElementById("semesterWorkloadDisclosure"),
  semesterWorkloadBreakdown: document.getElementById("semesterWorkloadBreakdown"),
  semesterWorkloadStatus: document.getElementById("semesterWorkloadStatus"),
  semesterWorkloadToggleRow: document.getElementById("semesterWorkloadToggleRow"),
  semesterWorkloadToggle: document.getElementById("semesterWorkloadToggle"),
  semesterWorkloadRemainingSemesters: document.getElementById("semesterWorkloadRemainingSemesters"),
  resultConfidenceBadge: document.getElementById("resultConfidenceBadge"),
  gpaAuxiliary: document.getElementById("gpaAuxiliary"),
  gpaValue: document.getElementById("gpaValue"),
  graduationGroupList: document.getElementById("graduationGroupList"),
  failureOverviewEntry: document.getElementById("failureOverviewEntry"),
  failureOverviewCandidateCount: document.getElementById("failureOverviewCandidateCount"),
  failureOverviewOtherCount: document.getElementById("failureOverviewOtherCount"),
  retakeCandidateCount: document.getElementById("retakeCandidateCount"),
  retakeCandidateList: document.getElementById("retakeCandidateList"),
  retakeCandidateSection: document.getElementById("retakeCandidateSection"),
  failedHistoryDetails: document.getElementById("failedHistoryDetails"),
  failedHistoryCount: document.getElementById("failedHistoryCount"),
  failedHistoryList: document.getElementById("failedHistoryList"),
  teachingSection: document.getElementById("teachingSection"),
  teachingControls: document.getElementById("teachingControls"),
  teachingSchoolSelect: document.getElementById("teachingSchoolSelect"),
  teachingSubjectSelect: document.getElementById("teachingSubjectSelect"),
  teachingRunButton: document.getElementById("teachingRunButton"),
  teachingProfileSummary: document.getElementById("teachingProfileSummary"),
  teachingStatus: document.getElementById("teachingStatus"),
  teachingResults: document.getElementById("teachingResults"),
  liberalRule: document.getElementById("liberalRule"),
  liberalList: document.getElementById("liberalList"),
  requirements: document.getElementById("requirements"),
  exportButton: document.getElementById("exportButton"),
  courseColumnsButton: document.getElementById("courseColumnsButton"),
  courseSection: document.getElementById("courseSection"),
  specialProgramBadge: document.getElementById("specialProgramBadge"),
  specialProgramSelect: document.getElementById("specialProgramSelect"),
  specialProgramList: document.getElementById("specialProgramList"),
  searchInput: document.getElementById("searchInput"),
  statusFilter: document.getElementById("statusFilter"),
  categoryFilter: document.getElementById("categoryFilter"),
  courseSortSelect: document.getElementById("courseSortSelect"),
  courseSortDirection: document.getElementById("courseSortDirection"),
  courseSortStatus: document.getElementById("courseSortStatus"),
  courseTable: document.getElementById("courseTable"),
  issueReportDialog: document.getElementById("issueReportDialog"),
  issueType: document.getElementById("issueType"),
  issueReportDialogPreview: document.getElementById("issueReportDialogPreview"),
  issueReportDialogStatus: document.getElementById("issueReportDialogStatus"),
  confirmIssueReportButton: document.getElementById("confirmIssueReportButton"),
  openInstagramProfileButton: document.getElementById("openInstagramProfileButton"),
  homeScreenGuideButton: document.getElementById("homeScreenGuideButton"),
  homeScreenNudge: document.getElementById("homeScreenNudge"),
  resultHomeScreenGuideButton: document.getElementById("resultHomeScreenGuideButton"),
  dismissHomeScreenNudgeButton: document.getElementById("dismissHomeScreenNudgeButton"),
  homeScreenGuideDialog: document.getElementById("homeScreenGuideDialog"),
  howToButton: document.getElementById("howToButton"),
  howToDialog: document.getElementById("howToDialog"),
  privacyButton: document.getElementById("privacyButton"),
  footerPrivacyButton: document.getElementById("footerPrivacyButton"),
  privacyDialog: document.getElementById("privacyDialog"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalize(value) {
  return String(value ?? "").normalize("NFKC").replace(/\s+/g, " ").trim();
}

function compactCourseName(value) {
  return normalize(value)
    .replace(/[\s・･\-‐‑–—ー（）()[\]［］「」『』、,，.．]/g, "")
    .toUpperCase();
}

function identityCourseNameKey(value) {
  return normalize(value).replace(/\s+/g, "").toUpperCase();
}

function isSpecificCategory(category) {
  return Boolean(category && category !== "未分類" && category !== "教養科目" && category !== "専門科目" && category !== "その他の科目");
}

function categorySection(category) {
  if (/資格|免許|教職/.test(category)) return "資格・免許";
  return /専門|学部共通|学科|GSP|自由選択/.test(category) ? "専門科目" : "全学共通";
}

function round1(value) {
  return Number(value || 0).toFixed(1);
}

function compactNumber(value) {
  return Number(round1(value)).toString();
}

function pct(value, need) {
  if (!need) return 0;
  return Math.max(0, Math.min(100, (Number(value) / Number(need)) * 100));
}

function normalizeStudentId(value) {
  return normalize(value).replace(/\s+/g, "").toUpperCase();
}

function inferAdmissionYearFromStudentId(value) {
  const match = normalizeStudentId(value).match(/^(\d{2})\d{4,8}[A-Z]?$/);
  return match ? `20${match[1]}` : "";
}

function maskedStudentId(value) {
  const id = normalizeStudentId(value);
  if (!id) return "非表示";
  const suffix = id.match(/[A-Z]$/)?.[0] || "";
  return `${id.slice(0, 2)}****${suffix}`;
}

function inferFacultyKey(value) {
  const text = normalize(value);
  if (text.includes("国際人間科学部")) return "internationalHumanSciences";
  if (text.includes("経済学部")) return "economics";
  if (text.includes("文学部")) return "literature";
  if (text.includes("法学部")) return "law";
  if (text.includes("経営学部")) return "business";
  return "";
}

function inferDepartmentKey(value) {
  const text = normalize(value);
  if (text.includes("グローバル文化学科")) return "globalCulture";
  if (text.includes("発達コミュニティ学科")) return "humanDevelopment";
  if (text.includes("環境共生学科")) return "environment";
  if (text.includes("子ども教育学科")) return "childEducation";
  return "";
}

function currentFacultyConfig() {
  return state.faculties[state.faculty] || state.faculties.business || { label: "経営学部", rules: state.rules };
}

function currentRule() {
  const faculty = currentFacultyConfig();
  const rules = faculty.rules || state.rules || {};
  const baseRule = rules[state.year] || rules[faculty.defaultYear] || state.rules[state.year] || state.rules["2024"] || {};
  if (state.faculty !== "internationalHumanSciences" || baseRule.unavailable || !baseRule.requiresDepartment) {
    return baseRule;
  }
  if (!state.department) {
    return {
      ...baseRule,
      unavailable: true,
      missingDepartment: true,
      unavailableReason: "国際人間科学部は学科を選択すると、該当する卒業要件を表示できます。",
    };
  }
  const departmentRule = baseRule.departments?.[state.department];
  if (!departmentRule) {
    return {
      ...baseRule,
      unavailable: true,
      missingDepartment: true,
      unavailableReason: "選択した学科の卒業要件を確認できません。学科を選び直してください。",
    };
  }
  return {
    ...baseRule,
    ...departmentRule,
    departmentLabel: departmentRule.label || DEPARTMENT_LABELS[state.department],
  };
}

function currentProfileAvailabilityEntry(faculty = state.faculty, year = state.year) {
  return state.profileAvailabilityMatrix.find((entry) => (
    entry.faculty === faculty && String(entry.entranceYear) === String(year)
  )) || null;
}

function permissiveLawSupportEntries() {
  const rules = state.faculties.law?.rules || {};
  return ["2025", "2026"].flatMap((year) => {
    const rule = rules[year];
    if (!rule || rule.unavailable === true || !Number(rule.total) || !Number(rule.special)) return [];
    return [{
      id: `LAW-${year}-PROVISIONAL`,
      faculty: "law",
      entranceYear: Number(year),
      department: null,
      major: null,
      course: null,
      assessmentEnabled: true,
      provisionalSupport: true,
      sourceIds: year === "2026"
        ? ["LAW-CORRECTION-2026", "LAW-HANDBOOK-2026"]
        : ["LAW-HANDBOOK-2025"],
    }];
  });
}

function detailedSupportEntries() {
  const entries = state.releaseSupportVariants.length
    ? state.releaseSupportVariants
    : state.releaseSupportMatrix.filter((entry) => (
      entry.assessmentEnabled === true || (entry.supported === true && entry.status === "detailed")
    ));
  const merged = [...entries];
  for (const fallback of permissiveLawSupportEntries()) {
    if (!merged.some((entry) => (
      entry.faculty === fallback.faculty
      && String(entry.entranceYear) === String(fallback.entranceYear)
    ))) merged.push(fallback);
  }
  return merged;
}

function currentReleaseSupportEntry(faculty = state.faculty, year = state.year) {
  return detailedSupportEntries().find((entry) => (
    entry.faculty === faculty
    && String(entry.entranceYear) === String(year)
    && (entry.department ?? null) === (state.department || null)
    && (entry.major ?? null) === (state.literatureMajor || null)
    && (entry.course ?? null) === (state.lawCourse || null)
  )) || null;
}

function profileAssessmentStatus() {
  if (state.runtimeStop) return { code: "runtime_stop", error: state.runtimeStop };
  if (state.releaseSupportVariants.length) {
    const profileVariants = detailedSupportEntries().filter((entry) => (
      entry.faculty === state.faculty && String(entry.entranceYear) === String(state.year)
    ));
    if (!profileVariants.length) return { code: "unsupported_profile", entry: null };
    if (profileVariants.some((entry) => entry.department) && !state.department) {
      return { code: "profile_selection_required", field: "department", entry: null };
    }
    if (profileVariants.some((entry) => entry.major) && !state.literatureMajor) {
      return { code: "profile_selection_required", field: "major", entry: null };
    }
    if (profileVariants.some((entry) => entry.course) && !state.lawCourse) {
      return { code: "profile_selection_required", field: "course", entry: null };
    }
    const exact = currentReleaseSupportEntry();
    return exact ? { code: "supported", entry: exact } : { code: "unsupported_variant", entry: null };
  }
  const availability = currentProfileAvailabilityEntry();
  if (!availability || availability.assessmentEnabled !== true) {
    return { code: "unsupported_profile", entry: availability };
  }
  if (availability.departmentRequired && !state.department) {
    return { code: "profile_selection_required", field: "department", entry: availability };
  }
  if (availability.majorRequired && !state.literatureMajor) {
    return { code: "profile_selection_required", field: "major", entry: availability };
  }
  const entry = currentReleaseSupportEntry();
  if (!entry || entry.assessmentEnabled !== true) return { code: "unsupported_variant", entry };
  return { code: "supported", entry };
}

function profileIsAssessable() {
  return profileAssessmentStatus().code === "supported";
}

function supportedProfileRangeText() {
  const labels = {
    business: "経営学部",
    economics: "経済学部",
    law: "法学部",
    internationalHumanSciences: "国際人間科学部",
    literature: "文学部",
  };
  const groups = new Map();
  for (const entry of detailedSupportEntries()) {
    const years = groups.get(entry.faculty) || [];
    years.push(Number(entry.entranceYear));
    groups.set(entry.faculty, years);
  }
  return [...groups.entries()].map(([faculty, rawYears]) => {
    const years = [...new Set(rawYears)].sort((a, b) => a - b);
    const yearText = years.length > 1 && years.every((year, index) => index === 0 || year === years[index - 1] + 1)
      ? `${years[0]}〜${years[years.length - 1]}年度`
      : `${years.join("・")}年度`;
    const selection = faculty === "internationalHumanSciences"
      ? "・学科選択必須"
      : (faculty === "literature" ? "・専修選択必須" : (faculty === "law" ? "・コース選択必須" : ""));
    return `${labels[faculty] || faculty} ${yearText}${selection}`;
  }).join(" / ");
}

function applySupportOptionAvailability() {
  if (!state.profileAvailabilityMatrix.length && !state.releaseSupportVariants.length) return;
  const supportedEntries = detailedSupportEntries();
  for (const option of el.facultySelect?.options || []) {
    option.disabled = !supportedEntries.some((entry) => entry.faculty === option.value);
  }
  for (const option of el.yearSelect?.options || []) {
    option.disabled = !supportedEntries.some((entry) => (
      entry.faculty === state.faculty && String(entry.entranceYear) === option.value
    ));
  }
}

function ensureProfileDataDecorated() {
  if (!state.data || !profileIsAssessable()) return false;
  const key = [state.faculty, state.year, state.department, state.literatureMajor, state.lawCourse, state.ihsGspRoute].join("|");
  if (state.decoratedProfileKey === key) return true;
  decorateCourseUsages(state.data.courses || [], { source: "成績表PDF" });
  state.decoratedProfileKey = key;
  return true;
}

function createAnonymousDiagnosisId() {
  const bytes = new Uint8Array(6);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  }
  return `RS-${[...bytes].map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function courses() {
  return state.data?.courses || [];
}

function isEarned(course) {
  return Number(course.credits || 0) > 0 && !["不可", "取消", "未履修"].includes(course.grade);
}

function isQualificationCourse(course) {
  const text = normalize(`${course.transcriptCategory || ""} ${course.section || ""} ${course.category || ""} ${course.group || ""}`);
  return /資格|免許|教職/.test(text);
}

function exactCourseName(course, target) {
  return compactCourseName(course?.name || "") === compactCourseName(target);
}

function courseNameStartsWith(course, target) {
  return compactCourseName(course?.name || "").startsWith(compactCourseName(target));
}

function teachingUsageTags(course) {
  const tags = [];
  const name = normalize(course?.name || "");
  const articleGroups = {
    "日本国憲法": ["日本国憲法1", "日本国憲法2"],
    "体育": ["健康・スポーツ科学実習基礎", "健康・スポーツ科学実習1", "健康・スポーツ科学実習2", "健康・スポーツ科学講義A"],
    "外国語コミュニケーション": [
      "Academic English Communication A1",
      "Academic English Communication A2",
      "Academic English Communication B1",
      "Academic English Communication B2",
    ],
    "情報機器の操作": ["情報リテラシー演習1", "情報リテラシー演習2"],
  };
  for (const [group, names] of Object.entries(articleGroups)) {
    if (names.some((target) => exactCourseName(course, target))) tags.push(`66条の6:${group}`);
  }
  if (courseNameStartsWith(course, "心の発達と教育1") || courseNameStartsWith(course, "心の発達と教育2")) {
    tags.push("教職:教育心理セット");
  }
  if (isKnownQualificationCourseName(name) || isQualificationCourse(course)) tags.push("教職:関連科目");
  return [...new Set(tags)];
}

function decorateCourseUsages(list, meta = {}) {
  for (const [index, course] of (list || []).entries()) {
    const literaturePolicy = state.faculty === "literature" ? literatureCoursePolicy(course) : null;
    if (literaturePolicy?.graduationUse === "excluded_qualification") {
      markQualificationCourse(course, "文学部2026年度科目別記号マスタ");
    }
    if (!Number.isInteger(course.sourceIndex)) course.sourceIndex = index;
    course.transcriptCategory = course.transcriptCategory || course.category || "未分類";
    course.earnedCredits = Number(course.credits || 0);
    course.isEarned = isEarned(course);
    course.source = course.source || meta.source || "成績表PDF";
    course.graduationUsages = isQualificationCourse(course)
      ? []
      : [...new Set([course.category || course.transcriptCategory].filter(Boolean))];
    course.graduationPoolIds = courseGraduationPoolIds(course);
    if (literaturePolicy) {
      course.repeatSymbol = literaturePolicy.gpaSymbol;
      course.repeatAfterPass = literaturePolicy.repeatAfterPass;
      course.retakeAfterFailure = literaturePolicy.retakeAfterFailure;
      course.pastFailGpaAfterRetake = literaturePolicy.pastFailGpaAfterRetake;
      course.literatureGraduationUse = literaturePolicy.graduationUse;
    }
    course.teachingUsages = teachingUsageTags(course);
    course.programUsages = matchesAnyPattern(`${course.name || ""} ${course.category || ""} ${course.group || ""}`, IHS_GSP_COURSE_PATTERNS)
      ? ["GSP"]
      : [];
  }
  return list;
}

function isGpaExcludedCourse(course) {
  return /^(＊|\*|─|―|-)$/.test(normalize(course.gp || ""));
}

function isQualificationContextCandidate(course) {
  if (!course || isQualificationCourse(course)) return false;
  if (!isGpaExcludedCourse(course)) return false;
  if (isFirstYearSeminarCourseName(course.name || "")) return false;
  const text = normalize(`${course.name || ""} ${course.category || ""} ${course.group || ""}`);
  if (/外国語|情報科目|健康・スポーツ|GSP|基礎教養|総合教養|高度教養/.test(text)) return false;
  return true;
}

function hasNearbyQualificationContext(list, index, direction, maxSteps = 3) {
  let checked = 0;
  for (let cursor = index + direction; cursor >= 0 && cursor < list.length && checked < maxSteps; cursor += direction) {
    const course = list[cursor];
    if (!course || !course.name) continue;
    checked += 1;
    if (isQualificationCourse(course)) return true;
    if (!isGpaExcludedCourse(course)) return false;
  }
  return false;
}

function markQualificationCourse(course, reason = "") {
  course.section = "資格・免許";
  course.category = "資格免許科目";
  course.transcriptCategory = "資格免許科目";
  course.group = "資格・免許";
  if (reason) course.classificationRepair = reason;
}

function isRootedExclusionCourse(course) {
  if (!course || isQualificationCourse(course)) return false;
  const text = normalize(`${course.category || ""} ${course.section || ""} ${course.graduationUse || ""}`);
  // In the 2025+ Faculty of Business Administration curriculum,
  // "その他の科目" is an official graduation-credit pool (up to 12 credits),
  // not a synonym for non-degree coursework.
  if (isBusinessNewSystem() && /その他の科目/.test(text) && !/卒業要件外|算入対象外/.test(text)) return false;
  return /その他の科目|卒業要件外|算入対象外/.test(text);
}

function isBusinessNewSystem(year = state.year) {
  return state.faculty === "business" && Number(year) >= 2025;
}

function earnedCreditsFrom(list, predicate) {
  return roundCredits((list || []).filter((course) => isEarned(course) && predicate(course))
    .reduce((total, course) => total + Number(course.credits || 0), 0));
}

function businessLanguageSeries(course) {
  const text = compactCourseName(`${course?.name || ""} ${course?.category || ""} ${course?.group || ""}`);
  if (/外国語第III/.test(text)) return "III";
  if (/外国語第II(?!I)/.test(text) || /(ドイツ|フランス|中国|ロシア|朝鮮|スペイン|イタリア)語初級[AB][1-4１-４]/.test(text)) return "II";
  if (/外国語第I(?!I)/.test(text) || /AcademicEnglish(?:Communication|Literacy)[AB][12１２]/i.test(text)) return "I";
  return "";
}

function businessLanguageICredits(list = courses()) {
  return earnedCreditsFrom(list, (course) => businessLanguageSeries(course) === "I");
}

function businessLanguageIICredits(list = courses()) {
  return earnedCreditsFrom(list, (course) => businessLanguageSeries(course) === "II");
}

function businessHumanNaturalCredits(list = courses()) {
  return earnedCreditsFrom(list, (course) => ["人文系", "自然系"].includes(course.category));
}

function businessFourFieldsCredits(list = courses()) {
  return earnedCreditsFrom(list, (course) => ["人文系", "自然系", "社会系", "総合系"].includes(course.category));
}

function businessCommonBasicRawCredits(list = courses()) {
  return earnedCreditsFrom(list, (course) => course.category === "共通専門基礎科目" || course.group === "共通専門基礎");
}

function businessCommonBasicOverflowCredits(list = courses(), rule = currentRule()) {
  const raw = businessCommonBasicRawCredits(list);
  return Math.min(
    Number(rule.commonBasicOverflowToOtherMax || 0),
    Math.max(0, raw - Number(rule.commonBasic || 0))
  );
}

function businessNewProfessionalCredits(list = courses()) {
  return earnedCreditsFrom(list, (course) => {
    if (course.category === "共通専門基礎科目" || course.group === "共通専門基礎") return false;
    return course.section === "専門科目"
      || ["専門科目", "グローバル科目群"].includes(course.category)
      || ["第1群", "第2群", "第3群", "グローバル科目群"].includes(course.group);
  });
}

function businessNewOtherDirectCredits(list = courses()) {
  return earnedCreditsFrom(list, (course) => {
    const name = compactCourseName(course?.name || "");
    const classification = normalize(`${course?.category || ""} ${course?.group || ""} ${course?.section || ""}`);
    const text = normalize(`${name} ${classification}`);
    if (/健康・スポーツ科学/.test(text)) return true;
    if (businessLanguageSeries(course) === "III") return true;
    if (businessLanguageSeries(course) === "II" && /C[12１２]/i.test(name)) return true;
    if (/その他必要と認める科目|その他の科目/.test(classification)) return true;
    return /他学部/.test(text) && /専門/.test(text) && !/法学部|経済学部/.test(text);
  });
}

function businessNewOtherCredits(list = courses(), rule = currentRule()) {
  return Math.min(
    Number(rule.otherMax || 0),
    businessNewOtherDirectCredits(list) + businessCommonBasicOverflowCredits(list, rule)
  );
}

function businessNewGraduationCredits(list = courses(), rule = currentRule()) {
  const eligible = (list || []).filter((course) => isEarned(course) && !isQualificationCourse(course) && !isRootedExclusionCourse(course));
  const liberal = Math.min(Number(rule.liberal?.["教養科目"] || 0), businessFourFieldsCredits(eligible));
  const base = Math.min(Number(rule.liberal?.["基盤系"] || 0), earnedCreditsFrom(eligible, (course) => course.category === "基盤系" || course.group === "基盤系"));
  const languageI = Math.min(Number(rule.language1 || 0), businessLanguageICredits(eligible));
  const languageII = Math.min(Number(rule.language2 || 0), businessLanguageIICredits(eligible));
  const commonBasic = Math.min(Number(rule.commonBasic || 0), businessCommonBasicRawCredits(eligible));
  const professional = Math.min(Number(rule.special || 0), businessNewProfessionalCredits(eligible));
  const other = businessNewOtherCredits(eligible, rule);
  return roundCredits(liberal + base + languageI + languageII + commonBasic + professional + other);
}

function businessResearchEligibility(list = courses(), rule = currentRule()) {
  const route = rule.researchRoute || {};
  const group1Credits = earnedCreditsFrom(list, (course) => course.group === "第1群");
  const totalCredits = earnedCreditsFrom(list, (course) => !isQualificationCourse(course) && !isRootedExclusionCourse(course));
  const group1Minimum = Number(route.eligibilityGroup1Minimum || 0);
  const totalMinimum = Number(route.eligibilityTotalMinimum || 0);
  return {
    group1Credits,
    totalCredits,
    group1Minimum,
    totalMinimum,
    eligible: group1Credits >= group1Minimum && totalCredits >= totalMinimum,
  };
}

function graduationCredits(list = null) {
  if (isBusinessNewSystem()) {
    return businessNewGraduationCredits(list || courses());
  }
  if (!list) {
    const summaryValue = state.data?.summary?.["卒業判定用合計"];
    if (Number.isFinite(Number(summaryValue))) return Number(summaryValue);
    list = courses();
  }
  return list
    .filter((course) => isEarned(course) && !isQualificationCourse(course) && !isRootedExclusionCourse(course))
    .reduce((total, course) => total + Number(course.credits || 0), 0);
}

function qualificationCredits() {
  const summaryValue = state.data?.summary?.["資格免許科目"];
  if (Number.isFinite(Number(summaryValue))) return Number(summaryValue);
  return sumBy(isQualificationCourse);
}

function transcriptEarnedCredits() {
  const summaryValue = state.data?.summary?.["合計"];
  if (Number.isFinite(Number(summaryValue))) return Number(summaryValue);
  return courses()
    .filter(isEarned)
    .reduce((total, course) => total + Number(course.credits || 0), 0);
}

function sum(list) {
  return list.filter(isEarned).reduce((total, course) => total + Number(course.credits || 0), 0);
}

function sumBy(filter) {
  return sum(courses().filter(filter));
}

function sumCategory(category) {
  const summaryValue = state.data?.summary?.[category];
  if (Number.isFinite(Number(summaryValue))) return Number(summaryValue);
  return sumBy((course) => course.category === category);
}

function hasSummaryCategory(category) {
  return Number.isFinite(Number(state.data?.summary?.[category]));
}

function roundCredits(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function reconcileGraduationSummary(summary = {}) {
  const total = Number(summary["合計"]);
  const qualification = Number(summary["資格免許科目"]);
  if (Number.isFinite(total) && Number.isFinite(qualification)) {
    summary["卒業判定用合計"] = roundCredits(total - qualification);
  }
  return summary;
}

function informationRequirementCredits(need = 1) {
  return Math.min(sumCategory("情報科目"), Number(need || 1));
}

function basisCredits() {
  if (hasSummaryCategory("基盤系")) return sumCategory("基盤系");
  return sumBy((course) => course.category === "基盤系" || course.sub === "基盤系" || isBasisCourseName(course.name));
}

function summaryCategories() {
  const totals = new Map();
  for (const course of courses()) {
    if (!isEarned(course)) continue;
    const key = course.category || "未分類";
    totals.set(key, (totals.get(key) || 0) + Number(course.credits || 0));
  }
  return totals;
}

const GROUP1 = ["経営学基礎論", "会計学基礎論", "市場システム基礎論"];
const GROUP2 = [
  "経営管理",
  "経営戦略",
  "経営史",
  "経営数学",
  "経営統計",
  "コーポレートファイナンス",
  "簿記",
  "財務会計",
  "管理会計",
  "マーケティング",
  "金融システム",
  "交通論",
];
const INFO_SCIENCE = ["情報科学1", "情報科学2"];
const COMMON_BASIC = [
  "線形代数入門1",
  "線形代数入門2",
  "線形代数1",
  "線形代数2",
  "線形代数3",
  "線形代数4",
  "微分積分入門1",
  "微分積分入門2",
  "微分積分1",
  "微分積分2",
  "微分積分3",
  "微分積分4",
];
const GLOBAL_COURSES = [
  "外国書講読",
  "外国文献講義",
  "Introduction to Management",
  "Introduction to Accounting",
  "Introduction to Finance",
  "Globalization and International Trade",
];
const GROUP3_HINTS = [
  "人的資源管理",
  "工業経営",
  "戦略マネジメント",
  "公益事業経営",
  "ゲーム理論",
  "組織と情報",
  "監査論",
  "国際会計",
  "税務会計",
  "原価計算",
  "社会環境会計",
  "流通システム",
  "マーケティング・マネジメント",
  "顧客関係管理",
  "金融機関",
  "リスク・マネジメント",
  "証券市場",
  "国際交通",
  "経営科学の基礎",
  "経営学特殊講義",
  "会計学特殊講義",
  "市場システム特殊講義",
  "経営学入門演習",
  "研究指導",
  "卒業論文",
  "経営データ分析",
  "実践簿記1",
  "実践簿記2",
  "実践簿記3",
  "実践簿記4",
  "リーダーシップ開発入門",
  "起業指導入門",
];

const KNOWN_COURSE_NAMES = [
  ...GROUP1,
  ...GROUP2,
  ...INFO_SCIENCE,
  ...COMMON_BASIC,
  ...GLOBAL_COURSES,
  ...GROUP3_HINTS,
].sort((a, b) => b.length - a.length);

const IHS_GSP_COURSE_PATTERNS = [
  /GSP/,
  /グローバルイシュー概論/,
  /グローバルイシュー演習/,
  /GSP演習.*オリエンテーション/,
  /GSP演習.*リフレクション/,
  /留学型GSコース/,
  /実践型GSコース/,
  /研修型GSコース/,
];

function matchesAnyPattern(value, patterns) {
  const text = normalize(value);
  return patterns.some((pattern) => pattern.test(text));
}

function isStandardForeignLanguageCourseName(value) {
  const text = normalize(value);
  return (
    /^Academic English (?:Communication|Literacy) [AB][12]$/.test(text)
    || /^(?:フランス語|ドイツ語|中国語|ロシア語|スペイン語|朝鮮語|韓国語)(?:初級|中級)[A-Z][1-4]$/.test(text)
    || /^第三外国語（[^）]+）T[1-4]$/.test(text)
  );
}

function isKnownQualificationCourseName(value) {
  const text = normalize(value);
  return /教職論|教育原理|教育行政学|教育実習|教職実践演習|教育職員|日本国憲法|ソルフェージュ|中等.*(?:教育論|カリキュラム論|道徳教育論|学習指導)|総合的な学習の指導法|特別支援教育論|科教育論/.test(text);
}

function isQualificationOverrideCourseName(value) {
  return /^ソルフェージュ(?:[ⅠⅡⅢIV１２３４1-4])?$/.test(normalize(value));
}

function isInfoScienceCourseName(value) {
  return /^情報科学[12１２]$/.test(normalize(value));
}

function isBasisCourseName(value) {
  return /^(情報基礎|データサイエンス基礎学|統計学[ABＡＢ]?)$/.test(normalize(value));
}

function isFirstYearSeminarCourseName(value) {
  const text = normalize(value).replace(/セミナー/g, "ｾﾐﾅｰ");
  return /^(初年次|初年時)ｾﾐﾅｰ$/.test(text) || /^First Year Seminar$/i.test(normalize(value));
}

const PDF_ROW_RE = /(?:^|\s)(＊\s*)?(.+?)\s+([0-9]+(?:\.[0-9])?)\s+(秀|優|良|可|不可|合格|取消)\s+([0-9]+(?:\.[0-9])?|＊|─|―|-)\s+(\d{2})\s*(前|後)(?:\s+([^\n]*?))?(?=(?:\s+＊?\s*[^\s].+?\s+[0-9]+(?:\.[0-9])?\s+(?:秀|優|良|可|不可|合格|取消)\s+)|$)/g;
const PDF_COURSE_COLUMNS = [[25, 284], [285, 544], [545, 820]];
const PDF_SUMMARY_VALUE_RE = /^(\d+(?:\.\d+)?)\s*(?:\((\d+(?:\.\d+)?)\))?$/;

function pdfColumnIndex(x) {
  const index = PDF_COURSE_COLUMNS.findIndex(([left, right]) => x >= left && x < right);
  return index >= 0 ? index : 0;
}

function classifyCourse(name, currentCategory = "未分類") {
  const n = normalize(name);
  const hasName = (items) => items.some((item) => normalize(item) === n);
  const categoryText = normalize(currentCategory);

  if (hasName(COMMON_BASIC)) return { section: "専門科目", category: "共通専門基礎科目", group: "共通専門基礎" };
  if (/共通専門基礎/.test(categoryText) && hasName(INFO_SCIENCE)) {
    return { section: "専門科目", category: "共通専門基礎科目", group: "共通専門基礎" };
  }
  if (hasName(INFO_SCIENCE)) return { section: "全学共通", category: "情報科学", group: "情報科学" };
  if (n === "初年次セミナー") return { section: "専門科目", category: "専門科目", group: "初年次" };
  if (hasName(GROUP1)) return { section: "専門科目", category: "専門科目", group: "第1群" };
  if (hasName(GROUP2)) return { section: "専門科目", category: "専門科目", group: "第2群" };
  if (GLOBAL_COURSES.some((course) => n.includes(normalize(course)))) {
    return { section: "専門科目", category: "グローバル科目群", group: "グローバル科目群" };
  }
  if (matchesAnyPattern(`${n} ${currentCategory}`, IHS_GSP_COURSE_PATTERNS)) {
    return { section: "専門科目", category: "GSP科目", group: "GSP科目" };
  }
  if (/資格|免許|教職|教育職員/.test(currentCategory) || isKnownQualificationCourseName(n)) {
    return { section: "資格・免許", category: "資格免許科目", group: "資格・免許" };
  }
  if (isStandardForeignLanguageCourseName(n)) {
    return { section: "全学共通", category: "外国語科目", group: "" };
  }
  if (isSpecificCategory(categoryText)) {
    return { section: categorySection(categoryText), category: categoryText, group: "" };
  }
  if (/グローバル人文学英語/.test(n)) {
    return { section: "専門科目", category: "グローバル人文学英語科目", group: "" };
  }
  if (/卒業論文関連/.test(n)) {
    return { section: "専門科目", category: "卒業論文関連科目", group: "" };
  }
  if (/卒業論文/.test(n)) {
    return { section: "専門科目", category: "卒業論文", group: "" };
  }
  if (hasName(GROUP3_HINTS) || /特殊講義|研究指導|卒業論文|実践簿記|経営データ分析/.test(n)) {
    return { section: "専門科目", category: "専門科目", group: "第3群" };
  }
  if (/Academic English|英語|フランス語|ドイツ語|中国語|ロシア語|外国語/.test(n)) {
    return { section: "全学共通", category: "外国語科目", group: "" };
  }
  if (n.includes("情報基礎")) return { section: "全学共通", category: "情報科目", group: "" };
  if (/健康|スポーツ/.test(n)) return { section: "全学共通", category: "健康・スポーツ科学", group: "" };
  if (currentCategory && currentCategory !== "未分類") {
    return { section: categorySection(currentCategory), category: currentCategory, group: "" };
  }
  return { section: "未分類", category: "未分類", group: "" };
}

function trimKnownCourseName(value) {
  let name = normalize(value);
  name = name.replace(/^(基礎教養科目|総合教養科目|教養科目|専門科目|外国語科目|情報科目|共通専門基礎科目|高度教養科目|専門基礎科目|グローバル人文学英語科目|卒業論文関連科目|卒業論文|自由選択科目|GSP科目|資格免許科目|資格・免許)\s+/, "");
  for (const known of KNOWN_COURSE_NAMES) {
    const k = normalize(known);
    if (name === k || name.endsWith(` ${k}`) || name.includes(k)) return k;
  }
  const lang = name.match(/(Academic English [A-Za-z ]+[AB][12]|(?:フランス語|ドイツ語|中国語|ロシア語|スペイン語|朝鮮語|韓国語)(?:初級|中級)[A-Z][1-4]|第三外国語（[^）]+）T[1-4])/);
  if (lang) return lang[1];
  const parts = name.split(" ");
  if (parts.length > 1 && (parts[0].length <= 4 || /^[A-Z][a-z]+$/.test(parts[0]))) {
    return parts.slice(1).join(" ");
  }
  return name;
}

function detectCategory(line, current) {
  const cleaned = line.replace(/[【】\[\]<>＜＞]/g, "");
  if (/教養科目.*基盤系/.test(cleaned)) return "基盤系";
  if (/教養科目.*人文系/.test(cleaned)) return "人文系";
  if (/教養科目.*社会系/.test(cleaned)) return "社会系";
  if (/教養科目.*自然系/.test(cleaned)) return "自然系";
  if (/教養科目.*総合系/.test(cleaned)) return "総合系";
  if (/教養科目.*外国語系/.test(cleaned)) return "外国語科目";
  if (/教養科目.*健康・スポーツ科学系/.test(cleaned)) return "健康・スポーツ科学";
  if (/外国語第|外国語系/.test(cleaned)) return "外国語科目";
  if (/健康・スポーツ科学系/.test(cleaned)) return "健康・スポーツ科学";
  const pairs = [
    ["基礎教養科目", "基礎教養科目"],
    ["総合教養科目", "総合教養科目"],
    ["高度教養科目", "高度教養科目"],
    ["教養科目", "教養科目"],
    ["外国語科目", "外国語科目"],
    ["情報科目", "情報科目"],
    ["健康・スポーツ科学", "健康・スポーツ科学"],
    ["基盤系", "基盤系"],
    ["社会系", "社会系"],
    ["自然系", "自然系"],
    ["人文系", "人文系"],
    ["総合系", "総合系"],
    ["共通専門基礎科目", "共通専門基礎科目"],
    ["専門基礎科目", "専門基礎科目"],
    ["グローバル人文学英語科目", "グローバル人文学英語科目"],
    ["グローバル人文学英語", "グローバル人文学英語科目"],
    ["卒業論文関連科目", "卒業論文関連科目"],
    ["卒業論文関連", "卒業論文関連科目"],
    ["卒業論文", "卒業論文"],
    ["学部共通基礎科目", "学部共通基礎科目"],
    ["学部共通基礎", "学部共通基礎科目"],
    ["学部共通発展科目", "学部共通発展科目"],
    ["学部共通発展", "学部共通発展科目"],
    ["学部専門科目", "学部専門科目"],
    ["グローバル・スタディーズ・プログラム", "GSP科目"],
    ["GSP科目", "GSP科目"],
    ["GSP", "GSP科目"],
    ["資格免許科目", "資格免許科目"],
    ["資格・免許", "資格免許科目"],
    ["資格免許", "資格免許科目"],
    ["教職", "資格免許科目"],
    ["学科専門科目", "学科専門科目"],
    ["自由選択科目", "自由選択科目"],
    ["専門科目", "専門科目"],
    ["その他の科目", "その他の科目"],
  ];
  const found = pairs.find(([key]) => cleaned.includes(key));
  return found ? found[1] : current;
}

function groupPdfItemsByLine(items, tolerance = 2.4) {
  const lines = [];
  for (const item of [...items].sort((a, b) => a.y - b.y || a.x - b.x)) {
    let line = lines.find((entry) => Math.abs(entry.y - item.y) <= tolerance);
    if (!line) {
      line = { y: item.y, items: [] };
      lines.push(line);
    }
    line.items.push(item);
  }
  return lines.map((line) => line.items.sort((a, b) => a.x - b.x));
}

function findPdfItemNear(items, x, y, pattern, xTolerance = 4, yTolerance = 8) {
  const candidates = items.filter((item) => {
    if (Math.abs(item.x - x) > xTolerance || Math.abs(item.y - y) > yTolerance) return false;
    return !pattern || pattern.test(item.text);
  });
  candidates.sort((a, b) => (Math.abs(a.x - x) + Math.abs(a.y - y)) - (Math.abs(b.x - x) + Math.abs(b.y - y)));
  return candidates[0] || null;
}

function verticalSummaryValueNearLabel(items, label) {
  return items
    .filter((item) => (
      Math.abs(item.x - label.x) <= 4
      && item.y < label.y
      && label.y - item.y <= 240
      && PDF_SUMMARY_VALUE_RE.test(item.text)
    ))
    .sort((a, b) => Math.abs(a.y - label.y) - Math.abs(b.y - label.y))[0] || null;
}

function isPdfCategorySummaryLabel(item, items) {
  if (item.y >= 90) return false;
  const category = detectCategory(item.text, "");
  return Boolean(category && verticalSummaryValueNearLabel(items, item));
}

function flattenPdfItems(pageItems) {
  return pageItems.flat();
}

function valuesAfterGridLabel(items, labelPattern, valuePattern) {
  const rows = [];
  for (const label of items.filter((item) => labelPattern.test(item.text))) {
    const values = items
      .filter((item) => Math.abs(item.y - label.y) <= 14 && item.x > label.x && item.x < label.x + 80 && valuePattern.test(item.text))
      .sort((a, b) => a.x - b.x)
      .map((item) => item.text);
    if (values.length) rows.push(values);
  }
  rows.sort((a, b) => b.length - a.length);
  return rows[0] || [];
}

function valueAboveGridLabel(items, labelPattern, valuePattern) {
  const labels = items.filter((item) => labelPattern.test(item.text));
  for (const label of labels) {
    const candidates = items
      .filter((item) => Math.abs(item.x - label.x) <= 5 && item.y < label.y && label.y - item.y <= 50 && valuePattern.test(item.text))
      .sort((a, b) => Math.abs(a.y - label.y) - Math.abs(b.y - label.y));
    if (candidates[0]) return candidates[0].text;
  }
  return "";
}

function extractGridMeta(pageItems) {
  const items = flattenPdfItems(pageItems);
  const gpTotals = valuesAfterGridLabel(items, /科目GP合計/, /^\d+(?:\.\d+)?$/).map(Number);
  const gpaCredits = valuesAfterGridLabel(items, /計算単位数/, /^\d+(?:\.\d+)?$/).map(Number);
  const gpaValues = valuesAfterGridLabel(items, /^値$/, /^\d+(?:\.\d+)?$/).map(Number);
  const admission = valueAboveGridLabel(items, /^入学年月日$/, /^20\d{2}年\d{2}月\d{2}日$/);
  const studentId = valueAboveGridLabel(items, /^学籍番号$/, /^\d{6,10}[A-Za-z]?$/);
  const faculty = items.find((item) =>
    item.x < 190 && /^(経営学部|経済学部|法学部|国際人間科学部|文学部)$/.test(item.text)
  )?.text || "";
  const department = items.find((item) =>
    item.x < 190 && /^(経営学科|経済学科|法律学科|人文学科|グローバル文化学科|発達コミュニティ学科|環境共生学科|子ども教育学科)/.test(item.text)
  )?.text || "";

  const meta = {};
  if (admission) meta.admission = admission;
  if (studentId) meta.studentIdRaw = normalizeStudentId(studentId);
  if (faculty) meta.faculty = faculty;
  if (department) meta.department = department;
  if (gpTotals.length && gpaCredits.length && gpaValues.length) {
    meta.gpaCurrent = {
      label: "直近GPA",
      gpTotal: gpTotals[0],
      gpaCredits: gpaCredits[0],
      value: gpaValues[0],
    };
    meta.gpaTotal = {
      label: "通算GPA",
      gpTotal: gpTotals[gpTotals.length - 1],
      gpaCredits: gpaCredits[gpaCredits.length - 1],
      value: gpaValues[gpaValues.length - 1],
    };
  }
  return meta;
}

function extractCategorySummary(pageItems) {
  const summary = {};
  const remoteSummary = {};
  const numberPattern = /^\d+(?:\.\d+)?$/;
  const remotePattern = /^\(\d+(?:\.\d+)?\)$/;

  for (const items of pageItems) {
    for (const label of items) {
      if (label.x < 520) continue;
      const category = detectCategory(label.text, "");
      if (!category) continue;
      const sameRow = items
        .filter((item) => Math.abs(item.y - label.y) <= 5 && item.x > label.x + 70 && item.x < label.x + 240)
        .sort((a, b) => a.x - b.x);
      const earned = sameRow.find((item) => numberPattern.test(item.text));
      if (earned) {
        summary[category] = Math.max(Number(summary[category] || 0), Number(earned.text));
      }
      const remote = sameRow.find((item) => remotePattern.test(item.text));
      if (remote) {
        const value = Number(remote.text.replace(/[()]/g, ""));
        remoteSummary[category] = Math.max(Number(remoteSummary[category] || 0), value);
      }
    }

    for (const label of items) {
      if (!isPdfCategorySummaryLabel(label, items)) continue;
      const category = detectCategory(label.text, "");
      if (!category) continue;
      const valueItem = verticalSummaryValueNearLabel(items, label);
      if (!valueItem) continue;
      const value = valueItem.text.match(PDF_SUMMARY_VALUE_RE);
      if (!value) continue;
      summary[category] = Number(value[1]);
      if (value[2] !== undefined) {
        remoteSummary[category] = Number(value[2]);
      }
    }
  }

  return { summary, remoteSummary };
}

function extractCategorySummaryFromText(text) {
  const summary = {};
  const remoteSummary = {};
  const lines = String(text || "").split("\n").map(normalize).filter(Boolean);
  const numberPairPattern = /(\d+(?:\.\d+)?)\s*(?:\((\d+(?:\.\d+)?)\))?/g;

  for (let index = 0; index < lines.length; index += 1) {
    const labelLine = lines[index];
    if (!labelLine.includes("基礎教養科目") || !labelLine.includes("高度教養科目")) continue;
    const labels = labelLine.split(/\s+/).filter(Boolean);
    if (!labels.some((label) => detectCategory(label, ""))) continue;

    const valueLine = lines
      .slice(Math.max(0, index - 60), index)
      .reverse()
      .find((line) => line.includes("修得単位") && /\d+(?:\.\d+)?/.test(line));
    if (!valueLine) continue;

    const values = [];
    numberPairPattern.lastIndex = 0;
    let match;
    while ((match = numberPairPattern.exec(valueLine))) {
      values.push({
        earned: Number(match[1]),
        remote: match[2] === undefined ? null : Number(match[2]),
      });
    }

    labels.forEach((label, labelIndex) => {
      const category = detectCategory(label, "");
      const value = values[labelIndex];
      if (!category || !value) return;
      summary[category] = Math.max(Number(summary[category] || 0), value.earned);
      if (value.remote !== null) {
        remoteSummary[category] = Math.max(Number(remoteSummary[category] || 0), value.remote);
      }
    });
  }

  return { summary, remoteSummary };
}

function parsePdfGridRows(pageItems) {
  const rows = [];
  const seen = new Set();

  for (const items of pageItems) {
    const categories = ["未分類", "未分類", "未分類"];
    const summaryTableX = items.some((item) => item.x > 610 && /修得単位/.test(item.text)) ? 545 : Infinity;
    const lines = groupPdfItemsByLine(items).sort((a, b) => (a[0]?.y || 0) - (b[0]?.y || 0));

    for (const line of lines) {
      const nameY = line[0].y;
      let flowingCategory = "";
      for (const item of line) {
        if (item.x >= summaryTableX) continue;
        if (isPdfCategorySummaryLabel(item, items)) continue;
        const rawName = normalize(item.text);
        const columnIndex = pdfColumnIndex(item.x);
        const currentCategory = flowingCategory || categories[columnIndex] || "未分類";
        const detected = detectCategory(rawName, currentCategory);
        if (detected !== currentCategory) {
          categories[columnIndex] = detected;
          flowingCategory = detected;
          continue;
        }
        if (/^(<<|【|】|全学共通授業科目|専門科目|高度教養科目|\(|\)|>>)$/.test(rawName)) continue;

        const creditItem = findPdfItemNear(items, item.x, nameY - 128, /^\d+\.\d$/);
        const gradeItem = findPdfItemNear(items, item.x, nameY - 144, /^(秀|優|良|可|不可|合格|取消)$/);
        const gpItem = findPdfItemNear(items, item.x, nameY - 164, /^(\d+\.\d|＊|\*|─|―|-)$/);
        const yearTermItem = findPdfItemNear(items, item.x, nameY - 179, /^\d{2}\s*(前|後)$/);
        if (!creditItem || !gradeItem || !gpItem || !yearTermItem) continue;

        const yearTerm = yearTermItem.text.match(/^(\d{2})\s*(前|後)$/);
        if (!yearTerm) continue;

        const teacherFamily = findPdfItemNear(items, item.x, nameY - 196, /.+/);
        const teacherGiven = findPdfItemNear(items, item.x, nameY - 214, /.+/);
        const remoteItem = findPdfItemNear(items, item.x, nameY + 11, /^[＊*]$/);
        const name = trimKnownCourseName(rawName);
        if (!name || /^(授業|科目|区分|合計|GPA|遠隔|修得|年度|学期|担当|単位|成績|科目GP)/.test(name)) continue;
        const categoryForCourse = flowingCategory || categories[columnIndex] || "未分類";

        const course = {
          id: rows.length + 1,
          name,
          remote: Boolean(remoteItem),
          credits: Number(creditItem.text),
          grade: gradeItem.text,
          gp: gpItem.text.replace("*", "＊").replace("―", "─").replace("-", "─"),
          year: yearTerm[1],
          term: yearTerm[2],
          teacher: normalize([teacherFamily?.text, teacherGiven?.text].filter(Boolean).join(" ")),
        };
        Object.assign(course, classifyCourse(name, categoryForCourse));
        const key = [course.name, course.credits, course.grade, course.gp, course.year, course.term].join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        rows.push(course);
      }
    }
  }
  return rows;
}

function parseCourseMatches(text, category, rows, seen) {
  let match;
  PDF_ROW_RE.lastIndex = 0;
  while ((match = PDF_ROW_RE.exec(text))) {
    const name = trimKnownCourseName(match[2]);
    if (!name || /^(授業|科目|区分|合計|GPA|遠隔|修得|年度|学期|担当|単位|成績|科目GP)/.test(name)) continue;
    const gp = ["-", "―"].includes(match[5]) ? "─" : match[5];
    const course = {
      id: rows.length + 1,
      name,
      remote: Boolean(match[1]),
      credits: Number(match[3]),
      grade: match[4],
      gp,
      year: match[6],
      term: match[7],
      teacher: normalize((match[8] || "").split("  ")[0]),
    };
    Object.assign(course, classifyCourse(name, category));
    const key = [course.name, course.credits, course.grade, course.gp, course.year, course.term].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push(course);
  }
}

function parsePdfRows(pageItems) {
  const gridRows = parsePdfGridRows(pageItems);
  if (gridRows.length) return gridRows;

  const columns = [[25, 284], [285, 544], [545, 820]];
  const categories = ["未分類", "未分類", "未分類"];
  const rows = [];
  const seen = new Set();

  for (const items of pageItems) {
    for (const line of groupPdfItemsByLine(items)) {
      columns.forEach(([left, right], index) => {
        const text = normalize(line.filter((item) => item.x >= left && item.x < right).map((item) => item.text).join(" "));
        if (!text) return;
        const category = detectCategory(text, categories[index]);
        if (category !== categories[index]) {
          categories[index] = category;
          return;
        }
        if (/^(区|分|修得単位|備|考|合\s*計|科目GP合計|G\s*P\s*A|GPA)/.test(text)) return;
        parseCourseMatches(text, categories[index], rows, seen);
      });
    }
  }
  return rows;
}

function buildSummaryFromCourses(parsedCourses) {
  const summary = {};
  const remoteSummary = {};
  for (const course of parsedCourses) {
    if (!isEarned(course)) continue;
    const category = course.category || "未分類";
    const credits = Number(course.credits || 0);
    summary[category] = roundCredits((summary[category] || 0) + credits);
    if (course.remote) {
      remoteSummary[category] = roundCredits((remoteSummary[category] || 0) + credits);
    }
  }
  summary["合計"] = roundCredits(parsedCourses.filter(isEarned).reduce((total, course) => total + Number(course.credits || 0), 0));
  summary["卒業判定用合計"] = roundCredits(graduationCredits(parsedCourses));
  remoteSummary["合計"] = roundCredits(parsedCourses.filter((course) => isEarned(course) && course.remote).reduce((total, course) => total + Number(course.credits || 0), 0));
  remoteSummary["卒業判定用合計"] = roundCredits(parsedCourses.filter((course) => isEarned(course) && !isQualificationCourse(course) && course.remote).reduce((total, course) => total + Number(course.credits || 0), 0));
  return { summary, remoteSummary };
}

function extractPdfMeta(text, pageItems = []) {
  const n = normalize(text);
  const gridMeta = extractGridMeta(pageItems);
  const issuedMatch = n.match(/学業成績表\s*(\d{4}年\d{1,2}月\d{1,2}日)/) || n.match(/(\d{4}年\d{1,2}月\d{1,2}日)/);
  const admissionMatch = n.match(/(20\d{2}年\s*0?4月\s*0?1日)\s*入学/);
  const sidMatch = n.match(/学籍番号\s*(\d{6,10})\s*([A-Za-z])?/);
  const studentIdRaw = gridMeta.studentIdRaw
    || (sidMatch ? normalizeStudentId(`${sidMatch[1]}${sidMatch[2] || ""}`) : "");
  const gpaMatches = [...n.matchAll(/G\s*P\s*A\s*([0-9]+(?:\.[0-9]+)?)\s+([0-9]+(?:\.[0-9]+)?)\s+([0-9]+(?:\.[0-9]+)?)(?![0-9.])/g)];
  let gpaTotal = { label: "通算GPA", gpTotal: "-", gpaCredits: "-", value: "算出不可" };
  if (gpaMatches.length) {
    const last = gpaMatches[gpaMatches.length - 1];
    gpaTotal = { label: "通算GPA", gpTotal: Number(last[1]), gpaCredits: Number(last[2]), value: Number(last[3]) };
  }
  const headerText = n.slice(0, 800);
  const faculty = gridMeta.faculty || (
    headerText.match(/(国際人間科学部|経営学部|経済学部|法学部|文学部)(?!科目)/)?.[1] || ""
  );
  const department = gridMeta.department || (
    headerText.match(/(グローバル文化学科|発達コミュニティ学科|環境共生学科|子ども教育学科|経営学科|経済学科|法律学科)[^\s]*/)?.[0] || ""
  );
  return {
    name: "本人データ",
    studentIdRaw,
    studentId: maskedStudentId(studentIdRaw),
    faculty,
    department,
    admission: gridMeta.admission || (admissionMatch ? normalize(admissionMatch[1]).replace(/ /g, "") : ""),
    issued: issuedMatch ? issuedMatch[1] : "",
    gpaCurrent: gridMeta.gpaCurrent,
    gpaTotal: gridMeta.gpaTotal || gpaTotal,
  };
}

function normalizeParsedCoursesForPdfMeta(parsedCourses, meta = {}) {
  const facultyKey = inferFacultyKey(meta.faculty || "");
  for (const course of parsedCourses) {
    if (isQualificationOverrideCourseName(course.name || "")) {
      markQualificationCourse(course, "公式区分マスタの資格免許科目");
      continue;
    }
    if (facultyKey === "internationalHumanSciences" && isFirstYearSeminarCourseName(course.name || "")) {
      course.name = "初年次セミナー";
      course.section = "専門科目";
      course.category = "学部共通基礎科目";
      course.group = "学部共通基礎";
      continue;
    }
    if (isKnownQualificationCourseName(course.name || "") && (
      !isSpecificCategory(course.category || "")
      || /資格|免許|教職/.test(`${course.section || ""} ${course.category || ""} ${course.group || ""}`)
    )) {
      markQualificationCourse(course);
      continue;
    }
    if (facultyKey === "internationalHumanSciences" && (course.category || "未分類") === "未分類") {
      course.section = "専門科目";
      course.category = "学科専門科目";
      course.group = course.group || "";
    }
  }
  repairQualificationContinuations(parsedCourses);
  return decorateCourseUsages(parsedCourses, { source: "成績表PDF" });
}

function repairQualificationContinuations(parsedCourses) {
  const repaired = [];
  for (let index = 0; index < parsedCourses.length; index += 1) {
    const course = parsedCourses[index];
    if (!isQualificationContextCandidate(course)) continue;
    const nearBefore = hasNearbyQualificationContext(parsedCourses, index, -1);
    const nearAfter = hasNearbyQualificationContext(parsedCourses, index, 1);
    if (!nearBefore && !nearAfter) continue;
    markQualificationCourse(course, nearBefore && nearAfter ? "資格免許欄の連続行として補正" : "資格免許欄の列またぎとして補正");
    repaired.push(course.name);
  }
  return repaired;
}

function startPdfDiagnostics() {
  state.pdfDiagnostics = {
    stage: "starting",
    startedAt: Date.now(),
    elapsedMs: 0,
    workerFallbackUsed: false,
    errorCode: "",
  };
}

function updatePdfDiagnostics(stage, details = {}) {
  if (!state.pdfDiagnostics) startPdfDiagnostics();
  state.pdfDiagnostics.stage = stage;
  state.pdfDiagnostics.elapsedMs = Math.max(0, Date.now() - state.pdfDiagnostics.startedAt);
  if (details.workerFallbackUsed) state.pdfDiagnostics.workerFallbackUsed = true;
  if (details.errorCode) state.pdfDiagnostics.errorCode = String(details.errorCode).replace(/[^A-Z0-9_-]/g, "").slice(0, 64);
}

function userFacingPdfError(error) {
  const code = String(error?.code || "PDF_PROCESSING_FAILED").replace(/[^A-Z0-9_-]/g, "").slice(0, 64);
  const base = normalize(error?.message) || "PDFを読み取れませんでした。もう一度選択してください。";
  const isRecoverableBrowserFailure = /TIMEOUT|FAILED|UNAVAILABLE|MISMATCH|STALLED/.test(code);
  let recovery = "";
  if (isRecoverableBrowserFailure && PDF_RUNTIME?.isInstagramBrowser()) {
    recovery = INSTAGRAM_RECOVERY_MESSAGE;
  } else if (isRecoverableBrowserFailure && PDF_RUNTIME?.isIosLike()) {
    recovery = "ページを再読み込みしてから、もう一度PDFを選択してください。";
  }
  updatePdfDiagnostics("failed", { errorCode: code });
  const message = recovery && !base.includes(recovery) ? `${base} ${recovery}` : base;
  const safeError = new Error(message);
  safeError.code = code;
  return safeError;
}

function pdfDiagnosticText() {
  const diagnostic = state.pdfDiagnostics || {};
  return [
    `アプリ版: ${APP_BUILD}`,
    `処理段階: ${diagnostic.stage || "不明"}`,
    `経過秒: ${Math.round(Number(diagnostic.elapsedMs || 0) / 100) / 10}`,
    `互換モード: ${diagnostic.workerFallbackUsed ? "使用" : "未使用"}`,
    `エラーコード: ${diagnostic.errorCode || "なし"}`,
    `iOS系: ${PDF_RUNTIME?.isIosLike() ? "はい" : "いいえ"}`,
    `Instagram内: ${PDF_RUNTIME?.isInstagramBrowser() ? "はい" : "いいえ"}`,
    "PDF名・氏名・学籍番号・科目名は含まれていません。",
  ].join("\n");
}

function showPdfDiagnosticDetails(visible) {
  if (!el.pdfDiagnosticDetails || !el.pdfDiagnosticCode) return;
  el.pdfDiagnosticDetails.hidden = !visible;
  el.pdfDiagnosticDetails.open = false;
  el.pdfDiagnosticCode.textContent = visible ? pdfDiagnosticText() : "";
  if (el.pdfDiagnosticCopyStatus) el.pdfDiagnosticCopyStatus.textContent = "";
}

async function copyPdfDiagnostic() {
  const copied = await copyIssueReportToClipboard(pdfDiagnosticText());
  if (!el.pdfDiagnosticCopyStatus) return;
  el.pdfDiagnosticCopyStatus.textContent = copied
    ? "匿名の診断情報をコピーしました。"
    : "コピーできませんでした。表示内容を選択してコピーしてください。";
}

function codedPdfError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function readPdfFileBytes(file) {
  if (typeof FileReader !== "function") {
    return Promise.race([
      file.arrayBuffer().then((buffer) => new Uint8Array(buffer)),
      new Promise((_, reject) => setTimeout(() => reject(codedPdfError(
        "PDF_FILE_READ_TIMEOUT",
        "PDFファイルの読み込みが20秒以内に完了しませんでした。ファイルを選び直してください。"
      )), PDF_FILE_READ_TIMEOUT_MS)),
    ]);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let settled = false;
    const finish = (bytes, error = null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve(bytes);
    };
    const timer = setTimeout(() => {
      try { reader.abort(); } catch { /* Best effort. */ }
      finish(null, codedPdfError(
        "PDF_FILE_READ_TIMEOUT",
        "PDFファイルの読み込みが20秒以内に完了しませんでした。ファイルを選び直してください。"
      ));
    }, PDF_FILE_READ_TIMEOUT_MS);
    reader.addEventListener("load", () => finish(new Uint8Array(reader.result)));
    reader.addEventListener("error", () => finish(null, codedPdfError("PDF_FILE_READ_FAILED", "PDFファイルを読み込めませんでした。")));
    reader.addEventListener("abort", () => {
      if (!settled) finish(null, codedPdfError("PDF_FILE_READ_ABORTED", "PDFファイルの読み込みが中断されました。"));
    });
    try {
      reader.readAsArrayBuffer(file);
    } catch {
      finish(null, codedPdfError("PDF_FILE_READ_FAILED", "PDFファイルを読み込めませんでした。"));
    }
  });
}

function extractPdfPagesInIsolatedWorker(bytes, onProgress = () => {}) {
  if (typeof Worker !== "function") {
    return Promise.reject(codedPdfError(
      "PDF_EXTRACTION_WORKER_UNAVAILABLE",
      "このブラウザではPDF文字読取用の独立処理を開始できませんでした。"
    ));
  }

  return new Promise((resolve, reject) => {
    let worker;
    let settled = false;
    let numPages = 0;
    let activePage = 0;
    let hardTimer = 0;
    let stallTimer = 0;
    const pageItems = [];

    const completedPages = () => pageItems.filter(Array.isArray).length;
    const cleanup = () => {
      clearTimeout(hardTimer);
      clearTimeout(stallTimer);
      try { worker?.terminate(); } catch { /* Best effort. */ }
    };
    const finish = (value, error = null) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) reject(error);
      else resolve(value);
    };
    const finishAfterFailure = (code, message) => {
      const readPages = completedPages();
      if (readPages > 0) {
        finish({
          pageItems: pageItems.filter(Array.isArray),
          numPages: numPages || readPages,
          partial: true,
          warning: `${numPages || "全"}ページ中${readPages}ページを読み取りました。未読ページは除外して暫定判定しています。`,
          failureCode: code,
        });
        return;
      }
      finish(null, codedPdfError(code, message));
    };
    const armStallTimer = () => {
      clearTimeout(stallTimer);
      stallTimer = setTimeout(() => {
        finishAfterFailure(
          "PDF_PAGE_STALLED",
          `PDFの${activePage || 1}ページ目の文字読み取りが停止しました。処理を終了したので、もう一度選択してください。`
        );
      }, PDF_WORKER_STALL_TIMEOUT_MS);
    };

    try {
      worker = new Worker(PDF_EXTRACT_WORKER_URL);
    } catch (error) {
      finish(null, codedPdfError("PDF_EXTRACTION_WORKER_UNAVAILABLE", "PDF文字読取用の独立処理を開始できませんでした。"));
      return;
    }

    worker.addEventListener("message", (event) => {
      const message = event.data || {};
      if (message.type === "document") {
        numPages = Number(message.numPages || 0);
        armStallTimer();
        return;
      }
      if (message.type === "page-start") {
        numPages = Number(message.numPages || numPages || 0);
        activePage = Number(message.pageNo || 0);
        onProgress(`${activePage}/${numPages}ページを読み取っています...`);
        updatePdfDiagnostics("isolated-page-read");
        armStallTimer();
        return;
      }
      if (message.type === "page") {
        numPages = Number(message.numPages || numPages || 0);
        activePage = Number(message.pageNo || 0);
        pageItems[activePage - 1] = message.items || [];
        onProgress(`${activePage}/${numPages}ページの読み取りが完了しました。`);
        armStallTimer();
        return;
      }
      if (message.type === "done") {
        const readPages = completedPages();
        const truncated = message.truncated === true || (numPages > 0 && readPages < numPages);
        finish({
          pageItems: pageItems.filter(Array.isArray),
          numPages,
          partial: truncated,
          warning: truncated
            ? `${numPages}ページ中${readPages}ページを読み取りました。iPhoneでの安定動作を優先し、未読ページを除外して暫定判定しています。`
            : "",
          failureCode: truncated ? "PDF_PAGE_LIMIT" : "",
        });
        return;
      }
      if (message.type === "error") {
        finishAfterFailure(
          message.error?.code || "PDF_WORKER_FAILED",
          message.error?.message || "PDFの文字を読み取れませんでした。"
        );
      }
    });
    worker.addEventListener("error", () => {
      finishAfterFailure("PDF_WORKER_FAILED", "PDF文字読取用の独立処理でエラーが発生しました。");
    });

    hardTimer = setTimeout(() => {
      finishAfterFailure("PDF_EXTRACTION_TIMEOUT", "PDF全体の文字読み取りが時間内に完了しませんでした。処理を終了しました。");
    }, PDF_WORKER_HARD_TIMEOUT_MS);
    armStallTimer();
    const transferable = bytes.slice();
    try {
      worker.postMessage({ type: "extract", buffer: transferable.buffer, maxPages: MAX_PDF_PAGES }, [transferable.buffer]);
    } catch {
      finishAfterFailure("PDF_WORKER_POST_FAILED", "PDF文字読取用の独立処理へファイルを渡せませんでした。");
    }
  });
}

globalThis.ResyuuPdfTestApi = Object.freeze({ extractPdfPagesInIsolatedWorker });

async function analyzePdfInBrowser(file, onProgress = () => {}) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw codedPdfError("PDF_TOO_LARGE", "PDFは8MB以内にしてください。");
  }

  updatePdfDiagnostics("file-read");
  onProgress("PDFファイルを読み込んでいます...");
  const bytes = await readPdfFileBytes(file);
  if (bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46) {
    throw codedPdfError("PDF_INVALID_HEADER", "PDFファイルを選択してください。");
  }

  onProgress("PDF文字読取用の独立処理を開始しています...");
  updatePdfDiagnostics("isolated-worker-start");
  const extracted = await extractPdfPagesInIsolatedWorker(bytes, onProgress);
  if (extracted.partial) updatePdfDiagnostics("partial-page-judgment", { errorCode: extracted.failureCode });
  onProgress(extracted.partial ? "取得できたページで暫定判定を準備しています..." : "年度別ルールを読み込んでいます...");
  await loadRules();

  const pageItems = extracted.pageItems;
  const textChunks = pageItems.map((items) => (
    groupPdfItemsByLine(items).map((line) => normalize(line.map((item) => item.text).join(" "))).join("\n")
  ));
  const text = textChunks.join("\n");
  const parsedCourses = parsePdfRows(pageItems);
  if (!parsedCourses.length) {
    throw codedPdfError("PDF_COURSES_NOT_FOUND", "PDFは読み込めましたが、科目行を検出できませんでした。学業成績表PDFか確認してください。");
  }
  const meta = extractPdfMeta(text, pageItems);
  normalizeParsedCoursesForPdfMeta(parsedCourses, meta);
  const courseSummary = buildSummaryFromCourses(parsedCourses);
  const coordinateSummary = extractCategorySummary(pageItems);
  const textSummary = extractCategorySummaryFromText(text);
  const summary = reconcileGraduationSummary({ ...courseSummary.summary, ...textSummary.summary, ...coordinateSummary.summary });
  const remoteSummary = { ...courseSummary.remoteSummary, ...textSummary.remoteSummary, ...coordinateSummary.remoteSummary };
  return {
    ...meta,
    courses: parsedCourses,
    summary,
    remoteSummary,
    mode: extracted.partial ? "ブラウザ内PDF解析（部分読取）" : "ブラウザ内PDF解析",
    matchedCanonical: false,
    parseWarnings: extracted.warning ? [extracted.warning] : [],
  };
}

function group23GlobalCredits() {
  return sumBy((course) => ["第2群", "第3群", "グローバル科目群"].includes(course.group));
}

function infoScienceCredits() {
  return sumBy((course) => course.category !== "共通専門基礎科目" && (course.group === "情報科学" || isInfoScienceCourseName(course.name)));
}

function commonBasicCredits() {
  const rule = currentRule();
  const base = sumCategory("共通専門基礎科目");
  if (hasSummaryCategory("共通専門基礎科目")) return base;
  return rule.commonBasicWithInfo ? base : base + infoScienceCredits();
}

function commonBasicWithInfoCredits() {
  const rule = currentRule();
  const base = sumCategory("共通専門基礎科目");
  const need = Number(rule.commonBasicWithInfo || 0);
  if (hasSummaryCategory("共通専門基礎科目") && (!need || base >= need)) return base;
  return base + infoScienceCredits();
}

function specialCredits() {
  if (state.faculty === "literature") return literatureSpecialCredits();
  if (state.faculty === "internationalHumanSciences") return internationalDepartmentCredits();
  if (isBusinessNewSystem()) return businessNewProfessionalCredits();
  return sumBy((course) => course.section === "専門科目" || ["専門科目", "共通専門基礎科目", "グローバル科目群", "情報科学"].includes(course.category));
}

function liberalCredits() {
  if (state.faculty === "literature") return literatureLiberalCredits();
  if (state.faculty === "internationalHumanSciences") return internationalCommonCredits();
  return sumBy((course) => !isQualificationCourse(course) && !["専門科目", "共通専門基礎科目", "グローバル科目群", "情報科学"].includes(course.category));
}

function liberalNeed() {
  const rule = currentRule();
  if (state.faculty === "internationalHumanSciences") return internationalCommonNeed(rule);
  return Object.values(rule.liberal || {}).reduce((total, value) => total + Number(value || 0), 0);
}

function ihsDepartmentSpecialNeed(rule = currentRule(), route = state.ihsGspRoute) {
  const baseNeed = Number(rule.departmentSpecial);
  if (!Number.isFinite(baseNeed)) return null;
  if (rule.system === "legacy" && route !== "advanced") {
    const effectiveNeed = Number(rule.departmentSpecialEffective);
    return Number.isFinite(effectiveNeed)
      ? effectiveNeed
      : baseNeed + Number(rule.advanced || 0);
  }
  return baseNeed;
}

function ihsDepartmentSpecialNote(rule = currentRule()) {
  const gspNeed = ihsDepartmentSpecialNeed(rule, "gsp");
  const advancedNeed = ihsDepartmentSpecialNeed(rule, "advanced");
  if (gspNeed === null) return `${rule.departmentLabel || DEPARTMENT_LABELS[state.department] || "選択学科"}の学科別要件`;
  if (rule.system !== "legacy") {
    return `${rule.departmentLabel || DEPARTMENT_LABELS[state.department] || "選択学科"}の学科別要件。必要${compactNumber(gspNeed)}単位。`;
  }
  const currentNeed = ihsDepartmentSpecialNeed(rule);
  const routeLabel = state.ihsGspRoute === "advanced" ? "GSP未履修・高度教養ルート" : "GSP履修ルート";
  const advancedText = advancedNeed === null ? "判定停止" : `${compactNumber(advancedNeed)}単位＋高度教養${compactNumber(rule.advanced || 0)}単位`;
  return `${routeLabel}では必要${compactNumber(currentNeed)}単位。GSP履修ルートは高度教養の代わりに学科専門+${compactNumber(rule.advanced || 0)}単位を反映して${compactNumber(gspNeed)}単位、GSP未履修・高度教養ルートは表内基準${advancedText}として表示します。`;
}

function specialNeed() {
  const rule = currentRule();
  if (state.faculty === "internationalHumanSciences") return ihsDepartmentSpecialNeed(rule);
  if (Number.isFinite(Number(rule.special))) return Number(rule.special);
  if (Number.isFinite(Number(rule.departmentSpecial))) return Number(rule.departmentSpecial);
  return null;
}

function categoryOrMatchCredits(category, pattern) {
  const categoryTotal = sumCategory(category);
  if (hasSummaryCategory(category)) return categoryTotal;
  if (categoryTotal) return categoryTotal;
  return sumBy((course) => pattern.test(`${course.category || ""} ${course.group || ""} ${course.section || ""} ${course.name || ""}`));
}

function categoriesOrMatchCredits(categoryNames, pattern) {
  const categoryTotal = categoryNames.reduce((total, category) => total + sumCategory(category), 0);
  if (categoryTotal) return categoryTotal;
  return sumBy((course) => (
    categoryNames.includes(course.category)
    || categoryNames.includes(course.group)
    || pattern.test(`${course.category || ""} ${course.group || ""} ${course.section || ""} ${course.name || ""}`)
  ));
}

function literatureLiberalCredits() {
  const rule = currentRule();
  const categories = rule.system === "literatureNew"
    ? ["基盤系", "教養科目", "社会系", "自然系", "人文系", "総合系", "外国語科目"]
    : ["基礎教養科目", "総合教養科目", "外国語科目", "情報科目", "健康・スポーツ科学", "高度教養科目"];
  return categoriesOrMatchCredits(categories, /基盤系|教養|社会系|自然系|人文系|総合系|外国語|情報基礎|データサイエンス基礎学|統計学|健康|スポーツ|高度教養/);
}

function literatureSpecialCredits() {
  return categoriesOrMatchCredits(
    ["専門科目", "専門基礎科目", "グローバル人文学英語科目", "グローバル人文学演習", "卒業論文関連科目", "卒業論文"],
    /専門科目|専門基礎|グローバル人文学(?:英語|演習)|卒業論文関連|卒業論文/
  );
}

function literatureGlobalHumanitiesCredits() {
  return categoriesOrMatchCredits(
    ["グローバル人文学英語科目", "グローバル人文学演習"],
    /グローバル人文学(?:英語|演習)/
  );
}

function literatureAdvancedFieldCredits(field) {
  const suffix = field === "A" ? "A" : "B";
  const explicit = new RegExp(`(?:人文学演習|人文学講義|グローバル・?アクティブ・?ラーニング|English Summer Lectures in Humanities|高度教養セミナー文学部)${suffix}(?:$|\\s|\\(|（)`, "i");
  return sumBy((course) => (
    !isQualificationCourse(course)
    && /高度教養/.test(`${course.category || ""} ${course.group || ""} ${course.section || ""}`)
    && explicit.test(normalize(course.name || ""))
  ));
}

function literatureAdvancedDistribution(rule = currentRule()) {
  const total = sumCategory("高度教養科目");
  const fieldA = literatureAdvancedFieldCredits("A");
  const fieldB = literatureAdvancedFieldCredits("B");
  const other = Math.max(0, roundCredits(total - fieldA - fieldB));
  const major = normalize(state.literatureMajor).replace(/史学$/, "史");
  const distributions = rule.advancedLiberalArtsDistribution || [];
  const selected = distributions.find((item) => (item.majorGroup || []).includes(major));
  if (!selected) return { total, fieldA, fieldB, other, selected: null };
  const prefersB = Boolean(selected.fieldBAndOtherFaculties);
  return {
    total,
    fieldA,
    fieldB,
    other,
    selected,
    preferredLabel: prefersB ? "B分野・他学部・教養教育院" : "A分野・他学部・教養教育院",
    preferredCredits: roundCredits((prefersB ? fieldB : fieldA) + other),
    oppositeLabel: prefersB ? "A分野" : "B分野",
    oppositeCredits: prefersB ? fieldA : fieldB,
  };
}

function literatureFreeChoiceAllocation(rule = currentRule()) {
  const required = Number(rule.freeChoice || 0);
  const direct = categoriesOrMatchCredits(["自由選択科目"], /自由選択/);
  if (!rule.freeElectiveAllocation) {
    return { got: direct, direct, excess: 0, sources: [] };
  }
  const languageRequired = Number(rule.language1 || 0) + Number(rule.language2 || 0);
  const languageMax = Number(rule.foreignLanguageFreeChoiceMaxTotal || languageRequired);
  const sources = [
    { label: "基礎教養科目", got: sumCategory("基礎教養科目"), need: Number(rule.liberalBase || 0) },
    { label: "総合教養科目", got: sumCategory("総合教養科目"), need: Number(rule.liberalGeneral || 0) },
    { label: "外国語科目", got: Math.min(sumCategory("外国語科目"), languageMax), need: languageRequired },
    { label: "情報科目", got: sumCategory("情報科目"), need: Number(rule.information || 0) },
    { label: "健康・スポーツ科学", got: sumCategory("健康・スポーツ科学"), need: Number(rule.sport || 0) },
    { label: "高度教養科目", got: sumCategory("高度教養科目"), need: Number(rule.advanced || 0) },
    { label: "専門基礎科目", got: sumCategory("専門基礎科目"), need: Number(rule.basicSpecial || 0) },
    { label: rule.globalHumanitiesLabel || "グローバル人文学英語科目", got: literatureGlobalHumanitiesCredits(), need: Number(rule.globalEnglish || 0) },
    { label: "卒業論文関連科目", got: literatureThesisGroupMatches(rule).totalCredits, need: Number(rule.thesisRelated || 0) },
  ].map((source) => ({ ...source, excess: Math.max(0, roundCredits(source.got - source.need)) }));
  const excess = roundCredits(sources.reduce((total, source) => total + source.excess, 0));
  return {
    got: required ? Math.min(required, roundCredits(direct + excess)) : roundCredits(direct + excess),
    direct,
    excess,
    sources: sources.filter((source) => source.excess > 0),
  };
}

function literatureFreeChoiceCredits() {
  return literatureFreeChoiceAllocation().got;
}

function literatureFreeChoiceNote(rule = currentRule()) {
  const allocation = literatureFreeChoiceAllocation(rule);
  const sourceText = allocation.sources.length
    ? allocation.sources.map((source) => `${source.label}超過${compactNumber(source.excess)}`).join("、")
    : "必要枠を超えた算入対象単位なし";
  return `明示区分${compactNumber(allocation.direct)}単位 + ${sourceText}。固定必要枠へ先に配賦し、残りだけを自由選択へ算入します。`;
}

function literatureCommonSubtotalCredits(rule = currentRule()) {
  const rows = [
    [sumCategory("基礎教養科目"), rule.liberalBase],
    [sumCategory("総合教養科目"), rule.liberalGeneral],
    [sumCategory("外国語科目"), Number(rule.language1 || 0) + Number(rule.language2 || 0)],
    [sumCategory("情報科目"), rule.information],
    [sumCategory("健康・スポーツ科学"), rule.sport],
    [sumCategory("高度教養科目"), rule.advanced],
  ];
  return roundCredits(rows.reduce((total, [got, need]) => total + Math.min(Number(got || 0), Number(need || 0)), 0));
}

function literatureSpecializedSubtotalCredits(rule = currentRule()) {
  const thesisMatches = literatureThesisGroupMatches(rule);
  return roundCredits(
    Math.min(sumCategory("専門基礎科目"), Number(rule.basicSpecial || 0))
    + Math.min(literatureGlobalHumanitiesCredits(), Number(rule.globalEnglish || 0))
    + Math.min(thesisMatches.totalCredits, Number(rule.thesisRelated || 0))
    + Math.min(sumCategory("卒業論文"), Number(rule.thesis || 0))
    + literatureFreeChoiceCredits()
  );
}

function literatureGeneralCredits() {
  return categoriesOrMatchCredits(["社会系", "自然系", "人文系", "総合系", "教養科目"], /社会系|自然系|人文系|総合系|教養科目/);
}

function literatureMajorOptions(rule = currentRule()) {
  return rule.thesisMajorOptions || Object.keys(rule.thesisGroupsByMajor || {});
}

function compactCourseText(value) {
  return normalize(value).replace(/[\s・･\-‐‑–—ー（）()[\]［］「」『』、,，.．]/g, "");
}

function courseAliasBase(value) {
  return compactCourseText(value)
    .toUpperCase()
    .replace(/[國]/g, "国")
    .replace(/[學]/g, "学")
    .replace(/[藝]/g, "芸")
    .replace(/[歷]/g, "歴")
    .replace(/[臺]/g, "台")
    .replace(/[ヶヵ]/g, "ケ");
}

function literatureCourseKeyVariants(value) {
  const base = courseAliasBase(value);
  if (!base) return [];
  const variants = new Set([base]);
  const romanToNumber = [
    ["VIII", "8"],
    ["VII", "7"],
    ["VI", "6"],
    ["IV", "4"],
    ["III", "3"],
    ["II", "2"],
    ["I", "1"],
    ["V", "5"],
  ];
  for (const [roman, digit] of romanToNumber) {
    if (base.includes(roman)) variants.add(base.split(roman).join(digit));
    if (base.includes(digit)) variants.add(base.split(digit).join(roman));
  }
  return [...variants];
}

function shortNote(value, max = 92) {
  const text = normalize(value);
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function literatureThesisGroupMatches(rule = currentRule()) {
  const groups = rule.thesisGroupsByMajor?.[state.literatureMajor] || [];
  const uniqueCourses = new Set();
  const rows = groups.map((group, index) => {
    const groupText = compactCourseText(group.courseGroupText);
    const courseCandidates = (group.normalizedCourseNames || group.courseNames || [])
      .flatMap(literatureCourseKeyVariants)
      .filter(Boolean);
    const matched = courses().filter((course) => {
      if (!isEarned(course) || isQualificationCourse(course)) return false;
      const courseNames = literatureCourseKeyVariants(course.name);
      if (!courseNames.some((courseName) => courseName.length >= 2)) return false;
      const matchesCandidate = courseCandidates.some((candidate) => courseNames.some((courseName) => (
        candidate === courseName || candidate.includes(courseName) || courseName.includes(candidate)
      )));
      const matchesGroupText = courseNames.some((courseName) => groupText.includes(courseName));
      return matchesCandidate || matchesGroupText;
    });
    matched.forEach((course) => uniqueCourses.add(course));
    return {
      ...group,
      key: `litThesisGroup${index + 1}`,
      got: sum(matched),
    };
  });
  const categoryCredits = sumCategory("卒業論文関連科目");
  const matchedCredits = sum([...uniqueCourses]);
  return {
    groups: rows,
    totalCredits: Math.max(categoryCredits, matchedCredits),
  };
}

function literatureThesisRequirementRows(rule = currentRule()) {
  const options = literatureMajorOptions(rule);
  if (!options.length) {
    return [{
      key: "litThesisRelated",
      title: "卒業論文関連科目",
      need: rule.thesisRelated,
      got: sumCategory("卒業論文関連科目"),
      note: "専修別科目表マスタ未整備のため、不足とは断定せず、専修別専門科目履修に関する内規で確認してください。",
      statusLabel: "専修別表判定停止",
      statusTone: "neutral",
    }];
  }
  if (!state.literatureMajor || !rule.thesisGroupsByMajor?.[state.literatureMajor]) {
    return [{
      key: "litThesisRelated",
      title: "卒業論文関連科目",
      need: null,
      got: 0,
      note: "上部で文学部の専修を選択すると、抽出済みの専修別科目群で卒論関連42単位を確認します。",
      statusLabel: "専修を選択",
      statusTone: "neutral",
    }];
  }
  const matches = literatureThesisGroupMatches(rule);
  const methodNote = rule.thesisGroupStatus || "専修別科目群を抽出済み。個別科目分割が未完のため、科目名照合の限界があります。";
  return [
    {
      key: "litThesisRelated",
      title: `卒業論文関連科目（${state.literatureMajor}）`,
      need: rule.thesisRelated,
      got: matches.totalCredits,
      note: `${state.literatureMajor}専修の科目群で照合。${methodNote}`,
    },
    ...matches.groups.map((group) => ({
      key: group.key,
      title: `卒論関連 ${state.literatureMajor} 第${group.groupNumber}群`,
      need: group.requiredCredits,
      got: group.got,
      note: `${group.source || ""}。対象群: ${shortNote(group.courseGroupText)}`,
    })),
  ];
}

function internationalFacultyBaseCredits() {
  return categoryOrMatchCredits("学部共通基礎科目", /学部共通基礎/);
}

function internationalFacultyDevelopmentCredits() {
  const direct = categoryOrMatchCredits("学部共通発展科目", /学部共通発展/);
  if (direct || !hasSummaryCategory("学部専門科目")) return direct;
  return Math.max(0, roundCredits(
    sumCategory("学部専門科目") - internationalFacultyBaseCredits() - internationalGspCredits()
  ));
}

function internationalGspCredits() {
  if (hasSummaryCategory("GSP科目")) return sumCategory("GSP科目");
  return sumBy((course) => (
    course.category === "GSP科目"
    || course.group === "GSP科目"
    || matchesAnyPattern(`${course.name || ""} ${course.category || ""} ${course.group || ""}`, IHS_GSP_COURSE_PATTERNS)
  ));
}

function ihsGspNeed(rule = currentRule()) {
  const direct = Number(rule.gsp);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const year = Number(state.year || 0);
  if (year >= 2021 && year <= 2024) return 7;
  if (year >= 2025 && year <= 2026) return 4;
  return null;
}

function ihsGspDisplayText(rule = currentRule()) {
  if (!state.department || !state.year) return "学科・入学年度を選択してください";
  const need = ihsGspNeed(rule);
  if (!need) return "学科・入学年度を選択してください";
  const got = internationalGspCredits();
  const remaining = Math.max(0, need - got);
  const inputText = got > 0 ? "" : "取得単位未入力 / ";
  return `GSP ${compactNumber(got)}/${compactNumber(need)}、${inputText}残${compactNumber(remaining)}単位`;
}

function isIhsLegacyGspRule(rule = currentRule()) {
  return state.faculty === "internationalHumanSciences"
    && rule.system === "legacy"
    && Number(ihsGspNeed(rule)) === 7;
}

function internationalFacultyCredits() {
  return internationalFacultyBaseCredits() + internationalFacultyDevelopmentCredits() + internationalGspCredits();
}

function internationalLiberalSubjectCredits() {
  return sumCategory("教養科目")
    + sumCategory("基礎教養科目")
    + sumCategory("総合教養科目")
    + sumCategory("人文系")
    + sumCategory("社会系")
    + sumCategory("自然系")
    + sumCategory("総合系");
}

function internationalLegacyAllCommonCredits(includeAdvanced = false) {
  return sumCategory("基礎教養科目")
    + sumCategory("総合教養科目")
    + sumCategory("外国語科目")
    + informationRequirementCredits(currentRule().information)
    + sumCategory("健康・スポーツ科学")
    + (includeAdvanced ? sumCategory("高度教養科目") : 0);
}

function internationalLegacyAllCommonNeed(rule = currentRule(), includeAdvanced = false) {
  return Number(rule.liberalBase || 0)
    + Number(rule.liberalGeneral || 0)
    + Number(rule.language1 || 0)
    + Number(rule.language2 || 0)
    + Number(rule.information || 0)
    + Number(rule.sport || 0)
    + (includeAdvanced ? Number(rule.advanced || 0) : 0);
}

function internationalFacultyCommonNeed(rule = currentRule()) {
  if (Number.isFinite(Number(rule.facultySpecial))) return Number(rule.facultySpecial);
  return Number(rule.facultyBase || 0)
    + Number(rule.facultyDevelopment || 0)
    + Number(ihsGspNeed(rule) || 0);
}

function internationalCommonBreakdown(rule = currentRule()) {
  if (state.faculty !== "internationalHumanSciences" || !state.data || rule.unavailable) return [];
  if (rule.system === "legacy") {
    const advancedRoute = state.ihsGspRoute === "advanced";
    const allCommon = {
      label: "全学共通",
      got: internationalLegacyAllCommonCredits(advancedRoute),
      need: internationalLegacyAllCommonNeed(rule, advancedRoute),
    };
    if (advancedRoute) {
      return [
        allCommon,
        { label: "高度教養", got: sumCategory("高度教養科目"), need: Number(rule.advanced || 0) },
        { label: "学部共通基礎", got: internationalFacultyBaseCredits(), need: Number(rule.facultyBase || 0) },
        { label: "学部共通発展", got: internationalFacultyDevelopmentCredits(), need: Number(rule.facultyDevelopment || 0) },
      ];
    }
    return [
      allCommon,
      { label: "学部共通・GSP", got: internationalFacultyCredits(), need: internationalFacultyCommonNeed(rule) },
      { label: "GSP", got: internationalGspCredits(), need: ihsGspNeed(rule) },
    ];
  }
  return [
    {
      label: "全学共通",
      got: basisCredits() + internationalLiberalSubjectCredits() + sumCategory("外国語科目"),
      need: Number(rule.base || 0) + Number(rule.liberalTotal || 0) + Number(rule.language1 || 0) + Number(rule.language2 || 0),
    },
    { label: "学部共通・GSP", got: internationalFacultyCredits(), need: internationalFacultyCommonNeed(rule) },
    { label: "GSP", got: internationalGspCredits(), need: ihsGspNeed(rule) },
  ];
}

function internationalCommonCredits(rule = currentRule()) {
  if (rule.system === "legacy") {
    const routeCredits = state.ihsGspRoute === "advanced"
      ? sumCategory("高度教養科目")
      : internationalGspCredits();
    return sumCategory("基礎教養科目")
      + sumCategory("総合教養科目")
      + sumCategory("外国語科目")
      + informationRequirementCredits(rule.information)
      + sumCategory("健康・スポーツ科学")
      + internationalFacultyBaseCredits()
      + internationalFacultyDevelopmentCredits()
      + routeCredits;
  }
  return basisCredits()
    + internationalLiberalSubjectCredits()
    + sumCategory("外国語科目")
    + internationalFacultyCredits();
}

function internationalCommonNeed(rule = currentRule()) {
  if (rule.system === "legacy") {
    const routeNeed = state.ihsGspRoute === "advanced" ? Number(rule.advanced || 0) : ihsGspNeed(rule);
    return Number(rule.liberalBase || 0)
      + Number(rule.liberalGeneral || 0)
      + Number(rule.language1 || 0)
      + Number(rule.language2 || 0)
      + Number(rule.information || 0)
      + Number(rule.sport || 0)
      + Number(rule.facultyBase || 0)
      + Number(rule.facultyDevelopment || 0)
      + Number(routeNeed || 0);
  }
  const facultyCommonNeed = Number.isFinite(Number(rule.facultySpecial))
    ? Number(rule.facultySpecial)
    : Number(rule.facultyBase || 0) + Number(rule.facultyDevelopment || 0) + Number(ihsGspNeed(rule) || 0);
  return Number(rule.base || 0)
    + Number(rule.liberalTotal || 0)
    + Number(rule.language1 || 0)
    + Number(rule.language2 || 0)
    + facultyCommonNeed;
}

function internationalDepartmentCredits() {
  if (hasSummaryCategory("学科専門科目")) {
    return sumCategory("学科専門科目")
      + (state.department === "environment" ? sumCategory("共通専門基礎科目") : 0);
  }
  return sumBy((course) => {
    const classification = `${course.category || ""} ${course.group || ""} ${course.section || ""}`;
    if (/学科専門/.test(classification)) return true;
    return state.department === "environment" && course.category === "共通専門基礎科目";
  });
}

function ihsOverflowDepartmentId() {
  return ({
    globalCulture: "globalCulture",
    humanDevelopment: "humanDevelopmentCommunity",
    environment: "environmentSustainability",
    childEducation: "childEducation",
  })[state.department] || "";
}

function ihsOverflowTransferRule() {
  return (state.finalP0Rules?.ihsOverflowTransferRules || []).find((entry) => (
    Number(entry.entranceYear) === Number(state.year)
    && entry.departmentId === ihsOverflowDepartmentId()
  )) || null;
}

function positiveCreditExcess(got, need) {
  return Math.max(0, roundCredits(Number(got || 0) - Number(need || 0)));
}

function internationalFreeChoiceAllocation(rule = currentRule()) {
  const direct = hasSummaryCategory("自由選択科目")
    ? sumCategory("自由選択科目")
    : sumBy((course) => /自由選択/.test(`${course.category || ""} ${course.group || ""}`));
  const transferRule = ihsOverflowTransferRule();
  if (!transferRule || state.faculty !== "internationalHumanSciences") {
    return { got: direct, direct, transferred: 0, eligibleExcess: 0, allocations: [] };
  }

  const allocations = [];
  const addExcess = (source, got, need) => {
    const excess = positiveCreditExcess(got, need);
    if (excess > 0) allocations.push({ source, excess });
  };

  if (rule.system === "legacy") {
    addExcess("基礎教養", sumCategory("基礎教養科目"), rule.liberalBase);
    addExcess("総合教養", sumCategory("総合教養科目"), rule.liberalGeneral);
    addExcess("外国語", sumCategory("外国語科目"), Number(rule.language1 || 0) + Number(rule.language2 || 0));
    addExcess("情報", sumCategory("情報科目"), rule.information);
    addExcess("健康・スポーツ", sumCategory("健康・スポーツ科学"), rule.sport);
    addExcess("学部共通基礎", internationalFacultyBaseCredits(), rule.facultyBase);
    addExcess("学部共通発展", internationalFacultyDevelopmentCredits(), rule.facultyDevelopment);
    addExcess("GSP", internationalGspCredits(), state.ihsGspRoute === "advanced" ? 0 : ihsGspNeed(rule));
    addExcess("学科専門", internationalDepartmentCredits(), ihsDepartmentSpecialNeed(rule));
    const advanced = sumCategory("高度教養科目");
    if (advanced > 0) allocations.push({ source: "高度教養", excess: advanced });
  } else {
    addExcess("基盤系", basisCredits(), rule.base);
    addExcess("教養科目", internationalLiberalSubjectCredits(), rule.liberalTotal);
    addExcess("外国語", sumCategory("外国語科目"), Number(rule.language1 || 0) + Number(rule.language2 || 0));
    addExcess("学部共通基礎", internationalFacultyBaseCredits(), rule.facultyBase);
    addExcess("学部共通発展", internationalFacultyDevelopmentCredits(), rule.facultyDevelopment);
    addExcess("GSP", internationalGspCredits(), ihsGspNeed(rule));
    addExcess("学科専門", internationalDepartmentCredits(), rule.departmentSpecial);
  }

  addExcess("他学部専門等", sumCategory("他学部専門科目") + sumCategory("その他の科目"), 0);
  const eligibleExcess = roundCredits(allocations.reduce((total, item) => total + item.excess, 0));
  const required = Number(transferRule.destinationRequiredCredits || rule.freeChoice || 0);
  const remaining = Math.max(0, required - direct);
  let transferable = Math.min(remaining, eligibleExcess);
  const applied = allocations.map((item) => {
    const amount = Math.min(item.excess, transferable);
    transferable = roundCredits(transferable - amount);
    return { ...item, applied: amount };
  }).filter((item) => item.applied > 0);
  const transferred = roundCredits(applied.reduce((total, item) => total + item.applied, 0));
  return {
    got: Math.min(required, roundCredits(direct + transferred)),
    direct,
    transferred,
    eligibleExcess,
    allocations: applied,
    rule: transferRule,
  };
}

function internationalFreeChoiceCredits() {
  return internationalFreeChoiceAllocation().got;
}

function internationalFreeChoiceNote(rule = currentRule()) {
  const allocation = internationalFreeChoiceAllocation(rule);
  if (!allocation.rule || !allocation.transferred) return rule.freeChoiceNote || `${rule.departmentLabel}の学科別要件`;
  const sources = allocation.allocations.map((item) => `${item.source}${compactNumber(item.applied)}`).join("、");
  return `明示区分${compactNumber(allocation.direct)}単位 + 必須枠を超えた未配賦単位${compactNumber(allocation.transferred)}単位（${sources}）。資格免許・不合格・取消は含めません。`;
}

function internationalConditionCredits(match) {
  if (match === "departmentDevelopment") {
    return sumBy((course) => /学科展開/.test(`${course.category || ""} ${course.group || ""}`));
  }
  if (match === "graduationResearch") {
    return sumBy((course) => /卒業研究/.test(course.name || ""));
  }
  return 0;
}

function internationalResearchEligibilityCredits() {
  return graduationCredits();
}

function internationalResearchEligibilityRule(rule = currentRule()) {
  const eligibility = rule.researchEligibility || {};
  const departmentRule = eligibility[state.department] || eligibility.default;
  if (!departmentRule) return null;
  return {
    ...departmentRule,
    label: departmentRule.label || DEPARTMENT_LABELS[state.department] || "卒業研究届提出資格",
  };
}

function researchRequiredCourseMatched(course, requiredName) {
  const courseName = normalize(course.name);
  const target = normalize(requiredName);
  if (/Academic Communication|Academic English Communication/i.test(target)) {
    return /Academic.*Communication|Academic English Communication/i.test(courseName);
  }
  return courseName === target || courseName.includes(target) || target.includes(courseName);
}

function internationalResearchRequiredCourseSummary(eligibility) {
  const requiredCourses = eligibility?.requiredCourses || [];
  const missing = requiredCourses.filter((name) => !courses().some((course) => (
    isEarned(course) && researchRequiredCourseMatched(course, name)
  )));
  return {
    total: requiredCourses.length,
    got: requiredCourses.length - missing.length,
    missing,
  };
}

function internationalResearchEligibilityNote(eligibility) {
  const details = [];
  const hasNumeric = (value) => value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
  if (hasNumeric(eligibility.language)) details.push(`外国語${eligibility.language}`);
  if (hasNumeric(eligibility.information)) details.push(`情報${eligibility.information}`);
  if (hasNumeric(eligibility.sport)) details.push(`健康スポーツ${eligibility.sport}`);
  if (eligibility.liberal) details.push(`教養等${eligibility.liberal}`);
  if (hasNumeric(eligibility.special)) details.push(`専門${eligibility.special}`);
  const detailText = details.length ? ` 内訳目安: ${details.join("、")}。` : "";
  const sourceText = eligibility.source ? ` 根拠: ${eligibility.source}。` : "";
  return `${eligibility.label}の卒業研究届資格。合計${eligibility.requiredCredits}単位以上を卒業要件本体とは分離して確認します。${detailText}${sourceText}`;
}

function ihsAdvancedAlternative(rule = currentRule()) {
  const advancedNeed = Number(rule.advanced || 0);
  const gspNeed = Number(rule.gspAdvancedExemptionCredits || (rule.system === "legacy" && Number(rule.gsp || 0) === 7 ? 7 : 0));
  if (state.faculty !== "internationalHumanSciences" || !advancedNeed || !gspNeed) return null;
  const advanced = sumCategory("高度教養科目");
  const gsp = internationalGspCredits();
  if (gsp >= gspNeed) {
    const baseNote = rule.advancedAlternativeNote
      ? `${rule.advancedAlternativeNote} `
      : `GSP科目${compactNumber(gsp)}単位を修得済みのため、高度教養科目${compactNumber(advancedNeed)}単位は不要として扱います。`;
    return {
      got: advancedNeed,
      statusLabel: `GSP${compactNumber(gspNeed)}単位で免除`,
      statusTone: "ok",
      note: `${baseNote}学科専門科目の必要単位には代替分+${compactNumber(advancedNeed)}単位を反映済みです。`,
    };
  }
  if (state.ihsGspRoute === "advanced") {
    return {
      got: advanced,
      statusLabel: advanced >= advancedNeed ? "高度教養ルート充足" : undefined,
      statusTone: advanced >= advancedNeed ? "ok" : undefined,
      note: `GSP未履修・高度教養ルートでは、学科専門科目は表内基準${compactNumber(ihsDepartmentSpecialNeed(rule, "advanced"))}単位で表示し、高度教養科目${compactNumber(advancedNeed)}単位を別枠で確認します。`,
    };
  }
  if (advanced >= advancedNeed) {
    return {
      got: advancedNeed,
      statusLabel: "高度教養ルート確認",
      statusTone: "neutral",
      note: `通常はGSP${compactNumber(gspNeed)}単位で判定します。GSPを履修していない場合のみ、高度教養科目${compactNumber(advancedNeed)}単位を公式資料で確認してください。`,
    };
  }
  return {
    got: advanced,
    statusLabel: "GSP標準ルート",
    statusTone: "neutral",
    note: `国際人間科学部旧制度ではGSP科目${compactNumber(gspNeed)}単位を標準ルートとして判定します。GSP履修ルートでは高度教養科目${compactNumber(advancedNeed)}単位の代わりに、学科専門科目へ+${compactNumber(advancedNeed)}単位を反映します。高度教養科目は、上部で「GSP未履修・高度教養ルート」を選んだ場合だけ追加条件にします。${ihsGspDisplayText(rule)}。`,
  };
}

function evaluateParentRequirement({ key, title, earned, required, children = [], sourceStatus = "confirmed", jump = "requirements" }) {
  if (sourceStatus !== "confirmed") {
    return {
      key,
      title,
      earned: Number(earned || 0),
      required: Number(required || 0),
      children,
      status: "needs_review",
      minimumAdditional: null,
      shortages: [],
      jump,
    };
  }
  const parentTotalDeficit = Math.max(0, Number(required || 0) - Number(earned || 0));
  const shortages = children
    .filter((child) => !child.substitutable)
    .map((child) => ({
      ...child,
      missing: Math.max(0, Number(child.required || 0) - Number(child.earned || 0)),
    }))
    .filter((child) => child.missing > 0);
  const childDeficitSum = shortages.reduce((total, child) => total + child.missing, 0);
  const minimumAdditional = Math.max(parentTotalDeficit, childDeficitSum);
  const status = childDeficitSum > 0
    ? "bucket_shortage"
    : (parentTotalDeficit > 0 ? "total_shortage" : "ok");
  return {
    key,
    title,
    earned: Number(earned || 0),
    required: Number(required || 0),
    children,
    status,
    parentTotalDeficit,
    childDeficitSum,
    minimumAdditional,
    shortages,
    jump,
  };
}

function ihsLegacyParentRequirements(rule = currentRule()) {
  if (state.faculty !== "internationalHumanSciences" || rule.system !== "legacy" || rule.unavailable) return [];
  const allCommonChildren = [
    { key: "ihsLiberalBase", title: "基礎教養", earned: sumCategory("基礎教養科目"), required: Number(rule.liberalBase || 0) },
    { key: "ihsLiberalGeneral", title: "総合教養", earned: sumCategory("総合教養科目"), required: Number(rule.liberalGeneral || 0) },
    { key: "ihsLanguages", title: "外国語", earned: sumCategory("外国語科目"), required: Number(rule.language1 || 0) + Number(rule.language2 || 0) },
    { key: "ihsInformation", title: "情報", earned: informationRequirementCredits(rule.information), required: Number(rule.information || 0) },
    { key: "ihsSport", title: "健康・スポーツ", earned: sumCategory("健康・スポーツ科学"), required: Number(rule.sport || 0) },
  ];
  const facultyChildren = [
    { key: "ihsFacultyBase", title: "学部共通基礎", earned: internationalFacultyBaseCredits(), required: Number(rule.facultyBase || 0) },
    { key: "ihsFacultyDevelopment", title: "学部共通発展", earned: internationalFacultyDevelopmentCredits(), required: Number(rule.facultyDevelopment || 0) },
    { key: "ihsGsp", title: "GSP", earned: internationalGspCredits(), required: Number(ihsGspNeed(rule) || 0) },
  ];
  return [
    evaluateParentRequirement({
      key: "ihsAllCommonParent",
      title: "教養・語学",
      earned: internationalLegacyAllCommonCredits(false),
      required: internationalLegacyAllCommonNeed(rule, false),
      children: allCommonChildren,
      jump: "liberal",
    }),
    evaluateParentRequirement({
      key: "ihsFacultyCommonParent",
      title: "学部共通・GSP",
      earned: internationalFacultyCredits(),
      required: internationalFacultyCommonNeed(rule),
      children: facultyChildren,
      jump: "special",
    }),
  ];
}

function requirementStateLabel(status) {
  if (status === "bucket_shortage") return "必須区分に不足があります";
  if (status === "total_shortage") return "必要単位が不足しています";
  if (status === "needs_review") return "判定停止";
  return "充足";
}

function teachingMaster() {
  return state.teachingRequirements || {};
}

function humanDevelopmentLicenseRule(year = state.year) {
  const rows = teachingMaster().fghHumanDevelopment?.licenseYears || [];
  return rows.find((row) => (row.entranceYears || []).map(String).includes(String(year))) || null;
}

function teachingAvailabilityRule(year = state.year) {
  const faculty = state.teachingAvailability?.faculties?.[state.faculty];
  if (!faculty?.available) return null;
  const departmentKey = state.faculty === "literature" ? "default" : state.department;
  const department = faculty.departments?.[departmentKey];
  if (!department) return null;
  const ranged = (department.yearRanges || []).find((row) => (
    Number(year) >= Number(row.from) && Number(year) <= Number(row.to)
  ));
  return ranged || department;
}

function teachingAvailableForProfile() {
  return Boolean(state.data && teachingAvailabilityRule());
}

function teachingSchoolOptions(year = state.year) {
  const rule = teachingAvailabilityRule(year);
  if (!rule) return [];
  const options = [];
  if (rule.middle?.length) options.push({ value: "middle", label: "中学校" });
  if (rule.high?.length) options.push({ value: "high", label: "高等学校" });
  if (rule.license?.length) options.push({ value: "license", label: "免許種" });
  return options;
}

function teachingLicenseSubjects(year = state.year, school = state.teachingSchool) {
  const rule = teachingAvailabilityRule(year);
  if (!rule) return [];
  if (school === "license") return rule.license || [];
  return school === "high" ? (rule.high || []) : (school === "middle" ? (rule.middle || []) : []);
}

function earnedCourseByExactName(name, list = courses()) {
  return list.find((course) => exactCourseName(course, name) && isEarned(course));
}

function designatedCourseCredits(names, required, list = courses()) {
  const earned = names
    .map((name) => earnedCourseByExactName(name, list))
    .filter(Boolean)
    .reduce((total, course) => total + Number(course.credits || 0), 0);
  return Math.min(Number(required || 0), roundCredits(earned));
}

function teachingSportCredits(config, list = courses()) {
  const baseNames = config.requiredCourses || [];
  const baseComplete = baseNames.every((name) => earnedCourseByExactName(name, list));
  const baseCredits = baseComplete
    ? Math.min(1, designatedCourseCredits(baseNames, 1, list))
    : 0;
  const choiceComplete = (config.choiceSets || []).some((set) => (
    set.every((name) => earnedCourseByExactName(name, list))
  ));
  return Math.min(Number(config.required || 0), baseCredits + (choiceComplete ? 1 : 0));
}

function evaluateTeachingArticle66(list = courses()) {
  const config = teachingMaster().fghHumanDevelopment?.article66_6;
  if (!config || String(state.year) !== "2024" || state.faculty !== "internationalHumanSciences" || state.department !== "humanDevelopment") {
    return { status: "needs_review", earned: 0, required: 8, groups: [] };
  }
  const groups = Object.entries(config.groups || {}).map(([title, group]) => {
    const earned = title === "体育"
      ? teachingSportCredits(group, list)
      : designatedCourseCredits(group.courses || [], group.required, list);
    return { title, earned, required: Number(group.required || 0), missing: Math.max(0, Number(group.required || 0) - earned) };
  });
  const earned = roundCredits(groups.reduce((total, group) => total + group.earned, 0));
  return {
    status: earned >= Number(config.required || 8) ? "ok" : "bucket_shortage",
    earned,
    required: Number(config.required || 8),
    groups,
  };
}

function evaluateTeachingPair(list = courses()) {
  const pair = teachingMaster().fghHumanDevelopment?.pairedCourseRule;
  if (!pair) return { earned: 0, required: 2, complete: false };
  const complete = (pair.courses || []).every((name) => list.some((course) => courseNameStartsWith(course, name) && isEarned(course)));
  return { earned: complete ? Number(pair.credits || 2) : 0, required: Number(pair.credits || 2), complete };
}

function teachingSubjectMinimum(year = state.year, school = state.teachingSchool, subject = state.teachingSubject) {
  return (teachingMaster().fghHumanDevelopment?.subjectMinimums || []).find((row) => (
    String(row.year) === String(year) && row.school === school && row.subject === subject
  )) || null;
}

function hasTeachingSupportContext() {
  return teachingAvailableForProfile();
}

function lawNamedCredits(pattern) {
  return sumBy((course) => pattern.test(`${course.name || ""} ${course.category || ""} ${course.group || ""}`));
}

function lawAtomicRequirementCredits(requirement, rule = currentRule()) {
  const names = new Set(
    (requirement.groups || [])
      .flatMap((groupKey) => rule.courseGroups?.[groupKey]?.courses || [])
      .map(compactCourseName),
  );
  return sumBy((course) => names.has(compactCourseName(course.name)));
}

function lawRouteProgress(route, rule = currentRule()) {
  return (route?.atomicRequirements || []).reduce((total, requirement) => (
    total + Math.min(Number(requirement.minimum || 0), lawAtomicRequirementCredits(requirement, rule))
  ), 0);
}

function lawSeminarCrossCredits(rule = currentRule()) {
  const pattern = new RegExp(rule.seminarCrossPattern || "専門演習|応用研究|応用法律|外国書講読");
  return lawNamedCredits(pattern);
}

function lawSeminarCredits(rule = currentRule()) {
  return lawNamedCredits(new RegExp(rule.seminarCreditPattern || "専門演習"));
}

function lawGeneralCredits() {
  return sumBy((course) => [
    "基礎教養科目",
    "総合教養科目",
    "外国語科目",
    "情報科目",
    "高度教養科目",
    "基盤系",
    "教養科目",
    "別表第1イ",
  ].includes(course.category) || course.group === "別表第1イ");
}

function lawGeneralRequirementCredits(requirement) {
  const id = normalize(requirement?.id || "");
  const label = normalize(requirement?.label || "");
  if (/liberalBase/.test(id) || /基礎教養/.test(label)) return sumCategory("基礎教養科目");
  if (/liberalGeneral/.test(id) || /総合教養/.test(label)) return sumCategory("総合教養科目");
  if (/\.base$/.test(id) || label === "基盤系") return sumCategory("基盤系");
  if (/\.human$/.test(id) || label === "人文系") return sumCategory("人文系");
  if (/\.liberal$/.test(id) || /教養科目（人文/.test(label)) {
    return ["人文系", "自然系", "社会系", "総合系"].reduce((total, category) => total + sumCategory(category), 0);
  }
  if (/language1/.test(id) || /外国語第Ⅰ|外国語第I(?!I)/.test(label)) return businessLanguageICredits();
  if (/language2/.test(id) || /外国語第Ⅱ|外国語第II/.test(label)) return businessLanguageIICredits();
  if (/information/.test(id) || /情報科目/.test(label)) return sumCategory("情報科目") || infoScienceCredits();
  if (/advanced/.test(id) || /高度教養/.test(label)) return sumCategory("高度教養科目");
  return 0;
}

function lawSpecialCredits() {
  return sumBy((course) => course.section === "専門科目" || ["専門科目", "別表第1ロ"].includes(course.category) || course.group === "別表第1ロ");
}

function economicsNamedGroupCredits(names = [], groupPattern = null) {
  const exactNames = new Set(names.map(compactCourseName));
  return sumBy((course) => {
    if (exactNames.has(compactCourseName(course.name))) return true;
    return groupPattern ? groupPattern.test(normalize(`${course.category || ""} ${course.group || ""} ${course.section || ""}`)) : false;
  });
}

function economicsResearchCredits(rule = currentRule()) {
  return economicsNamedGroupCredits(rule.groupTwoCourses || [], /(?:^|\s)(?:Ⅱ群|II群|第2群)(?:\s|$)/);
}

function economicsGroupThreeNeed(rule = currentRule()) {
  const research = economicsResearchCredits(rule);
  if (research >= Number(rule.groupTwo || 0)) return Number(rule.groupThree || 0);
  if (research >= 4) return Number(rule.groupThreeOneResearch || rule.groupThree || 0);
  return Number(rule.groupThreeNoResearch || rule.groupThree || 0);
}

function economicsRequiredTotal(rule = currentRule()) {
  return economicsResearchCredits(rule) >= Number(rule.groupTwo || 0)
    ? Number(rule.total || 0)
    : Number(rule.alternativeTotal || rule.total || 0);
}

function graduationRequiredTotal(rule = currentRule()) {
  return state.faculty === "economics" ? economicsRequiredTotal(rule) : Number(rule.total || 0);
}

function economicsRelatedCredits(rule = currentRule()) {
  const explicit = categoriesOrMatchCredits(["関連科目", "自由選択科目"], /関連科目|自由選択科目/);
  if (explicit) return explicit;
  const fixed = [
    [basisCredits(), rule.base],
    [businessFourFieldsCredits(), rule.liberalFourFields],
    [businessLanguageICredits(), rule.language1],
    [businessLanguageIICredits(), rule.language2],
    [businessCommonBasicRawCredits(), rule.commonBasic],
    [economicsNamedGroupCredits(rule.groupOneCourses || [], /(?:^|\s)(?:Ⅰ群|I群|第1群)(?:\s|$)/), rule.groupOne],
    [economicsResearchCredits(rule), rule.groupTwo],
    [economicsNamedGroupCredits(rule.groupThreeCourses || [], /(?:^|\s)(?:Ⅲ群|III群|第3群)(?:\s|$)/), economicsGroupThreeNeed(rule)],
  ].reduce((total, [got, need]) => total + Math.min(Number(got || 0), Number(need || 0)), 0);
  // Unclassified earned rows are provisionally left in the flexible 30-credit
  // destination. This follows the product policy to warn and continue instead
  // of discarding credits only because the historical category is missing.
  return Math.max(0, roundCredits(graduationCredits() - fixed));
}

function requirementDefs() {
  const rule = currentRule();
  if (rule.unavailable) {
    return [{
      key: "unavailable",
      title: "卒業要件",
      need: null,
      got: 0,
      note: rule.unavailableReason || `${currentFacultyConfig().label || "選択学部"} ${state.year}年度入学者用の詳細要件は公式資料で確認してください。`,
      statusLabel: rule.missingDepartment ? "学科選択" : "数値判定停止",
      statusTone: "warn",
    }];
  }
  if (state.faculty === "economics") {
    const groupThreeNeed = economicsGroupThreeNeed(rule);
    const totalNeed = economicsRequiredTotal(rule);
    return [
      {
        key: "total",
        title: "卒業必要単位",
        need: totalNeed,
        got: graduationCredits(),
        note: economicsResearchCredits(rule) >= Number(rule.groupTwo || 0)
          ? `研究指導I・II修得時は合計${totalNeed}単位`
          : `研究指導I・IIをともに履修しない、又はIのみの場合は合計${totalNeed}単位`,
      },
      { key: "econBase", title: "基盤系", need: rule.base, got: basisCredits(), note: "4単位必修" },
      { key: "econLiberal", title: "人文・自然・社会・総合系", need: rule.liberalFourFields, got: businessFourFieldsCredits(), note: "4系統合計12単位" },
      { key: "econHumanNatural", title: "人文系・自然系", need: rule.humanNaturalMin, got: businessHumanNaturalCredits(), note: `${rule.humanNaturalMin}〜${rule.humanNaturalMax}単位` },
      { key: "econSocialGeneralMax", title: "社会系・総合系", need: rule.socialGeneralMax, got: earnedCreditsFrom(courses(), (course) => ["社会系", "総合系"].includes(course.category)), note: `0〜${rule.socialGeneralMax}単位`, limitType: "max" },
      { key: "econLanguageI", title: "外国語第I", need: rule.language1, got: businessLanguageICredits(), note: "4単位必修" },
      { key: "econLanguageII", title: "外国語第II", need: rule.language2, got: businessLanguageIICredits(), note: "同一外国語4単位必修" },
      { key: "econCommonBasic", title: "共通専門基礎科目", need: rule.commonBasic, got: businessCommonBasicRawCredits(), note: "線形代数入門・微分積分入門の指定セット" },
      { key: "econGroupOne", title: "専門科目I群", need: rule.groupOne, got: economicsNamedGroupCredits(rule.groupOneCourses || [], /(?:^|\s)(?:Ⅰ群|I群|第1群)(?:\s|$)/), note: `${rule.groupOne}単位必修` },
      { key: "econGroupTwo", title: "専門科目II群（研究指導）", need: rule.groupTwo, got: economicsResearchCredits(rule), note: "研究指導I・IIで8単位。3年次早期卒業は4単位特例" },
      { key: "econGroupThree", title: "専門科目III群", need: groupThreeNeed, got: economicsNamedGroupCredits(rule.groupThreeCourses || [], /(?:^|\s)(?:Ⅲ群|III群|第3群)(?:\s|$)/), note: `研究指導の修得状況により${rule.groupThree}/${rule.groupThreeOneResearch}/${rule.groupThreeNoResearch}単位` },
      { key: "econRelated", title: "関連・自由選択科目", need: rule.related, got: economicsRelatedCredits(rule), note: "III群超過・関連科目・他学部専門・算入可能な選択科目を合計" },
      ...(rule.distanceMax ? [{ key: "econDistanceMax", title: "遠隔授業の卒業算入", need: rule.distanceMax, got: sumBy((course) => course.remote), note: `${rule.distanceMax}単位以内`, limitType: "max" }] : []),
      ...(rule.provisionalAssessmentNotice ? [{
        key: "econProvisionalNotice",
        title: "暫定判定",
        need: null,
        got: 0,
        note: rule.provisionalAssessmentNotice,
        statusLabel: "近似値で判定継続",
        statusTone: "warn",
      }] : []),
    ];
  }
  if (state.faculty === "literature") {
    const classificationStatus = rule.classificationReady === false ? {
      statusLabel: "内訳判定停止",
      statusTone: "neutral",
    } : {};
    const advancedDistribution = literatureAdvancedDistribution(rule);
    const commonRows = [
      {
        key: "total",
        title: "卒業必要単位",
        need: rule.total,
        got: graduationCredits(),
        note: `合計 ${rule.total || "--"} 単位`,
      },
      ...(Number.isFinite(Number(rule.commonSubtotal)) ? [{
        key: "litCommonSubtotal",
        title: rule.commonSubtotalLabel || "全学共通授業科目等",
        need: rule.commonSubtotal,
        got: literatureCommonSubtotalCredits(rule),
        note: "各必須区分へ先に配賦した卒業算入単位",
      }] : []),
      ...(Number.isFinite(Number(rule.specializedSubtotal)) ? [{
        key: "litSpecializedSubtotal",
        title: rule.specializedSubtotalLabel || "専門科目等",
        need: rule.specializedSubtotal,
        got: literatureSpecializedSubtotalCredits(rule),
        note: "専門基礎・グローバル人文学・卒論関連・卒論・自由選択の合計",
      }] : []),
    ];
    const newSystemRows = [
      {
        key: "litBase",
        title: "基盤系",
        need: rule.base,
        got: basisCredits(),
        note: "新制度の必修枠",
      },
      {
        key: "litGeneral",
        title: "社会系・自然系・人文系・総合系",
        need: rule.liberalTotal,
        got: literatureGeneralCredits(),
        note: rule.liberalRangeNote || "社会系・自然系8〜12単位、人文系・総合系0〜4単位。合計12単位",
      },
      {
        key: "litLanguages",
        title: "外国語第I・II",
        need: Number(rule.language1 || 0) + Number(rule.language2 || 0),
        got: sumCategory("外国語科目"),
        note: "外国語第I 4単位、外国語第II 4単位",
      },
    ];
    const legacyRows = [
      {
        key: "litLiberalBase",
        title: "基礎教養科目",
        need: rule.liberalBase,
        got: sumCategory("基礎教養科目"),
        note: "旧制度の専門科目以外",
      },
      {
        key: "litLiberalGeneral",
        title: "総合教養科目",
        need: rule.liberalGeneral,
        got: sumCategory("総合教養科目"),
        note: "旧制度の専門科目以外",
      },
      {
        key: "litLanguages",
        title: "外国語第I・II",
        need: Number(rule.language1 || 0) + Number(rule.language2 || 0),
        got: sumCategory("外国語科目"),
        note: "外国語第I 4単位、外国語第II 4単位",
      },
      {
        key: "litInformation",
        title: "情報科目",
        need: rule.information,
        got: informationRequirementCredits(rule.information),
        note: "情報基礎が2単位で読み込まれても、この欄は1単位枠として表示",
      },
      {
        key: "litSport",
        title: "健康・スポーツ科学",
        need: rule.sport,
        got: sumCategory("健康・スポーツ科学"),
        note: "実習基礎1単位と講義/実習から1単位",
      },
      {
        key: "litAdvanced",
        title: "高度教養科目",
        need: rule.advanced,
        got: advancedDistribution.total,
        note: rule.advancedNote || "専修群によりA/B分野の下限・上限が異なるため公式確認",
      },
      ...(advancedDistribution.selected ? [{
        key: "litAdvancedPreferred",
        title: advancedDistribution.preferredLabel,
        need: 2,
        got: advancedDistribution.preferredCredits,
        note: `${state.literatureMajor}専修の高度教養内訳。合計4単位のうち2単位以上。`,
      }, {
        key: "litAdvancedOppositeMax",
        title: advancedDistribution.oppositeLabel,
        need: 2,
        got: advancedDistribution.oppositeCredits,
        note: `${state.literatureMajor}専修では0〜2単位。`,
        limitType: "max",
      }] : []),
    ];
    return [
      ...commonRows,
      ...(rule.system === "literatureNew" ? newSystemRows : legacyRows),
      {
        key: "litBasic",
        title: "専門基礎科目",
        need: rule.basicSpecial,
        got: sumCategory("専門基礎科目"),
        note: "初年次セミナー1、選択外国語1、その他基礎10",
      },
      {
        key: "litGlobalEnglish",
        title: rule.globalHumanitiesLabel || "グローバル人文学英語科目",
        need: rule.globalEnglish,
        got: literatureGlobalHumanitiesCredits(),
        note: `${rule.globalEnglish || "--"}単位以上`,
      },
      ...literatureThesisRequirementRows(rule),
      {
        key: "litThesis",
        title: "卒業論文",
        need: rule.thesis,
        got: sumCategory("卒業論文"),
        note: "卒業論文試験合格時に10単位",
      },
      {
        key: "litFreeChoice",
        title: "自由選択科目",
        need: rule.freeChoice,
        got: literatureFreeChoiceCredits(),
        note: rule.freeElectiveAllocation ? literatureFreeChoiceNote(rule) : (rule.freeChoiceNote || "算入対象・上限は表注を確認"),
        ...classificationStatus,
      },
      ...(rule.remoteMax ? [{
        key: "litRemoteMax",
        title: "遠隔授業の卒業算入",
        need: rule.remoteMax,
        got: sumBy((course) => course.remote),
        note: `${rule.remoteMax}単位以内`,
        limitType: "max",
      }] : []),
      ...(rule.separateNotice ? [{
        key: "litSeparateNotice",
        title: "専修別・卒論関連条件",
        need: null,
        got: 0,
        note: rule.separateNotice,
        statusLabel: "公式確認",
        statusTone: "neutral",
      }] : []),
      ...(rule.provisionalAssessmentNotice ? [{
        key: "litProvisionalNotice",
        title: "暫定判定",
        need: null,
        got: 0,
        note: rule.provisionalAssessmentNotice,
        statusLabel: "近似値で判定継続",
        statusTone: "warn",
      }] : []),
    ];
  }
  if (state.faculty === "internationalHumanSciences") {
    const classificationPending = rule.classificationReady === false;
    const detailStatus = classificationPending ? {
      statusLabel: "区分判定停止",
      statusTone: "warn",
    } : {};
    const researchEligibility = internationalResearchEligibilityRule(rule);
    if (rule.system === "legacy") {
      const advancedAlternative = ihsAdvancedAlternative(rule);
      return [
        {
          key: "total",
          title: "卒業必要単位",
          need: rule.total,
          got: graduationCredits(),
          note: `合計 ${rule.total || "--"} 単位`,
        },
        {
          key: "ihsLiberalBase",
          title: "基礎教養科目",
          need: rule.liberalBase,
          got: sumCategory("基礎教養科目"),
          note: `${rule.departmentLabel}の旧制度要件`,
          ...detailStatus,
        },
        {
          key: "ihsLiberalGeneral",
          title: "総合教養科目",
          need: rule.liberalGeneral,
          got: sumCategory("総合教養科目"),
          note: `${rule.departmentLabel}の旧制度要件`,
          ...detailStatus,
        },
        {
          key: "ihsLanguages",
          title: "外国語第I・II",
          need: Number(rule.language1 || 0) + Number(rule.language2 || 0),
          got: sumCategory("外国語科目"),
          note: "外国語第I 4単位、外国語第II 4単位",
          ...detailStatus,
        },
        {
          key: "ihsSport",
          title: "健康・スポーツ科学",
          need: rule.sport,
          got: sumCategory("健康・スポーツ科学"),
          note: "旧制度の全学科共通要件",
          ...detailStatus,
        },
        {
          key: "ihsInformation",
          title: "情報科目",
          need: rule.information,
          got: informationRequirementCredits(rule.information),
          note: "旧制度の全学科共通要件。情報基礎が2単位で読み込まれても、この欄は必要枠の1単位として表示",
          ...detailStatus,
        },
        {
          key: "ihsGsp",
          title: "GSP科目",
          need: ihsGspNeed(rule),
          got: internationalGspCredits(),
          note: `旧制度の標準ルート。${ihsGspDisplayText(rule)}。GSP履修ルートでは高度教養4単位の代替として学科専門+4単位を反映します。GSP未履修を明示した場合のみ高度教養4単位を確認します。`,
          ...detailStatus,
        },
        {
          key: "ihsFacultyBase",
          title: "学部共通基礎科目",
          need: rule.facultyBase,
          got: sumBy((course) => /学部共通基礎/.test(`${course.category || ""} ${course.group || ""}`)),
          note: `${rule.departmentLabel}の学科別要件`,
          ...detailStatus,
        },
        {
          key: "ihsFacultyDevelopment",
          title: "学部共通発展科目",
          need: rule.facultyDevelopment,
          got: sumBy((course) => /学部共通発展/.test(`${course.category || ""} ${course.group || ""}`)),
          note: `${rule.departmentLabel}の学科別要件`,
          ...detailStatus,
        },
        {
          key: "ihsAdvancedException",
          title: "高度教養科目（GSP未履修時）",
          need: rule.advanced,
          got: advancedAlternative?.got ?? 0,
          note: advancedAlternative?.note || rule.advancedNote || "GSPを履修していない場合のみ確認します。",
          ...(advancedAlternative ? { statusLabel: advancedAlternative.statusLabel, statusTone: advancedAlternative.statusTone } : { statusLabel: "GSP未履修時のみ", statusTone: "neutral" }),
        },
        {
          key: "ihsDepartmentSpecial",
          title: "学科専門科目",
          need: ihsDepartmentSpecialNeed(rule),
          got: internationalDepartmentCredits(),
          note: ihsDepartmentSpecialNote(rule),
          ...detailStatus,
        },
        {
          key: "ihsFreeChoice",
          title: "自由選択科目",
          need: rule.freeChoice,
          got: internationalFreeChoiceCredits(),
          note: internationalFreeChoiceNote(rule),
          ...detailStatus,
        },
        ...(rule.departmentRequiredItems || []).map((item, index) => ({
          key: item.key || `ihsDepartmentRequired${index}`,
          title: item.title,
          need: item.need,
          got: internationalConditionCredits(item.match),
          note: item.note,
          ...detailStatus,
        })),
        ...(rule.correctionNotice ? [{
          key: "ihsCorrection",
          title: "訂正資料",
          need: null,
          got: 0,
          note: rule.correctionNotice,
          statusLabel: "訂正を優先",
          statusTone: "warn",
        }] : []),
        ...(rule.researchEligibilityPending ? [{
          key: "ihsResearchEligibilityPending",
          title: "卒業研究届提出資格",
          need: null,
          got: 0,
          note: rule.researchEligibilityPending,
          statusLabel: "公式確認",
          statusTone: "neutral",
        }] : []),
        ...(researchEligibility ? [{
          key: "ihsResearchEligibility",
          title: "卒業研究届提出資格",
          need: researchEligibility.requiredCredits,
          got: internationalResearchEligibilityCredits(),
          note: internationalResearchEligibilityNote(researchEligibility),
          statusLabel: internationalResearchEligibilityCredits() >= Number(researchEligibility.requiredCredits || 0) ? "目安充足" : "開始資格注意",
          statusTone: internationalResearchEligibilityCredits() >= Number(researchEligibility.requiredCredits || 0) ? "ok" : "warn",
        }, {
          key: "ihsResearchEligibilityCourses",
          title: "卒業研究届 指定科目",
          need: internationalResearchRequiredCourseSummary(researchEligibility).total,
          got: internationalResearchRequiredCourseSummary(researchEligibility).got,
          note: internationalResearchRequiredCourseSummary(researchEligibility).missing.length
            ? `未確認: ${internationalResearchRequiredCourseSummary(researchEligibility).missing.join("、")}`
            : "指定科目は修得済みとして確認しました。通常の単位区分は変更しません。",
          statusLabel: internationalResearchRequiredCourseSummary(researchEligibility).missing.length ? "指定科目確認" : "指定科目充足",
          statusTone: internationalResearchRequiredCourseSummary(researchEligibility).missing.length ? "warn" : "ok",
        }] : []),
      ];
    }
    return [
      {
        key: "total",
        title: "卒業必要単位",
        need: rule.total,
        got: graduationCredits(),
        note: `合計 ${rule.total || "--"} 単位`,
      },
      {
        key: "ihsBase",
        title: "基盤系",
        need: rule.base,
        got: basisCredits(),
        note: "全学科共通",
        ...detailStatus,
      },
      {
        key: "ihsLiberal",
        title: "教養科目",
        need: rule.liberalTotal,
        got: sumCategory("教養科目")
          + sumCategory("基礎教養科目")
          + sumCategory("総合教養科目")
          + sumCategory("人文系")
          + sumCategory("社会系")
          + sumCategory("自然系")
          + sumCategory("総合系"),
        note: "指定系統から8単位を含む。対象系統は学科別に公式便覧で確認",
        ...detailStatus,
      },
      {
        key: "ihsLanguages",
        title: "外国語第I・II",
        need: Number(rule.language1 || 0) + Number(rule.language2 || 0),
        got: sumCategory("外国語科目"),
        note: "外国語第I 4単位、外国語第II 4単位",
        ...detailStatus,
      },
      ...(Number.isFinite(Number(rule.facultyBase)) ? [{
        key: "ihsFacultyBase",
        title: "学部共通基礎科目",
        need: rule.facultyBase,
        got: internationalFacultyBaseCredits(),
        note: `${rule.departmentLabel || DEPARTMENT_LABELS[state.department]}の学科別要件`,
        ...detailStatus,
      }] : []),
      ...(Number.isFinite(Number(rule.facultyDevelopment)) ? [{
        key: "ihsFacultyDevelopment",
        title: "学部共通発展科目",
        need: rule.facultyDevelopment,
        got: internationalFacultyDevelopmentCredits(),
        note: `${rule.departmentLabel || DEPARTMENT_LABELS[state.department]}の学科別要件`,
        ...detailStatus,
      }] : []),
      ...(Number.isFinite(Number(rule.gsp)) ? [{
        key: "ihsGsp",
        title: "GSP科目",
        need: ihsGspNeed(rule),
        got: internationalGspCredits(),
        note: `${rule.departmentLabel || DEPARTMENT_LABELS[state.department]}の学科別要件。${ihsGspDisplayText(rule)}。`,
        ...detailStatus,
      }] : []),
      {
        key: "ihsFacultySpecial",
        title: "学部専門科目",
        need: rule.facultySpecial,
        got: internationalFacultyCredits(),
        note: rule.facultySpecialNote || "学部共通科目・GSPを含む",
        ...detailStatus,
      },
      {
        key: "ihsDepartmentSpecial",
        title: rule.departmentSpecialTitle || "学科専門科目",
        need: rule.departmentSpecial,
        got: internationalDepartmentCredits(),
        note: `${rule.departmentLabel || DEPARTMENT_LABELS[state.department]}の学科別要件`,
        ...detailStatus,
      },
      {
        key: "ihsFreeChoice",
        title: "自由選択科目",
        need: rule.freeChoice,
        got: internationalFreeChoiceCredits(),
        note: internationalFreeChoiceNote(rule),
        ...detailStatus,
      },
      ...(rule.annualCap ? [{
        key: "ihsCap",
        title: "年間履修登録上限",
        need: null,
        got: 0,
        note: `${rule.annualCap}単位。成績表の累計単位とは別に、年度ごとの履修登録で確認`,
        statusLabel: "年度ごとに確認",
        statusTone: "neutral",
      }] : []),
      ...(rule.correctionNotice ? [{
        key: "ihsCorrection",
        title: "訂正資料",
        need: null,
        got: 0,
        note: rule.correctionNotice,
        statusLabel: "訂正を優先",
        statusTone: "warn",
      }] : []),
      ...(rule.researchEligibilityPending ? [{
        key: "ihsResearchEligibilityPending",
        title: "卒業研究届提出資格",
        need: null,
        got: 0,
        note: rule.researchEligibilityPending,
        statusLabel: "公式確認",
        statusTone: "neutral",
      }] : []),
      ...(researchEligibility ? [{
        key: "ihsResearchEligibility",
        title: "卒業研究届提出資格",
        need: researchEligibility.requiredCredits,
        got: internationalResearchEligibilityCredits(),
        note: internationalResearchEligibilityNote(researchEligibility),
        statusLabel: internationalResearchEligibilityCredits() >= Number(researchEligibility.requiredCredits || 0) ? "目安充足" : "開始資格注意",
        statusTone: internationalResearchEligibilityCredits() >= Number(researchEligibility.requiredCredits || 0) ? "ok" : "warn",
      }, {
        key: "ihsResearchEligibilityCourses",
        title: "卒業研究届 指定科目",
        need: internationalResearchRequiredCourseSummary(researchEligibility).total,
        got: internationalResearchRequiredCourseSummary(researchEligibility).got,
        note: internationalResearchRequiredCourseSummary(researchEligibility).missing.length
          ? `未確認: ${internationalResearchRequiredCourseSummary(researchEligibility).missing.join("、")}`
          : "指定科目は修得済みとして確認しました。通常の単位区分は変更しません。",
        statusLabel: internationalResearchRequiredCourseSummary(researchEligibility).missing.length ? "指定科目確認" : "指定科目充足",
        statusTone: internationalResearchRequiredCourseSummary(researchEligibility).missing.length ? "warn" : "ok",
      }] : []),
    ];
  }
  if (state.faculty === "law") {
    const classificationPending = rule.classificationReady === false;
    const detailStatus = classificationPending ? {
      statusLabel: "区分判定停止",
      statusTone: "warn",
    } : {};
    const selectedCourse = rule.courses?.[state.lawCourse];
    return [
      {
        key: "total",
        title: "卒業必要単位",
        need: rule.total,
        got: graduationCredits(),
        note: `合計 ${rule.total || "--"} 単位`,
      },
      {
        key: "lawI",
        title: rule.generalTitle || "専門科目以外",
        need: rule.general ?? rule.lawI,
        got: lawGeneralCredits(),
        note: `${rule.general ?? rule.lawI ?? "--"}単位以上`,
        ...detailStatus,
      },
      ...((rule.nonSpecializedRequirements || []).map((requirement, index) => ({
        key: `lawGeneralAtomic${index + 1}`,
        title: requirement.label,
        need: requirement.minimum,
        got: lawGeneralRequirementCredits(requirement),
        note: requirement.sameLanguageRequired
          ? `${requirement.minimum}単位以上（同一外国語）`
          : `${requirement.minimum}単位以上`,
        parentKey: "lawI",
        ...detailStatus,
      }))),
      {
        key: "lawRo",
        title: rule.specialTitle || "法学部専門科目",
        need: rule.special ?? rule.lawRo,
        got: lawSpecialCredits(),
        note: `${rule.special ?? rule.lawRo ?? "--"}単位以上`,
        ...detailStatus,
      },
      ...((rule.additional ?? rule.lawAdditional) ? [{
        key: "lawAdditional",
        title: rule.additionalTitle || "自由選択・追加取得",
        need: rule.additional ?? rule.lawAdditional,
        got: Math.max(0, graduationCredits() - Number((rule.general ?? rule.lawI) || 0) - Number((rule.special ?? rule.lawRo) || 0)),
        note: "2単位以上。詳細な算入は学生便覧で確認",
        ...detailStatus,
      }] : []),
      ...(selectedCourse ? [{
        key: "lawCourseTotal",
        title: `${selectedCourse.label}の必修合計`,
        need: selectedCourse.total,
        got: lawRouteProgress(selectedCourse, rule),
        note: "下の科目群別基準をすべて満たす必要があります。別群の超過単位で不足を相殺しません。",
        ...detailStatus,
      }, ...(selectedCourse.atomicRequirements || []).map((requirement, index) => ({
        key: `lawCourseAtomic${index + 1}`,
        title: requirement.label,
        need: requirement.minimum,
        got: lawAtomicRequirementCredits(requirement, rule),
        note: `${requirement.minimum}単位以上`,
        parentKey: "lawCourseTotal",
        ...detailStatus,
      })), ...(rule.requiredCourses || []).map((requiredCourse, index) => ({
        key: `lawRequiredCourse${index + 1}`,
        title: requiredCourse.course,
        need: requiredCourse.credits,
        got: sumBy((course) => exactCourseName(course, requiredCourse.course)),
        note: `${requiredCourse.timing || "指定年次"}の必修科目`,
        parentKey: "lawCourseTotal",
        ...detailStatus,
      }))] : (rule.courses ? [{
        key: "lawCourseSelection",
        title: "履修コース",
        need: null,
        got: 0,
        note: "上部で履修コースを選ぶと、コース別必修合計を表示します。",
        statusLabel: "コースを選択",
        statusTone: "neutral",
      }] : [])),
      ...(rule.distanceMax ? [{
        key: "lawDistanceMax",
        title: "遠隔授業の卒業算入",
        need: rule.distanceMax,
        got: sumBy((course) => course.remote),
        note: `${rule.distanceMax}単位以内`,
        limitType: "max",
      }] : []),
      ...(rule.specialLectureMax ? [{
        key: "lawSpecialLectureMax",
        title: "特別講義",
        need: rule.specialLectureMax,
        got: lawNamedCredits(/特別講義/),
        note: `${rule.specialLectureMax}単位以内`,
        limitType: "max",
      }] : []),
      ...(rule.programLectureMax ? [{
        key: "lawProgramLectureMax",
        title: "プログラム講義",
        need: rule.programLectureMax,
        got: lawNamedCredits(/プログラム講義/),
        note: `${rule.programLectureMax}単位以内`,
        limitType: "max",
      }] : []),
      ...(rule.specialProgramMax ? [{
        key: "lawSpecialProgramMax",
        title: "特別講義・プログラム講義合算",
        need: rule.specialProgramMax,
        got: lawNamedCredits(/特別講義|プログラム講義/),
        note: `合計${rule.specialProgramMax}単位以内`,
        limitType: "max",
      }] : []),
      ...(rule.otherFacultyMax ? [{
        key: "lawOtherFacultyMax",
        title: "他学部専門科目",
        need: rule.otherFacultyMax,
        got: lawNamedCredits(/他学部専門/),
        note: `${rule.otherFacultyMax}単位以内`,
        limitType: "max",
      }] : []),
      ...(rule.seminarCrossNeed ? [{
        key: "lawSeminarCross",
        title: "専門演習・応用研究等",
        need: rule.seminarCrossNeed,
        got: lawSeminarCrossCredits(rule),
        note: rule.seminarNotice || "専門演習、応用研究、応用法律、外国書講読等を横断して確認。卒業論文必修やゼミ必修としては扱いません。",
        ...detailStatus,
      }] : []),
      ...(rule.seminarMax ? [{
        key: "lawSeminarMax",
        title: "専門演習 通算上限",
        need: rule.seminarMax,
        got: lawSeminarCredits(rule),
        note: rule.seminarEnrollmentNotice || `専門演習は通算${rule.seminarMax}単位まで。申込制限・年度別条件は学生便覧で確認してください。`,
        limitType: "max",
      }] : []),
      ...(rule.seminarTermLimitNotice ? [{
        key: "lawSeminarTermLimit",
        title: "演習の学期上限・申込条件",
        need: null,
        got: 0,
        note: rule.seminarTermLimitNotice,
        statusLabel: "履修時に確認",
        statusTone: "neutral",
      }] : []),
      ...(rule.seminarPendingNotice ? [{
        key: "lawSeminarPending",
        title: "専門演習・応用研究等",
        need: null,
        got: 0,
        note: rule.seminarPendingNotice,
        statusLabel: "年度別確認",
        statusTone: "neutral",
      }] : []),
      ...(rule.annualCap ? [{
        key: "lawAnnualCap",
        title: "年間履修登録上限",
        need: null,
        got: 0,
        note: `${rule.annualCap}単位。成績表累計とは別に年度ごとの登録で確認`,
        statusLabel: "年度ごとに確認",
        statusTone: "neutral",
      }] : []),
      ...(rule.transferMax ? [{
        key: "lawTransferMax",
        title: "入学前既修得・単位認定",
        need: null,
        got: 0,
        note: `認定上限は${rule.transferMax}単位。個別認定は教務情報で確認`,
        statusLabel: "認定上限",
        statusTone: "neutral",
      }] : []),
      ...(rule.separateNotice ? [{
        key: "lawSeparateNotice",
        title: "特別プログラム",
        need: null,
        got: 0,
        note: rule.separateNotice,
        statusLabel: "一般卒業要件と分離",
        statusTone: "neutral",
      }] : []),
      ...(rule.provisionalAssessmentNotice ? [{
        key: "lawProvisionalNotice",
        title: "暫定判定",
        need: null,
        got: 0,
        note: rule.provisionalAssessmentNotice,
        statusLabel: "近似値で判定継続",
        statusTone: "warn",
      }] : []),
    ];
  }
  return [
    {
      key: "total",
      title: "卒業必要単位",
      need: rule.total,
      got: graduationCredits(),
      note: `合計 ${rule.total || "--"} 単位`,
    },
    ...(Number(state.year) <= 2024 ? [{
      key: "businessLiberalBase",
      title: "基礎教養科目",
      need: rule.liberal?.["基礎教養科目"],
      got: sumCategory("基礎教養科目"),
      note: "学生便覧の専門科目以外の科目",
    }, {
      key: "businessLiberalGeneral",
      title: "総合教養科目",
      need: rule.liberal?.["総合教養科目"],
      got: sumCategory("総合教養科目"),
      note: "学生便覧の専門科目以外の科目",
    }, {
      key: "businessLanguages",
      title: "外国語科目",
      need: rule.liberal?.["外国語科目"],
      got: sumCategory("外国語科目"),
      note: "外国語科目の必要単位",
    }, {
      key: "businessInformation",
      title: "情報科目",
      need: rule.liberal?.["情報科目"],
      got: informationRequirementCredits(rule.liberal?.["情報科目"]),
      note: "情報科目の必要単位",
    }, {
      key: "businessAdvanced",
      title: "高度教養科目",
      need: rule.liberal?.["高度教養科目"],
      got: sumCategory("高度教養科目"),
      note: "高度教養科目の必要単位",
    }] : [{
      key: "businessBase",
      title: "教養科目（基盤系）",
      need: rule.liberal?.["基盤系"],
      got: basisCredits(),
      note: "基盤系4単位",
    }, {
      key: "businessLiberal",
      title: "教養科目（人文系・自然系・社会系・総合系）",
      need: rule.liberal?.["教養科目"],
      got: businessFourFieldsCredits(),
      note: "人文系・自然系・社会系・総合系から12単位",
    }, {
      key: "businessHumanNatural",
      title: "人文系・自然系",
      need: rule.humanNaturalMinimum,
      got: businessHumanNaturalCredits(),
      note: "四分野12単位の内数として8単位以上",
    }, {
      key: "businessLanguages",
      title: "教養科目（外国語系）",
      need: rule.liberal?.["外国語科目"],
      got: roundCredits(businessLanguageICredits() + businessLanguageIICredits()),
      note: "外国語第I・第IIを各4単位",
    }, {
      key: "businessLanguageI",
      title: "外国語第I",
      need: rule.language1,
      got: businessLanguageICredits(),
      note: "Academic English Communication・Literacyから4単位",
    }, {
      key: "businessLanguageII",
      title: "外国語第II",
      need: rule.language2,
      got: businessLanguageIICredits(),
      note: "選択した初修外国語から4単位",
    }]),
    {
      key: "special",
      title: "専門科目",
      need: rule.special,
      got: specialCredits(),
      note: `専門科目区分 ${rule.special || "--"} 単位`,
    },
    {
      key: "commonBasic",
      title: "共通専門基礎",
      need: rule.commonBasic,
      got: commonBasicCredits(),
      note: rule.commonBasicOverflowToOtherMax
        ? `${rule.commonBasic || "--"}単位以上。超過は${rule.commonBasicOverflowToOtherMax}単位まで「その他必要と認める科目」へ算入`
        : `${rule.commonBasic || "--"} 単位以上`,
    },
    ...(rule.commonBasicWithInfo ? [{
      key: "commonBasicWithInfo",
      title: "共通専門基礎+情報科学",
      need: rule.commonBasicWithInfo,
      got: commonBasicWithInfoCredits(),
      note: "情報科学を含め6単位",
    }] : []),
    {
      key: "firstYear",
      title: "初年次セミナー",
      need: rule.firstYear,
      got: sumBy((course) => course.name === "初年次セミナー"),
      note: "必修",
    },
    {
      key: "group1",
      title: "第1群科目",
      need: rule.group1,
      got: sumBy((course) => course.group === "第1群"),
      note: "経営学・会計学・市場システム基礎論",
    },
    {
      key: "group2",
      title: "第2群科目",
      need: rule.group2,
      got: sumBy((course) => course.group === "第2群"),
      note: `${rule.group2 || "--"} 単位以上`,
    },
    {
      key: "global",
      title: "グローバル科目群",
      need: rule.global,
      got: sumBy((course) => course.group === "グローバル科目群"),
      note: `${rule.global || "--"} 単位以上`,
    },
    {
      key: "group23Global",
      title: "第2群+第3群+グローバル",
      need: rule.group23Global,
      got: group23GlobalCredits(),
      note: `合計 ${rule.group23Global || "--"} 単位`,
    },
    ...(rule.otherMax ? [{
      key: "businessOtherMax",
      title: "その他必要と認める科目",
      need: null,
      got: businessNewOtherCredits(),
      note: `健康・スポーツ科学、外国語第II（C1・C2）、外国語第III、所定の他学部専門科目などを${rule.otherMax}単位まで算入${rule.commonBasicOverflowToOtherMax ? `。共通専門基礎の超過は${rule.commonBasicOverflowToOtherMax}単位まで` : ""}`,
      statusLabel: `${compactNumber(businessNewOtherCredits())}単位算入`,
      statusTone: "neutral",
    }] : []),
    ...(rule.annualCap ? [{
      key: "businessAnnualCap",
      title: "年間履修登録上限",
      need: null,
      got: 0,
      note: `${rule.annualCap}単位。卒業論文は対象外`,
      statusLabel: "年度ごとに確認",
      statusTone: "neutral",
    }] : []),
    ...(rule.transferMax ? [{
      key: "businessTransferMax",
      title: "他大学等の認定単位",
      need: null,
      got: 0,
      note: `大学以外の教育施設等を含め合算${rule.transferMax}単位以内`,
      statusLabel: "認定上限",
      statusTone: "neutral",
    }] : []),
    ...(rule.researchNotice && sumBy((course) => /研究指導/.test(course.name || "")) > 0 ? [{
      key: "businessResearchThesis",
      title: "研究指導選択時の卒業論文",
      need: Number(state.year) <= 2024 ? 8 : 4,
      got: sumBy((course) => /卒業論文/.test(course.name || "")),
      note: `${rule.researchNotice} 第3群科目の内訳として判定します。`,
    }] : (rule.researchNotice ? [{
      key: "businessResearchNotice",
      title: "研究指導・卒業論文",
      need: null,
      got: 0,
      note: `${rule.researchNotice} 研究指導を選択した場合だけ第3群科目の内訳で判定します。`,
      statusLabel: "選択時のみ",
      statusTone: "neutral",
    }] : [])),
    ...(rule.researchRoute ? (() => {
      const eligibility = businessResearchEligibility();
      return [
        {
          key: "businessResearchEligibility",
          title: "ゼミ（研究指導）の履修資格判定",
          need: null,
          got: 0,
          note: "下の2条件を数値で判定します。卒業要件本体とは分離し、不足していても卒業判定を停止しません。",
          statusLabel: eligibility.eligible ? "履修条件を充足" : "履修条件が不足",
          statusTone: eligibility.eligible ? "ok" : "warn",
        },
        {
          key: "businessResearchEligibilityGroup1",
          title: "ゼミ履修条件：第1群科目",
          need: eligibility.group1Minimum,
          got: eligibility.group1Credits,
          note: "研究指導の履修資格。卒業必要単位とは別に判定します。",
          advisoryOnly: true,
        },
        {
          key: "businessResearchEligibilityTotal",
          title: "ゼミ履修条件：総修得単位",
          need: eligibility.totalMinimum,
          got: eligibility.totalCredits,
          note: "資格免許科目等を除く総修得単位。卒業必要単位とは別に判定します。",
          advisoryOnly: true,
        },
      ];
    })() : []),
    ...(rule.correctionNotice ? [{
      key: "businessCorrection",
      title: "公式訂正資料",
      need: null,
      got: 0,
      note: rule.correctionNotice,
      statusLabel: "訂正を反映",
      statusTone: "warn",
    }] : []),
    ...(currentFacultyConfig().specialPrograms?.length ? [{
      key: "businessSpecialPrograms",
      title: "特別プログラム",
      need: null,
      got: 0,
      note: currentFacultyConfig().specialPrograms.map((program) => program.name).join("、") + "は一般卒業要件と分離して公式資料で確認します。",
      statusLabel: "別確認",
      statusTone: "neutral",
    }] : []),
  ];
}

function requirementStatus(def) {
  if (def.statusTone) return def.statusTone;
  if (!def.need && def.need !== 0) return "neutral";
  if (def.limitType === "max") return def.got <= def.need ? "ok" : "danger";
  return def.got >= def.need ? "ok" : "warn";
}

function latestAttemptRank(course) {
  const year = Number(course.year || 0);
  const term = courseTermRank(course) || 0;
  return year * 10 + term;
}

function hasEarnedCourse(name) {
  return courses().some((course) => normalize(course.name) === normalize(name) && isEarned(course));
}

function retakeMaster() {
  return state.retakeRequirements || {};
}

function retakePoolMaster() {
  return state.retakePoolMaster || {};
}

function retakeEligibilityMaster() {
  return state.retakeEligibilityMaster || {};
}

function retakeCompletenessMaster() {
  return state.retakeCompletenessMaster || {};
}

const RETAKE_TERMINAL_STATES = new Set([
  "fixed_required",
  "deficit_eligible",
  "not_repeatable",
  "later_passed",
  "outside_graduation",
]);

class RetakeMasterGapError extends Error {
  constructor(course, details = {}) {
    super(`再履修マスタ未接続: ${course?.name || "科目名不明"}`);
    this.name = "RetakeMasterGapError";
    this.code = "RETAKE_MASTER_GAP";
    this.course = course || null;
    this.details = details;
  }
}

function retakeMasterGap(course, details = {}) {
  return {
    bucket: "history",
    policy: "unresolved_warning",
    terminalState: null,
    reason: "科目の再履修区分は確認中です。卒業要件の判定は継続します",
    poolIds: [],
    eligibilityKnown: false,
    courseName: course?.name || "",
    ...details,
  };
}

function requireResolvedRetakeMetadata(metadata, course) {
  if (!metadata || metadata.eligibilityKnown === false || metadata.policy === "master_gap") {
    throw new RetakeMasterGapError(course, { metadata });
  }
  if (!RETAKE_TERMINAL_STATES.has(metadata.terminalState)) {
    throw new RetakeMasterGapError(course, { reason: "invalid_terminal_state", metadata });
  }
  if (!Array.isArray(metadata.poolIds)) {
    throw new RetakeMasterGapError(course, { reason: "pool_ids_not_array", metadata });
  }
  return metadata;
}

function canonicalRetakeCategory(value) {
  const category = normalize(value || "");
  const aliases = retakeCompletenessMaster().normalization?.categoryAliases || {};
  for (const [canonical, values] of Object.entries(aliases)) {
    if ([canonical, ...(values || [])].some((item) => normalize(item) === category)) return canonical;
  }
  return category;
}

function retakeExactException(course) {
  const route = retakeCompletenessMaster().facultyRoutes?.[state.faculty];
  const name = normalize(course?.name || "");
  const exception = (route?.exactExceptions || []).find((entry) => (
    exactCourseSetMatch(name, entry.courseNames || (entry.courseName ? [entry.courseName] : []))
    || (entry.coursePrefix && name.startsWith(normalize(entry.coursePrefix)))
  ));
  if (!exception || !["not_repeatable", "outside_graduation"].includes(exception.state)) return null;
  return {
    bucket: "history",
    policy: exception.state,
    terminalState: exception.state,
    reason: exception.reason || (exception.state === "not_repeatable"
      ? "科目固有の公式規則により再履修できません"
      : "一般卒業要件の算入対象外です"),
    poolIds: [],
    eligibilityKnown: true,
  };
}

function literatureCoursePolicy(course) {
  const records = state.finalP0Rules?.literatureCourseSymbolPolicy?.courses || [];
  return records.find((entry) => compactCourseName(entry.courseName) === compactCourseName(course?.name)) || null;
}

function literatureCourseSymbolCompleteness() {
  const records = state.finalP0Rules?.literatureCourseSymbolPolicy?.courses || [];
  const incomplete = records.filter((entry) => (
    !entry.courseName
    || !entry.gpaSymbol
    || typeof entry.repeatAfterPass !== "boolean"
    || typeof entry.retakeAfterFailure !== "boolean"
    || !entry.pastFailGpaAfterRetake
    || !entry.graduationUse
  ));
  return { count: records.length, incomplete };
}

function facultyResultMaster() {
  return state.facultyResultRequirements || {};
}

function failedAttempts() {
  return courses()
    .filter((course) => course.grade === "不可")
    .sort((a, b) => latestAttemptRank(b) - latestAttemptRank(a));
}

function courseIdentityRecord(course) {
  const names = [course?.name, ...(course?.equivalentNames || []), ...(course?.replacementNames || [])]
    .filter(Boolean)
    .map(identityCourseNameKey);
  const ids = [course?.courseId, course?.id].filter(Boolean).map((value) => normalize(value).toUpperCase());
  return (state.courseIdentityMaster?.courses || []).find((entry) => (
    ids.includes(normalize(entry.courseId).toUpperCase())
    || [entry.canonicalName, ...(entry.aliases || [])].some((name) => names.includes(identityCourseNameKey(name)))
  )) || null;
}

function equivalentCourseKeys(course) {
  const identity = courseIdentityRecord(course);
  const names = [
    course?.name,
    ...(course?.equivalentNames || []),
    ...(course?.replacementNames || []),
    identity?.canonicalName,
    ...(identity?.aliases || []),
  ].filter(Boolean).map((value) => `name:${compactCourseName(value)}`);
  const ids = [
    course?.courseId,
    course?.id,
    course?.replacementCourseId,
    ...(course?.equivalentCourseIds || []),
    ...(course?.replacementCourseIds || []),
    identity?.courseId,
    ...(identity?.equivalentCourseIds || []),
    ...(identity?.replacementCourseIds || []),
  ].filter(Boolean).map((value) => `id:${normalize(value).toUpperCase()}`);
  return [...new Set([...names, ...ids])];
}

function hasLaterEarnedEquivalent(course) {
  const failedKeys = new Set(equivalentCourseKeys(course));
  return courses().some((candidate) => {
    if (!isEarned(candidate) || latestAttemptRank(candidate) <= latestAttemptRank(course)) return false;
    return equivalentCourseKeys(candidate).some((key) => failedKeys.has(key));
  });
}

function matchesRetakePattern(course, pattern) {
  if (!pattern) return false;
  try {
    return new RegExp(pattern).test(normalize(course?.name || ""));
  } catch {
    return false;
  }
}

function currentStudentYear() {
  const explicit = Number(state.data?.currentStudentYear || state.data?.studentYear);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  const admissionYear = Number(state.year);
  return Number.isFinite(admissionYear) ? Math.max(1, new Date().getFullYear() - admissionYear + 1) : 1;
}

function isTransferStudent() {
  return Boolean(state.data?.transferStudent || state.data?.isTransferStudent || /編入/.test(normalize(state.data?.admissionType || "")));
}

function lawFinalP0CourseRule(course) {
  const master = state.finalP0Rules?.lawRetakeAndYearLimits || {};
  if (exactCourseSetMatch(course?.name, master.introductoryCourses || [])) {
    const year = currentStudentYear();
    const transferException = isTransferStudent() && year === 3;
    return year <= 2 || transferException
      ? { bucket: "category", policy: "category_choice", reason: transferException ? "編入3年次の履修例外" : `${year}年次は再履修可能`, eligibilityKnown: true }
      : { bucket: "history", policy: "year_restricted", reason: "一般学生は3年次以降履修不可", eligibilityKnown: true };
  }
  if (exactCourseName(course, master.legalInterpretationBasics?.courseName || "法解釈基礎")) {
    return { bucket: "history", policy: "not_repeatable", reason: "重複履修不可。応用法律等の同じ横断要件に入る別科目で不足を確認", eligibilityKnown: true };
  }
  return null;
}

function isFixedFoundationName(name) {
  const fixed = retakeMaster().fixedFoundation;
  return (fixed?.courses || []).some((target) => compactCourseName(target) === compactCourseName(name));
}

function businessFixedRequirement(name) {
  const entries = facultyResultMaster().faculties?.business?.fixedRequired?.["2021-2026"] || [];
  return entries.find((entry) => compactCourseName(entry.title) === compactCourseName(name)) || null;
}

function exactCourseSetMatch(name, values = []) {
  const key = compactCourseName(name);
  return values.some((value) => compactCourseName(value) === key);
}

function businessRetakePolicy(course) {
  const master = retakeEligibilityMaster().business || {};
  const year = Number(state.year);
  const override = (master.courseOverrides || []).find((entry) => (
    (entry.entranceYears || []).includes(year)
    && exactCourseSetMatch(course?.name, entry.courseNames || [])
  ));
  if (override) return override;
  return (master.courseRetakePolicies || []).find((entry) => exactCourseSetMatch(course?.name, entry.courseNames || [])) || null;
}

function businessCommonBasicCourseSet(course) {
  const sets = retakeEligibilityMaster().business?.courseSets || {};
  if (exactCourseSetMatch(course?.name, sets.businessInformationScience || [])) return "businessInformationScience";
  if (exactCourseSetMatch(course?.name, sets.businessCommonBasicMath || [])) return "businessCommonBasicMath";
  return "";
}

function businessDspTopic(course) {
  const config = state.finalP0Rules?.businessDspSameTheme || {};
  const name = normalize(course?.name || "");
  if (!name.startsWith(config.coursePrefix || "経営データ分析")) return "";
  const match = name.match(/[（(]([^）)]+)[）)]/);
  if (!match) return "";
  const topic = normalize(match[1]).replace(/[・･]/g, "・");
  return (config.excludeFromTopicSet || []).some((excluded) => compactCourseName(excluded) === compactCourseName(topic)) ? "" : topic;
}

function businessCourseSet(course) {
  const sets = retakePoolMaster().business?.courseSets || {};
  for (const setName of ["group2", "group3", "global"]) {
    if (exactCourseSetMatch(course?.name, sets[setName] || [])) return setName;
  }
  return "";
}

function courseGraduationPoolIds(course) {
  if (!course || isQualificationCourse(course)) return [];
  if (state.faculty === "business") {
    if (businessDspTopic(course)) {
      return [...new Set(retakePoolMaster().business?.poolAssignments?.group3 || [])];
    }
    const commonBasicSet = businessCommonBasicCourseSet(course);
    if (commonBasicSet) {
      const legacy = Number(state.year) <= 2024;
      const pools = legacy
        ? [
          ...(commonBasicSet === "businessCommonBasicMath" ? ["business.commonBasic2021to2024"] : []),
          "business.commonBasicWithInformation2021to2024",
          "business.professionalTotal",
        ]
        : ["business.commonBasic2025to2026", "business.professionalTotal"];
      return [...new Set(pools)];
    }
    const setName = businessCourseSet(course);
    if (setName) return [...new Set(retakePoolMaster().business?.poolAssignments?.[setName] || [])];
    const group = normalize(course.group || "");
    const category = canonicalRetakeCategory(course.category || "");
    const section = normalize(course.section || "");
    const assignments = retakePoolMaster().business?.poolAssignments || {};
    if (/第2群/.test(group)) return [...new Set(assignments.group2 || [])];
    if (/第3群/.test(group)) return [...new Set(assignments.group3 || [])];
    if (/グローバル/.test(`${group} ${category}`)) return [...new Set(assignments.global || [])];
    if (/専門/.test(`${section} ${category}`)) return ["business.professionalTotal"];
    return [];
  }
  if (state.faculty === "law") {
    const category = canonicalRetakeCategory(course.category);
    if (course.section === "専門科目" || ["専門科目", "法律学科専門科目", "別表第1ロ"].includes(category)) return ["law.special"];
    if (course.section === "全学共通" || [
      "基礎教養科目", "総合教養科目", "外国語科目", "情報科目", "健康・スポーツ科学", "高度教養科目", "基盤系", "教養科目", "別表第1イ",
    ].includes(category)) return ["law.general"];
    return [];
  }
  if (state.faculty === "internationalHumanSciences") {
    const category = canonicalRetakeCategory(course.category);
    if (Number(state.year) >= 2025 && ["人文系", "社会系", "自然系", "総合系"].includes(category)) {
      return ["internationalHumanSciences.ihsLiberal"];
    }
    const map = {
      "基礎教養科目": "internationalHumanSciences.ihsLiberalBase",
      "総合教養科目": "internationalHumanSciences.ihsLiberalGeneral",
      "外国語科目": "internationalHumanSciences.ihsLanguages",
      "健康・スポーツ科学": "internationalHumanSciences.ihsSport",
      "情報科目": "internationalHumanSciences.ihsInformation",
      "高度教養科目": "internationalHumanSciences.ihsAdvancedException",
      "基盤系": "internationalHumanSciences.ihsBase",
      "教養科目": "internationalHumanSciences.ihsLiberal",
      "学部共通基礎科目": "internationalHumanSciences.ihsFacultyBase",
      "学部共通発展科目": "internationalHumanSciences.ihsFacultyDevelopment",
      "GSP科目": "internationalHumanSciences.ihsGsp",
      "学科専門科目": "internationalHumanSciences.ihsDepartmentSpecial",
      "自由選択科目": "internationalHumanSciences.ihsFreeChoice",
    };
    return map[category] ? [map[category]] : [];
  }
  if (state.faculty === "literature") {
    const policy = literatureCoursePolicy(course);
    if (policy?.graduationUse === "excluded_qualification") return [];
    if (/基礎科目/.test(policy?.courseGroup || "")) return ["literature.litBasic"];
    if (/グローバル人文学(?:英語|演習)/.test(policy?.courseGroup || "")) return ["literature.litGlobalEnglish"];
    if (policy?.graduationUse === "literature_requirement_pool") return ["literature.litThesisRelated"];
    const map = {
      "基礎教養科目": "literature.litLiberalBase",
      "総合教養科目": "literature.litLiberalGeneral",
      "外国語科目": "literature.litLanguages",
      "情報科目": "literature.litInformation",
      "健康・スポーツ科学": "literature.litSport",
      "高度教養科目": "literature.litAdvanced",
      "基盤系": "literature.litBase",
      "教養科目": "literature.litGeneral",
      "専門基礎科目": "literature.litBasic",
      "グローバル人文学英語科目": "literature.litGlobalEnglish",
      "グローバル人文学演習": "literature.litGlobalEnglish",
      "卒業論文関連科目": "literature.litThesisRelated",
      "卒業論文": "literature.litThesis",
      "自由選択科目": "literature.litFreeChoice",
    };
    const category = canonicalRetakeCategory(course.category);
    return map[category] ? [map[category]] : [];
  }
  return [];
}

function requirementPoolId(key) {
  if (state.faculty === "business") {
    const legacy = Number(state.year) <= 2024;
    return ({
      group2: "business.group2",
      global: "business.global",
      group23Global: "business.group23global",
      special: "business.professionalTotal",
      commonBasic: legacy ? "business.commonBasic2021to2024" : "business.commonBasic2025to2026",
      commonBasicWithInfo: legacy ? "business.commonBasicWithInformation2021to2024" : "",
    })[key] || "";
  }
  if (state.faculty === "law") {
    return ({ lawI: "law.general", lawRo: "law.special", lawAdditional: "law.additional" })[key] || "";
  }
  if (["internationalHumanSciences", "literature"].includes(state.faculty)) return `${state.faculty}.${key}`;
  return "";
}

function deficitByPoolId() {
  const deficits = new Map();
  for (const def of requirementDefs()) {
    const poolId = requirementPoolId(def.key);
    const required = Number(def.need);
    if (!poolId || !Number.isFinite(required) || def.limitType === "max") continue;
    const missing = Math.max(0, required - Number(def.got || 0));
    if (missing > 0) {
      const title = poolId === "business.commonBasicWithInformation2021to2024"
        ? `共通専門基礎・情報科学があと${compactNumber(missing)}単位必要`
        : def.title;
      deficits.set(poolId, { poolId, title, missing, jump: /liberal|language|information|sport|advanced|base/i.test(def.key) ? "liberal" : "special" });
    }
  }
  return deficits;
}

function resolvedRetakeMetadataForCourse(course) {
  const facultyRule = retakeMaster().facultyRules?.[state.faculty] || {};
  const requirementKind = normalize(course?.requirementKind || course?.requirementType || "");
  const suppliedPolicy = normalize(course?.retakePolicy || "");
  if ((retakeMaster().candidateDisplay?.excludedPolicies || ["not_repeatable"]).includes(suppliedPolicy)) {
    return { bucket: "history", policy: "not_repeatable", reason: "公式規定上、同一科目を再履修できません", eligibilityKnown: true };
  }
  if (isQualificationCourse(course)) {
    return state.teachingEnabled && teachingAvailableForProfile()
      ? { bucket: "category", policy: "teaching_separate", reason: "教職・資格側の不足として確認", eligibilityKnown: true }
      : { bucket: "history", policy: "teaching_separate", reason: "教職・資格の科目は一般卒業要件と分離", eligibilityKnown: true };
  }
  if (state.faculty === "business") {
    const retakePolicy = businessRetakePolicy(course);
    if (retakePolicy?.retakeEligibility === "not_repeatable") {
      return { bucket: "history", policy: "not_repeatable", reason: retakePolicy.historyLabel || "再履修不可", eligibilityKnown: true };
    }
    const categoryChoiceOnly = retakeMaster().candidateDisplay?.excludedCategories || ["基礎教養科目", "総合教養科目"];
    if (categoryChoiceOnly.includes(normalize(course?.category || ""))) {
      return { bucket: "history", policy: "category_choice", reason: "教養科目は同一科目ではなく区分全体の不足で確認", eligibilityKnown: true };
    }
    const dspTopic = businessDspTopic(course);
    if (dspTopic) {
      if (hasEarnedBusinessDspTopic(course)) {
        return { bucket: "history", policy: "history_only", reason: `DSPの同一テーマ「${dspTopic}」を修得済み`, eligibilityKnown: true };
      }
      if (course.currentlyOffered !== true) {
        return { bucket: "history", policy: "not_currently_offered", reason: `DSPテーマ「${dspTopic}」の現行開講を確認できないため候補外`, eligibilityKnown: true };
      }
      if (course.prerequisitesMet === false) {
        return { bucket: "history", policy: "prerequisite_unmet", reason: `DSPテーマ「${dspTopic}」の前提条件を満たしていません`, eligibilityKnown: true };
      }
      return {
        bucket: "category",
        policy: "category_choice",
        reason: `DSPテーマ「${dspTopic}」の不合格後再履修候補`,
        poolIds: courseGraduationPoolIds(course),
        eligibilityKnown: true,
      };
    }
    const fixedRequired = businessFixedRequirement(course?.name);
    if (fixedRequired) {
      const sourcePage = fixedRequired.sourcePages?.[state.year];
      return {
        bucket: "required",
        policy: "same_course",
        reason: `経営学部${state.year}年度の固定必修${sourcePage ? `（学生便覧 PDF p.${sourcePage}）` : ""}`,
        eligibilityKnown: true,
      };
    }
    const poolIds = courseGraduationPoolIds(course);
    if (poolIds.length) return {
      bucket: "category",
      policy: retakePolicy?.retakeEligibility || "category_choice",
      registrationMethod: retakePolicy?.registrationMethod || "",
      priorityFromDeficit: Boolean(retakePolicy?.priorityFromDeficit),
      reason: "卒業要件の不足を埋められる科目",
      poolIds,
      eligibilityKnown: true,
    };
  }
  if (["fixed", "fixed_course", "required_set", "必修"].includes(requirementKind)) {
    return {
      bucket: "required",
      policy: suppliedPolicy || "same_course",
      reason: requirementKind === "required_set" ? "指定された必修科目群" : "固定必修科目",
    };
  }
  const fixed = retakeMaster().fixedFoundation;
  if ((fixed?.entranceYears || []).includes(Number(state.year)) && isFixedFoundationName(course?.name)) {
    return { bucket: "required", policy: fixed.policy || "same_course", reason: "全学共通の固定基礎科目" };
  }
  if (state.faculty === "law") {
    const finalRule = lawFinalP0CourseRule(course);
    if (finalRule) return finalRule;
  }
  if (state.faculty === "economics" && (facultyRule.groupOneCourses || []).some((name) => compactCourseName(name) === compactCourseName(course?.name))) {
    return { bucket: "required", policy: facultyRule.policy || "same_course", reason: "第I群の指定科目" };
  }
  if (state.faculty === "law" && matchesRetakePattern(course, facultyRule.firstYearSeminarPattern)) {
    return { bucket: "required", policy: facultyRule.firstYearPolicy || "special_permission", reason: "初年次セミナーの科目固有手続" };
  }
  if (state.faculty === "law" && matchesRetakePattern(course, facultyRule.repeatablePattern)) {
    return { bucket: "category", policy: facultyRule.repeatablePolicy || "repeatable_not_required", reason: "繰り返し履修可能な専門科目群" };
  }
  if (state.faculty === "internationalHumanSciences" && matchesRetakePattern(course, facultyRule.repeatablePattern)) {
    return { bucket: "category", policy: facultyRule.repeatablePolicy || "repeatable_not_required", reason: "演習科目群の不足として確認" };
  }
  if (state.faculty === "literature") {
    const policy = literatureCoursePolicy(course);
    if (policy) {
      if (!policy.retakeAfterFailure) {
        return { bucket: "history", policy: "not_repeatable", reason: "科目別規則により不合格後の再履修不可", eligibilityKnown: true };
      }
      return {
        bucket: "category",
        policy: policy.pastFailGpaAfterRetake === "remove" ? "gpa_replacement" : "repeatable_not_required",
        reason: policy.pastFailGpaAfterRetake === "remove"
          ? "不合格後の再履修可。再履修後は過去の不可をGPAから除外"
          : "不合格後の再履修可。過去の不可はGPAに残る",
        poolIds: courseGraduationPoolIds(course),
        eligibilityKnown: true,
      };
    }
    const symbol = normalize(course?.repeatSymbol || course?.retakeSymbol || "");
    if (symbol === facultyRule.repeatableSymbol || symbol === facultyRule.gpaReplacementSymbol) {
      return { bucket: "category", policy: symbol === facultyRule.gpaReplacementSymbol ? "gpa_replacement" : "repeatable_not_required", reason: "不合格後の再履修可", poolIds: courseGraduationPoolIds(course), eligibilityKnown: true };
    }
  }
  const poolIds = courseGraduationPoolIds(course);
  if (poolIds.length) {
    return { bucket: "category", policy: "category_choice", reason: "同じ卒業要件区分の不足を補える科目群", poolIds, eligibilityKnown: true };
  }
  return null;
}

function retakeTerminalState(metadata) {
  if (!metadata) return null;
  if (RETAKE_TERMINAL_STATES.has(metadata?.terminalState)) return metadata.terminalState;
  if (metadata?.bucket === "required") return "fixed_required";
  if (metadata?.bucket === "category" && metadata?.policy !== "teaching_separate") return "deficit_eligible";
  if (metadata?.bucket === "history" && metadata?.policy === "category_choice") return "deficit_eligible";
  if (["not_repeatable", "year_restricted", "not_currently_offered", "prerequisite_unmet", "history_only"].includes(metadata?.policy)) {
    return "not_repeatable";
  }
  if (["outside_graduation", "teaching_separate"].includes(metadata?.policy)) return "outside_graduation";
  return null;
}

function retakeMetadataForCourse(course) {
  if (course?.grade === "不可" && hasLaterEarnedEquivalent(course)) {
    return {
      bucket: "history",
      policy: "later_passed",
      terminalState: "later_passed",
      reason: "後の学期に同一又は公式等価科目を修得済みです",
      poolIds: [],
      eligibilityKnown: true,
    };
  }
  const exactException = retakeExactException(course);
  const metadata = exactException || resolvedRetakeMetadataForCourse(course);
  if (!metadata) {
    return retakeMasterGap(course, { reasonCode: "unconnected_course" });
  }
  return {
    ...metadata,
    terminalState: retakeTerminalState(metadata),
    poolIds: metadata.poolIds || courseGraduationPoolIds(course),
    eligibilityKnown: metadata.eligibilityKnown !== false,
  };
}

function assertRetakeMasterCompleteForCurrentData() {
  return retakePolicyCompletenessIssues();
}

function fixtureProfile(fixture) {
  return {
    faculty: fixture.faculty,
    year: String(fixture.entranceYear || fixture.id.match(/-(20\d{2})-/)?.[1] || 2024),
    department: fixture.department || "",
    lawCourse: fixture.courseRoute || "",
    literatureMajor: fixture.major || "",
  };
}

function runKnownFailureFixtures(fixtures = []) {
  const snapshot = {
    faculty: state.faculty,
    year: state.year,
    department: state.department,
    lawCourse: state.lawCourse,
    literatureMajor: state.literatureMajor,
    ihsGspRoute: state.ihsGspRoute,
    data: state.data,
    decoratedProfileKey: state.decoratedProfileKey,
    teachingEnabled: state.teachingEnabled,
  };
  const results = [];
  try {
    for (const fixture of fixtures) {
      Object.assign(state, fixtureProfile(fixture));
      state.teachingEnabled = false;
      const failed = {
        name: fixture.course,
        category: fixture.category || "",
        group: fixture.group || "",
        credits: Number(fixture.credits || 2),
        grade: "不可",
        year: "2024",
        term: "前期",
      };
      const fixtureCourses = [failed];
      if (fixture.laterPassed) {
        fixtureCourses.push({ ...failed, grade: "可", year: "2025", term: "後期" });
      }
      state.data = { courses: fixtureCourses, summary: {} };
      state.decoratedProfileKey = "";
      decorateCourseUsages(fixtureCourses, { source: "knownFailureFixture" });
      try {
        const actual = requireResolvedRetakeMetadata(retakeMetadataForCourse(failed), failed);
        const actualPools = [...(actual.poolIds || [])].sort();
        const expectedPools = [...(fixture.expectedPools || [])].sort();
        results.push({
          id: fixture.id,
          passed: actual.terminalState === fixture.expectedState
            && JSON.stringify(actualPools) === JSON.stringify(expectedPools),
          expectedState: fixture.expectedState,
          actualState: actual.terminalState,
          expectedPools,
          actualPools,
        });
      } catch (error) {
        results.push({ id: fixture.id, passed: false, errorCode: error.code || error.name, message: error.message });
      }
    }
  } finally {
    Object.assign(state, snapshot);
  }
  return {
    passed: results.length === fixtures.length && results.every((item) => item.passed),
    total: results.length,
    passedCount: results.filter((item) => item.passed).length,
    failed: results.filter((item) => !item.passed),
    results,
  };
}

async function runGoldenFixtures(fixtures, productionAdapter) {
  const results = [];
  for (const fixture of fixtures) {
    try {
      const output = await productionAdapter.run(fixture);
      const assertions = await productionAdapter.assert(fixture, output);
      results.push({
        id: fixture.id,
        variantId: fixture.variantId,
        passed: assertions.every((item) => item.passed === true),
        assertions,
        buildId: APP_BUILD,
        rulesVersion: state.rulesVersion,
        expectedRuleHash: fixture.expectedRuleHash,
      });
    } catch (error) {
      results.push({ id: fixture.id, variantId: fixture.variantId, passed: false, errorCode: error.code || error.name, message: error.message });
    }
  }
  return {
    passed: results.length === 276 && results.every((item) => item.passed),
    expectedCount: 276,
    actualCount: results.length,
    passedCount: results.filter((item) => item.passed).length,
    failed: results.filter((item) => !item.passed),
    results,
  };
}

function requiredRetakeItems() {
  if (!state.data || currentRule().unavailable) return [];
  const items = [];
  const fixed = retakeMaster().fixedFoundation;
  if ((fixed?.entranceYears || []).includes(Number(state.year))) {
    for (const name of fixed.courses || []) {
      const attempts = courses().filter((course) => exactCourseName(course, name));
      const earned = attempts.some(isEarned);
      if (!earned) {
        const failed = attempts.find((course) => course.grade === "不可");
        items.push({
          course: failed || { name, category: "全学共通・教養", year: state.year, term: "" },
          policy: "same_course",
          reason: failed ? "固定基礎科目が不合格" : "固定基礎科目が未修得",
          missing: !failed,
        });
      }
    }
  }
  for (const course of failedAttempts()) {
    if (items.some((item) => exactCourseName(item.course, course.name))) continue;
    const meta = retakeMetadataForCourse(course);
    if (meta.bucket !== "required" || hasLaterEarnedEquivalent(course)) continue;
    items.push({ course, ...meta, missing: false });
  }
  return items;
}

function failedHistoryItems() {
  return failedAttempts().map((course) => {
    const meta = retakeMetadataForCourse(course);
    const laterPass = hasLaterEarnedEquivalent(course);
    return {
      course,
      laterPass,
      reason: laterPass ? "後の学期で合格済み" : meta.reason,
      policy: meta.policy,
    };
  });
}

function matchingShortageForCourse(course) {
  const excludedCategories = retakeMaster().candidateDisplay?.excludedCategories || ["基礎教養科目", "総合教養科目"];
  if (excludedCategories.includes(normalize(course?.category || ""))) return null;
  if (course?.programUsages?.length && !(course.graduationUsages || []).length) {
    return el.specialProgramSelect?.value
      ? { title: "選択中の資格・プログラム", jump: "programs" }
      : null;
  }
  if (isQualificationCourse(course)) {
    return state.teachingEnabled && teachingAvailableForProfile()
      ? { title: "選択中の教職課程", jump: "teaching" }
      : null;
  }
  const pools = courseGraduationPoolIds(course);
  const deficits = deficitByPoolId();
  const matched = pools.map((poolId) => deficits.get(poolId)).filter(Boolean);
  if (!matched.length) return null;
  return {
    title: [...new Set(matched.map((item) => item.title))].join("、"),
    jump: matched[0].jump,
    poolIds: matched.map((item) => item.poolId),
  };
}

function businessRetakeNominalCredits(course) {
  if (businessCommonBasicCourseSet(course)) return 1;
  const value = Number(course?.nominalCredits || course?.credits);
  if (Number.isFinite(value) && value > 0) return value;
  return officialNominalCredits(course) || 2;
}

function officialNominalCredits(course) {
  const identity = courseIdentityRecord(course);
  const identityCredits = Number(identity?.nominalCreditsByEntranceYear?.[String(state.year)]);
  if (Number.isFinite(identityCredits) && identityCredits > 0) return identityCredits;
  const name = compactCourseName(course?.name || "");
  const correction = (state.businessCourseCreditCorrectionMaster?.rules || []).find((entry) => (
    entry.autoFillWhenMissing === true
    && (entry.entranceYears || []).includes(Number(state.year))
    && entry.canonicalName
    && compactCourseName(entry.canonicalName) === name
  ));
  const exact = Number(correction?.correctedCredits?.exact);
  return Number.isFinite(exact) && exact > 0 ? exact : null;
}

function businessShortestPathCourseKeys() {
  if (state.faculty !== "business") return new Set();
  const targetPool = Number(state.year) <= 2024
    ? "business.commonBasicWithInformation2021to2024"
    : "business.commonBasic2025to2026";
  const deficit = deficitByPoolId().get(targetPool);
  if (!deficit) return new Set();
  const preferredNames = retakeEligibilityMaster().business?.verifiedScenario?.shortestPathFailedCourses || [];
  const preferredRank = new Map(preferredNames.map((name, index) => [compactCourseName(name), index]));
  const candidates = failedAttempts()
    .filter((course) => !hasLaterEarnedEquivalent(course))
    .filter((course) => businessRetakePolicy(course)?.retakeEligibility === "repeatable")
    .filter((course) => courseGraduationPoolIds(course).includes(targetPool))
    .filter((course, index, list) => list.findIndex((item) => compactCourseName(item.name) === compactCourseName(course.name)) === index)
    .sort((a, b) => (
      (preferredRank.get(compactCourseName(a.name)) ?? 999) - (preferredRank.get(compactCourseName(b.name)) ?? 999)
      || businessRetakeNominalCredits(b) - businessRetakeNominalCredits(a)
      || Number(a.sourceIndex || 0) - Number(b.sourceIndex || 0)
    ));
  const selected = [];
  let covered = 0;
  for (const course of candidates) {
    if (covered >= deficit.missing) break;
    selected.push(course);
    covered += businessRetakeNominalCredits(course);
  }
  return covered >= deficit.missing
    ? new Set(selected.map((course) => compactCourseName(course.name)))
    : new Set();
}

function retakePolicyCompletenessIssues() {
  return failedAttempts()
    .map((course) => ({ course, metadata: retakeMetadataForCourse(course) }))
    .filter(({ metadata }) => !RETAKE_TERMINAL_STATES.has(metadata.terminalState))
    .map(({ course }) => ({ course, issue: "retake_terminal_state_missing" }));
}

function rootedExclusionCredits() {
  return courses()
    .filter((course) => isEarned(course) && isRootedExclusionCourse(course))
    .reduce((total, course) => total + Number(course.credits || 0), 0);
}

function allocationLedger() {
  const rows = courses().map((course, index) => {
    const credits = Number(course.credits || 0);
    const earned = isEarned(course);
    const candidatePoolIds = courseGraduationPoolIds(course);
    let destination = "unearned";
    if (earned && isQualificationCourse(course)) destination = "qualification";
    else if (earned && isRootedExclusionCourse(course)) destination = "rooted_exclusion";
    else if (earned) destination = "graduation";
    return {
      rowId: `${index + 1}:${compactCourseName(course.name)}`,
      courseName: course.name || "科目名未読取",
      courseId: courseIdentityRecord(course)?.courseId || course.courseId || null,
      credits: roundCredits(credits),
      earned,
      destination,
      allocatedCredits: earned ? roundCredits(credits) : 0,
      primaryRequirementPoolId: destination === "graduation" ? (candidatePoolIds[0] || null) : null,
      candidateRequirementPoolIds: destination === "graduation" ? candidatePoolIds : [],
      classification: course.category || course.section || "未分類",
    };
  });
  const totalFor = (destination) => roundCredits(rows
    .filter((row) => row.destination === destination)
    .reduce((total, row) => total + row.allocatedCredits, 0));
  const totals = {
    graduation: totalFor("graduation"),
    qualification: totalFor("qualification"),
    rootedExclusion: totalFor("rooted_exclusion"),
    transcriptEarned: roundCredits(rows.filter((row) => row.earned).reduce((total, row) => total + row.allocatedCredits, 0)),
  };
  return {
    rows,
    totals,
    balanced: Math.abs(roundCredits(totals.transcriptEarned - totals.graduation - totals.qualification - totals.rootedExclusion)) < 0.01,
    unassignedGraduationRows: rows.filter((row) => row.destination === "graduation" && !row.primaryRequirementPoolId),
  };
}

function transcriptReconciliation() {
  const transcript = roundCredits(transcriptEarnedCredits());
  // Reconcile the transcript total against every earned row's top-level
  // destination. graduationCredits() is intentionally capped by degree
  // requirements, so using it here incorrectly treats legitimate excess
  // credits as a parsing error (notably 2025+ business transcripts).
  const allocation = allocationLedger();
  const hasParsedRows = courses().length > 0;
  const graduation = roundCredits(hasParsedRows ? allocation.totals.graduation : graduationCredits());
  const qualification = roundCredits(hasParsedRows ? allocation.totals.qualification : qualificationCredits());
  const rootedExclusion = roundCredits(hasParsedRows ? allocation.totals.rootedExclusion : rootedExclusionCredits());
  const delta = roundCredits(transcript - graduation - qualification - rootedExclusion);
  return {
    transcript,
    graduation,
    qualification,
    rootedExclusion,
    delta,
    balanced: Math.abs(delta) < 0.01,
    basis: hasParsedRows ? "allocated_earned_rows" : "reported_summary",
  };
}

function gpaLedger() {
  const rows = courses().map((course, index) => {
    const gp = Number(course.gp);
    const reportedCredits = Number(course.credits);
    const inferredCredits = officialNominalCredits(course);
    const credits = Number.isFinite(reportedCredits) && reportedCredits > 0
      ? reportedCredits
      : inferredCredits;
    const excludedBySymbol = isGpaExcludedCourse(course);
    const nominalCreditsMissing = course.grade === "不可" && (!Number.isFinite(credits) || credits <= 0);
    const included = !excludedBySymbol && Number.isFinite(gp) && Number.isFinite(credits) && credits > 0;
    return {
      rowId: `${index + 1}:${compactCourseName(course.name)}`,
      courseName: course.name || "科目名未読取",
      grade: course.grade || "",
      gp: Number.isFinite(gp) ? gp : null,
      credits: Number.isFinite(credits) ? credits : null,
      creditSource: Number.isFinite(reportedCredits) && reportedCredits > 0
        ? "transcript"
        : (Number.isFinite(inferredCredits) ? "official_correction" : null),
      included,
      numerator: included ? roundCredits(gp * credits) : 0,
      denominator: included ? roundCredits(credits) : 0,
      exclusionReason: included
        ? null
        : (excludedBySymbol ? "gpa_excluded_symbol" : (nominalCreditsMissing ? "failed_course_nominal_credits_missing" : "gp_or_credits_unavailable")),
    };
  });
  const numerator = rows.reduce((total, row) => total + row.numerator, 0);
  const denominator = rows.reduce((total, row) => total + row.denominator, 0);
  const transcriptNumerator = Number(state.data?.gpaTotal?.gpTotal);
  const transcriptDenominator = Number(state.data?.gpaTotal?.gpaCredits);
  const missingNominalCredits = rows.filter((row) => row.exclusionReason === "failed_course_nominal_credits_missing");
  const numeratorDelta = Number.isFinite(transcriptNumerator) ? roundCredits(transcriptNumerator - numerator) : null;
  const denominatorDelta = Number.isFinite(transcriptDenominator) ? roundCredits(transcriptDenominator - denominator) : null;
  const verified = !missingNominalCredits.length
    && Number.isFinite(numeratorDelta)
    && Number.isFinite(denominatorDelta)
    && Math.abs(numeratorDelta) < 0.01
    && Math.abs(denominatorDelta) < 0.01;
  return {
    rows,
    numerator: roundCredits(numerator),
    denominator: roundCredits(denominator),
    calculated: denominator > 0 ? numerator / denominator : null,
    transcript: {
      value: Number(state.data?.gpaTotal?.value),
      numerator: Number.isFinite(transcriptNumerator) ? transcriptNumerator : null,
      denominator: Number.isFinite(transcriptDenominator) ? transcriptDenominator : null,
    },
    deltas: { numerator: numeratorDelta, denominator: denominatorDelta },
    missingNominalCredits,
    verificationStatus: verified
      ? "verified"
      : (missingNominalCredits.length ? "incomplete_missing_nominal_failed_credits" : "not_verified"),
  };
}

function assessmentIntegrityStatus() {
  const reconciliation = transcriptReconciliation();
  if (state.accuracyLedgerPolicy?.blockOnNonZeroDelta === true && !reconciliation.balanced) {
    return {
      code: "transcript_reconciliation_failed",
      title: "成績表の単位合計と内訳が一致しません",
      message: `成績表合計 ${compactNumber(reconciliation.transcript)}単位に対し、卒業算入・資格免許・算入対象外の合計との差が${compactNumber(Math.abs(reconciliation.delta))}単位あります。科目一覧の単位を確認してください。`,
      reconciliation,
    };
  }
  return null;
}

function retakeMethodLabel(policy, registrationMethod = "") {
  if (registrationMethod === "lottery_for_math_common_basic") return "数学系共通専門基礎の抽選登録";
  if (registrationMethod === "faculty_designated_frame") return "学部指定の再履修枠";
  if (policy === "special_permission") return "許可制・教務手続";
  if (policy === "same_course") return "同一科目";
  if (policy === "official_replacement") return "公式代替科目可";
  return "同一科目又は同区分の科目";
}

function retakeCandidateItems() {
  if (!state.data || currentRule().unavailable) return [];
  const shortestPathKeys = businessShortestPathCourseKeys();
  const shortestPathPool = Number(state.year) <= 2024
    ? "business.commonBasicWithInformation2021to2024"
    : "business.commonBasic2025to2026";
  const shortestPathReason = deficitByPoolId().get(shortestPathPool)?.title || "不足要件を最短で埋める組合せ";
  const required = requiredRetakeItems()
    .filter((item) => !item.missing && item.course?.grade === "不可")
    .map((item) => ({
      ...item,
      state: "required",
      stateLabel: retakeMaster().candidateDisplay?.requiredLabel || "再履修が必要",
      usage: item.reason,
      method: retakeMethodLabel(item.policy, item.registrationMethod),
    }));
  const requiredNames = new Set(required.map((item) => compactCourseName(item.course.name)));
  const availableNames = new Set();
  const available = failedAttempts().flatMap((course) => {
    const courseKey = compactCourseName(course.name);
    if (requiredNames.has(courseKey) || availableNames.has(courseKey) || hasLaterEarnedEquivalent(course)) return [];
    const meta = retakeMetadataForCourse(course);
    if (meta.bucket !== "category" || meta.policy === "not_repeatable") return [];
    const shortage = matchingShortageForCourse(course);
    if (!shortage) return [];
    availableNames.add(courseKey);
    const shortestPath = shortestPathKeys.has(compactCourseName(course.name));
    return [{
      course,
      ...meta,
      state: shortestPath ? "shortest_path" : "available",
      stateLabel: shortestPath ? "優先して取る候補" : (retakeMaster().candidateDisplay?.availableLabel || "不足を埋められる"),
      reason: shortestPath ? shortestPathReason : meta.reason,
      usage: shortestPath ? shortestPathReason : shortage.title,
      jump: shortage.jump,
      method: retakeMethodLabel(meta.policy, meta.registrationMethod),
    }];
  });
  return [...required, ...available].sort((a, b) => {
    const priority = { required: 0, shortest_path: 1, available: 2 };
    const stateOrder = (priority[a.state] ?? 9) - (priority[b.state] ?? 9);
    if (stateOrder) return stateOrder;
    return latestAttemptRank(b.course) - latestAttemptRank(a.course)
      || Number(a.course.sourceIndex || 0) - Number(b.course.sourceIndex || 0);
  });
}

function unreadableNameCourses() {
  return courses().filter((course) => !normalize(course.name) || normalize(course.name).length < 2);
}

function unreadableCreditCourses() {
  return courses().filter((course) => !Number.isFinite(Number(course.credits)));
}

function unknownCategoryCourses() {
  return courses().filter((course) => !course.category || course.category === "未分類" || course.section === "未分類");
}

function possibleDuplicateCourses() {
  const grouped = new Map();
  for (const course of courses()) {
    const key = [normalize(course.name), course.year || "", course.term || "", course.grade || ""].join("|");
    if (!normalize(course.name)) continue;
    grouped.set(key, [...(grouped.get(key) || []), course]);
  }
  return [...grouped.values()].filter((group) => group.length > 1).flat();
}

function liberalRows() {
  const rule = currentRule();
  const liberal = rule.liberal || {};
  return Object.entries(liberal).map(([title, need]) => {
    let got = 0;
    let note = "";
    if (title === "教養科目") {
      got = sumBy((course) => ["教養科目", "基礎教養科目", "総合教養科目", "社会系", "自然系", "人文系", "総合系"].includes(course.category));
      note = "社会系・自然系・人文系・総合系などを合算";
    } else if (title === "基盤系") {
      got = basisCredits();
      note = "情報基礎、データサイエンス基礎学、統計学など";
    } else if (title === "情報科目") {
      got = informationRequirementCredits(need);
      note = "情報基礎1単位が必修。情報基礎が2単位で読み込まれても、この欄は1単位枠として表示";
    } else if (title === "高度教養科目") {
      const alternative = ihsAdvancedAlternative(rule);
      got = alternative?.got ?? sumCategory(title);
      note = alternative?.note || "";
      return { title, need, got, note, statusLabel: alternative?.statusLabel, statusTone: alternative?.statusTone };
    } else {
      got = sumCategory(title);
    }
    return { title, need, got, note };
  });
}

function badgeClass(tone) {
  if (tone === "danger") return "badge danger";
  if (tone === "warn") return "badge warn";
  if (tone === "ok") return "badge ok";
  return "badge neutral";
}

const JUDGMENT_STATUS = {
  detailed: {
    label: "詳細判定可",
    tone: "ok",
    note: "卒業要件の詳細を年度・学科別に抽出済みです。",
  },
  major: {
    label: "主要判定可",
    tone: "neutral",
    note: "総単位など主要要件を確認済みです。細かい特別条件は公式資料で確認してください。",
  },
  needsSource: {
    label: "現在の公開対象外",
    tone: "warn",
    note: "学生便覧または卒業要件表の取得・抽出が未完了のため、数値判定を停止しています。",
  },
  needsDepartment: {
    label: "学科選択が必要",
    tone: "warn",
    note: "国際人間科学部は学科を選択すると、該当する卒業要件を表示できます。",
  },
};

function ruleJudgmentStatus(rule = currentRule()) {
  if (rule.missingDepartment) return JUDGMENT_STATUS.needsDepartment;
  if (rule.unavailable) return JUDGMENT_STATUS.needsSource;
  return JUDGMENT_STATUS[rule.judgmentStatus] || (
    rule.classificationReady === false
      ? JUDGMENT_STATUS.major
      : JUDGMENT_STATUS.detailed
  );
}

function rowHtml(item) {
  return `
    <div class="list-row">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.note || "")}</small>
      </div>
      <span class="${badgeClass(item.tone)}">${escapeHtml(item.label || "確認")}</span>
    </div>
  `;
}

function renderHeader() {
  const rule = currentRule();
  const faculty = currentFacultyConfig();
  const isInternational = state.faculty === "internationalHumanSciences";
  const isLaw = state.faculty === "law";
  const isLiterature = state.faculty === "literature";
  const hasIhsGspRouteOptions = isInternational && isIhsLegacyGspRule(rule) && !rule.unavailable;
  const departmentLabel = DEPARTMENT_LABELS[state.department] || "";
  const lawCourseLabel = LAW_COURSE_LABELS[state.lawCourse] || "";
  const literatureMajorOptionsForRule = literatureMajorOptions(rule);
  applySupportOptionAvailability();
  el.facultySelect.value = state.faculty;
  el.departmentSelect.hidden = !isInternational;
  el.departmentSelect.required = isInternational;
  el.departmentSelect.value = isInternational ? state.department : "";
  el.ihsGspRouteSelect.hidden = !hasIhsGspRouteOptions;
  el.ihsGspRouteSelect.value = hasIhsGspRouteOptions ? state.ihsGspRoute : "gsp";
  const hasLawCourseOptions = isLaw && Boolean(rule.courses);
  el.lawCourseSelect.hidden = !hasLawCourseOptions;
  el.lawCourseSelect.value = hasLawCourseOptions ? state.lawCourse : "";
  el.literatureMajorSelect.hidden = !isLiterature || !literatureMajorOptionsForRule.length;
  el.literatureMajorSelect.required = isLiterature && Boolean(literatureMajorOptionsForRule.length);
  el.literatureMajorSelect.innerHTML = [
    `<option value="">専修を選択</option>`,
    ...literatureMajorOptionsForRule.map((major) => (
      `<option value="${escapeHtml(major)}">${escapeHtml(major)}専修</option>`
    )),
  ].join("");
  el.literatureMajorSelect.value = isLiterature ? state.literatureMajor : "";
  el.yearSelect.value = state.year;
  el.profileSummary.textContent = [
    faculty.label || "学部未設定",
    isInternational ? (departmentLabel || "学科未選択") : "",
    hasIhsGspRouteOptions ? (state.ihsGspRoute === "advanced" ? "高度教養ルート" : "GSP履修ルート") : "",
    hasLawCourseOptions && lawCourseLabel ? lawCourseLabel : "",
    isLiterature && state.literatureMajor ? `${state.literatureMajor}専修` : "",
    `${state.year}年度入学`,
  ].filter(Boolean).join("・");
  if (el.resultProfileLine) el.resultProfileLine.textContent = el.profileSummary.textContent;
  el.profileSource.textContent = state.profileSource === "auto"
    ? "成績表左上・学籍番号から自動判定"
    : (state.profileSource === "manual" ? "手動で変更済み" : "PDF読込後に自動判定");
  const assessment = profileAssessmentStatus();
  const judgment = assessment.code === "supported"
    ? (assessment.entry?.releaseReady === false
      ? { label: "精度検証中", tone: "warn" }
      : JUDGMENT_STATUS.detailed)
    : (assessment.code === "profile_selection_required"
      ? {
        label: assessment.field === "major"
          ? "専修選択が必要"
          : (assessment.field === "course" ? "コース選択が必要" : "学科選択が必要"),
        tone: "warn",
      }
      : JUDGMENT_STATUS.needsSource);
  el.ruleBadge.textContent = judgment.label;
  el.ruleBadge.className = badgeClass(judgment.tone);
  el.liberalRule.textContent = rule.label || "年度別";
  if (!state.data) {
    el.studentName.textContent = "履修サポート";
    el.studentMeta.textContent = [
      faculty.label || "選択学部",
      isInternational ? (departmentLabel || "学科未選択") : "",
      hasIhsGspRouteOptions ? (state.ihsGspRoute === "advanced" ? "高度教養ルート" : "GSP履修ルート") : "",
      hasLawCourseOptions && lawCourseLabel ? lawCourseLabel : "",
      isLiterature && state.literatureMajor ? `${state.literatureMajor}専修` : "",
      `${state.year}年度入学`,
    ].filter(Boolean).join(" / ");
    el.modeBadge.textContent = "待機";
    el.modeBadge.className = "badge neutral";
    return;
  }

  el.studentName.textContent = state.data.name || "読み取りデータ";
  const meta = [
    faculty.label,
    state.data.faculty,
    state.data.department,
    state.data.studentId ? `学籍番号 ${state.data.studentId}` : "",
    state.data.issued,
  ].filter(Boolean);
  el.studentMeta.textContent = meta.join(" / ");
  el.modeBadge.textContent = state.data.mode || "読込済み";
  el.modeBadge.className = state.data.matchedCanonical ? "badge ok" : "badge warn";
}

function renderProfileStop() {
  if (!el.profileStopPanel) return;
  const assessment = profileAssessmentStatus();
  const integrity = state.integrityIssue;
  const visible = Boolean(state.data) && (assessment.code !== "supported" || Boolean(integrity));
  el.profileStopPanel.hidden = !visible;
  if (el.profileStopReportButton) el.profileStopReportButton.hidden = !integrity;
  if (!visible) return;

  if (integrity) {
    el.profileStopTitle.textContent = integrity.title;
    el.profileStopMessage.textContent = integrity.message;
    el.profileSupportRange.textContent = "誤集計を避けるため、この成績表の卒業要件数値は表示していません。科目一覧と公式資料で確認してください。";
    return;
  }
  const selectionRequired = assessment.code === "profile_selection_required";
  const runtimeStopped = assessment.code === "runtime_stop";
  const isMajor = assessment.field === "major";
  const isCourse = assessment.field === "course";
  const selectionLabel = isMajor ? "専修" : (isCourse ? "履修コース" : "学科");
  el.profileStopTitle.textContent = selectionRequired
    ? `${selectionLabel}を選択してください`
    : (runtimeStopped ? "判定処理を停止しました" : "この学部・年度は現在判定できません");
  el.profileStopMessage.textContent = selectionRequired
    ? `成績表から${selectionLabel}を特定できませんでした。上のプロフィール欄で選択すると判定を開始します。`
    : (runtimeStopped
      ? "科目と卒業要件の接続が完全でないため、誤った数値を表示せず停止しました。"
      : "公式資料と要件マスタの確認が完了していないため、数値判定を行いません。対応する学部・入学年度へ変更してください。");
  el.profileSupportRange.textContent = `現在の判定対応範囲: ${supportedProfileRangeText()}`;
}

function missingRequirementDefs() {
  return requirementDefs()
    .filter((def) => !def.statusTone && def.limitType !== "max" && !def.advisoryOnly)
    .map((def) => ({
      ...def,
      missing: Math.max(0, Number(def.need || 0) - Number(def.got || 0)),
    }))
    .filter((def) => def.need && def.missing > 0);
}

function summaryRowFromRequirement(def) {
  const required = Number(def.need || 0);
  const earned = Number(def.got || 0);
  const missing = Math.max(0, required - earned);
  return {
    key: def.key,
    title: def.title,
    earned,
    required,
    status: missing > 0 ? "total_shortage" : "ok",
    minimumAdditional: missing,
    shortages: missing > 0 ? [{ title: def.title, missing }] : [],
    jump: /ihsLiberal|litLiberal|litBase|ihsBase|Languages|Information|Sport|Advanced/.test(def.key) ? "liberal" : "special",
  };
}

function userRequirementSummaryRows() {
  const rule = currentRule();
  if (!state.data) return { shortages: [], displayRows: [], achieved: [] };
  if (rule.unavailable) {
    return {
      shortages: [{
        key: "unavailable",
        title: rule.missingDepartment ? "学科選択" : "卒業要件資料",
        earned: 0,
        required: 0,
        status: "needs_review",
        minimumAdditional: null,
        shortages: [],
        note: rule.unavailableReason,
        jump: rule.missingDepartment ? "profile" : "evidence",
      }],
      displayRows: [],
      achieved: [],
    };
  }

  const defs = requirementDefs().filter((def) => (
    def.key !== "total"
    && def.limitType !== "max"
    && !def.advisoryOnly
    && (def.need || def.need === 0)
    && (!def.statusTone || (def.key === "ihsAdvancedException" && state.ihsGspRoute === "advanced"))
  ));
  const parentRows = ihsLegacyParentRequirements(rule);
  const childKeys = new Set(parentRows.flatMap((parent) => parent.children.map((child) => child.key)));
  const standalone = defs
    .filter((def) => !childKeys.has(def.key) && (def.key !== "ihsAdvancedException" || state.ihsGspRoute === "advanced"))
    .map(summaryRowFromRequirement);
  const combined = [...parentRows, ...standalone];
  const childAchieved = parentRows.flatMap((parent) => parent.children
    .filter((child) => Number(child.earned || 0) >= Number(child.required || 0))
    .map((child) => ({
      key: child.key,
      title: child.title,
      earned: Number(child.earned || 0),
      required: Number(child.required || 0),
      status: "ok",
      jump: parent.jump,
    })));
  return {
    shortages: combined.filter((row) => row.status !== "ok"),
    displayRows: combined,
    achieved: [
      ...combined.filter((row) => row.status === "ok"),
      ...childAchieved,
    ],
  };
}

function graduationBlockingRows() {
  if (!state.data || currentRule().unavailable) return [];
  return graduationRequirementGroups()
    .filter((group) => group.status === "required" || group.status === "shortage")
    .map((group) => ({
      key: group.key,
      title: group.title,
      earned: group.earned,
      required: group.required,
      status: "total_shortage",
      minimumAdditional: group.minimumAdditional,
      shortages: group.shortageDetails || [],
      jump: group.jump,
    }));
}

function minimumAdditionalCredits(parentDeficit, independentDeficits = []) {
  const children = independentDeficits.reduce((total, value) => total + Math.max(0, Number(value || 0)), 0);
  return Math.max(0, Number(parentDeficit || 0), children);
}

function overviewSpec(key, title, memberKeys, options = {}) {
  const members = new Set(memberKeys);
  return { key, title, jump: options.jump || "requirements", mode: options.mode || "max", parentKey: options.parentKey || memberKeys[0], matches: (row) => members.has(row.key) };
}

function facultyOverviewSpecs(rule = currentRule()) {
  const year = Number(state.year);
  if (state.faculty === "business") {
    const liberal = year <= 2024
      ? [
        overviewSpec("businessLiberalBase", "基礎教養科目", ["businessLiberalBase"], { jump: "liberal" }),
        overviewSpec("businessLiberalGeneral", "総合教養科目", ["businessLiberalGeneral"], { jump: "liberal" }),
        overviewSpec("businessLanguages", "外国語科目", ["businessLanguages"], { jump: "liberal" }),
        overviewSpec("businessInformation", "情報科目", ["businessInformation"], { jump: "liberal" }),
        overviewSpec("businessAdvanced", "高度教養科目", ["businessAdvanced"], { jump: "liberal" }),
      ]
      : [
        overviewSpec("businessBase", "教養科目（基盤系）", ["businessBase"], { jump: "liberal" }),
        overviewSpec("businessLiberal", "教養科目（人文系・自然系・社会系・総合系）", ["businessLiberal", "businessHumanNatural"], { jump: "liberal", mode: "parentChildren", parentKey: "businessLiberal" }),
        overviewSpec("businessLanguages", "教養科目（外国語系）", ["businessLanguages", "businessLanguageI", "businessLanguageII"], { jump: "liberal", mode: "parentChildren", parentKey: "businessLanguages" }),
      ];
    return [
      ...liberal,
      overviewSpec("businessCommonBasic", "共通専門基礎科目", ["commonBasic", "commonBasicWithInfo"]),
      overviewSpec("businessFirstYear", "初年次セミナー", ["firstYear"]),
      overviewSpec("businessGroup1", "第1群科目", ["group1"]),
      overviewSpec("businessGroup2", "第2群科目", ["group2"]),
      overviewSpec("businessGroup23", "第3群科目・グローバル科目群", ["group23Global", "global", "businessResearchThesis"], { mode: "parentChildren", parentKey: "group23Global" }),
      overviewSpec("businessSpecial", "専門科目", ["special"]),
      ...(year >= 2025 ? [overviewSpec("businessOther", "その他必要と認める科目", ["businessOtherMax"])] : []),
    ];
  }
  if (state.faculty === "law") {
    return [
      overviewSpec("lawGeneral", rule.generalTitle || "専門科目以外の科目", ["lawI"]),
      overviewSpec("lawSpecial", rule.specialTitle || "法律学科専門科目", ["lawRo", "lawCourseTotal"], { mode: "parentChildren", parentKey: "lawRo" }),
      ...((rule.additional ?? rule.lawAdditional) ? [overviewSpec("lawAdditional", rule.additionalTitle || "自由選択科目", ["lawAdditional"])] : []),
    ];
  }
  if (state.faculty === "internationalHumanSciences") {
    const common = rule.system === "legacy"
      ? [
        overviewSpec("ihsLiberalBase", "基礎教養科目", ["ihsLiberalBase"], { jump: "liberal" }),
        overviewSpec("ihsLiberalGeneral", "総合教養科目", ["ihsLiberalGeneral"], { jump: "liberal" }),
        overviewSpec("ihsLanguages", "外国語科目", ["ihsLanguages"], { jump: "liberal" }),
        overviewSpec("ihsSport", "健康・スポーツ科学", ["ihsSport"], { jump: "liberal" }),
        overviewSpec("ihsInformation", "情報科目", ["ihsInformation"], { jump: "liberal" }),
        ...(state.ihsGspRoute === "advanced" ? [overviewSpec("ihsAdvanced", "高度教養科目", ["ihsAdvancedException"], { jump: "liberal" })] : []),
      ]
      : [
        overviewSpec("ihsBase", "教養科目（基盤系）", ["ihsBase"], { jump: "liberal" }),
        overviewSpec("ihsLiberal", "教養科目", ["ihsLiberal"], { jump: "liberal" }),
        overviewSpec("ihsLanguages", "教養科目（外国語系）", ["ihsLanguages"], { jump: "liberal" }),
      ];
    return [
      ...common,
      overviewSpec("ihsFacultyBase", "学部共通基礎科目", ["ihsFacultyBase"]),
      overviewSpec("ihsFacultyDevelopment", "学部共通発展科目", ["ihsFacultyDevelopment"]),
      ...(state.ihsGspRoute === "advanced" ? [] : [overviewSpec("ihsGsp", "GSP科目", ["ihsGsp"])]),
      { ...overviewSpec("ihsDepartmentSpecial", rule.departmentSpecialTitle || "学科専門科目", ["ihsDepartmentSpecial"], { mode: "parentChildren", parentKey: "ihsDepartmentSpecial" }), matches: (row) => row.key === "ihsDepartmentSpecial" || row.key.startsWith("ihsDepartmentRequired") },
      overviewSpec("ihsFreeChoice", "自由選択科目", ["ihsFreeChoice"]),
    ];
  }
  if (state.faculty === "literature") {
    const common = rule.system === "literatureNew"
      ? [
        overviewSpec("litBase", "教養科目（基盤系）", ["litBase"], { jump: "liberal" }),
        overviewSpec("litGeneral", "教養科目", ["litGeneral"], { jump: "liberal" }),
        overviewSpec("litLanguages", "教養科目（外国語系）", ["litLanguages"], { jump: "liberal" }),
      ]
      : [
        overviewSpec("litLiberalBase", "基礎教養科目", ["litLiberalBase"], { jump: "liberal" }),
        overviewSpec("litLiberalGeneral", "総合教養科目", ["litLiberalGeneral"], { jump: "liberal" }),
        overviewSpec("litLanguages", "外国語科目", ["litLanguages"], { jump: "liberal" }),
        overviewSpec("litInformation", "情報科目", ["litInformation"], { jump: "liberal" }),
        overviewSpec("litSport", "健康・スポーツ科学", ["litSport"], { jump: "liberal" }),
        { ...overviewSpec("litAdvanced", "高度教養科目", ["litAdvanced"], { jump: "liberal", mode: "parentChildren", parentKey: "litAdvanced" }), matches: (row) => row.key === "litAdvanced" || row.key.startsWith("litAdvanced") },
      ];
    return [
      ...common,
      overviewSpec("litBasicSpecial", "専門基礎科目", ["litBasic", "litGlobalEnglish"], { mode: "parentChildren" }),
      { ...overviewSpec("litMajorSpecial", "専修専門科目", ["litThesisRelated", "litThesis"], { mode: "literatureThesis" }), matches: (row) => row.key === "litThesisRelated" || row.key === "litThesis" || row.key.startsWith("litThesisGroup") },
      overviewSpec("litFreeChoice", "自由選択科目", ["litFreeChoice"]),
    ];
  }
  return [];
}

function groupMinimumAdditional(spec, rows) {
  const deficits = new Map(rows.map((row) => [row.key, Math.max(0, Number(row.minimumAdditional || 0))]));
  if (spec.mode === "literatureThesis") {
    const parent = deficits.get("litThesisRelated") || 0;
    const childSum = [...deficits.entries()].filter(([key]) => key.startsWith("litThesisGroup")).reduce((total, [, value]) => total + value, 0);
    return Math.max(parent, childSum) + (deficits.get("litThesis") || 0);
  }
  if (spec.mode === "parentChildren") {
    const parent = rows.find((row) => row.key === spec.parentKey) || rows[0];
    const children = rows.filter((row) => row !== parent);
    return minimumAdditionalCredits(parent?.minimumAdditional || 0, children.map((row) => row.minimumAdditional || 0));
  }
  return Math.max(0, ...rows.map((row) => Number(row.minimumAdditional || 0)));
}

function overviewSummaryRows() {
  return requirementDefs()
    .filter((def) => def.key !== "total" && def.limitType !== "max" && !def.advisoryOnly && Number.isFinite(Number(def.need)))
    .map(summaryRowFromRequirement);
}

function graduationRequirementGroups() {
  const rule = currentRule();
  if (!state.data || rule.unavailable) return [];
  const rows = overviewSummaryRows();
  return facultyOverviewSpecs(rule).map((group) => {
    const groupRows = rows.filter(group.matches);
    if (!groupRows.length) return null;
    const shortages = groupRows.filter((row) => row.status !== "ok");
    const primary = groupRows.find((row) => row.key === group.parentKey) || groupRows[0];
    const shortageDetails = shortages.flatMap((row) => {
      if (row.shortages?.length) {
        return row.shortages.map((item) => ({ title: item.title, missing: Number(item.missing || 0) }));
      }
      return [{ title: row.title, missing: Number(row.minimumAdditional || 0) }];
    }).filter((item, index, list) => list.findIndex((candidate) => candidate.title === item.title) === index);
    const requiredMissing = shortages.some((row) => /卒業論文|卒業研究|初年次|必修|group1/i.test(`${row.key || ""} ${row.title || ""}`));
    const status = requiredMissing ? "required" : (shortages.length ? "shortage" : (groupRows.length ? "ok" : "neutral"));
    return {
      ...group,
      status,
      rows: groupRows,
      earned: Number(primary?.earned || 0),
      required: Number(primary?.required || 0),
      shortageCount: shortages.length,
      shortageDetails,
      minimumAdditional: groupMinimumAdditional(group, groupRows),
      priority: status === "required" ? 0 : (shortages.some((row) => row.status === "bucket_shortage") ? 1 : (status === "shortage" ? 2 : (status === "ok" ? 3 : 4))),
    };
  }).filter(Boolean).sort((a, b) => a.priority - b.priority);
}

function profileIndependentDeficits(groups) {
  if (state.faculty !== "business") return groups.map((group) => group.minimumAdditional || 0);
  const byKey = new Map(groups.map((group) => [group.key, Number(group.minimumAdditional || 0)]));
  const rowDeficits = new Map(overviewSummaryRows().map((row) => [row.key, Number(row.minimumAdditional || 0)]));
  const liberalKeys = Number(state.year) <= 2024
    ? ["businessLiberalBase", "businessLiberalGeneral", "businessLanguages", "businessInformation", "businessAdvanced"]
    : ["businessBase", "businessLiberal", "businessLanguages"];
  const liberal = liberalKeys.map((key) => byKey.get(key) || 0);
  const group23 = minimumAdditionalCredits(rowDeficits.get("group23Global") || 0, [
    rowDeficits.get("group2") || 0,
    rowDeficits.get("global") || 0,
    rowDeficits.get("businessResearchThesis") || 0,
  ]);
  const specialist = minimumAdditionalCredits(byKey.get("businessSpecial") || 0, [
    byKey.get("businessCommonBasic") || 0,
    byKey.get("businessFirstYear") || 0,
    byKey.get("businessGroup1") || 0,
    group23,
  ]);
  return [...liberal, specialist];
}

function graduationOutcome() {
  const rule = currentRule();
  const requiredTotal = graduationRequiredTotal(rule);
  if (!state.data || rule.unavailable || !requiredTotal) {
    return { blockerCount: 0, minimumAdditional: 0, totalMissing: 0, blocked: true };
  }
  const groups = graduationRequirementGroups();
  const totalMissing = Math.max(0, requiredTotal - graduationCredits());
  return {
    blockerCount: groups.filter((group) => group.minimumAdditional > 0).length + Number(totalMissing > 0),
    minimumAdditional: minimumAdditionalCredits(totalMissing, profileIndependentDeficits(groups)),
    totalMissing,
    blocked: false,
  };
}

function semesterWorkloadProfile() {
  const year = Number(state.year);
  return (state.semesterWorkloadMaster?.profiles || []).find((profile) => {
    if (profile.faculty !== state.faculty || !(profile.entranceYears || []).includes(year)) return false;
    if (profile.departments && !profile.departments.includes("*") && !profile.departments.includes(state.department)) return false;
    if (profile.courses && !profile.courses.includes("*") && !profile.courses.includes(state.lawCourse)) return false;
    if (profile.majors && !profile.majors.includes("*") && !profile.majors.includes(state.literatureMajor)) return false;
    return true;
  }) || null;
}

function semesterWorkloadProfileVerified(profile) {
  return Boolean(profile && /^(verified_|verified$)/.test(normalize(profile.status)));
}

function defaultRemainingSemesters(admissionYear = state.year, now = new Date()) {
  const entered = Number(admissionYear);
  if (!Number.isInteger(entered)) return null;
  const month = now.getMonth();
  const academicYear = month >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const completedBeforeCurrentTerm = Math.max(0, (academicYear - entered) * 2 + (month >= 9 || month < 3 ? 1 : 0));
  return Math.max(0, 8 - completedBeforeCurrentTerm);
}

function semesterWorkloadSettingsKey(profile = semesterWorkloadProfile()) {
  return [
    state.faculty,
    state.year,
    state.department,
    state.lawCourse,
    state.literatureMajor,
    state.ihsGspRoute,
    profile?.id || "unverified",
  ].join("|");
}

function ensureSemesterWorkloadSettings(profile = semesterWorkloadProfile()) {
  const key = semesterWorkloadSettingsKey(profile);
  if (state.semesterWorkloadProfileKey === key) return;
  state.semesterWorkloadProfileKey = key;
  state.semesterWorkloadToggle = profile?.defaultIncluded !== false && Number(profile?.nominalCredits || 0) > 0;
  state.semesterWorkloadRemainingSemesters = defaultRemainingSemesters();
  state.semesterWorkloadRemainingSemestersEdited = false;
}

function outstandingCapstoneCredits(profile = semesterWorkloadProfile(), list = courses()) {
  const components = (profile?.components || []).map((component) => {
    const nominalCredits = Math.max(0, Number(component.credits || 0));
    const earnedCredits = Math.min(nominalCredits, (list || [])
      .filter((course) => isEarned(course) && exactCourseName(course, component.courseName))
      .reduce((total, course) => total + Number(course.credits || 0), 0));
    return {
      ...component,
      nominalCredits,
      earnedCredits: roundCredits(earnedCredits),
      outstandingCredits: roundCredits(Math.max(0, nominalCredits - earnedCredits)),
    };
  });
  return {
    components,
    nominalCredits: roundCredits(components.reduce((total, component) => total + component.nominalCredits, 0)),
    earnedCredits: roundCredits(components.reduce((total, component) => total + component.earnedCredits, 0)),
    outstandingCredits: roundCredits(components.reduce((total, component) => total + component.outstandingCredits, 0)),
  };
}

function semesterWorkloadSyntheticCourse(component) {
  const base = {
    name: component.courseName,
    credits: component.outstandingCredits,
    grade: "合",
    gp: "＊",
    year: "見込",
    term: "卒業時",
    source: "1学期あたり目安の見込シミュレーション",
    planningSynthetic: true,
  };
  if (component.allocationPool === "business.group3") {
    return { ...base, section: "専門科目", category: "専門科目", group: "第3群" };
  }
  if (component.allocationPool === "internationalHumanSciences.ihsDepartmentSpecial") {
    return { ...base, section: "専門科目", category: "学科専門科目", group: "学科専門科目" };
  }
  if (component.allocationPool === "literature.thesis" || component.allocationPool === "literature.litThesis") {
    return { ...base, section: "専門科目", category: "卒業論文", group: "卒業論文" };
  }
  return { ...base, section: "未分類", category: "未分類", group: "" };
}

function simulateOutstandingCapstone(profile = semesterWorkloadProfile()) {
  const officialOutcome = graduationOutcome();
  if (!profile || officialOutcome.blocked) return { available: false, reason: "卒業要件を判定できません。" };
  const outstanding = outstandingCapstoneCredits(profile);
  if (!outstanding.outstandingCredits) {
    return {
      available: true,
      officialRemaining: officialOutcome.minimumAdditional,
      simulatedRemaining: officialOutcome.minimumAdditional,
      capstoneContribution: 0,
      outstanding,
    };
  }

  const syntheticCourses = outstanding.components
    .filter((component) => component.outstandingCredits > 0)
    .map(semesterWorkloadSyntheticCourse);
  if (syntheticCourses.some((course) => course.category === "未分類")) {
    return { available: false, reason: "見込科目の算入先を確認できません。", outstanding };
  }

  const originalData = state.data;
  const originalDecoratedProfileKey = state.decoratedProfileKey;
  const simulatedCourses = [
    ...(originalData?.courses || []).map((course) => ({ ...course })),
    ...syntheticCourses,
  ];
  decorateCourseUsages(simulatedCourses, { source: "1学期あたり目安の見込シミュレーション" });
  const simulatedSummary = buildSummaryFromCourses(simulatedCourses);
  let simulatedOutcome;
  try {
    state.data = {
      ...originalData,
      courses: simulatedCourses,
      summary: simulatedSummary.summary,
      remoteSummary: simulatedSummary.remoteSummary,
    };
    state.decoratedProfileKey = "semester-workload-simulation";
    simulatedOutcome = graduationOutcome();
  } finally {
    state.data = originalData;
    state.decoratedProfileKey = originalDecoratedProfileKey;
  }
  if (!simulatedOutcome || simulatedOutcome.blocked) {
    return { available: false, reason: "見込科目を卒業要件へ配賦できません。", outstanding };
  }
  const capstoneContribution = roundCredits(Math.max(
    0,
    Math.min(officialOutcome.minimumAdditional, officialOutcome.minimumAdditional - simulatedOutcome.minimumAdditional),
  ));
  return {
    available: true,
    officialRemaining: officialOutcome.minimumAdditional,
    simulatedRemaining: simulatedOutcome.minimumAdditional,
    capstoneContribution,
    outstanding,
  };
}

function semesterWorkloadCalculation({ officialRemaining, simulatedRemaining, remainingSemesters, capstoneToggle }) {
  const official = Number(officialRemaining);
  const simulated = Number(simulatedRemaining);
  const semesters = Number(remainingSemesters);
  if (!Number.isFinite(official) || official < 0 || !Number.isInteger(semesters) || semesters <= 0) {
    return { numericVisible: false, officialRemaining: Number.isFinite(official) ? official : null };
  }
  const contribution = capstoneToggle && Number.isFinite(simulated)
    ? roundCredits(Math.max(0, Math.min(official, official - simulated)))
    : 0;
  const regularRemaining = roundCredits(Math.max(0, official - contribution));
  const perSemester = Math.ceil((regularRemaining / semesters) * 2 - Number.EPSILON) / 2;
  return {
    numericVisible: true,
    officialRemaining: official,
    capstoneContribution: contribution,
    regularRemaining,
    remainingSemesters: semesters,
    perSemester,
  };
}

function semesterWorkloadAssessment(outcome = graduationOutcome()) {
  const profile = semesterWorkloadProfile();
  ensureSemesterWorkloadSettings(profile);
  if (state.runtimeStop || state.integrityIssue || outcome.blocked) {
    return { numericVisible: false, reason: "判定停止中のため目安を表示できません。", profile };
  }
  const semesters = Number(state.semesterWorkloadRemainingSemesters);
  if (!Number.isInteger(semesters) || semesters <= 0) {
    return {
      numericVisible: false,
      reason: state.semesterWorkloadRemainingSemestersEdited
        ? "残り学期を設定してください。"
        : "標準修業年限超過のため残り学期を設定してください。",
      profile,
      toggleVisible: Boolean(profile) && Number(profile.nominalCredits || 0) > 0 && profile.ui !== "hide_capstone_toggle",
    };
  }
  if (!semesterWorkloadProfileVerified(profile)) {
    return {
      ...semesterWorkloadCalculation({
        officialRemaining: outcome.minimumAdditional,
        simulatedRemaining: outcome.minimumAdditional,
        remainingSemesters: semesters,
        capstoneToggle: false,
      }),
      profile,
      toggleVisible: false,
      capstoneToggle: false,
      provisionalRegularOnly: true,
    };
  }
  const toggleVisible = Number(profile.nominalCredits || 0) > 0 && profile.ui !== "hide_capstone_toggle";
  const capstoneToggle = toggleVisible ? state.semesterWorkloadToggle : false;
  const simulation = capstoneToggle
    ? simulateOutstandingCapstone(profile)
    : {
      available: true,
      officialRemaining: outcome.minimumAdditional,
      simulatedRemaining: outcome.minimumAdditional,
      capstoneContribution: 0,
      outstanding: outstandingCapstoneCredits(profile),
    };
  if (!simulation.available) {
    return { numericVisible: false, reason: simulation.reason, profile, toggleVisible, simulation };
  }
  return {
    ...semesterWorkloadCalculation({
      officialRemaining: outcome.minimumAdditional,
      simulatedRemaining: simulation.simulatedRemaining,
      remainingSemesters: semesters,
      capstoneToggle,
    }),
    profile,
    toggleVisible,
    capstoneToggle,
    simulation,
  };
}

function clearSemesterWorkloadDisplay() {
  if (el.semesterWorkloadSection) el.semesterWorkloadSection.hidden = true;
  if (el.semesterWorkloadValue) el.semesterWorkloadValue.textContent = "--";
}

function renderSemesterWorkload(outcome = graduationOutcome()) {
  if (!el.semesterWorkloadSection) return;
  if (!state.data) {
    clearSemesterWorkloadDisplay();
    return;
  }
  const result = semesterWorkloadAssessment(outcome);
  el.semesterWorkloadSection.hidden = false;
  if (el.semesterWorkloadRemainingSemesters) {
    const semesters = Number(state.semesterWorkloadRemainingSemesters);
    el.semesterWorkloadRemainingSemesters.value = Number.isInteger(semesters) && semesters > 0 ? String(semesters) : "";
  }
  if (el.semesterWorkloadToggleRow) el.semesterWorkloadToggleRow.hidden = !result.toggleVisible;
  if (el.semesterWorkloadToggle) el.semesterWorkloadToggle.checked = Boolean(result.capstoneToggle);
  if (!result.numericVisible) {
    el.semesterWorkloadValue.textContent = "--";
    el.semesterWorkloadDisclosure.textContent = "目安は表示していません";
    el.semesterWorkloadBreakdown.textContent = result.reason || "計算条件を確認してください。";
    el.semesterWorkloadStatus.textContent = "卒業までの残単位は上の公式判定値を確認してください。";
    return;
  }
  el.semesterWorkloadValue.textContent = compactNumber(result.perSemester);
  el.semesterWorkloadDisclosure.textContent = result.capstoneToggle
    ? "ゼミ・卒論等の見込単位を差し引いて計算"
    : (result.provisionalRegularOnly
      ? "ゼミ・卒論等を差し引かない暫定目安"
      : "ゼミ・卒論等を差し引かず計算");
  el.semesterWorkloadBreakdown.textContent = result.capstoneToggle
    ? `残り${compactNumber(result.officialRemaining)}単位 - ゼミ・卒論等の見込${compactNumber(result.capstoneContribution)}単位 = 今後の授業で${compactNumber(result.regularRemaining)}単位`
    : `残り${compactNumber(result.officialRemaining)}単位 ÷ 残り${result.remainingSemesters}学期 = 1学期あたり${compactNumber(result.perSemester)}単位`;
  el.semesterWorkloadStatus.textContent = result.provisionalRegularOnly
    ? `残り${result.remainingSemesters}学期で均等に履修する暫定目安です。見込単位の公式根拠が未接続でも、判定を止めずに表示しています。`
    : `残り${result.remainingSemesters}学期で均等に履修する場合の目安です。卒業までの残単位は切り替わりません。`;
}

function categoryShortageItems() {
  return graduationBlockingRows().map((row) => ({
    key: row.key,
    title: row.title,
    missing: Number(row.minimumAdditional || 0),
    details: (row.shortages || []).map((item) => `${item.title} あと${compactNumber(item.missing)}`).join("、"),
    jump: row.jump || "requirements",
  }));
}

function requirementSummaryNote(row) {
  if (row.status === "needs_review") return row.note || "公式資料の確認が必要です。";
  const shortageText = (row.shortages || []).map((item) => `${item.title} あと${compactNumber(item.missing)}`).join("、");
  const requiredText = row.required ? `合計 ${compactNumber(row.earned)}/${compactNumber(row.required)}` : "";
  return [requiredText, shortageText ? `今必要: ${shortageText}` : `あと${compactNumber(row.minimumAdditional)}単位`].filter(Boolean).join(" / ");
}

function renderUserRequirementSummary() {
  if (!el.requiredShortageList || !el.achievedRequirementList || !el.requirementSummaryBadge) return;
  if (!state.data) {
    el.requirementSummaryBadge.textContent = "未読込";
    el.requirementSummaryBadge.className = "badge neutral";
    el.requiredShortageList.className = "compact-list empty";
    el.requiredShortageList.textContent = "成績表PDFを読み込むと表示します。";
    el.achievedRequirementList.className = "compact-list empty";
    el.achievedRequirementList.textContent = "達成済みの条件を表示します。";
    if (el.achievedRequirementsDetails) el.achievedRequirementsDetails.open = false;
    return;
  }
  const { shortages, achieved } = userRequirementSummaryRows();
  el.requirementSummaryBadge.textContent = shortages.length ? `${shortages.length}件` : "大きな不足なし";
  el.requirementSummaryBadge.className = shortages.length ? "badge warn" : "badge ok";
  if (!shortages.length) {
    el.requiredShortageList.className = "compact-list empty";
    el.requiredShortageList.textContent = "現在確認できる必須内訳に大きな不足はありません。";
  } else {
    el.requiredShortageList.className = "compact-list";
    el.requiredShortageList.innerHTML = shortages.map((row) => compactRow(
      row.title,
      `${requirementStateLabel(row.status)} / ${requirementSummaryNote(row)}`,
      row.status === "needs_review" ? "neutral" : "warn",
      "",
      { jump: row.jump || "requirements", label: "詳細を見る" }
    )).join("");
  }
  if (!achieved.length) {
    el.achievedRequirementList.className = "compact-list empty";
    el.achievedRequirementList.textContent = "達成済みとして確定できる条件はまだありません。";
  } else {
    el.achievedRequirementList.className = "compact-list";
    el.achievedRequirementList.innerHTML = achieved.map((row) => compactRow(
      row.title,
      `${compactNumber(row.earned)} / ${compactNumber(row.required)}単位`,
      "ok",
      "充足"
    )).join("");
  }
}

function renderGraduationGroups() {
  if (!el.graduationGroupList) return;
  if (!state.data) {
    el.graduationGroupList.className = "graduation-group-grid empty";
    el.graduationGroupList.textContent = "成績表PDFを読み込むと表示します。";
    return;
  }
  const rule = currentRule();
  if (rule.unavailable) {
    el.graduationGroupList.className = "graduation-group-grid empty";
    el.graduationGroupList.textContent = rule.missingDepartment
      ? "学科を選択すると要件の内訳を表示します。"
      : "根拠資料が揃うまで数値判定を停止しています。";
    return;
  }
  const groups = graduationRequirementGroups();
  el.graduationGroupList.className = "graduation-group-grid";
  el.graduationGroupList.innerHTML = groups.map((group) => {
    const requirementKeys = [...new Set((group.rows || []).map((row) => row.key).filter(Boolean))];
    const hasUnits = Number(group.required || 0) > 0;
    const unitText = hasUnits
      ? `${compactNumber(group.earned)} / ${compactNumber(group.required)}単位`
      : "必要単位は詳細表で確認";
    const detailText = group.shortageDetails?.length
      ? group.shortageDetails.slice(0, 2).map((item) => `${item.title} あと${compactNumber(item.missing)}単位必要`).join(" / ")
      : (group.status === "ok" ? "必要単位を満たしています" : `あと${compactNumber(group.minimumAdditional || 0)}単位必要`);
    const statusIcon = group.status === "required" ? "!" : (group.status === "shortage" ? "!" : (group.status === "ok" ? "✓" : "i"));
    return `
      <button class="graduation-group-row state-${escapeHtml(group.status)}" type="button"
        data-requirement-group="${escapeHtml(group.key)}"
        data-requirement-keys="${escapeHtml(requirementKeys.join(","))}"
        aria-label="${escapeHtml(group.title)}の詳細な卒業要件を見る">
        <span class="requirement-state-icon" aria-hidden="true">${statusIcon}</span>
        <span class="requirement-main">
          <strong>${escapeHtml(group.title)}</strong>
          <b>${escapeHtml(unitText)}</b>
          <small>${escapeHtml(detailText)}</small>
        </span>
        <span class="requirement-chevron" aria-hidden="true">›</span>
      </button>
    `;
  }).join("");
}

function teachingOfficialLink() {
  return teachingMaster().officialSources?.portal || "https://www.uriboportal.ofc.kobe-u.ac.jp/qualification/teaching-license/";
}

function renderTeachingSupport() {
  if (!el.teachingSection || !el.teachingControls || !el.teachingResults) return;
  const visible = teachingAvailableForProfile();
  el.teachingSection.dataset.contextHidden = String(!visible);
  el.teachingSection.hidden = !visible;
  if (!visible) return;
  state.teachingEnabled = state.resultView === "teaching";
  const facultyLabel = currentFacultyConfig().label || "選択学部";
  const departmentLabel = state.faculty === "literature"
    ? "人文学科"
    : (DEPARTMENT_LABELS[state.department] || "学科未選択");
  el.teachingProfileSummary.textContent = `${facultyLabel} / ${departmentLabel} / ${state.year}年度入学を自動入力済み`;

  const schoolOptions = teachingSchoolOptions();
  el.teachingSchoolSelect.innerHTML = [
    '<option value="">校種を選択</option>',
    ...schoolOptions.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`),
  ].join("");
  if (!schoolOptions.some((option) => option.value === state.teachingSchool)) state.teachingSchool = "";
  el.teachingSchoolSelect.value = state.teachingSchool;
  const subjects = teachingLicenseSubjects(state.year, state.teachingSchool);
  el.teachingSubjectSelect.innerHTML = [
    `<option value="">${state.teachingSchool === "license" ? "免許種を選択" : "教科を選択"}</option>`,
    ...subjects.map((subject) => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`),
  ].join("");
  if (!subjects.includes(state.teachingSubject)) state.teachingSubject = "";
  el.teachingSubjectSelect.value = state.teachingSubject;
  if (!state.teachingSchool || !state.teachingSubject) {
    el.teachingStatus.textContent = state.teachingSchool === "license"
      ? "免許種を選択してから判定を開始してください。"
      : "校種と教科を選択してから判定を開始してください。";
    el.teachingResults.className = "compact-list empty";
    el.teachingResults.textContent = "選択前に取得可否は判定しません。";
    el.teachingResults.hidden = true;
    return;
  }

  if (!state.teachingAssessmentStarted) {
    el.teachingStatus.textContent = "選択内容を確認し、「判定を開始」を押してください。";
    el.teachingResults.hidden = true;
    return;
  }

  const article = evaluateTeachingArticle66();
  const pair = evaluateTeachingPair();
  const subjectMinimum = teachingSubjectMinimum();
  const schoolLabel = schoolOptions.find((option) => option.value === state.teachingSchool)?.label || "免許課程";
  el.teachingStatus.textContent = `${state.year}年度 ${schoolLabel} ${state.teachingSubject}。卒業要件とは別に確認しています。`;
  const detailedHdc2024 = state.faculty === "internationalHumanSciences"
    && state.department === "humanDevelopment"
    && String(state.year) === "2024";
  const baseRows = detailedHdc2024 ? article.groups.map((group) => compactRow(
    group.title,
    `${compactNumber(group.earned)} / ${compactNumber(group.required)}単位${group.missing ? `、あと${compactNumber(group.missing)}` : ""}`,
    group.missing ? "warn" : "ok",
    group.missing ? "不足" : "充足"
  )) : [];
  const subjectNote = subjectMinimum
    ? `必要${compactNumber(subjectMinimum.subjectAndMethod)}単位。科目ごとの対応表は公式資料で確認してください。`
    : "成績表で確認できる履修歴と、年度別の教職科目対応表を照合してください。";
  el.teachingResults.hidden = false;
  el.teachingResults.className = "compact-list";
  el.teachingResults.innerHTML = [
    compactRow(
      "全員に必要な基礎科目",
      detailedHdc2024
        ? `${compactNumber(article.earned)} / ${compactNumber(article.required)}単位。憲法・体育・英語・情報を別々に判定します。`
        : "憲法・体育・外国語コミュニケーション・情報機器の操作を確認します。",
      detailedHdc2024 && article.status === "ok" ? "ok" : "neutral",
      detailedHdc2024 && article.status === "ok" ? "充足" : "履修歴を確認"
    ),
    ...baseRows,
    compactRow("担当教科の専門・指導法", subjectNote, "neutral", subjectMinimum ? "公式基準" : "科目表で確認"),
    compactRow(
      "教職の授業",
      detailedHdc2024
        ? `心の発達と教育1・2は両方合格時だけ2単位として扱います。現在 ${compactNumber(pair.earned)}/${compactNumber(pair.required)}単位。`
        : "教職課程の必修・選択科目を年度別科目表で確認します。",
      detailedHdc2024 && pair.complete ? "ok" : "neutral",
      detailedHdc2024 && pair.complete ? "セット充足" : "履修歴を確認"
    ),
    compactRow("教育実習", "受講資格・事前事後指導・実習を公式日程で確認してください。", "neutral", "進捗確認"),
    ...(state.teachingSchool === "middle" ? [compactRow("介護等体験", "中学校免許では完了証明を確認してください。", "neutral", "進捗確認")] : []),
    compactRow("履修カルテ・免許申請", "提出、説明会、免許申請は成績表だけでは判定しません。", "neutral", "手続確認"),
    `<div class="compact-row"><a href="${escapeHtml(teachingOfficialLink())}" target="_blank" rel="noopener noreferrer">教員免許の公式情報を開く</a></div>`,
  ].join("");
}

function compactRow(title, note, tone = "neutral", label = "", action = null) {
  const control = action
    ? `<button class="inline-jump" type="button" data-jump="${escapeHtml(action.jump)}">${escapeHtml(action.label)}</button>`
    : (label ? `<span class="${badgeClass(tone)}">${escapeHtml(label)}</span>` : "");
  return `
    <div class="compact-row">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <small>${escapeHtml(note || "")}</small>
      </div>
      ${control}
    </div>
  `;
}

function releaseAcceptanceRows(rule = currentRule()) {
  const faculty = state.faculty;
  const year = String(state.year || "");
  const rows = [];
  if (faculty === "economics") {
    return [rule.provisionalAssessmentNotice
      ? compactRow(
        "リリース受入: 経済学部",
        rule.provisionalAssessmentNotice,
        "warn",
        "暫定判定継続"
      )
      : compactRow(
        "リリース受入: 経済学部",
        "神戸大学経済学部規則の別表第2に基づき、研究指導の修得状況に応じた卒業必要単位と各科目群を判定します。軽微な未同定科目は警告に留め、判定を続けます。",
        "ok",
        "詳細判定可"
      )];
  }
  if (rule.unavailable) {
    rows.push(compactRow(
      "リリース受入: 数値判定停止",
      rule.unavailableReason || "未確認年度へ他年度の数値を流用しないため、取得が必要な根拠資料を表示します。",
      "warn",
      "P0 停止"
    ));
  } else {
    rows.push(compactRow(
      "リリース受入: 判定範囲",
      "判定できる範囲だけを表示し、教員免許・資格・法曹コース・特別プログラムは一般卒業要件と分離します。",
      "ok",
      rule.judgmentStatus === "detailed" ? "詳細判定可" : "条件付き"
    ));
  }
  if (faculty === "internationalHumanSciences") {
    const gspNeed = ihsGspNeed(rule);
    rows.push(compactRow(
      "国際人間科学部GSP",
      gspNeed
        ? `${year}年度はGSP必要単位を${gspNeed}単位として表示します。GSP履修ルートでは高度教養4単位の代わりに学科専門+4単位を反映し、GSP未履修ルートを明示した場合のみ高度教養4単位を追加条件にします。`
        : "学科・入学年度が未選択のため、GSPの数値判定を停止します。",
      gspNeed ? "ok" : "warn",
      gspNeed ? `GSP ${gspNeed}単位` : "選択待ち"
    ));
    rows.push(compactRow(
      "卒業研究届資格",
      rule.researchEligibility
        ? "2022・2026年度だけ注意判定を出します。卒業要件本体とは分離しています。"
        : (rule.researchEligibilityPending || "未確認年度は他年度の数値を流用せず、停止理由を表示します。"),
      rule.researchEligibility ? "neutral" : "warn",
      rule.researchEligibility ? "P1 注意判定" : "P1 停止"
    ));
  }
  if (faculty === "business") {
    rows.push(compactRow(
      "経営学部特別プログラム",
      "KIBER/KIMERA/DSP/KEEL等は公式情報・注意・リンク表示に留め、修了可否は一般卒業要件へ混ぜません。",
      "neutral",
      "分離"
    ));
  }
  if (faculty === "law") {
    const provisional = Boolean(rule.provisionalAssessmentNotice);
    rows.push(compactRow(
      "法学部の判定範囲",
      provisional
        ? rule.provisionalAssessmentNotice
        : Number(year) >= 2024
        ? "2024〜2026年度は公式便覧に基づき、3コース別・科目群別要件を判定します。専門演習は卒業論文必修ではなく、選択必修・上限注意として扱います。軽微な未同定科目は警告に留め、判定を続けます。"
        : "公式便覧に基づく数値判定を継続します。",
      provisional ? "warn" : "ok",
      provisional ? "暫定判定継続" : "詳細判定可"
    ));
  }
  if (faculty === "literature") {
    const provisional = Boolean(rule.provisionalAssessmentNotice);
    rows.push(compactRow(
      "文学部の判定範囲",
      provisional
        ? rule.provisionalAssessmentNotice
        : Number(year) >= 2023
        ? "2023〜2026年度は主要要件と卒論10単位を判定し、卒論関連42単位は専修別表に基づく条件付き判定として表示します。"
        : "2022年度公式便覧に基づき、専修別要件を判定します。",
      provisional ? "warn" : "neutral",
      provisional ? "暫定判定継続" : "P1 条件付き"
    ));
  }
  return rows;
}

const PAGE_BY_JUMP_TARGET = {
  requirements: "requirements",
  special: "requirements",
  liberal: "requirements",
  requiredRetakes: "courses",
  categoryShortages: "requirements",
  failedHistory: "courses",
  teaching: "dashboard",
  courses: "courses",
  unknown: "courses",
  gpa: "courses",
  evidence: "requirements",
  programs: "dashboard",
};

function programAvailableForProfile() {
  return Boolean(state.data && (currentFacultyConfig().specialPrograms || []).length);
}

function syncResultViewAvailability() {
  const teachingVisible = teachingAvailableForProfile();
  const programVisible = programAvailableForProfile();
  if (el.teachingResultTab) el.teachingResultTab.hidden = !teachingVisible;
  if (el.programResultTab) el.programResultTab.hidden = !programVisible;
  if ((state.resultView === "teaching" && !teachingVisible) || (state.resultView === "programs" && !programVisible)) {
    state.resultView = "graduation";
  }
}

function renderResultView() {
  syncResultViewAvailability();
  el.resultModeTabs?.querySelectorAll("[data-result-view]").forEach((button) => {
    const selected = button.dataset.resultView === state.resultView;
    button.setAttribute("aria-selected", String(selected));
    button.classList.toggle("active", selected);
  });
  document.querySelectorAll("[data-result-section]").forEach((section) => {
    const contextHidden = section.dataset.contextHidden === "true";
    section.hidden = contextHidden || section.dataset.resultSection !== state.resultView;
  });
}

function revealSelectedResultSection(resultView) {
  requestAnimationFrame(() => {
    const section = document.querySelector(`[data-result-section="${resultView}"]:not([hidden])`);
    if (!section) return;
    section.scrollIntoView({
      behavior: preferredScrollBehavior(),
      block: "nearest",
      inline: "nearest",
    });
  });
}

function renderActivePage() {
  const page = ["dashboard", "requirements", "courses"].includes(state.activePage)
    ? state.activePage
    : "dashboard";
  state.activePage = page;
  document.body.dataset.activePage = page;
  document.querySelectorAll("[data-page]").forEach((section) => {
    const resultHidden = page === "dashboard"
      && section.dataset.resultSection
      && section.dataset.resultSection !== state.resultView;
    section.hidden = section.dataset.page !== page || section.dataset.contextHidden === "true" || resultHidden;
  });
  renderHomeScreenNudge();
  el.viewTabs?.querySelectorAll("[data-view]").forEach((button) => {
    const selected = button.dataset.view === page;
    button.setAttribute("aria-selected", String(selected));
    button.classList.toggle("active", selected);
  });
  if (page === "dashboard") renderResultView();
}

function activatePage(page, options = {}) {
  if (!["dashboard", "requirements", "courses"].includes(page)) return;
  const { updateHash = true, scrollTop = false } = options;
  state.activePage = page;
  renderActivePage();
  if (updateHash && location.hash !== `#${page}`) {
    history.pushState(null, "", `#${page}`);
  }
  if (updateHash) state.restoredNavigationHash = "";
  if (scrollTop) {
    window.scrollTo({ top: 0, behavior: preferredScrollBehavior() });
  }
}

function reducedMotionPreferred() {
  return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
}

function preferredScrollBehavior() {
  return reducedMotionPreferred() ? "auto" : "smooth";
}

function afterPageLayout(callback) {
  const requestFrame = window.requestAnimationFrame || ((next) => setTimeout(next, 0));
  requestFrame(() => requestFrame(callback));
}

function fixedViewportTop() {
  let bottom = 0;
  document.querySelectorAll(".topbar, .result-mode-tabs").forEach((element) => {
    if (element.hidden) return;
    const style = window.getComputedStyle?.(element);
    if (style && !["fixed", "sticky"].includes(style.position)) return;
    const rect = element.getBoundingClientRect?.();
    if (!rect || rect.height <= 0 || rect.top > 1 || rect.bottom <= 0) return;
    bottom = Math.max(bottom, rect.bottom);
  });
  return bottom;
}

function highlightElement(element) {
  if (!element) return;
  element.classList.remove("jump-highlight");
  void element.offsetWidth;
  element.classList.add("jump-highlight");
  setTimeout(() => {
    element.classList.remove("jump-highlight");
  }, 1500);
}

function highlightAfterScroll(targets, behavior) {
  let applied = false;
  const apply = () => {
    if (applied) return;
    applied = true;
    targets.forEach(highlightElement);
  };
  if (behavior === "auto") {
    apply();
    return;
  }
  window.addEventListener?.("scrollend", apply, { once: true });
  setTimeout(apply, 500);
}

function scrollElementsToCenter(elements = [], fallback = null) {
  const targets = [...new Set(elements.filter(Boolean))];
  if (!targets.length && fallback) targets.push(fallback);
  if (!targets.length) return;

  afterPageLayout(() => {
    const behavior = preferredScrollBehavior();
    if (targets.length === 1) {
      targets[0].scrollIntoView({ behavior, block: "center", inline: "nearest" });
      highlightAfterScroll(targets, behavior);
      return;
    }

    const rects = targets.map((element) => element.getBoundingClientRect()).filter((rect) => rect.height > 0);
    if (!rects.length) return;
    const groupTop = Math.min(...rects.map((rect) => rect.top));
    const groupBottom = Math.max(...rects.map((rect) => rect.bottom));
    const headerBottom = fixedViewportTop();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;
    const usableTop = Math.min(viewportHeight - 80, headerBottom + 12);
    const usableBottom = viewportHeight - 12;
    const usableHeight = Math.max(80, usableBottom - usableTop);
    const groupHeight = groupBottom - groupTop;
    const currentScroll = window.scrollY || window.pageYOffset || 0;
    const targetTop = groupHeight <= usableHeight
      ? currentScroll + ((groupTop + groupBottom) / 2) - ((usableTop + usableBottom) / 2)
      : currentScroll + groupTop - usableTop;
    window.scrollTo({ top: Math.max(0, targetTop), behavior });
    highlightAfterScroll(targets, behavior);
  });
}

function scrollAndHighlight(element) {
  scrollElementsToCenter([element]);
}

function requirementRow(key) {
  return document.querySelector(`[data-requirement-key="${key}"]`);
}

function requirementRows(keys = []) {
  return [...new Set(keys.flatMap((key) => (
    Array.from(document.querySelectorAll(`[data-requirement-key="${key}"]`))
  )))];
}

function jumpToRequirementGroup(groupKey, keys = [], options = {}) {
  const { updateHash = true } = options;
  activatePage("requirements", { updateHash: false, scrollTop: false });
  const rows = requirementRows(keys);
  const fallback = document.getElementById("requirementsSection");
  if (updateHash) {
    const hash = `#requirements/${encodeURIComponent(groupKey)}`;
    if (location.hash !== hash) history.pushState(null, "", hash);
    state.restoredNavigationHash = hash;
  }
  scrollElementsToCenter(rows, fallback);
}

function requirementNavigationFromHash() {
  const [page, encodedGroup = ""] = location.hash.slice(1).split("/");
  if (page !== "requirements" || !encodedGroup) return null;
  const groupKey = decodeURIComponent(encodedGroup);
  const group = graduationRequirementGroups().find((item) => item.key === groupKey);
  if (!group) return null;
  return { groupKey, keys: [...new Set((group.rows || []).map((row) => row.key).filter(Boolean))] };
}

function restoreRequirementNavigation() {
  if (!state.data || state.restoredNavigationHash === location.hash) return false;
  const target = requirementNavigationFromHash();
  if (!target) return false;
  state.restoredNavigationHash = location.hash;
  jumpToRequirementGroup(target.groupKey, target.keys, { updateHash: false });
  return true;
}

function specialRequirementRows() {
  return ["special", "commonBasic", "commonBasicWithInfo", "firstYear", "group1", "group2", "global", "group23Global", "lawI", "lawRo", "lawAdditional", "lawCourseTotal", "lawSeminarCross", "lawSeminarMax", "lawSeminarTermLimit", "lawSeminarPending", "ihsFacultyBase", "ihsFacultyDevelopment", "ihsGsp", "ihsAdvancedException", "ihsFacultySpecial", "ihsDepartmentSpecial", "ihsFreeChoice", "ihsDepartmentDevelopmentRequired", "ihsGraduationResearchRequired", "ihsResearchEligibility", "ihsResearchEligibilityCourses", "ihsResearchEligibilityPending", "litBasic", "litGlobalEnglish", "litThesisRelated", "litThesis", "litFreeChoice"]
    .map(requirementRow)
    .filter(Boolean);
}

function liberalHighlightRows() {
  const rows = Array.from(el.liberalList.querySelectorAll(".list-row"));
  return rows.length ? rows : [document.getElementById("liberalSection")].filter(Boolean);
}

function resetCourseFilters() {
  el.searchInput.value = "";
  el.statusFilter.value = "all";
  el.categoryFilter.value = "all";
}

function jumpTo(target) {
  const page = PAGE_BY_JUMP_TARGET[target];
  if (page) {
    activatePage(page, { updateHash: true, scrollTop: false });
  }
  if (target === "requirements") {
    scrollAndHighlight(document.getElementById("requirementsSection"));
    return;
  }
  if (target === "special") {
    const rows = specialRequirementRows();
    scrollElementsToCenter(rows, document.getElementById("requirementsSection"));
    return;
  }
  if (target === "liberal") {
    const rows = liberalHighlightRows();
    const section = document.getElementById("liberalSection");
    scrollElementsToCenter(rows, section);
    return;
  }
  if (target === "requiredRetakes") {
    if (el.failedHistoryDetails) el.failedHistoryDetails.open = false;
    scrollAndHighlight(el.retakeCandidateSection || document.getElementById("failedHistorySection"));
    return;
  }
  if (target === "categoryShortages") {
    scrollAndHighlight(document.getElementById("requirementsSection"));
    return;
  }
  if (target === "failedHistory") {
    const { candidates, otherHistory } = retakeHistoryPartition();
    const showOtherHistory = candidates.length === 0 && otherHistory.length > 0;
    if (el.failedHistoryDetails) el.failedHistoryDetails.open = showOtherHistory;
    scrollAndHighlight(showOtherHistory ? el.failedHistoryDetails : (el.retakeCandidateSection || document.getElementById("failedHistorySection")));
    return;
  }
  if (target === "teaching") {
    state.resultView = "teaching";
    state.teachingEnabled = true;
    renderActivePage();
    scrollAndHighlight(document.getElementById("teachingSection"));
    return;
  }
  if (target === "courses") {
    resetCourseFilters();
    renderCourseTable();
    scrollAndHighlight(document.getElementById("courseSection"));
    return;
  }
  if (target === "evidence") {
    scrollAndHighlight(document.getElementById("evidenceSection"));
    return;
  }
  if (target === "programs") {
    state.resultView = "programs";
    renderActivePage();
    scrollAndHighlight(document.getElementById("specialProgramSection"));
    return;
  }
  if (target === "profile") {
    el.profileControls.open = true;
    scrollAndHighlight(el.profileControls);
    setTimeout(() => el.departmentSelect?.focus(), 450);
    return;
  }
  if (target === "unknown") {
    el.searchInput.value = "";
    el.statusFilter.value = "all";
    el.categoryFilter.value = "未分類";
    renderCourseTable();
    scrollAndHighlight(document.getElementById("courseSection"));
    return;
  }
  if (target === "gpa") {
    el.searchInput.value = "";
    el.categoryFilter.value = "all";
    el.statusFilter.value = "gpa";
    renderCourseTable();
    scrollAndHighlight(document.getElementById("courseSection"));
  }
}

function renderReadingNotices() {
  if (!el.readingNoticeSection || !el.readingNoticeList || !el.readingNoticeCount) return;
  if (!state.data) {
    el.readingNoticeSection.dataset.contextHidden = "true";
    el.readingNoticeSection.hidden = true;
    el.readingNoticeList.innerHTML = "";
    return;
  }
  const rule = currentRule();
  const rows = [];
  const unknown = unknownCategoryCourses();
  const unreadableNames = unreadableNameCourses();
  const unreadableCredits = unreadableCreditCourses();
  const duplicateRows = possibleDuplicateCourses();
  if (!rule.unavailable && rule.classificationReady === false) {
    rows.push(compactRow(
      "科目区分の自動判定を完了できません",
      "修得単位の合計は確認できますが、区分別の数値は科目一覧と公式資料で確認してください。",
      "warn", "区分整備中", { jump: "evidence", label: "公式確認リストを見る" }
    ));
  }
  if (unknown.length) {
    rows.push(compactRow(
      "区分を判定できない科目があります",
      "卒業要件の判定に影響する可能性があります。科目一覧で区分を確認してください。",
      "warn", `${unknown.length}件`, { jump: "unknown", label: "区分不明の科目を見る" }
    ));
  }
  if (unreadableNames.length) {
    rows.push(compactRow(
      "一部の科目名を正しく読み取れなかった可能性があります",
      "科目一覧で科目名を確認してください。",
      "warn", `${unreadableNames.length}件`, { jump: "courses", label: "科目一覧を見る" }
    ));
  }
  if (unreadableCredits.length) {
    rows.push(compactRow(
      "単位数を読み取れない科目があります",
      "修得単位の合計がずれる可能性があります。科目一覧で確認してください。",
      "warn", `${unreadableCredits.length}件`, { jump: "courses", label: "科目一覧で確認する" }
    ));
  }
  if (duplicateRows.length) {
    const names = [...new Set(duplicateRows.slice(0, 3).map((course) => course.name))].join("、");
    rows.push(compactRow(
      "同じ科目が重複して読み込まれている可能性があります",
      `${names}${duplicateRows.length > 3 ? " など" : ""}。科目一覧で確認してください。`,
      "warn", `${duplicateRows.length}件`, { jump: "courses", label: "科目一覧で確認する" }
    ));
  }
  el.readingNoticeSection.dataset.contextHidden = String(rows.length === 0);
  el.readingNoticeSection.hidden = rows.length === 0;
  el.readingNoticeCount.textContent = `${rows.length}件`;
  el.readingNoticeList.className = "compact-list";
  el.readingNoticeList.innerHTML = rows.join("");
}

function renderEvidenceSupport() {
  if (!state.data) {
    el.evidenceList.className = "compact-list empty";
    el.evidenceList.textContent = "年度別の便覧ルールをもとに表示します。";
    if (el.officialSourceList) {
      el.officialSourceList.className = "compact-list empty";
      el.officialSourceList.textContent = "学生便覧・履修関連ページを確認してください。";
    }
    if (el.evidenceDetails) el.evidenceDetails.open = false;
    el.reportStatus.textContent = "氏名・学籍番号・PDF本体を含めない報告文を作成できます。";
    showIssueReportPreview("", false);
    return;
  }

  const rule = currentRule();
  const judgment = ruleJudgmentStatus(rule);

  const source = rule.edition || `${state.year}年度学生便覧`;
  const statusRow = compactRow(
    "判定状態",
    `${judgment.note} 教員免許・資格・法曹コース・旧科目読替は一般卒業要件と分離して扱います。`,
    judgment.tone,
    judgment.label
  );
  const acceptanceRows = releaseAcceptanceRows(rule);
  const evidenceRows = requirementDefs().map((def) => {
    const hasNeed = def.need || def.need === 0;
    const ok = def.statusTone
      ? false
      : (def.limitType === "max"
        ? Number(def.got || 0) <= Number(def.need || 0)
        : Number(def.got || 0) >= Number(def.need || 0));
    const missingCredits = Math.max(0, Number(def.need || 0) - Number(def.got || 0));
    const excessCredits = Math.max(0, Number(def.got || 0) - Number(def.need || 0));
    return compactRow(
      def.title,
      `${source} / ${def.note}`,
      def.statusTone || (ok ? "ok" : "warn"),
      def.statusLabel || (def.limitType === "max"
        ? (ok ? "上限内" : `上限超過 ${round1(excessCredits)}`)
        : (hasNeed ? (ok ? "達成" : `あと${round1(missingCredits)}`) : "数値基準なし"))
    );
  });
  el.evidenceList.className = "compact-list evidence-list";
  el.evidenceList.innerHTML = [statusRow, ...acceptanceRows, ...evidenceRows].join("");
  renderOfficialSources();
  el.reportStatus.textContent = "氏名・学籍番号・PDF本体を含めない報告文を作成できます。";
  showIssueReportPreview("", false);
}

function renderOfficialSources() {
  if (!el.officialSourceList) return;
  const rule = currentRule();
  const facultySources = currentFacultyConfig().sources || [];
  const sources = [...(rule.sources || []), ...facultySources];
  if (!sources.length) {
    el.officialSourceList.className = "compact-list empty";
    el.officialSourceList.textContent = "学生便覧・履修関連ページを確認してください。";
    return;
  }
  el.officialSourceList.className = "compact-list";
  el.officialSourceList.innerHTML = sources.map((source) => {
    const tone = source.status?.includes("確認済み") && !source.status?.includes("要") ? "ok" : "warn";
    const title = escapeHtml(source.title || "公式情報");
    const url = source.url ? escapeHtml(source.url) : "";
    const link = url
      ? `<a href="${url}" target="_blank" rel="noopener noreferrer">公式ページを開く</a>`
      : "公式ページで最新情報を確認してください。";
    return `
      <div class="compact-row">
        <div>
          <strong>${title}</strong>
          <small>${link}</small>
        </div>
        <span class="${badgeClass(tone)}">${escapeHtml(source.status || "確認")}</span>
      </div>
    `;
  }).join("");
}

function formattedGpa(value) {
  if (value === null || value === undefined || normalize(value) === "") return "--";
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 && numeric <= 4 ? numeric.toFixed(2) : "--";
}

function renderGpaDisplay() {
  if (!el.gpaAuxiliary || !el.gpaValue) return;
  const rawValue = state.data?.gpaTotal?.value;
  const displayValue = formattedGpa(rawValue);
  el.gpaAuxiliary.className = "summary-metric-row gpa-auxiliary";
  el.gpaAuxiliary.setAttribute("aria-label", `通算GPA ${displayValue}。科目・不合格で内訳を見る`);
  el.gpaValue.textContent = displayValue;
}

function renderGraduationPosition() {
  renderGpaDisplay();
  if (!state.data) {
    if (el.resultConfidenceBadge) {
      el.resultConfidenceBadge.textContent = "確認中";
      el.resultConfidenceBadge.className = "badge neutral";
    }
    el.graduationRemainingCredits.textContent = "--";
    el.graduationRemainingUnit.hidden = false;
    el.graduationRemainingValue.classList.remove("completed");
    el.graduationCountedCredits.textContent = "-- / --単位";
    if (el.graduationProgressBar) el.graduationProgressBar.style.width = "0%";
    if (el.graduationProgress) el.graduationProgress.setAttribute("aria-valuenow", "0");
    el.transcriptEarnedCredits.textContent = "--";
    el.excludedCredits.textContent = "--単位";
    el.excludedCreditsRow.hidden = false;
    clearSemesterWorkloadDisplay();
    return;
  }

  const rule = currentRule();
  const judgment = ruleJudgmentStatus(rule);
  if (el.resultConfidenceBadge) {
    el.resultConfidenceBadge.textContent = judgment.label;
    el.resultConfidenceBadge.className = badgeClass(judgment.tone);
    el.resultConfidenceBadge.title = judgment.note || "";
  }
  const requiredTotal = graduationRequiredTotal(rule);
  const current = graduationCredits();
  const transcriptTotal = transcriptEarnedCredits();
  const excluded = Math.max(0, roundCredits(transcriptTotal - current));
  const outcome = graduationOutcome();
  const unavailableText = rule.missingDepartment ? "学科を選択してください" : "この年度は判定対象外です";
  const completed = !outcome.blocked && outcome.minimumAdditional <= 0;
  el.graduationRemainingCredits.textContent = outcome.blocked
    ? unavailableText
    : (completed ? "卒業に必要な単位を満たしています" : compactNumber(outcome.minimumAdditional));
  el.graduationRemainingUnit.hidden = outcome.blocked || completed;
  el.graduationRemainingValue.classList.toggle("completed", outcome.blocked || completed);
  el.graduationCountedCredits.textContent = rule.unavailable || !requiredTotal
    ? `${compactNumber(current)}単位を卒業要件に算入`
    : `${compactNumber(current)} / ${compactNumber(requiredTotal)}単位を卒業要件に算入`;
  const progress = rule.unavailable || !requiredTotal ? 0 : Math.max(0, Math.min(100, (current / requiredTotal) * 100));
  if (el.graduationProgressBar) el.graduationProgressBar.style.width = `${progress}%`;
  if (el.graduationProgress) el.graduationProgress.setAttribute("aria-valuenow", String(Math.round(progress)));
  el.transcriptEarnedCredits.textContent = compactNumber(transcriptTotal);
  el.excludedCredits.textContent = `${compactNumber(excluded)}単位`;
  el.excludedCreditsRow.hidden = excluded === 0;
  renderSemesterWorkload(outcome);
}

function renderRequirements() {
  if (!state.data) {
    el.requirements.className = "requirements empty";
    el.requirements.textContent = "データがありません。";
    return;
  }

  el.requirements.className = "requirements";
  el.requirements.innerHTML = requirementDefs().map((def) => {
    const tone = requirementStatus(def);
    const missing = Math.max(0, Number(def.need || 0) - Number(def.got || 0));
    const excess = Math.max(0, Number(def.got || 0) - Number(def.need || 0));
    const label = def.statusLabel || (def.limitType === "max"
      ? (tone === "ok" ? "上限内" : `上限超過 ${round1(excess)}`)
      : (tone === "ok" ? "達成" : `あと${round1(missing)}`));
    const progressValue = def.limitType === "max"
      ? pct(Math.min(Number(def.got || 0), Number(def.need || 0)), def.need)
      : pct(def.got, def.need);
    const badge = def.need || def.need === 0
      ? (def.limitType === "max"
        ? `${escapeHtml(round1(def.got))} / 上限${escapeHtml(def.need)}`
        : `${escapeHtml(round1(def.got))} / ${escapeHtml(def.need)}`)
      : "数値基準なし";
    return `
      <div class="requirement" id="requirement-${escapeHtml(def.key)}" data-requirement-key="${escapeHtml(def.key)}">
        <div>
          <strong>${escapeHtml(def.title)}</strong>
          <small>${escapeHtml(def.note)}</small>
          <progress value="${progressValue}" max="100"></progress>
        </div>
        <span class="${badgeClass(tone)}">${badge}</span>
        <small>${escapeHtml(label)}</small>
      </div>
    `;
  }).join("");
}

function renderLiberalList() {
  if (!state.data) {
    el.liberalList.className = "list empty";
    el.liberalList.textContent = "データがありません。";
    return;
  }

  if (currentRule().unavailable) {
    el.liberalList.className = "list empty";
    el.liberalList.textContent = "この学部・年度・学科は、根拠資料が揃うまで数値判定を停止しています。";
    return;
  }

  const rows = liberalRows();
  if (!rows.length) {
    el.liberalList.className = "list empty";
    el.liberalList.textContent = "この学部・年度の教養科目内訳は、公式資料で確認してください。";
    return;
  }

  el.liberalList.className = "list";
  el.liberalList.innerHTML = rows.map((row, index) => {
    const ok = row.statusTone ? row.statusTone === "ok" : row.got >= row.need;
    const tone = row.statusTone || (ok ? "ok" : "warn");
    const label = row.statusLabel || (ok ? "達成" : `あと${round1(row.need - row.got)}単位`);
    const title = row.title === "情報科目" ? "情報科目（情報基礎）" : row.title;
    return `
      <div class="list-row ${tone === "warn" ? "warn-row" : ""}" data-liberal-index="${index}">
        <div>
          <strong>${escapeHtml(title)}</strong>
          <small>${escapeHtml(label)}${row.note ? ` / ${escapeHtml(row.note)}` : ""}</small>
          <progress value="${pct(row.got, row.need)}" max="100"></progress>
        </div>
        <span class="${badgeClass(tone)}">${round1(row.got)} / ${row.need}</span>
      </div>
    `;
  }).join("");
}

function retakeHistoryPartition() {
  const candidates = state.data ? retakeCandidateItems() : [];
  const history = state.data ? failedHistoryItems() : [];
  const candidateKeys = new Set(candidates.map((item) => `${compactCourseName(item.course.name)}|${item.course.year || ""}|${item.course.term || ""}`));
  const otherHistory = history.filter((item) => !candidateKeys.has(`${compactCourseName(item.course.name)}|${item.course.year || ""}|${item.course.term || ""}`));
  return { candidates, history, otherHistory };
}

function renderRetakeSections() {
  const { candidates, history, otherHistory } = retakeHistoryPartition();

  if (el.failureOverviewEntry) {
    el.failureOverviewEntry.hidden = history.length === 0;
    el.failureOverviewEntry.setAttribute("aria-label", `再履修候補${candidates.length}件、その他の不合格${otherHistory.length}件。不合格履歴と再履修候補を見る`);
  }
  if (el.failureOverviewCandidateCount) el.failureOverviewCandidateCount.textContent = `${candidates.length}件`;
  if (el.failureOverviewOtherCount) el.failureOverviewOtherCount.textContent = `${otherHistory.length}件`;
  el.retakeCandidateCount.textContent = `${candidates.length}件`;
  el.retakeCandidateCount.className = candidates.some((item) => item.state === "required") ? "badge danger" : (candidates.length ? "badge warn" : "badge ok");
  if (!candidates.length) {
    el.retakeCandidateList.className = "list empty";
    el.retakeCandidateList.textContent = state.data ? "再履修候補はありません。" : "データがありません。";
  } else {
    el.retakeCandidateList.className = "list";
    el.retakeCandidateList.innerHTML = candidates.map((item) => {
      const tone = item.state === "required" ? "danger" : "warn";
      const timing = [item.course.year, item.course.term].filter(Boolean).join("");
      return `
        <div class="list-row retake-candidate-row">
          <div>
            <strong>${escapeHtml(item.course.name)}</strong>
            <span class="${badgeClass(tone)}">${escapeHtml(item.stateLabel)}</span>
            <small>不合格: ${escapeHtml(timing || "時期不明")} / ${compactNumber(item.course.credits || 0)}単位</small>
            <small>理由: ${escapeHtml(item.reason)} / 算入先: ${escapeHtml(item.usage)} / 方法: ${escapeHtml(item.method)}</small>
          </div>
        </div>
      `;
    }).join("");
  }

  el.failedHistoryCount.textContent = `${history.length}件`;
  el.failedHistoryCount.className = history.length ? "badge neutral" : "badge ok";
  if (!otherHistory.length) {
    el.failedHistoryList.className = "list empty";
    el.failedHistoryList.textContent = state.data ? "その他の不合格履歴はありません。" : "データがありません。";
  } else {
    el.failedHistoryList.className = "list";
    el.failedHistoryList.innerHTML = otherHistory.map((item) => rowHtml({
      tone: item.laterPass ? "ok" : "neutral",
      title: item.course.name,
      note: `${item.course.category || "区分未判定"} / ${item.course.year || ""}${item.course.term || ""} / ${item.reason}`,
      label: item.laterPass ? "後で修得済み" : (item.policy === "not_repeatable" ? "再履修不可" : "不合格履歴"),
    })).join("");
  }
}

function statusBadge(course) {
  if (isEarned(course)) return '<span class="badge ok">修得</span>';
  if (course.grade === "取消") return '<span class="badge warn">取消</span>';
  if (course.grade === "不可") return '<span class="badge danger">不可</span>';
  return '<span class="badge neutral">履歴</span>';
}

function courseUsageLabel(course) {
  const usages = [
    ...(course.graduationUsages || []).map((usage) => `卒業:${usage}`),
    ...(course.teachingUsages || []),
    ...(course.programUsages || []).map((usage) => `プログラム:${usage}`),
  ];
  return usages.length ? usages.join(" / ") : "卒業判定外";
}

function renderCategoryFilter() {
  const categories = ["all", ...new Set(courses().map((course) => course.category || "未分類"))];
  const current = el.categoryFilter.value;
  el.categoryFilter.innerHTML = categories.map((category) => {
    const label = category === "all" ? "区分すべて" : category;
    return `<option value="${escapeHtml(category)}">${escapeHtml(label)}</option>`;
  }).join("");
  el.categoryFilter.value = categories.includes(current) ? current : "all";
}

function courseYearRank(course) {
  const value = Number(String(course?.year || "").replace(/[^0-9]/g, ""));
  if (!Number.isFinite(value) || !value) return null;
  return value < 100 ? 2000 + value : value;
}

function courseTermRank(course) {
  const term = normalize(course?.term || "").toUpperCase();
  if (/Q4|第4/.test(term)) return 4;
  if (/Q3|第3/.test(term)) return 3;
  if (/後|Q2|第2/.test(term)) return 2;
  if (/前|Q1|第1/.test(term)) return 1;
  return 0;
}

function courseGradeRank(course) {
  const grade = normalize(course?.grade || "").toUpperCase();
  const ranks = { "秀": 9, "S": 9, "優": 8, "A": 8, "良": 7, "B": 7, "可": 6, "C": 6, "合格": 5, "認定": 4, "不可": 3, "F": 3, "取消": 2, "履修取消": 2 };
  return ranks[grade] ?? null;
}

function transcriptCategoryRanks() {
  const ranks = new Map();
  for (const course of courses()) {
    const category = normalize(course.transcriptCategory || course.category || "");
    if (category && !/未分類|区分不明/.test(category) && !ranks.has(category)) ranks.set(category, ranks.size);
  }
  return ranks;
}

function courseGroupRank(course) {
  const group = normalize(course?.group || course?.sub || "").replace(/[ⅠI１]/g, "1").replace(/[Ⅱ２]/g, "2").replace(/[Ⅲ３]/g, "3").replace(/[Ⅳ４]/g, "4");
  const match = group.match(/(?:第)?([1-4])群/);
  if (match) return Number(match[1]);
  if (/共通専門基礎|初年次/.test(group)) return 0;
  if (/グローバル|GSP/.test(group)) return 5;
  return null;
}

function compareKnownValues(aValue, bValue, direction) {
  const aUnknown = aValue === null || aValue === undefined || aValue === "";
  const bUnknown = bValue === null || bValue === undefined || bValue === "";
  if (aUnknown !== bUnknown) return aUnknown ? 1 : -1;
  if (aUnknown && bUnknown) return 0;
  const comparison = typeof aValue === "string" ? aValue.localeCompare(bValue, "ja") : aValue - bValue;
  return direction === "desc" ? -comparison : comparison;
}

function sortedCourseRows(list) {
  const rows = [...list];
  const categoryRanks = transcriptCategoryRanks();
  return rows.sort((a, b) => {
    let primary = 0;
    if (state.courseSortMode === "year") {
      primary = compareKnownValues(courseYearRank(a), courseYearRank(b), state.courseSortDirection)
        || compareKnownValues(courseTermRank(a), courseTermRank(b), state.courseSortDirection);
    } else if (state.courseSortMode === "grade") {
      primary = compareKnownValues(courseGradeRank(a), courseGradeRank(b), state.courseSortDirection);
    } else if (state.courseSortMode === "category") {
      primary = compareKnownValues(
        categoryRanks.get(normalize(a.transcriptCategory || a.category || "")),
        categoryRanks.get(normalize(b.transcriptCategory || b.category || "")),
        state.courseSortDirection
      );
    } else if (state.courseSortMode === "group") {
      primary = compareKnownValues(courseGroupRank(a), courseGroupRank(b), state.courseSortDirection);
    }
    if (primary) return primary;
    const recent = compareKnownValues(courseYearRank(a), courseYearRank(b), "desc")
      || compareKnownValues(courseTermRank(a), courseTermRank(b), "desc");
    if (recent) return recent;
    return Number(a.sourceIndex || 0) - Number(b.sourceIndex || 0);
  });
}

function courseSortLabel() {
  const labels = { year: "履修年度", grade: "成績", category: "成績表区分", group: "群" };
  const directions = state.courseSortMode === "year"
    ? { desc: "新しい順", asc: "古い順" }
    : (state.courseSortMode === "grade"
      ? { desc: "高い順", asc: "低い順" }
      : { asc: "正順", desc: "逆順" });
  return `${labels[state.courseSortMode]}（${directions[state.courseSortDirection]}）`;
}

function renderCourseSortControls() {
  if (!el.courseSortSelect || !el.courseSortDirection || !el.courseSortStatus) return;
  el.courseSortSelect.value = state.courseSortMode;
  const nextDirection = state.courseSortDirection === "desc" ? "asc" : "desc";
  const nextLabel = state.courseSortMode === "year"
    ? (nextDirection === "asc" ? "古い順" : "新しい順")
    : (state.courseSortMode === "grade"
      ? (nextDirection === "asc" ? "低い順" : "高い順")
      : (nextDirection === "asc" ? "正順" : "逆順"));
  el.courseSortDirection.textContent = state.courseSortDirection === "desc" ? "↓" : "↑";
  el.courseSortDirection.setAttribute("aria-label", `${nextLabel}に切り替える`);
  el.courseSortDirection.title = `${nextLabel}に切り替える`;
  el.courseSortStatus.textContent = courseSortLabel();
}

function filteredCourses() {
  let rows = [...courses()];
  const query = normalize(el.searchInput.value).toLowerCase();
  const status = el.statusFilter.value;
  const category = el.categoryFilter.value;

  if (query) {
    rows = rows.filter((course) => normalize(`${course.name} ${course.teacher || ""}`).toLowerCase().includes(query));
  }
  if (category !== "all") {
    rows = rows.filter((course) => (course.category || "未分類") === category);
  }
  if (status === "earned") rows = rows.filter(isEarned);
  if (status === "failed") rows = rows.filter((course) => course.grade === "不可");
  if (status === "cancelled") rows = rows.filter((course) => course.grade === "取消");
  if (status === "remote") rows = rows.filter((course) => course.remote);
  if (status === "gpa") rows = rows.filter((course) => !["＊", "─", "―", "-"].includes(course.gp));
  if (status === "excluded") rows = rows.filter((course) => ["＊", "─", "―", "-"].includes(course.gp));
  return sortedCourseRows(rows);
}

function renderCourseTable() {
  renderCategoryFilter();
  renderCourseSortControls();
  if (!state.data) {
    el.courseTable.innerHTML = '<tr><td colspan="10" class="table-empty">成績表を読み込んでください。</td></tr>';
    return;
  }
  const rows = filteredCourses();
  if (!rows.length) {
    el.courseTable.innerHTML = '<tr><td colspan="10" class="table-empty">該当する科目はありません。</td></tr>';
    return;
  }
  el.courseTable.innerHTML = rows.map((course) => `
    <tr>
      <td>${statusBadge(course)}</td>
      <td><span class="course-name">${escapeHtml(course.name)}</span>${course.remote ? '<span class="badge neutral remote">遠隔</span>' : ""}</td>
      <td>${round1(course.credits)}</td>
      <td>${escapeHtml(course.grade)}</td>
      <td>${escapeHtml(course.gp)}</td>
      <td>${escapeHtml(course.year || "")}${escapeHtml(course.term || "")}</td>
      <td>${escapeHtml(course.transcriptCategory || course.category || "未分類")}</td>
      <td>${escapeHtml(courseUsageLabel(course))}</td>
      <td>${escapeHtml(course.group || course.sub || "")}</td>
      <td>${escapeHtml(course.teacher || "")}</td>
    </tr>
  `).join("");
}

const BUSINESS_DSP_RELATED_COURSES = [
  "情報基礎",
  "データサイエンス基礎学",
  "数学A",
  "数学B",
  "数学D",
  "統計学A",
  "統計学B",
  "線形代数入門1",
  "線形代数入門2",
  "微分積分入門1",
  "微分積分入門2",
  "情報科学1",
  "情報科学2",
];

function businessDspRule(year = state.year) {
  return Number(year) >= 2026
    ? {
      yearLabel: "2026年度以降",
      baseNeed: 13,
      note: "2026年度学部DSPは、経営データ分析（プログラミング）1単位を含む基礎13単位以上が目安です。",
    }
    : {
      yearLabel: "2025年度",
      baseNeed: 12,
      note: "2025年度学部DSPは基礎12単位以上が目安です。2026年度のプログラミング1単位条件は流用しません。",
    };
}

function businessDspTopicSummary() {
  const config = state.finalP0Rules?.businessDspSameTheme || {};
  const earnedByTopic = new Map();
  const failedByTopic = new Map();
  for (const course of courses()) {
    const topic = businessDspTopic(course);
    if (!topic) continue;
    const key = compactCourseName(topic);
    if (isEarned(course)) {
      const current = earnedByTopic.get(key);
      if (!current || latestAttemptRank(course) > latestAttemptRank(current.course)) {
        earnedByTopic.set(key, { topic, course, credits: Number(course.credits || 0) });
      }
    } else if (course.grade === "不可") {
      const current = failedByTopic.get(key);
      if (!current || latestAttemptRank(course) > latestAttemptRank(current.course)) {
        failedByTopic.set(key, { topic, course });
      }
    }
  }
  const earnedTopics = [...earnedByTopic.values()];
  const credits = roundCredits(earnedTopics.reduce((total, item) => total + item.credits, 0));
  const eligibleFailedTopics = [...failedByTopic.values()].filter((item) => (
    !earnedByTopic.has(compactCourseName(item.topic))
    && item.course.currentlyOffered === true
    && item.course.prerequisitesMet !== false
  ));
  return {
    earnedTopics,
    uniqueTopicCount: earnedTopics.length,
    credits,
    eligibleFailedTopics,
    fulfilled: earnedTopics.length >= Number(config.minimumUniqueTopics || 2)
      && credits >= Number(config.completionCreditsRequired || 4),
  };
}

function hasEarnedBusinessDspTopic(course) {
  const topic = businessDspTopic(course);
  if (!topic) return false;
  return courses().some((candidate) => (
    isEarned(candidate)
    && compactCourseName(businessDspTopic(candidate)) === compactCourseName(topic)
  ));
}

function courseNameEquals(course, name) {
  return compactCourseName(course.name) === compactCourseName(name);
}

function findCoursesByNames(names) {
  const wanted = new Set(names.map(compactCourseName));
  return courses().filter((course) => wanted.has(compactCourseName(course.name)));
}

function findCourseByName(name) {
  return courses().find((course) => courseNameEquals(course, name));
}

function courseNamesText(list) {
  return list.map((course) => course.name).join("、");
}

function businessSpecialProgramCandidates() {
  if (state.faculty !== "business" || !state.data) return [];
  const candidates = [];
  const bookkeeping = [1, 2, 3, 4]
    .map((number) => findCourseByName(`実践簿記${number}`))
    .filter(Boolean);
  const earnedBookkeeping = bookkeeping.filter(isEarned);
  const unearnedBookkeeping = bookkeeping.filter((course) => !isEarned(course));
  if (bookkeeping.length) {
    candidates.push({
      programId: "BUS-CPA",
      title: "会計プロフェッショナル候補",
      note: [
        earnedBookkeeping.length ? `修得済み: ${courseNamesText(earnedBookkeeping)}` : "",
        unearnedBookkeeping.length ? `未修得注意: ${courseNamesText(unearnedBookkeeping)}` : "",
        "実践簿記は関連科目として表示します。修了可否は断定しません。",
      ].filter(Boolean).join(" / "),
      statusLabel: unearnedBookkeeping.length ? "未修得注意" : "候補",
      statusTone: unearnedBookkeeping.length ? "warn" : "neutral",
    });
  }

  const dspRule = businessDspRule();
  const managementStats = findCourseByName("経営統計");
  const failedManagementStats = managementStats && !isEarned(managementStats);
  const dspRelated = findCoursesByNames(BUSINESS_DSP_RELATED_COURSES);
  const dspTopics = businessDspTopicSummary();
  if (managementStats || dspRelated.length || dspTopics.earnedTopics.length || dspTopics.eligibleFailedTopics.length) {
    candidates.push({
      programId: "BUS-DSP-UG",
      title: "神戸経営DSP候補",
      note: [
        dspRule.note,
        dspTopics.earnedTopics.length ? `各分野: ${dspTopics.uniqueTopicCount}テーマ / ${compactNumber(dspTopics.credits)}単位（同一テーマは1回だけ算入）` : "",
        failedManagementStats ? "経営統計が不可のため、DSP入門演習の前提未達に注意してください。" : "",
        dspRelated.length ? `関連基礎候補: ${courseNamesText(dspRelated.slice(0, 8))}${dspRelated.length > 8 ? " など" : ""}` : "",
        "情報・数学・統計系の関連候補は、公式DSP修了要件へ自動加算しません。",
      ].filter(Boolean).join(" / "),
      statusLabel: dspTopics.fulfilled ? "各分野条件を充足" : (failedManagementStats ? "前提未達注意" : `${dspRule.baseNeed}単位目安`),
      statusTone: dspTopics.fulfilled ? "ok" : (failedManagementStats ? "warn" : "neutral"),
    });
  }

  const englishCredits = sumBy((course) => /English|英語|外国語/.test(`${course.name || ""} ${course.category || ""}`));
  if (englishCredits || sumBy((course) => /グローバル|Global|留学|国際/.test(`${course.name || ""} ${course.category || ""} ${course.group || ""}`))) {
    candidates.push({
      programId: "BUS-KIBER",
      title: "KIBER確認候補",
      note: "英語・国際系の履修歴があります。KIBERは指定科目、TOEFL/IELTS、GPA、1年交換留学、単位換算上限49単位を公式資料で確認します。",
      statusLabel: "公式確認",
      statusTone: "neutral",
    });
  }

  return candidates;
}

function programKey(program) {
  return normalize(program.id || program.name || "").replace(/[^\w-]/g, "-") || "program";
}

function programMetaText(program) {
  return [
    program.category,
    program.audience,
    program.relation || program.note,
    program.source ? `根拠: ${program.source}` : "",
  ].filter(Boolean).join(" / ");
}

function programCandidateHtml(candidate) {
  return `
    <div class="program-candidate">
      <strong>${escapeHtml(candidate.title)}</strong>
      <small>${escapeHtml(candidate.note)}</small>
      <span class="${badgeClass(candidate.statusTone || "neutral")}">${escapeHtml(candidate.statusLabel || "候補")}</span>
    </div>
  `;
}

function renderSpecialPrograms() {
  if (!el.specialProgramList || !el.specialProgramSelect || !el.specialProgramBadge) return;
  const programs = currentFacultyConfig().specialPrograms || [];
  const candidates = businessSpecialProgramCandidates();
  const previous = el.specialProgramSelect.value || "";
  const options = [
    '<option value="">利用するプログラムを選択</option>',
    ...programs.map((program) => `<option value="${escapeHtml(programKey(program))}">${escapeHtml(program.name)}</option>`),
  ];
  el.specialProgramSelect.innerHTML = options.join("");
  el.specialProgramSelect.value = programs.some((program) => programKey(program) === previous) ? previous : "";

  el.specialProgramBadge.textContent = programs.length ? "選択時に表示" : "対象なし";
  el.specialProgramBadge.className = programs.length ? "badge neutral" : "badge ok";

  const selected = el.specialProgramSelect.value;
  const visiblePrograms = selected
    ? programs.filter((program) => programKey(program) === selected)
    : [];
  const visibleCandidates = selected
    ? candidates.filter((candidate) => programKey({ id: candidate.programId }) === selected)
    : [];

  if (!visiblePrograms.length && !visibleCandidates.length) {
    el.specialProgramList.className = "list empty";
    el.specialProgramList.textContent = programs.length
      ? "利用しているプログラムがある場合だけ選択してください。一般卒業要件には加算しません。"
      : "この学部で表示できる特殊プログラム情報はありません。";
    return;
  }

  el.specialProgramList.className = "list";
  el.specialProgramList.innerHTML = visiblePrograms.map((program) => `
    <div class="list-row">
      <div>
        <strong>${escapeHtml(program.name)}</strong>
        <small>${escapeHtml(program.summary || program.note || "一般卒業要件とは分離して公式資料で確認します。")}</small>
        <small>${escapeHtml(programMetaText(program))}</small>
        ${visibleCandidates.filter((candidate) => candidate.programId === program.id).map(programCandidateHtml).join("")}
        ${program.sourceUrl ? `<small><a href="${escapeHtml(program.sourceUrl)}" target="_blank" rel="noopener">公式情報を開く</a></small>` : ""}
      </div>
      <span class="${badgeClass(program.statusTone || "neutral")}">${escapeHtml(program.statusLabel || "別確認")}</span>
    </div>
  `).join("") + visibleCandidates
    .filter((candidate) => !visiblePrograms.some((program) => program.id === candidate.programId))
    .map((candidate) => `<div class="list-row"><div>${programCandidateHtml(candidate)}</div></div>`)
    .join("");
}

function syncScopedSelections() {
  const rule = currentRule();
  if (state.faculty !== "law" || !rule.courses) {
    state.lawCourse = "";
  }
  if (!isIhsLegacyGspRule(rule)) {
    state.ihsGspRoute = "gsp";
  }
  if (state.faculty !== "literature") {
    state.literatureMajor = "";
  } else {
    const options = literatureMajorOptions(rule);
    if (state.literatureMajor && !options.includes(state.literatureMajor)) {
      state.literatureMajor = "";
    }
  }
}

function render() {
  const hasData = Boolean(state.data);
  syncScopedSelections();
  const assessment = profileAssessmentStatus();
  const profileReady = hasData && assessment.code === "supported";
  state.integrityIssue = null;
  document.body.classList.toggle("has-data", hasData);
  document.body.classList.toggle("profile-blocked", hasData && !profileReady);
  document.body.classList.remove("integrity-blocked");
  el.viewTabs?.querySelectorAll("[data-view]").forEach((button) => { button.disabled = false; });
  if (el.topbar) {
    el.topbar.inert = !state.data;
    if (state.data) {
      el.topbar.removeAttribute("aria-hidden");
    } else {
      el.topbar.setAttribute("aria-hidden", "true");
    }
  }
  renderHeader();
  renderProfileStop();
  renderHomeScreenNudge();
  if (!profileReady) {
    clearSemesterWorkloadDisplay();
    return;
  }
  ensureProfileDataDecorated();
  // Missing retake metadata is a non-blocking warning. It must never prevent
  // the already parsed credits and graduation requirements from being shown.
  assertRetakeMasterCompleteForCurrentData();
  state.integrityIssue = assessmentIntegrityStatus();
  if (state.integrityIssue) {
    document.body.classList.add("profile-blocked");
    document.body.classList.add("integrity-blocked");
    state.activePage = "courses";
    el.viewTabs?.querySelectorAll("[data-view]").forEach((button) => {
      button.disabled = button.dataset.view !== "courses";
    });
    renderProfileStop();
    clearSemesterWorkloadDisplay();
    renderCourseTable();
    renderActivePage();
    return;
  }
  renderGraduationGroups();
  renderTeachingSupport();
  renderReadingNotices();
  renderEvidenceSupport();
  renderGraduationPosition();
  renderRequirements();
  renderLiberalList();
  renderRetakeSections();
  renderCourseTable();
  renderSpecialPrograms();
  renderActivePage();
  if (state.data && location.hash.startsWith("#requirements/") && state.restoredNavigationHash !== location.hash) {
    setTimeout(restoreRequirementNavigation, 0);
  }
}

async function loadRules() {
  if (state.rulesVersion && Object.keys(state.faculties).length) return;
  const candidates = [
    "./data/runtime-rules.json?v=start-links-blue-underlined-ui-20260720",
    "./data/rules.json?v=start-links-blue-underlined-ui-20260720",
  ];
  let lastError = null;
  for (const url of candidates) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("年度別ルールを読み込めませんでした。");
      const payload = await response.json();
      state.faculties = payload.faculties || {};
      state.teachingRequirements = payload.teachingRequirements || {};
      state.teachingAvailability = payload.teachingAvailability || {};
      state.retakeRequirements = payload.retakeRequirements || {};
      state.retakePoolMaster = payload.retakePoolMaster || {};
      state.retakeEligibilityMaster = payload.retakeEligibilityMaster || {};
      state.retakeCompletenessMaster = payload.retakeCompletenessMaster || {};
      state.finalP0Rules = payload.finalP0Rules || {};
      state.facultyResultRequirements = payload.facultyResultRequirements || {};
      state.profileAvailabilityMatrix = payload.profileAvailabilityMatrix || [];
      state.releaseSupportMatrix = payload.releaseSupportMatrix || [];
      state.releaseSupportVariants = payload.releaseSupportVariants || [];
      state.releaseSupportMatrixVersion = payload.releaseSupportMatrixVersion || "";
      state.releaseSourceCatalog = payload.releaseSourceCatalog || {};
      state.profileFixtureCatalog = payload.profileFixtureCatalog || {};
      state.regressionFixtureCatalog = payload.regressionFixtureCatalog || {};
      state.courseIdentityMaster = payload.courseIdentityMaster || {};
      state.businessCourseCreditCorrectionMaster = payload.businessCourseCreditCorrectionMaster || {};
      state.accuracyLedgerPolicy = payload.accuracyLedgerPolicy || {};
      state.goldenFixtureSpecifications = payload.goldenFixtureSpecifications || {};
      state.accuracyReleaseGate = payload.accuracyReleaseGate || {};
      state.semesterWorkloadMaster = payload.semesterWorkloadMaster || {};
      state.rulesVersion = payload.rulesVersion || "";
      state.rules = payload.rules && Object.keys(payload.rules).length
        ? payload.rules
        : (state.faculties.business?.rules || {});
      state.fixtureRunResult = runKnownFailureFixtures(state.retakeCompletenessMaster.knownFailureFixtures || []);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("年度別ルールを読み込めませんでした。");
}

function setData(data) {
  const previousFaculty = state.faculty;
  const pendingRequirementHash = location.hash.startsWith("#requirements/") ? location.hash : "";
  state.data = data;
  state.diagnosisId = createAnonymousDiagnosisId();
  state.decoratedProfileKey = "";
  state.restoredNavigationHash = "";
  state.integrityIssue = null;
  state.runtimeStop = null;
  state.semesterWorkloadProfileKey = "";
  state.semesterWorkloadToggle = true;
  state.semesterWorkloadRemainingSemesters = null;
  state.semesterWorkloadRemainingSemestersEdited = false;
  state.ihsGspRoute = "gsp";
  state.teachingEnabled = false;
  state.teachingSchool = "";
  state.teachingSubject = "";
  state.teachingAssessmentStarted = false;
  state.resultView = "graduation";
  if (el.failedHistoryDetails) el.failedHistoryDetails.open = false;
  const faculty = inferFacultyKey(`${data.faculty || ""} ${data.department || ""}`);
  if (faculty && state.faculties[faculty]) {
    state.faculty = faculty;
  }
  if (state.faculty === "internationalHumanSciences") {
    const inferredDepartment = inferDepartmentKey(data.department || "");
    if (inferredDepartment) {
      state.department = inferredDepartment;
    } else if (previousFaculty !== "internationalHumanSciences") {
      state.department = "";
    }
  } else {
    state.department = "";
  }
  if (state.faculty !== "law") {
    state.lawCourse = "";
  }
  if (state.faculty !== "literature") {
    state.literatureMajor = "";
  }
  const yearFromStudentId = inferAdmissionYearFromStudentId(data.studentIdRaw);
  const facultyRules = currentFacultyConfig().rules || state.rules;
  if (yearFromStudentId && facultyRules[yearFromStudentId]) {
    state.year = yearFromStudentId;
  }
  state.profileSource = faculty || yearFromStudentId ? "auto" : "default";
  state.activePage = pendingRequirementHash ? "requirements" : "dashboard";
  history.replaceState(null, "", pendingRequirementHash || "#dashboard");
  if (window.matchMedia("(max-width: 560px)").matches) {
    el.profileControls.open = false;
  }
  render();
}

function setUploadProgress(value, visible = true) {
  const progress = Math.max(0, Math.min(100, Number(value) || 0));
  if (el.uploadProgressContainer) el.uploadProgressContainer.hidden = !visible;
  if (el.uploadProgress) el.uploadProgress.setAttribute("aria-valuenow", String(Math.round(progress)));
  if (el.uploadProgressBar) el.uploadProgressBar.style.width = `${progress}%`;
}

function updateUploadProgressFromMessage(message) {
  const match = normalize(message).match(/(\d+)\/(\d+)ページ/);
  if (!match) return;
  const page = Number(match[1]);
  const total = Number(match[2]);
  if (!Number.isFinite(page) || !Number.isFinite(total) || total <= 0) return;
  setUploadProgress(12 + (Math.min(page, total) / total) * 46);
}

async function uploadPdf(file) {
  startPdfDiagnostics();
  showPdfDiagnosticDetails(false);
  setUploadProgress(6);
  el.uploadStatus.hidden = false;
  el.uploadStatus.className = "message";
  el.uploadStatus.textContent = "1/3 PDFの文字を読み取っています...";

  const payload = await analyzePdfInBrowser(file, (message) => {
    el.uploadStatus.textContent = message;
    updateUploadProgressFromMessage(message);
  });

  setUploadProgress(70);
  el.uploadStatus.textContent = "2/3 学部・入学年度と科目区分を確認しています...";
  await new Promise((resolve) => setTimeout(resolve, 0));
  setData(payload);
  setUploadProgress(86);
  el.uploadStatus.textContent = "3/3 単位合計を照合しています...";
  await new Promise((resolve) => setTimeout(resolve, 0));
  render();
  const warningItems = [...(payload.parseWarnings || [])];
  if (state.fixtureRunResult?.passed === false) {
    warningItems.push("内部検証の一部に不一致がありますが、取得できた情報で暫定判定を続けています。");
  }
  const warnings = warningItems.length ? ` ${warningItems.join(" ")}` : "";
  el.uploadStatus.className = payload.matchedCanonical ? "message ok" : "message";
  el.uploadStatus.textContent = `${payload.courses?.length || 0}件の科目を読み込みました。${warnings}`;
  setUploadProgress(100);
}

function setPdfUploadBusy(busy) {
  if (el.pdfInput) el.pdfInput.disabled = busy;
  el.startScreen?.setAttribute("aria-busy", String(busy));
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function exportCsv() {
  if (!state.data) return;
  const header = ["科目名", "単位", "成績", "GP", "年度", "学期", "成績表区分", "卒業用途", "教職用途", "プログラム用途", "群", "遠隔", "担当教員"];
  const lines = [
    header,
    ...courses().map((course) => [
      course.name,
      course.credits,
      course.grade,
      course.gp,
      course.year,
      course.term,
      course.transcriptCategory || course.category,
      (course.graduationUsages || []).join(" / "),
      (course.teachingUsages || []).join(" / "),
      (course.programUsages || []).join(" / "),
      course.group || course.sub || "",
      course.remote ? "遠隔" : "",
      course.teacher || "",
    ]),
  ].map((row) => row.map(csvEscape).join(","));
  const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "rishu_courses.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function currentOfficialSources() {
  const rule = currentRule();
  return [...(rule.sources || []), ...(currentFacultyConfig().sources || [])];
}

function issueReportGpaLine() {
  const gpa = state.data?.gpaTotal;
  const current = state.data?.gpaCurrent;
  if (!gpa || gpa.value === "算出不可") return "通算GPA: 算出不可";
  const credits = gpa.gpaCredits === "-" ? "算出不可" : `${gpa.gpaCredits}単位`;
  const currentText = current?.value && current.value !== "算出不可" ? ` / 直近GPA ${current.value}` : "";
  return `通算GPA: ${gpa.value} / GPA計算単位数 ${credits}${currentText}`;
}

function issueReportRuleStatus(rule) {
  if (rule.unavailable) return rule.unavailableReason || "未確認年度のため、数値判定を停止しています。";
  return rule.correctionNotice || rule.separateNotice || "判定可能範囲を表示しています。";
}

function issueReportSourceLines() {
  const sources = currentOfficialSources();
  if (!sources.length) return ["- 公式確認リスト: 未設定"];
  const seen = new Set();
  return sources
    .map((source) => ({
      title: source.title || "公式情報",
      url: source.url || source.sourceUrl || "URL未設定",
      status: source.status || "",
    }))
    .filter((source) => {
      const key = `${source.title}|${source.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8)
    .map((source) => {
      const status = source.status ? ` / ${source.status}` : "";
      return `- ${source.title}${status}: ${source.url}`;
    });
}

function buildIssueReportText(fields = {}) {
  if (!state.data) return "";
  const faculty = currentFacultyConfig();
  const lines = [
    "履修サポート 判定ミス報告",
    `匿名診断ID: ${state.diagnosisId || "未発行"}`,
    `アプリ版: ${APP_BUILD}`,
    `ルール版: ${state.rulesVersion || "未設定"}`,
    `学部: ${faculty.label || state.faculty}`,
    ...(state.faculty === "internationalHumanSciences"
      ? [
        `学科: ${DEPARTMENT_LABELS[state.department] || "未選択"}`,
      ]
      : []),
    ...(state.faculty === "literature"
      ? [`専修: ${state.literatureMajor || "未選択"}`]
      : []),
    `入学年度: ${state.year}`,
    `問題の種類: ${normalize(fields.type) || "未選択"}`,
    ...(state.pdfDiagnostics ? [
      `PDF処理段階: ${state.pdfDiagnostics.stage || "不明"}`,
      `PDF処理時間: ${Math.round(Number(state.pdfDiagnostics.elapsedMs || 0) / 100) / 10}秒`,
      `PDF互換モード: ${state.pdfDiagnostics.workerFallbackUsed ? "使用" : "未使用"}`,
      `PDF失敗コード: ${state.pdfDiagnostics.errorCode || "なし"}`,
    ] : []),
    "",
    "氏名、学籍番号、成績表PDF、科目情報は含まれていません。",
  ];
  return lines.join("\n");
}

async function copyIssueReportToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to the older execCommand path below.
  }
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textArea.remove();
  }
}

function showIssueReportPreview(text, visible) {
  if (!el.issueReportPreview) return;
  el.issueReportPreview.hidden = !visible;
  el.issueReportPreview.value = visible ? text : "";
}

async function reportIssue() {
  if (!state.data) {
    showIssueReportPreview("", false);
    el.reportStatus.textContent = "成績表PDFを読み込んでから、判定ミス報告を作成できます。";
    return;
  }
  const text = buildIssueReportText();
  showIssueReportPreview("", false);
  if (el.issueReportDialogPreview) el.issueReportDialogPreview.value = text;
  if (el.issueReportDialogStatus) el.issueReportDialogStatus.textContent = "報告文を確認してからコピーしてください。";
  if (el.issueReportDialog?.showModal) {
    el.issueReportDialog.showModal();
  } else if (el.issueReportDialog) {
    el.issueReportDialog.setAttribute("open", "");
  }
}

async function submitIssueReport() {
  if (!state.data) return;
  const text = buildIssueReportText({
    type: el.issueType?.value,
  });
  if (el.issueReportDialogPreview) el.issueReportDialogPreview.value = text;
  const copied = await copyIssueReportToClipboard(text);
  showIssueReportPreview(text, false);
  if (!copied) {
    if (el.issueReportDialogStatus) el.issueReportDialogStatus.textContent = "自動コピーできませんでした。表示中の報告文を選択してコピーしてください。";
    el.reportStatus.textContent = "報告文を自動コピーできませんでした。ダイアログ内の匿名報告文をコピーしてください。";
    return;
  }
  if (el.issueReportDialogStatus) el.issueReportDialogStatus.textContent = "報告文をコピーしました。Instagramプロフィールを開き、メッセージへ貼り付けてください。";
  el.reportStatus.textContent = "匿名の報告文をコピーしました。Instagramのメッセージへ貼り付けてください。";
}

function openInstagramProfile() {
  window.open(INSTAGRAM_PROFILE_URL, "_blank", "noopener,noreferrer");
  if (el.issueReportDialogStatus) el.issueReportDialogStatus.textContent = "プロフィールを開きました。Instagramの「メッセージ」へ報告文を貼り付けてください。";
}

function openHomeScreenGuideDialog() {
  if (!el.homeScreenGuideDialog) return;
  if (el.homeScreenGuideDialog.showModal) {
    el.homeScreenGuideDialog.showModal();
    return;
  }
  el.homeScreenGuideDialog.setAttribute("open", "");
}

function isStandaloneDisplay() {
  const displayModeStandalone = typeof window.matchMedia === "function"
    && window.matchMedia("(display-mode: standalone)").matches;
  return displayModeStandalone || navigator.standalone === true;
}

function renderHomeScreenNudge() {
  if (!el.homeScreenNudge) return;
  const profileUnavailable = document.body.classList.contains("profile-blocked")
    || document.body.classList.contains("integrity-blocked");
  const visible = Boolean(state.data)
    && state.activePage === "dashboard"
    && !state.homeScreenNudgeDismissed
    && !profileUnavailable
    && !isStandaloneDisplay();
  el.homeScreenNudge.hidden = !visible;
}

function openHowToDialog() {
  if (!el.howToDialog) return;
  if (el.howToDialog.showModal) {
    el.howToDialog.showModal();
    return;
  }
  el.howToDialog.setAttribute("open", "");
}

function openPrivacyDialog() {
  if (!el.privacyDialog) return;
  if (el.privacyDialog.showModal) {
    el.privacyDialog.showModal();
    return;
  }
  el.privacyDialog.setAttribute("open", "");
}

function unregisterServiceWorkers() {
  if (location.protocol === "file:" || !("serviceWorker" in navigator)) return;
  const appScope = new URL("./", location.href).href;
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => Promise.allSettled(
      registrations.filter((registration) => registration.scope === appScope)
        .map((registration) => registration.unregister())
    )).catch(() => {});
}

function initializeBrowserHint() {
  if (!el.browserHint || !PDF_RUNTIME?.isInstagramBrowser()) return;
  el.browserHint.hidden = false;
  el.browserHint.textContent = INSTAGRAM_RECOVERY_MESSAGE;
}

const mobileProfileMedia = window.matchMedia("(max-width: 560px)");

function syncProfileControlsForViewport(event = mobileProfileMedia) {
  el.profileControls.open = !event.matches;
}

syncProfileControlsForViewport();
if (typeof mobileProfileMedia.addEventListener === "function") {
  mobileProfileMedia.addEventListener("change", syncProfileControlsForViewport);
} else if (typeof mobileProfileMedia.addListener === "function") {
  mobileProfileMedia.addListener(syncProfileControlsForViewport);
}

el.pdfInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  setPdfUploadBusy(true);
  uploadPdf(file).catch((error) => {
    const visibleError = userFacingPdfError(error);
    el.uploadStatus.hidden = false;
    el.uploadStatus.className = "message error";
    el.uploadStatus.textContent = visibleError.message;
    setUploadProgress(0, false);
    showPdfDiagnosticDetails(true);
  }).finally(() => {
    setPdfUploadBusy(false);
    event.target.value = "";
  });
});

el.facultySelect.addEventListener("change", (event) => {
  state.faculty = event.target.value;
  state.runtimeStop = null;
  state.teachingEnabled = false;
  state.teachingSchool = "";
  state.teachingSubject = "";
  state.teachingAssessmentStarted = false;
  state.resultView = "graduation";
  if (state.faculty !== "internationalHumanSciences") {
    state.department = "";
  }
  if (state.faculty !== "law") {
    state.lawCourse = "";
  }
  if (state.faculty !== "literature") {
    state.literatureMajor = "";
  }
  state.profileSource = "manual";
  const faculty = currentFacultyConfig();
  const supportedYears = detailedSupportEntries()
    .filter((entry) => entry.faculty === state.faculty)
    .map((entry) => String(entry.entranceYear));
  if (supportedYears.length && !supportedYears.includes(state.year)) {
    const preferredYear = String(faculty.defaultYear || "");
    state.year = supportedYears.includes(preferredYear) ? preferredYear : supportedYears[0];
  } else if (faculty.rules && !faculty.rules[state.year]) {
    state.year = faculty.defaultYear || Object.keys(faculty.rules)[0] || state.year;
  }
  state.decoratedProfileKey = "";
  render();
});

el.departmentSelect.addEventListener("change", (event) => {
  state.department = event.target.value;
  state.runtimeStop = null;
  state.teachingSchool = "";
  state.teachingSubject = "";
  state.teachingAssessmentStarted = false;
  state.resultView = "graduation";
  state.profileSource = "manual";
  state.decoratedProfileKey = "";
  render();
});

el.ihsGspRouteSelect.addEventListener("change", (event) => {
  state.ihsGspRoute = event.target.value === "advanced" ? "advanced" : "gsp";
  state.runtimeStop = null;
  state.profileSource = "manual";
  state.decoratedProfileKey = "";
  render();
});

el.lawCourseSelect.addEventListener("change", (event) => {
  state.lawCourse = event.target.value;
  state.runtimeStop = null;
  state.profileSource = "manual";
  state.decoratedProfileKey = "";
  render();
});

el.literatureMajorSelect.addEventListener("change", (event) => {
  state.literatureMajor = event.target.value;
  state.runtimeStop = null;
  state.profileSource = "manual";
  state.decoratedProfileKey = "";
  render();
});

el.yearSelect.addEventListener("change", (event) => {
  state.year = event.target.value;
  state.runtimeStop = null;
  state.teachingSchool = "";
  state.teachingSubject = "";
  state.teachingAssessmentStarted = false;
  state.resultView = "graduation";
  state.profileSource = "manual";
  state.decoratedProfileKey = "";
  render();
});

el.semesterWorkloadToggle?.addEventListener("change", (event) => {
  state.semesterWorkloadToggle = Boolean(event.target.checked);
  renderGraduationPosition();
});

el.semesterWorkloadToggle?.addEventListener("keydown", (event) => {
  if (![" ", "Spacebar", "Enter"].includes(event.key)) return;
  event.preventDefault();
  event.currentTarget.click();
});

el.semesterWorkloadRemainingSemesters?.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  state.semesterWorkloadRemainingSemestersEdited = true;
  state.semesterWorkloadRemainingSemesters = Number.isInteger(value) && value > 0 ? value : null;
  renderGraduationPosition();
});

el.teachingSchoolSelect?.addEventListener("change", (event) => {
  state.teachingSchool = event.target.value;
  state.teachingSubject = "";
  state.teachingAssessmentStarted = false;
  renderTeachingSupport();
});

el.teachingSubjectSelect?.addEventListener("change", (event) => {
  state.teachingSubject = event.target.value;
  state.teachingAssessmentStarted = false;
  renderTeachingSupport();
});

el.teachingRunButton?.addEventListener("click", () => {
  if (!state.teachingSchool || !state.teachingSubject) return;
  state.teachingAssessmentStarted = true;
  renderTeachingSupport();
});

el.searchInput.addEventListener("input", renderCourseTable);
el.statusFilter.addEventListener("change", renderCourseTable);
el.categoryFilter.addEventListener("change", renderCourseTable);
el.courseSortSelect?.addEventListener("change", (event) => {
  state.courseSortMode = event.target.value;
  state.courseSortDirection = ["year", "grade"].includes(state.courseSortMode) ? "desc" : "asc";
  renderCourseTable();
});
el.courseSortDirection?.addEventListener("click", () => {
  state.courseSortDirection = state.courseSortDirection === "desc" ? "asc" : "desc";
  renderCourseTable();
});
el.specialProgramSelect?.addEventListener("change", renderSpecialPrograms);
el.courseColumnsButton?.addEventListener("click", () => {
  const expanded = el.courseSection?.classList.toggle("show-detail-columns") || false;
  el.courseColumnsButton.setAttribute("aria-pressed", String(expanded));
  el.courseColumnsButton.textContent = expanded ? "詳細列を閉じる" : "詳細列";
});
el.exportButton.addEventListener("click", exportCsv);
el.reportIssueButton.addEventListener("click", reportIssue);
el.profileStopReportButton?.addEventListener("click", reportIssue);
el.homeScreenGuideButton?.addEventListener("click", openHomeScreenGuideDialog);
el.resultHomeScreenGuideButton?.addEventListener("click", openHomeScreenGuideDialog);
el.dismissHomeScreenNudgeButton?.addEventListener("click", () => {
  state.homeScreenNudgeDismissed = true;
  renderHomeScreenNudge();
});
el.howToButton?.addEventListener("click", openHowToDialog);
el.privacyButton?.addEventListener("click", openPrivacyDialog);
el.footerPrivacyButton?.addEventListener("click", openPrivacyDialog);
el.copyPdfDiagnosticButton?.addEventListener("click", copyPdfDiagnostic);
el.confirmIssueReportButton?.addEventListener("click", submitIssueReport);
el.openInstagramProfileButton?.addEventListener("click", openInstagramProfile);
document.addEventListener("click", (event) => {
  const requirementGroupButton = event.target.closest("[data-requirement-group]");
  if (requirementGroupButton) {
    event.preventDefault();
    const keys = normalize(requirementGroupButton.dataset.requirementKeys).split(",").filter(Boolean);
    jumpToRequirementGroup(requirementGroupButton.dataset.requirementGroup, keys);
    return;
  }
  const resultButton = event.target.closest("[data-result-view]");
  if (resultButton) {
    event.preventDefault();
    state.resultView = resultButton.dataset.resultView;
    state.teachingEnabled = state.resultView === "teaching";
    renderTeachingSupport();
    renderRetakeSections();
    renderActivePage();
    revealSelectedResultSection(state.resultView);
    return;
  }
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    event.preventDefault();
    activatePage(viewButton.dataset.view, { updateHash: true, scrollTop: true });
    return;
  }
  const button = event.target.closest("[data-jump]");
  if (!button) return;
  event.preventDefault();
  jumpTo(button.dataset.jump);
});

window.addEventListener("hashchange", () => {
  const page = location.hash.slice(1).split("/")[0];
  if (page === "planning") {
    history.replaceState(null, "", "#requirements");
    state.activePage = "requirements";
  } else if (["dashboard", "requirements", "courses"].includes(page)) {
    state.activePage = page;
  } else {
    return;
  }
  renderActivePage();
  state.restoredNavigationHash = "";
  if (!restoreRequirementNavigation()) {
    window.scrollTo({ top: 0, behavior: preferredScrollBehavior() });
  }
});

render();
initializeBrowserHint();
unregisterServiceWorkers();
