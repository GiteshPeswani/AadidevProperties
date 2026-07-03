import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div class="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-lg space-y-8">
        <!-- Title -->
        <div class="text-center space-y-2">
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
          <p class="text-slate-500 text-sm">Welcome back! Sign in to access inquiries and profile dashboard.</p>
        </div>

        <form [formGroup]="loginForm" (submit)="onSubmit()" class="space-y-5 text-sm">
          <!-- Username -->
          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Username</label>
            <input type="text" formControlName="username" placeholder="admin"
                   class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
            <span *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="text-xs text-rose-500">
              Username is required.
            </span>
          </div>

          <!-- Password -->
          <div class="space-y-1">
            <div class="flex justify-between items-center">
              <label class="font-semibold text-slate-700">Password</label>
            </div>
            <input type="password" formControlName="password" placeholder="••••••••"
                   class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
            <span *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-xs text-rose-500">
              Password is required.
            </span>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || loading()"
                  class="w-full bg-[#0F172A] hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
            <span *ngIf="loading()">Signing In...</span>
            <span *ngIf="!loading()">Login</span>
          </button>
        </form>

        <div class="text-center text-sm text-slate-500 pt-2">
          Don't have an account? 
          <a routerLink="/register" class="text-amber-600 hover:text-amber-500 font-semibold transition-colors">
            Register Here
          </a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  loading = signal(false);
  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.toastService.success(`Welcome back, ${res.username}!`);
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
        this.loading.set(false);
      },
      error: (err) => {
        const errorMsg = err.error || 'Invalid credentials. Please verify your details.';
        this.toastService.error(errorMsg);
        this.loading.set(false);
      }
    });
  }
}
