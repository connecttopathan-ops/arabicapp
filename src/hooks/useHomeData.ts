/**
 * useHomeData — loads the Home dashboard via the content service.
 *
 * Exposes { data, loading, error } so the screen can show loading and error
 * states. When the service switches to Supabase this hook is unaffected; if
 * you later adopt React Query/SWR, swap the internals here only.
 */
import { useEffect, useState } from 'react';
import { getHomeData } from '@/services/contentService';
import type { HomeData } from '@/types/content';

interface HomeState {
  data: HomeData | null;
  loading: boolean;
  error: Error | null;
}

export function useHomeData(): HomeState {
  const [state, setState] = useState<HomeState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getHomeData()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (active) setState({ data: null, loading: false, error });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
