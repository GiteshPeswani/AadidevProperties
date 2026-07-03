import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-40 bg-[#0F172A] text-white border-b border-slate-800/80 backdrop-blur-md transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a routerLink="/" class="flex items-center gap-2 group">
              <span class="text-2xl font-bold tracking-tight text-white group-hover:text-amber-500 transition-colors">
                Aadidev<span class="text-amber-500 font-light">Properties</span>
              </span>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <a routerLink="/" routerLinkActive="text-amber-500 font-semibold" [routerLinkActiveOptions]="{exact: true}"
               class="text-sm tracking-wide text-slate-300 hover:text-white transition-colors duration-200">
              Home
            </a>
            <a routerLink="/properties" routerLinkActive="text-amber-500 font-semibold"
               class="text-sm tracking-wide text-slate-300 hover:text-white transition-colors duration-200">
              Properties
            </a>
            <a routerLink="/about" routerLinkActive="text-amber-500 font-semibold"
               class="text-sm tracking-wide text-slate-300 hover:text-white transition-colors duration-200">
              About Us
            </a>
            <a routerLink="/contact" routerLinkActive="text-amber-500 font-semibold"
               class="text-sm tracking-wide text-slate-300 hover:text-white transition-colors duration-200">
              Contact
            </a>
            <a *ngIf="authService.isAdmin()" routerLink="/admin/dashboard" routerLinkActive="text-amber-500 font-semibold"
               class="text-sm font-semibold tracking-wide text-amber-400 hover:text-amber-300 transition-colors duration-200 flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-13.32 9-8.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              Admin Panel
            </a>
          </div>

          <!-- Auth Actions -->
          <div class="hidden md:flex items-center gap-4">
            <ng-container *ngIf="authService.isLoggedIn(); else guestTpl">
              <div class="relative group">
                <button class="flex items-center gap-2 bg-slate-800/85 hover:bg-slate-800 border border-slate-700/50 rounded-full py-1.5 px-4.5 text-sm font-medium transition-all">
                  <div class="w-6 h-6 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {{ authService.currentUser()?.username?.substring(0, 2) }}
                  </div>
                  <span class="max-w-[100px] truncate text-slate-200">{{ authService.currentUser()?.username }}</span>
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <!-- Dropdown Menu -->
                <div class="absolute right-0 mt-2 w-48 bg-[#0F172A] border border-slate-800 rounded-xl shadow-xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div class="px-4 py-2 border-b border-slate-800 text-xs text-slate-400 truncate">
                    {{ authService.currentUser()?.email }}
                  </div>
                  <a *ngIf="authService.isAdmin()" routerLink="/admin/profile" class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    Admin Profile
                  </a>
                  <button (click)="logout()" class="w-full text-left block px-4 py-2 text-sm text-rose-450 hover:bg-slate-800 hover:text-rose-450 transition-colors font-medium">
                    Logout
                  </button>
                </div>
              </div>
            </ng-container>

            <ng-template #guestTpl>
              <a routerLink="/login" class="text-sm font-medium hover:text-amber-400 transition-colors">
                Sign In
              </a>
              <a routerLink="/register" class="bg-blue-650 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-all shadow-md shadow-blue-900/10">
                Register
              </a>
            </ng-template>
          </div>

          <!-- Mobile menu button -->
          <div class="flex md:hidden">
            <button (click)="toggleMobileMenu()" class="text-slate-400 hover:text-white p-2 focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path *ngIf="!isMobileMenuOpen()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                <path *ngIf="isMobileMenuOpen()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="isMobileMenuOpen()" class="md:hidden border-t border-slate-850 bg-[#0F172A] px-4 pt-2 pb-6 space-y-2">
        <a routerLink="/" (click)="closeMobileMenu()" routerLinkActive="text-amber-500 font-semibold" [routerLinkActiveOptions]="{exact: true}"
           class="block px-3 py-2.5 rounded-lg hover:bg-slate-800 text-base text-slate-300 hover:text-white transition-colors">
          Home
        </a>
        <a routerLink="/properties" (click)="closeMobileMenu()" routerLinkActive="text-amber-500 font-semibold"
           class="block px-3 py-2.5 rounded-lg hover:bg-slate-800 text-base text-slate-300 hover:text-white transition-colors">
          Properties
        </a>
        <a routerLink="/about" (click)="closeMobileMenu()" routerLinkActive="text-amber-500 font-semibold"
           class="block px-3 py-2.5 rounded-lg hover:bg-slate-800 text-base text-slate-300 hover:text-white transition-colors">
          About Us
        </a>
        <a routerLink="/contact" (click)="closeMobileMenu()" routerLinkActive="text-amber-500 font-semibold"
           class="block px-3 py-2.5 rounded-lg hover:bg-slate-800 text-base text-slate-300 hover:text-white transition-colors">
          Contact
        </a>
        <a *ngIf="authService.isAdmin()" routerLink="/admin/dashboard" (click)="closeMobileMenu()" routerLinkActive="text-amber-500 font-semibold"
           class="block px-3 py-2.5 rounded-lg hover:bg-slate-800 text-base text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-13.32 9-8.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          Admin Panel
        </a>
        
        <div class="pt-4 border-t border-slate-800 flex flex-col gap-3">
          <ng-container *ngIf="authService.isLoggedIn(); else mobileGuestTpl">
            <div class="px-3 text-sm text-slate-400 truncate flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-450" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ authService.currentUser()?.username }}
            </div>
            <button (click)="logout(); closeMobileMenu()" class="w-full bg-rose-950/20 text-rose-450 border border-rose-900/30 hover:bg-rose-900/10 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors">
              Logout
            </button>
          </ng-container>
          <ng-template #mobileGuestTpl>
            <a routerLink="/login" (click)="closeMobileMenu()" class="block text-center border border-slate-800 py-2.5 px-3 rounded-lg text-sm text-slate-300 hover:bg-slate-850 transition-colors">
              Sign In
            </a>
            <a routerLink="/register" (click)="closeMobileMenu()" class="block text-center bg-blue-600 py-2.5 px-3 rounded-lg text-sm text-white hover:bg-blue-550 transition-colors font-medium">
              Register
            </a>
          </ng-template>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.success('Logged out successfully!');
        this.router.navigate(['/']);
      },
      error: () => {
        this.toastService.error('Error logging out. Please try again.');
      }
    });
  }
}
