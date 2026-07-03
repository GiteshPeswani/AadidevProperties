import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { ToastService } from '../../../service/toast.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Desktop Sidebar -->
      <aside class="w-64 bg-[#0F172A] text-slate-300 hidden md:flex flex-col justify-between border-r border-slate-800">
        <div class="p-6 space-y-8">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <span class="text-xl font-black bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Aadidev
            </span>
            <span class="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold">Admin</span>
          </div>

          <!-- Navigation Links -->
          <nav class="space-y-1.5 flex flex-col text-sm">
            <a routerLink="/admin/dashboard" routerLinkActive="bg-slate-800 text-white font-semibold"
               class="px-4 py-3 rounded-xl hover:bg-slate-800/60 hover:text-white transition-all flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path></svg>
              <span>Dashboard</span>
            </a>
            <a routerLink="/admin/properties" routerLinkActive="bg-slate-800 text-white font-semibold"
               class="px-4 py-3 rounded-xl hover:bg-slate-800/60 hover:text-white transition-all flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              <span>Properties</span>
            </a>
            <a routerLink="/admin/inquiries" routerLinkActive="bg-slate-800 text-white font-semibold"
               class="px-4 py-3 rounded-xl hover:bg-slate-800/60 hover:text-white transition-all flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <span>Inquiries Leads</span>
            </a>
            <a routerLink="/admin/profile" routerLinkActive="bg-slate-800 text-white font-semibold"
               class="px-4 py-3 rounded-xl hover:bg-slate-800/60 hover:text-white transition-all flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span>Settings Profile</span>
            </a>
          </nav>
        </div>

        <!-- Footer / Back to site & Logout -->
        <div class="p-6 border-t border-slate-800 space-y-3.5 text-xs">
          <a routerLink="/" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span>View Public Website</span>
          </a>
          <button (click)="logout()" class="w-full text-left flex items-center gap-2 text-rose-400 hover:text-rose-300 font-semibold focus:outline-none">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      <!-- Main Panel Wrapper -->
      <div class="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <!-- Header -->
        <header class="bg-white border-b border-slate-100 h-20 flex items-center justify-between px-6 md:px-8">
          <div class="flex items-center gap-3">
            <button (click)="toggleMobileDrawer()" class="md:hidden text-slate-600 focus:outline-none flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h2 class="text-lg font-bold text-slate-900 hidden md:block">Real Estate Control Panel</h2>
          </div>

          <div class="flex items-center gap-3.5">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-bold text-slate-955">{{ authService.currentUser()?.username }}</p>
              <p class="text-xs text-amber-600 font-semibold tracking-wider uppercase">Administrator</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-900 text-amber-500 font-black flex items-center justify-center border border-slate-800 shadow-sm uppercase">
              {{ authService.currentUser()?.username?.substring(0, 2) }}
            </div>
          </div>
        </header>

        <!-- Mobile Drawer Menu -->
        <div *ngIf="isMobileDrawerOpen()" (click)="toggleMobileDrawer()" class="md:hidden fixed inset-0 bg-slate-955/40 backdrop-blur-sm z-50"></div>
        <aside *ngIf="isMobileDrawerOpen()" class="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between p-6 z-50 animate-slide-right">
          <div class="space-y-8">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg font-black text-amber-500">Aadidev</span>
                <span class="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Admin</span>
              </div>
              <button (click)="toggleMobileDrawer()" class="text-slate-400 focus:outline-none flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <nav class="space-y-1.5 flex flex-col text-sm">
              <a routerLink="/admin/dashboard" routerLinkActive="bg-slate-800 text-white font-semibold" (click)="toggleMobileDrawer()"
                 class="px-4 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path></svg>
                <span>Dashboard</span>
              </a>
              <a routerLink="/admin/properties" routerLinkActive="bg-slate-800 text-white font-semibold" (click)="toggleMobileDrawer()"
                 class="px-4 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                <span>Properties</span>
              </a>
              <a routerLink="/admin/inquiries" routerLinkActive="bg-slate-800 text-white font-semibold" (click)="toggleMobileDrawer()"
                 class="px-4 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>Inquiries Leads</span>
              </a>
              <a routerLink="/admin/profile" routerLinkActive="bg-slate-800 text-white font-semibold" (click)="toggleMobileDrawer()"
                 class="px-4 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span>Settings Profile</span>
              </a>
            </nav>
          </div>

          <div class="border-t border-slate-800 pt-4 space-y-4 text-xs">
            <a routerLink="/" (click)="toggleMobileDrawer()" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span>View Public Website</span>
            </a>
            <button (click)="logout(); toggleMobileDrawer()" class="w-full text-left flex items-center gap-2 text-rose-400 hover:text-rose-300 font-semibold focus:outline-none">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span>Logout Session</span>
            </button>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 p-6 md:p-8 min-w-0">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideRight {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    .animate-slide-right {
      animation: slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  isMobileDrawerOpen = signal(false);

  toggleMobileDrawer() {
    this.isMobileDrawerOpen.update(val => !val);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.success('Logged out successfully from Admin Panel.');
        this.router.navigate(['/']);
      },
      error: () => {
        this.toastService.error('Error logging out. Try again.');
      }
    });
  }
}
