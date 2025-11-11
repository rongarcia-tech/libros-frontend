// AuthService: maneja credenciales (memoria + sessionStorage opcional)
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private STORAGE_KEY = 'libros_basic_auth';
  private credentials?: string; // 'Basic ...'

  constructor() {
    // si hay credenciales en sessionStorage, las recuperamos
    const saved = sessionStorage.getItem(this.STORAGE_KEY);
    if (saved) this.credentials = saved;
  }

  setCredentials(username: string, password: string, persist = false) {
    const token = btoa(`${username}:${password}`);
    this.credentials = `Basic ${token}`;
    if (persist) sessionStorage.setItem(this.STORAGE_KEY, this.credentials);
  }

  clearCredentials() {
    this.credentials = undefined;
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  getAuthorizationHeader(): string | null {
    return this.credentials ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }
}
