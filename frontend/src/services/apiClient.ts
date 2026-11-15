/**
 * AAHMS API Client & Endpoints Contract
 * 
 * Reconciled with FastAPI backend routing under /api prefix and Vercel multi-service bindings.
 */

/**
 * Resolves the backend base URL for API requests.
 * In Vercel multi-service deployments:
 * - On the server: uses process.env.BACKEND_URL (injected by Vercel service binding).
 * - On the client: uses process.env.NEXT_PUBLIC_API_URL or defaults to empty string '' (using Vercel rewrites on the same domain).
 * - In local standalone dev: falls back to http://localhost:8000 when neither is set.
 */
export function getApiBaseUrl(): string {
  if (typeof window === 'undefined' && process.env.BACKEND_URL) {
    return process.env.BACKEND_URL.replace(/\/+$/, '');
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    return '';
  }
  return 'http://localhost:8000';
}

export const API_BASE_URL = getApiBaseUrl();

/**
 * API Endpoints Registry
 * Reconciled with backend /api routes and Vercel public routing.
 */
export const API_ENDPOINTS = {
  MISSION_OVERVIEW: '/api/dashboard/summary',
  INDICATOR_DETAIL: (id: string) => `/api/readings?indicator=${encodeURIComponent(id)}`,
  INDICATOR_HISTORY: (id: string, range: string) => 
    `/api/readings?indicator=${encodeURIComponent(id)}&days=${range === '7d' ? 7 : range === '30d' ? 30 : 90}`,
  DAILY_CHECK_IN: '/api/readings',
  ALERTS: '/api/dashboard/summary',
  RADIATION_SUMMARY: '/api/dashboard/summary',
  EXERCISE_ENTRIES: '/api/routine/today',
  ADD_EXERCISE: '/api/routine/today',
  MANUAL_RECORDS: '/api/readings',
  ADD_MANUAL_RECORD: '/api/readings',
  SYNC_STATUS: '/api/health',
  SYNC_DOWNLINK: '/api/health',
  AI_EXPLANATION: '/api/health/ai-explanation',
  AUTH_SIGNIN: '/api/auth/login',
  AUTH_SIGNUP: '/api/auth/register',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_SESSION: '/api/astronauts/me'
} as const;

/**
 * Helper to construct full qualified URL for an endpoint
 */
export function getApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const pathWithApi = normalizedPath.startsWith('/api') ? normalizedPath : `/api${normalizedPath}`;
  if (!base) {
    return pathWithApi;
  }
  try {
    return new URL(pathWithApi.replace(/^\/+/, ''), `${base}/`).toString();
  } catch {
    return `${base}${pathWithApi}`;
  }
}
