import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { catchError, throwError, switchMap, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiUrl + '/api/auth';
  isAuthed = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  // ---------- API ----------
  register(body: { name: string; email: string; password: string }) {
    return this.http.post<any>(`${this.base}/register`, body);
  }

  /**
   * Login that tries the two most common payloads:
   * 1) { email, password }
   * 2) { username, password }   (fallback if 400/404/415)
   *
   * Also requests the full HttpResponse so we can read Authorization header.
   */
  login(body: { email: string; password: string }) {
    const asEmail = { email: body.email, password: body.password };
    const asUsername = { username: body.email, password: body.password };

    return this.http.post<any>(`${this.base}/login`, asEmail, { observe: 'response' as const }).pipe(
      catchError(err => {
        // If the server didn't like {email,...}, try {username,...}
        if ([400, 404, 415].includes(err?.status ?? 0)) {
          return this.http.post<any>(`${this.base}/login`, asUsername, { observe: 'response' as const });
        }
        return throwError(() => err);
      })
    );
  }

  // ---------- Token helpers ----------
  storeToken(token: string) {
    localStorage.setItem('token', token);

    // Auto-extract and store UID from JWT payload, if present.
    try {
      const p = JSON.parse(atob(token.split('.')[1] || ''));
      const uid = p?.id ?? p?.userId ?? p?.uid ?? (p?.sub && Number(p.sub));
      if (uid && Number.isFinite(Number(uid))) {
        localStorage.setItem('uid', String(uid));
      }
    } catch { /* ignore */ }

    this.isAuthed.set(true);
  }

  /**
   * Accept token from body OR Authorization header (Bearer ...).
   * Works with either an HttpResponse or a plain body.
   */
  storeTokenFromResponse(res: HttpResponse<any> | any): boolean {
    // 1) common body fields
    let token =
      res?.body?.token ?? res?.body?.jwt ?? res?.body?.accessToken ?? res?.body?.access_token ??
      res?.token ?? res?.jwt ?? res?.accessToken ?? res?.access_token ??
      res?.data?.token ?? res?.data?.jwt ?? res?.data?.accessToken ?? res?.data?.access_token;

    // 2) Authorization header
    if (!token && (res as HttpResponse<any>)?.headers?.get) {
      const h = (res as HttpResponse<any>).headers.get('Authorization') || (res as HttpResponse<any>).headers.get('authorization');
      if (h && /^Bearer\s+/i.test(h)) token = h.replace(/^Bearer\s+/i, '');
    }

    if (token) { this.storeToken(token); return true; }
    return false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    this.isAuthed.set(false);
  }
  hasToken() { return !!localStorage.getItem('token'); }
  isLoggedIn() { return this.hasToken(); }

  hasRole(role: string): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      const roles = payload?.roles || payload?.authorities || payload?.role || [];
      const list: string[] = Array.isArray(roles) ? roles : [roles];
      return list.map(r => String(r).toUpperCase()).includes(role.toUpperCase());
    } catch { return false; }
  }
}
