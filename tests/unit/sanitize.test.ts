import { sanitizePartNumber, sanitizeRegistration, slugify } from "@/lib/sanitize";

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
});
