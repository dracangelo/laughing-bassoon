import validator from "validator";

type DomPurifySanitizeOptions = {
  USE_PROFILES?: { html?: boolean };
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  FORBID_TAGS?: string[];
  FORBID_ATTR?: string[];
};

type DomPurifyFactory = (window: unknown) => { sanitize: (dirty: string, options?: DomPurifySanitizeOptions) => string };

let serverSanitizer: ((dirty: string, options?: DomPurifySanitizeOptions) => string) | null | undefined;

function getServerSanitizer() {
  if (serverSanitizer !== undefined) return serverSanitizer;

  try {
    const createDOMPurify = require("dompurify") as DomPurifyFactory;
    const runtimeWindow = typeof window !== "undefined" && window.document ? window : null;

    if (runtimeWindow) {
      const purifier = createDOMPurify(runtimeWindow);
      serverSanitizer = purifier.sanitize.bind(purifier);
      return serverSanitizer;
    }

    const { JSDOM } = require("jsdom") as { JSDOM: new (html?: string) => { window: unknown } };
    const purifier = createDOMPurify(new JSDOM("").window);
    serverSanitizer = purifier.sanitize.bind(purifier);
  } catch {
    serverSanitizer = null;
  }

  return serverSanitizer;
}

function sanitizeWithDomPurify(value: string, options?: DomPurifySanitizeOptions) {
  const sanitizer = getServerSanitizer();
  return sanitizer ? sanitizer(value, options) : null;
}



export function sanitizeText(value: string, maxLength = 160) {
  const raw = value.replace(/[{}]/g, "");
  const clean = sanitizeWithDomPurify(raw, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    USE_PROFILES: { html: true }
  }) || raw.replace(/<\/?[^>]+(>|$)/g, " ");

  return validator
    .stripLow(validator.escape(clean), true)
    .trim()
    .slice(0, maxLength);
}

export function slugify(value: string) {
  return sanitizeText(value, 120)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function sanitizeHtmlInput(value: string, maxLength = 5000) {
  const raw = validator.stripLow(value.replace(/[{}]/g, ""), true).trim().slice(0, maxLength * 2);
  const clean = sanitizeWithDomPurify(raw, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li", "a"],
    ALLOWED_ATTR: ["href", "target", "rel", "title"],
    FORBID_TAGS: ["style", "script"],
    FORBID_ATTR: ["style", "onerror", "onclick", "onload"]
  });

  if (!clean) {
    return sanitizeText(raw.replace(/<\/?[^>]+(>|$)/g, " "), maxLength);
  }

  return validator.stripLow(clean, true).trim().slice(0, maxLength);
}
