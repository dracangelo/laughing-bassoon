import type { StoredTurbo } from "@/lib/persistence";

export type TurboContent = {
  gallery: Array<{ src: string; alt: string; label: string }>;
  highlights: string[];
  oemNumbers: string[];
  fitmentNotes: string[];
  included: string[];
  inspectionChecklist: string[];
  technicalSpecs: Array<{ label: string; value: string }>;
  serviceNotes: string[];
  warrantySummary: string;
};

const seededContent: Record<string, Omit<TurboContent, "technicalSpecs">> = {
  "ACE-GT1749V": {
    gallery: [
      { src: "/images/turbos/ace-gt1749v-hero.svg", alt: "ACE-GT1749V compressor-side view", label: "Compressor housing" },
      { src: "/images/turbos/ace-gt1749v-cutaway.svg", alt: "ACE-GT1749V cutaway", label: "Core and vane detail" },
      { src: "/images/turbos/ace-gt1749v-bench.svg", alt: "ACE-GT1749V bench inspection", label: "Bench inspection" }
    ],
    highlights: [
      "Variable vane assembly calibrated before dispatch",
      "Balanced CHRA and pressure-tested housings",
      "Workshop-friendly exchange unit supplied with fitting guidance"
    ],
    oemNumbers: ["717235-5001S", "46793334", "55191595"],
    fitmentNotes: [
      "Best matched to 1.9 JTD diesel applications using OE actuator geometry.",
      "Always inspect oil feed, return, and intercooler contamination before fitment.",
      "Prime the turbocharger with clean oil before first start."
    ],
    included: [
      "Turbocharger assembly",
      "Actuator set to workshop baseline",
      "Gasket pack",
      "Bench balance report"
    ],
    inspectionChecklist: [
      "Confirm shaft play and housing condition on returned core",
      "Check boost hoses for collapse or oil saturation",
      "Verify EGR and vacuum control operation before road test"
    ],
    serviceNotes: [
      "For repeat failures, inspect crankcase ventilation and DPF backpressure.",
      "Recommended oil grade and service interval must match vehicle manufacturer guidance."
    ],
    warrantySummary: "12-month workshop warranty when fitted with cleaned oil lines and documented service items."
  },
  "ACE-BW-K03": {
    gallery: [
      { src: "/images/turbos/ace-bwk03-hero.svg", alt: "ACE-BW-K03 turbine-side view", label: "Turbine housing" },
      { src: "/images/turbos/ace-bwk03-core.svg", alt: "ACE-BW-K03 CHRA detail", label: "CHRA assembly" },
      { src: "/images/turbos/ace-bwk03-pack.svg", alt: "ACE-BW-K03 packed unit", label: "Packed for dispatch" }
    ],
    highlights: [
      "New replacement unit for daily workshop stock coverage",
      "Matched for 2.0 TDI flow and response characteristics",
      "Protected packaging for courier and shelf handling"
    ],
    oemNumbers: ["53039880248", "03L253010J", "03L253019T"],
    fitmentNotes: [
      "Validate DPF load and intake leaks before replacement approval.",
      "Recommended for direct replacement where OE reference matches K03 family spec.",
      "Use fresh seals and flush intercooler pipework if oil carryover is present."
    ],
    included: [
      "Complete turbocharger",
      "Stud and nut pack",
      "Fitting note sheet",
      "Serialised dispatch label"
    ],
    inspectionChecklist: [
      "Check electronic actuator calibration if applicable to vehicle variant",
      "Inspect exhaust manifold face for cracking or warping",
      "Confirm ECU fault memory is cleared after install"
    ],
    serviceNotes: [
      "Ideal for stock-led retail and fleet repair jobs where turnaround matters.",
      "Post-install boost log is recommended for vehicles with prior underboost faults."
    ],
    warrantySummary: "12-month replacement warranty with documented installation and contamination checks."
  }
};

export function getTurboContent(turbo: StoredTurbo): TurboContent {
  const seeded = seededContent[turbo.sku];
  const baseTechnicalSpecs = [
    { label: "SKU", value: turbo.sku },
    { label: "Vehicle", value: `${turbo.make} ${turbo.model}` },
    { label: "Engine", value: turbo.engine },
    { label: "Model year", value: turbo.year ? String(turbo.year) : "Application dependent" },
    { label: "Power band", value: turbo.bhp ? `${turbo.bhp} BHP` : "Vehicle-specific" },
    { label: "Unit type", value: turbo.type },
    { label: "Stock", value: `${turbo.stock} ready to dispatch` }
  ];

  if (seeded) {
    return {
      ...seeded,
      technicalSpecs: baseTechnicalSpecs
    };
  }

  return {
    gallery: [
      { src: turbo.images[0] || "/images/ace-turbo-preview.svg", alt: `${turbo.sku} hero view`, label: "Primary view" },
      { src: turbo.images[1] || turbo.images[0] || "/images/ace-turbo-preview.svg", alt: `${turbo.sku} detail view`, label: "Workshop detail" },
      { src: turbo.images[2] || turbo.images[0] || "/images/ace-turbo-preview.svg", alt: `${turbo.sku} dispatch view`, label: "Dispatch prep" }
    ],
    highlights: [
      `${turbo.type} specification for ${turbo.make} ${turbo.model}`,
      "Add-to-cart ready with B2B pricing support when authorised",
      "Bench-checked workflow aligned with Ace Turbo dispatch process"
    ],
    oemNumbers: [turbo.sku, turbo.seoSlug.toUpperCase()],
    fitmentNotes: [
      "Match by OE reference and vehicle variant before fitment.",
      "Inspect lubrication path and intake contamination before installation.",
      "Prime with clean oil before first engine start."
    ],
    included: ["Turbocharger unit", "Dispatch paperwork", "Fitment guidance"],
    inspectionChecklist: [
      "Verify intake, exhaust, and oil-feed condition",
      "Check actuator operation and control faults",
      "Road test and confirm requested boost level"
    ],
    technicalSpecs: baseTechnicalSpecs,
    serviceNotes: [
      "This record is ready for richer migrated data as catalog import lands.",
      "Use workshop diagnostics to confirm the failed turbo is the root cause."
    ],
    warrantySummary: "Warranty and exchange terms depend on unit type and installation condition."
  };
}

export function describeUserAgent(agent?: string) {
  if (!agent) return "Unknown device";
  const lower = agent.toLowerCase();
  const browser = lower.includes("edg") ? "Edge" : lower.includes("chrome") ? "Chrome" : lower.includes("safari") ? "Safari" : lower.includes("firefox") ? "Firefox" : "Browser";
  const os = lower.includes("windows") ? "Windows" : lower.includes("android") ? "Android" : lower.includes("iphone") || lower.includes("ios") ? "iPhone" : lower.includes("mac os") || lower.includes("macintosh") ? "macOS" : lower.includes("linux") ? "Linux" : "OS";
  const device = lower.includes("mobile") ? "Mobile" : "Desktop";
  return `${browser} on ${os} · ${device}`;
}
