import { sanitizeHtmlInput, sanitizePartNumber, sanitizeRegistration, sanitizeText, slugify } from "@/lib/sanitize";

describe("sanitize helpers", () => {
  it("cleans registrations before lookup", () => {
    expect(sanitizeRegistration(" ab 12 cde! ")).toBe("AB12CDE");
  });

  it("keeps safe turbo part number characters", () => {
    expect(sanitizePartNumber(" gt-1749v<script> ")).toBe("GT-1749VSCRIPT");
  });

  it("creates SEO slugs", () => {
    expect(slugify("Garrett GT1749V Turbocharger")).toBe("garrett-gt1749v-turbocharger");
  });

  it("strips unsafe markup from plain text fields", () => {
    expect(sanitizeText('<img src=x onerror="alert(1)"> Garrett')).toBe("Garrett");
  });

  it("removes scripts while preserving safe formatting in rich text", () => {
    const clean = sanitizeHtmlInput('<p>Hello <strong>world</strong><script>alert(1)</script></p>');
    expect(clean).toContain("Hello");
    expect(clean).toContain("world");
    expect(clean).not.toContain("<script>");
    expect(clean).not.toContain("onerror=");
  });
});
