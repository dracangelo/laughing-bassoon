"use client";

import { useState } from "react";
import { sanitizeRegistration } from "@/lib/sanitize-strings";

export function useCarLookup() {
  const [loading, setLoading] = useState(false);

  async function lookup(registrationInput: string) {
    setLoading(true);
    try {
      const registration = sanitizeRegistration(registrationInput);
      const response = await fetch("/api/car-lookup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ registration })
      });
      return response.json();
    } finally {
      setLoading(false);
    }
  }

  return { loading, lookup };
}
