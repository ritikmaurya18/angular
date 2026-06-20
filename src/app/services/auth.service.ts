import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

interface AuthUser {
  email: string;
  name: string;
}

const DEMO_USER = {
  email: 'admin@example.com',
  password: 'password123',
  name: 'Admin User',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated$: BehaviorSubject<boolean>;
  private currentUser$: BehaviorSubject<AuthUser | null>;

  constructor(private storage: StorageService) {
    this.isAuthenticated$ = new BehaviorSubject<boolean>(this.hasToken());
    this.currentUser$ = new BehaviorSubject<AuthUser | null>(this.loadUser());
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private loadUser(): AuthUser | null {
    return this.storage.get<AuthUser>(AUTH_USER_KEY);
  }

  login(email: string, password: string): boolean {
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const token = btoa(`${email}:${Date.now()}`);
      const user: AuthUser = { email, name: DEMO_USER.name };
      this.storage.set(AUTH_TOKEN_KEY, token);
      this.storage.set(AUTH_USER_KEY, user);
      this.isAuthenticated$.next(true);
      this.currentUser$.next(user);
      return true;
    }
    return false;
  }

  logout(): void {
    this.storage.remove(AUTH_TOKEN_KEY);
    this.storage.remove(AUTH_USER_KEY);
    this.isAuthenticated$.next(false);
    this.currentUser$.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  isAuthenticatedSnapshot(): boolean {
    return this.isAuthenticated$.value;
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  getCurrentUser(): Observable<AuthUser | null> {
    return this.currentUser$.asObservable();
  }

  getCurrentUserSnapshot(): AuthUser | null {
    return this.currentUser$.value;
  }
}
