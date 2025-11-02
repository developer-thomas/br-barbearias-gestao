import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly KEY = 'ng-graph-token';
  private readonly SESSION_KEY = 'ng-graph-session';

  public getToken() {
    return localStorage.getItem(this.KEY);
  }

  public setToken(token: string) {
    localStorage.setItem(this.KEY, token);
  }

  public removeToken() {
    localStorage.removeItem(this.KEY);
    localStorage.removeItem(this.SESSION_KEY);
  }

  public setSession(session: { id: number; role: string; permissions: string[] }) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }

  public getSession(): { id: number; role: string; permissions: string[] } | null {
    const stored = localStorage.getItem(this.SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  public clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
  }
}
