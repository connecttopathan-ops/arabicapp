/**
 * Content service — the single seam between the UI and the data source.
 *
 * Every screen calls these functions and `await`s the result. Right now they
 * resolve instantly with local placeholder data. When Supabase is added you
 * only touch the bodies here, e.g.:
 *
 *   export async function getHomeData(): Promise<HomeData> {
 *     const { data, error } = await supabase.rpc('get_home_dashboard');
 *     if (error) throw error;
 *     return mapHomeData(data);
 *   }
 *
 * Because the functions are already async and typed, no screen has to change.
 */
import { homeData } from '@/data/homeData';
import type { HomeData } from '@/types/content';

/** Simulates async latency so loading states are exercised during dev. */
const SIMULATED_DELAY_MS = 0;

function resolve<T>(value: T): Promise<T> {
  if (SIMULATED_DELAY_MS === 0) return Promise.resolve(value);
  return new Promise((res) => setTimeout(() => res(value), SIMULATED_DELAY_MS));
}

export async function getHomeData(): Promise<HomeData> {
  return resolve(homeData);
}
