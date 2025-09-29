import { useEffect, useMemo, useState } from "react";

import { fallbackProgramsPayload } from "../data/programs-fallback";
import { API_BASE_URL } from "../lib/config";
import type { ProgramsPayload } from "../types/programs";

export interface ProgramsDataState {
  payload: ProgramsPayload | null;
  loading: boolean;
  error: string | null;
}

export const useProgramsData = (): ProgramsDataState => {
  const [payload, setPayload] = useState<ProgramsPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const loadPrograms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/programs`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as ProgramsPayload;

        if (!isActive) {
          return;
        }

        setPayload(data);
        setError(null);
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to load program data", error);
        setPayload(fallbackProgramsPayload);
        setError(
          "Live program insights are unavailable right now, so we are showing a demo snapshot instead. Start the API to see the latest data.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadPrograms();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  return useMemo(
    () => ({
      payload,
      loading,
      error,
    }),
    [payload, loading, error],
  );
};
