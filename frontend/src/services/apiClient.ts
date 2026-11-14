/**
 * AAHMS API Client & Endpoints Contract
 * 
 * ============================================================================
 * NOTE FOR BACKEND & INTEGRATION TEAM:
 * Every endpoint path defined below is PROPOSED and to be confirmed
 * with the FastAPI backend engineering team prior to production binding.
 * ============================================================================
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Proposed API Endpoints Registry
 * All paths are relative to API_BASE_URL.
 * Status: Proposed, to be confirmed with the backend team.
 */
export const API_ENDPOINTS = {
  // Proposed: to be confirmed with the backend team
  MISSION_OVERVIEW: '/mission/overview',

  // Proposed: to be confirmed with the backend team
  INDICATOR_DETAIL: (id: string) => `/indicators/${encodeURIComponent(id)}`,

  // Proposed: to be confirmed with the backend team
  INDICATOR_HISTORY: (id: string, range: string) => 
    `/indicators/${encodeURIComponent(id)}/history?range=${encodeURIComponent(range)}`,

  // Proposed: to be confirmed with the backend team
  DAILY_CHECK_IN: '/check-in',

  // Proposed: to be confirmed with the backend team
  ALERTS: '/alerts',

  // Proposed: to be confirmed with the backend team
  RADIATION_SUMMARY: '/radiation/summary',

  // Proposed: to be confirmed with the backend team
  EXERCISE_ENTRIES: '/exercise/entries',

  // Proposed: to be confirmed with the backend team
  ADD_EXERCISE: '/exercise',

  // Proposed: to be confirmed with the backend team
  MANUAL_RECORDS: '/records/manual',

  // Proposed: to be confirmed with the backend team
  ADD_MANUAL_RECORD: '/records/manual',

  // Proposed: to be confirmed with the backend team
  SYNC_STATUS: '/sync/status',

  // Proposed: to be confirmed with the backend team
  SYNC_DOWNLINK: '/sync/downlink',

  // Proposed: to be confirmed with the backend team
  AI_EXPLANATION: '/health/ai-explanation',

  // Proposed: to be confirmed with the backend team
  AUTH_SIGNIN: '/auth/login',

  // Proposed: to be confirmed with the backend team
  AUTH_SIGNUP: '/auth/register',

  // Proposed: to be confirmed with the backend team
  AUTH_LOGOUT: '/auth/logout',

  // Proposed: to be confirmed with the backend team
  AUTH_SESSION: '/auth/session'
} as const;

/**
 * Helper to construct full qualified URL for an endpoint
 */
export function getApiUrl(path: string): string {
  const cleanBase = API_BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
