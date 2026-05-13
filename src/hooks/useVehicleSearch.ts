"use client";

import { useState } from "react";

export function useVehicleSearch() {
  const [query, setQuery] = useState<Record<string, string>>({});
  return { query, setQuery };
}
