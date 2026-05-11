const ACCESS_KEY = 'doctor-letter:access';
const REFRESH_KEY = 'doctor-letter:refresh';

// dev: 빈 문자열 → vite proxy 경유. 앱/LAN 빌드: VITE_API_BASE_URL을 절대 URL로 지정.
const API_BASE: string = (import.meta as any).env?.VITE_API_BASE_URL ?? '';

export interface ApiError {
  status: number;
  message: string;
}

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function storeTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

function url(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path}`;
}

async function tryRefreshAccessToken(): Promise<string | null> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;
  const res = await fetch(url('/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.accessToken) return null;
  storeTokens(data.accessToken, data.refreshToken ?? refreshToken);
  return data.accessToken as string;
}

async function parseErrorMessage(res: Response): Promise<string> {
  const text = await res.text();
  if (!text) return `Error ${res.status}`;
  try {
    const json = JSON.parse(text);
    return json.message || json.error || text;
  } catch {
    return text;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retryOnUnauthorized = true
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  const access = getStoredAccessToken();
  if (access) headers.set('Authorization', `Bearer ${access}`);

  const res = await fetch(url(path), { ...options, headers });

  if ((res.status === 401 || res.status === 403) && retryOnUnauthorized) {
    const newAccess = await tryRefreshAccessToken();
    if (newAccess) {
      return apiFetch<T>(path, options, false);
    }
    clearTokens();
    throw { status: res.status, message: '인증이 만료되었습니다. 다시 로그인해주세요.' } as ApiError;
  }

  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw { status: res.status, message } as ApiError;
  }

  if (res.status === 204) return undefined as T;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}
