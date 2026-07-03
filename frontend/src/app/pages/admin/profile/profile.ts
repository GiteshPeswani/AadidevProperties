import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">
      <!-- Title -->
      <div class="space-y-1.5 border-b border-slate-100 pb-5">
        <h2 class="text-xl font-bold text-slate-900">Administrator Profile Settings</h2>
        <p class="text-xs text-slate-400">View corporate credentials and local web-storage session details.</p>
      </div>

      <!-- User Card -->
      <div class="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
        <div class="w-16 h-16 rounded-full bg-slate-900 text-amber-500 border border-slate-800 flex items-center justify-center font-black text-2xl uppercase shadow-md">
          {{ authService.currentUser()?.username?.substring(0, 2) }}
        </div>
        <div>
          <h3 class="font-extrabold text-slate-900 text-lg uppercase tracking-wide">{{ authService.currentUser()?.username }}</h3>
          <p class="text-xs font-semibold text-amber-600 uppercase tracking-widest mt-0.5">Corporate Manager</p>
        </div>
      </div>

      <!-- Form list read-only -->
      <div class="space-y-4 text-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-slate-400 uppercase text-[10px]">Username ID</label>
            <p class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800">
              {{ authService.currentUser()?.username }}
            </p>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-slate-400 uppercase text-[10px]">Email Address</label>
            <p class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800">
              {{ authService.currentUser()?.email }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-slate-400 uppercase text-[10px]">Assigned Role</label>
            <p class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800">
              {{ authService.currentUser()?.role }}
            </p>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-slate-400 uppercase text-[10px]">Session Status</label>
            <p class="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl px-4 py-3 font-bold flex items-center gap-1.5">
              <span>Active Cookie Session</span>
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            </p>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 text-slate-400 text-xs leading-relaxed flex items-start gap-1.5">
        <svg class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span><strong>Security Note:</strong> Account properties and credentials are managed through Spring Security methods. To alter administrator login details or roles, contact the system databases administrator directly.</span>
      </div>
    </div>
  `
})
export class AdminProfileComponent {
  authService = inject(AuthService);
}
