import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../api/client';

interface Result<T> {
  key: number;
  data: T | null;
  error: string | null;
}

// Loads data once and again whenever reload() is called.
// Pass a function with a stable identity (for example one imported from an api file).
export function useApiData<T>(fetcher: () => Promise<T>) {
  const [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((data) => {
        if (!cancelled) setResult({ key: refresh, data, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) setResult({ key: refresh, data: null, error: getErrorMessage(err) });
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, refresh]);

  const reload = useCallback(() => setRefresh((value) => value + 1), []);

  // A result only counts as current when it belongs to the latest refresh
  const loading = result?.key !== refresh;

  return {
    data: result?.data ?? null,
    error: loading ? null : (result?.error ?? null),
    loading,
    reload,
  };
}
