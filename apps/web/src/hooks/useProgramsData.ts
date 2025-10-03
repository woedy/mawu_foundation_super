import { useEffect, useMemo, useState } from "react";

import { fallbackProgramsPayload } from "../data/programs-fallback";
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

    const loadProgramsData = async () => {
      setLoading(true);

      await new Promise((resolve) => {
        window.setTimeout(resolve, 400);
      });

      if (!isActive) {
        return;
      }

      setPayload(fallbackProgramsPayload);
      setError(null);
      setLoading(false);
    };

    void loadProgramsData();

    return () => {
      isActive = false;
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
