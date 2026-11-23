import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendHealthService } from '../../service/backend-health.service';

@Component({
  selector: 'app-backend-connecting',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950 overflow-hidden select-none">
      <!-- Decorative background ambient lights -->
      <div class="absolute -top-32 -left-32 w-80 h-80 sm:w-96 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-950 to-slate-950"></div>

      <!-- Main Card -->
      <div class="relative w-full max-w-lg mx-auto dark-glass-card rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 text-center space-y-6 sm:space-y-8 animate-slide-up">
        
        <!-- Brand Tag -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Aadidev Properties
        </div>

        <!-- 1. CONNECTING & RETRYING STATE -->
        <ng-container *ngIf="healthService.isConnecting()">
          <!-- Animated Building Icon with Glow -->
          <div class="relative inline-flex items-center justify-center my-2">
            <div class="absolute inset-0 rounded-2xl bg-amber-500/20 animate-ping opacity-60"></div>
            <div class="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-xl shadow-amber-500/20 text-slate-950">
              <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          <!-- Titles -->
          <div class="space-y-2">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Connecting to Aadidev Properties
            </h1>
            <p class="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Waking up cloud server and initializing secure services. Live property listings will load automatically.
            </p>
          </div>

          <!-- Progress Bar & Status Details -->
          <div class="space-y-3 pt-2">
            <div class="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
              <div class="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 h-full rounded-full transition-all duration-500 ease-out"
                   [style.width.%]="healthService.progressPercent()">
              </div>
            </div>

            <div class="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
              <span class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ healthService.status() === 'retrying' ? 'Re-checking backend (every 5s)...' : 'Checking availability...' }}</span>
              </span>
              <span class="font-mono text-slate-300">
                {{ healthService.elapsedSeconds() }}s / 90s
              </span>
            </div>
          </div>
        </ng-container>

        <!-- 2. TIMEOUT / FAILED STATE (After 90 seconds) -->
        <ng-container *ngIf="healthService.isFailed()">
          <!-- Warning Icon -->
          <div class="relative inline-flex items-center justify-center my-2">
            <div class="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/10">
              <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <!-- Titles -->
          <div class="space-y-2">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Server Taking Longer Than Expected
            </h1>
            <p class="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Our backend cloud server did not respond within 90 seconds. It may still be finishing its boot sequence or undergoing brief maintenance.
            </p>
          </div>

          <!-- Manual Retry Button -->
          <div class="space-y-3 pt-2">
            <button (click)="healthService.retry()"
                    class="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer">
              <svg class="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Retry Connection</span>
            </button>

            <p class="text-xs text-slate-500">
              Check your network connection if retrying does not succeed.
            </p>
          </div>
        </ng-container>

      </div>
    </div>
  `
})
export class BackendConnectingComponent {
  readonly healthService = inject(BackendHealthService);
}
