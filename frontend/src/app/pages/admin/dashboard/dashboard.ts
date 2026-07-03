import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../service/dashboard.service';
import { ToastService } from '../../../service/toast.service';
import { DashboardStats } from '../../../model/dashboard.model';
import { PropertyStatus, PropertyType } from '../../../model/property.model';
import { InquiryStatus } from '../../../model/inquiry.model';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-10">
      <!-- Title -->
      <div class="space-y-1">
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p class="text-slate-500 text-sm">Real-time statistics, lead channels, and property distributions.</p>
      </div>

      <!-- Loading Placeholder -->
      <div *ngIf="loading()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        <div *ngFor="let i of [1,2,3,4]" class="bg-white rounded-2xl p-6 h-28 border border-slate-100"></div>
      </div>

      <!-- Dashboard Stats -->
      <ng-container *ngIf="!loading() && stats()">
        <!-- Stats Counter Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Properties -->
          <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
            <div class="space-y-1.5">
              <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Properties</span>
              <p class="text-3xl font-extrabold text-slate-900">{{ stats()?.totalProperties }}</p>
            </div>
            <div class="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
          </div>

          <!-- Featured Properties -->
          <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
            <div class="space-y-1.5">
              <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Featured Listings</span>
              <p class="text-3xl font-extrabold text-slate-900">{{ stats()?.featuredProperties }}</p>
            </div>
            <div class="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
          </div>

          <!-- Total Inquiries Leads -->
          <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
            <div class="space-y-1.5">
              <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Leads</span>
              <p class="text-3xl font-extrabold text-slate-900">{{ stats()?.totalInquiries }}</p>
            </div>
            <div class="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-105 transition-transform flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
          </div>

          <!-- Closed Leads -->
          <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
            <div class="space-y-1.5">
              <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Closed Deals</span>
              <p class="text-3xl font-extrabold text-slate-900">{{ stats()?.closedInquiries }}</p>
            </div>
            <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
        </div>

        <!-- Analytical Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Leads Channels SVG Column Chart -->
          <div class="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-slate-900 text-base">Inquiry status channel</h3>
              <p class="text-xs text-slate-400">Total volume of customer leads grouped by pipeline stage.</p>
            </div>

            <!-- SVG Chart -->
            <div class="h-64 flex items-end justify-between px-4 border-b border-slate-100 pb-4 pt-10">
              <div *ngFor="let col of chartColumns()" class="flex flex-col items-center gap-3 w-16 group relative">
                <!-- Tooltip -->
                <span class="absolute -top-8 bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {{ col.value }}
                </span>
                <!-- Bar representation -->
                <div [style.height.px]="col.height"
                     [ngClass]="col.color"
                     class="w-full rounded-t-lg transition-all duration-500 hover:opacity-90"></div>
                <!-- Label -->
                <span class="text-[10px] text-slate-500 font-bold uppercase text-center line-clamp-1 w-full">{{ col.label.replace('_', ' ') }}</span>
              </div>
            </div>
            
            <!-- Stage detail summaries -->
            <div class="grid grid-cols-4 gap-4 text-center text-xs">
              <div class="space-y-1">
                <p class="text-slate-400 font-semibold">New</p>
                <p class="font-bold text-slate-900">{{ stats()?.newInquiries }}</p>
              </div>
              <div class="space-y-1 border-l border-slate-100">
                <p class="text-slate-400 font-semibold">Contacted</p>
                <p class="font-bold text-slate-900">{{ stats()?.contactedInquiries }}</p>
              </div>
              <div class="space-y-1 border-l border-slate-100">
                <p class="text-slate-400 font-semibold">Visits</p>
                <p class="font-bold text-slate-900">{{ stats()?.scheduledVisits }}</p>
              </div>
              <div class="space-y-1 border-l border-slate-100">
                <p class="text-slate-400 font-semibold">Closed</p>
                <p class="font-bold text-slate-900">{{ stats()?.closedInquiries }}</p>
              </div>
            </div>
          </div>

          <!-- Property Distribution -->
          <div class="lg:col-span-1 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div class="space-y-1">
              <h3 class="font-bold text-slate-900 text-base">Property Status Distribution</h3>
              <p class="text-xs text-slate-400">Comparing active listings status types.</p>
            </div>

            <!-- Custom visual counters list -->
            <div class="space-y-5 py-6">
              <!-- Sale -->
              <div class="space-y-1.5 text-sm">
                <div class="flex justify-between font-medium">
                  <span class="text-slate-700">For Sale</span>
                  <span class="font-bold text-slate-900">{{ stats()?.totalProperties! - stats()?.soldProperties! - stats()?.rentProperties! }}</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-blue-600 h-full rounded-full" [style.width.%]="getPercent(stats()!.totalProperties! - stats()!.soldProperties! - stats()!.rentProperties!)"></div>
                </div>
              </div>

              <!-- Rent -->
              <div class="space-y-1.5 text-sm">
                <div class="flex justify-between font-medium">
                  <span class="text-slate-700">For Rent</span>
                  <span class="font-bold text-slate-900">{{ stats()?.rentProperties }}</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-amber-500 h-full rounded-full" [style.width.%]="getPercent(stats()!.rentProperties)"></div>
                </div>
              </div>

              <!-- Sold -->
              <div class="space-y-1.5 text-sm">
                <div class="flex justify-between font-medium">
                  <span class="text-slate-700">Sold Out</span>
                  <span class="font-bold text-slate-900">{{ stats()?.soldProperties }}</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-slate-400 h-full rounded-full" [style.width.%]="getPercent(stats()!.soldProperties)"></div>
                </div>
              </div>
            </div>

            <!-- Footer indicator -->
            <div class="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
              <span>Total Catalog:</span>
              <span class="text-slate-900 font-black text-sm">{{ stats()?.totalProperties }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity Logs Lists -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Recent Properties -->
          <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-slate-900 text-base">Recent Added Properties</h3>
              <a routerLink="/admin/properties" class="text-xs text-amber-600 hover:text-amber-500 font-semibold">View All</a>
            </div>

            <div class="divide-y divide-slate-100 text-sm">
              <div *ngFor="let prop of stats()?.recentProperties" class="py-3 flex justify-between items-center first:pt-0 last:pb-0 gap-4">
                <div class="min-w-0">
                  <p class="font-bold text-slate-900 truncate">{{ prop.title }}</p>
                  <p class="text-xs text-slate-400 flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-slate-455 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>{{ prop.location }} &bull; {{ prop.propertyType }}</span>
                  </p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="font-black text-slate-955">₹{{ prop.price | number }}</p>
                  <p class="text-[10px] text-slate-400">{{ prop.createdAt | date:'shortDate' }}</p>
                </div>
              </div>
              <div *ngIf="stats()?.recentProperties?.length === 0" class="text-center py-6 text-slate-400">
                No recent properties.
              </div>
            </div>
          </div>

          <!-- Recent Inquiries -->
          <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-slate-900 text-base">Recent Inquiries Leads</h3>
              <a routerLink="/admin/inquiries" class="text-xs text-amber-600 hover:text-amber-500 font-semibold">View All</a>
            </div>

            <div class="divide-y divide-slate-100 text-sm">
              <div *ngFor="let inquiry of stats()?.recentInquiries" class="py-3 flex justify-between items-center first:pt-0 last:pb-0 gap-4">
                <div class="min-w-0">
                  <p class="font-bold text-slate-900 truncate">{{ inquiry.name }}</p>
                  <p class="text-xs text-slate-400 truncate flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span>{{ inquiry.phoneNumber }} &bull; Prop: {{ inquiry.propertyTitle }}</span>
                  </p>
                </div>
                <div class="text-right flex-shrink-0">
                  <span [ngClass]="{
                          'bg-emerald-50 text-emerald-700 border-emerald-100': inquiry.status === InquiryStatus.CLOSED,
                          'bg-purple-50 text-purple-700 border-purple-100': inquiry.status === InquiryStatus.VISIT_SCHEDULED,
                          'bg-blue-50 text-blue-700 border-blue-100': inquiry.status === InquiryStatus.CONTACTED,
                          'bg-rose-50 text-rose-700 border-rose-100': inquiry.status === InquiryStatus.NEW
                        }"
                        class="border text-[10px] font-bold py-0.5 px-2 rounded-full uppercase tracking-wider">
                    {{ inquiry.status.replace('_', ' ') }}
                  </span>
                  <p class="text-[10px] text-slate-400 mt-1">{{ inquiry.createdAt | date:'shortDate' }}</p>
                </div>
              </div>
              <div *ngIf="stats()?.recentInquiries?.length === 0" class="text-center py-6 text-slate-400">
                No recent inquiries.
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- Error / Mismatch State -->
      <div *ngIf="!loading() && !stats()" class="bg-white border border-slate-100 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-sm">
        <div class="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v-2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-bold text-slate-900">Access Denied / Connection Mismatch</h2>
          <p class="text-slate-500 text-sm leading-relaxed">
            The frontend has assigned you <strong>ADMINISTRATOR</strong> status, but the Spring Boot backend database has not confirmed this role for username <strong>{{ authService.currentUser()?.username }}</strong>.
          </p>
        </div>

        <div class="bg-slate-55 border border-slate-100 rounded-2xl p-5 text-left text-xs space-y-3 font-mono text-slate-700">
          <p class="font-bold text-slate-900">How to fix this issue:</p>
          <ol class="list-decimal list-inside space-y-1.5 leading-relaxed">
            <li>Open your MySQL client tool (MySQL CLI, Workbench, phpMyAdmin, or DBeaver).</li>
            <li>Connect to database: <code class="bg-slate-200 px-1 rounded">aadidevbackend</code></li>
            <li>Execute the following SQL query:
              <pre class="bg-slate-950 text-amber-500 p-3 rounded-lg mt-2 overflow-x-auto">UPDATE users SET role = 'ROLE_ADMIN' WHERE username = '{{ authService.currentUser()?.username }}';</pre>
            </li>
            <li>Log out from the dashboard, sign in again, and the stats will load correctly.</li>
          </ol>
        </div>

        <button (click)="fetchStats()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md text-sm">
          🔄 Retry Connection
        </button>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  dashboardService = inject(DashboardService);
  toastService = inject(ToastService);
  authService = inject(AuthService);

  InquiryStatus = InquiryStatus;
  PropertyStatus = PropertyStatus;

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);

  // SVG Chart data columns
  chartColumns = signal<Array<{ label: string; value: number; height: number; color: string }>>([]);
  private pollIntervalId: any;

  ngOnInit() {
    this.fetchStats();
    // Poll for new dashboard stats every 10 seconds so they update in real-time
    this.pollIntervalId = setInterval(() => {
      this.fetchStatsSilent();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
    }
  }

  fetchStats() {
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.buildChartColumns(data);
        this.loading.set(false);
      },
      error: () => {
        this.toastService.error('Failed to load dashboard statistics.');
        this.loading.set(false);
      }
    });
  }

  fetchStatsSilent() {
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.buildChartColumns(data);
      }
    });
  }

  buildChartColumns(data: DashboardStats) {
    const vals = [
      { label: 'New', value: data.newInquiries, color: 'bg-rose-500' },
      { label: 'Contacted', value: data.contactedInquiries, color: 'bg-blue-500' },
      { label: 'Visit Sched', value: data.scheduledVisits, color: 'bg-purple-500' },
      { label: 'Closed Stage', value: data.closedInquiries, color: 'bg-emerald-500' }
    ];

    const maxVal = Math.max(...vals.map(v => v.value), 1);
    const columns = vals.map(v => ({
      ...v,
      height: Math.round((v.value / maxVal) * 180) + 15 // min height 15px so it registers visually
    }));

    this.chartColumns.set(columns);
  }

  getPercent(val: number): number {
    const total = this.stats()?.totalProperties || 1;
    return Math.round((val / total) * 100);
  }
}
