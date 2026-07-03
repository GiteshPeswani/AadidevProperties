import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div class="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-lg space-y-8">
        <!-- Title -->
        <div class="text-center space-y-2">
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p class="text-slate-500 text-sm">Register to begin browsing, inquiring, and managing properties.</p>
        </div>

        <form [formGroup]="registerForm" (submit)="onSubmit()" class="space-y-5 text-sm">
          <!-- Username -->
          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Username</label>
            <input type="text" formControlName="username" placeholder="john_doe"
                   class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
            <span *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="text-xs text-rose-500">
              Username is required (min 3 chars).
            </span>
          </div>

          <!-- Email -->
          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Email Address</label>
            <input type="email" formControlName="email" placeholder="john@example.com"
                   class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
            <span *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="text-xs text-rose-500">
              A valid email is required.
            </span>
          </div>

          <!-- Password -->
          <div class="space-y-1">
            <label class="font-semibold text-slate-700">Password</label>
            <input type="password" formControlName="password" placeholder="••••••••"
                   class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
            <span *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-xs text-rose-500">
              Password is required (min 6 chars).
            </span>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || loading()"
                  class="w-full bg-[#0F172A] hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
            <span *ngIf="loading()">Creating Account...</span>
            <span *ngIf="!loading()">Register</span>
          </button>
        </form>

        <div class="text-center text-sm text-slate-500 pt-2">
          Already have an account? 
          <a routerLink="/login" class="text-amber-600 hover:text-amber-500 font-semibold transition-colors">
            Sign In
          </a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  loading = signal(false);
  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading.set(true);
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.toastService.success(`Registration successful! Welcome, ${res.username}.`);
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
        this.loading.set(false);
      },
      error: (err) => {
        const errorMsg = err.error || 'Registration failed. Try a different username/email.';
        this.toastService.error(errorMsg);
        this.loading.set(false);
      }
    });
  }
}
