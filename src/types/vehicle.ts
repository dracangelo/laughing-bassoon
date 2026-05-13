export type Vehicle = {
  registration: string;
  make?: string;
  model?: string;
  year?: number;
  engine?: string;
  fuel?: string;
  colour?: string;
  source: "api" | "db" | "cache";
};
