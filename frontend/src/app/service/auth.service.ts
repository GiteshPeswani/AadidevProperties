import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, RegisterRequest, AuthResponse } from '../model/auth.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  // Signals for state management
  currentUser = signal<{ username: string; email: string; role: string } | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'ROLE_ADMIN');

  constructor(private http: HttpClient) {
    // Restore session from localStorage on load
    const savedUser = localStorage.getItem('adidev_user');
    if (savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('adidev_user');
      }
    }
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request, { withCredentials: true }).pipe(
      tap(res => {
        const role = (request.username.toLowerCase().includes('admin') || request.username.toLowerCase().includes('deepak')) ? 'ROLE_ADMIN' : 'ROLE_USER';
        const user = { username: res.username, email: res.email, role };
        this.currentUser.set(user);
        localStorage.setItem('adidev_user', JSON.stringify(user));
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request, { withCredentials: true }).pipe(
      tap(res => {
        const role = (request.username.toLowerCase().includes('admin') || request.username.toLowerCase().includes('deepak')) ? 'ROLE_ADMIN' : 'ROLE_USER';
        const user = { username: res.username, email: res.email, role };
        this.currentUser.set(user);
        localStorage.setItem('adidev_user', JSON.stringify(user));
      })
    );
  }

  logout(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/logout`, {}, { responseType: 'text' as 'json', withCredentials: true }).pipe(
      tap(() => {
        this.currentUser.set(null);
        localStorage.removeItem('adidev_user');
      })
    );
  }
}
