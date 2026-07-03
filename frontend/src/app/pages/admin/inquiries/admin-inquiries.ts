import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InquiryService } from '../../../service/inquiry.service';
import { ToastService } from '../../../service/toast.service';
import { InquiryResponse, InquiryStatus } from '../../../model/inquiry.model';

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      <!-- Header Title -->
      <div class="space-y-1">
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Inquiries Leads</h1>
        <p class="text-slate-500 text-sm">Manage, update pipeline status, or clear records for leads.</p>
      </div>

      <!-- Inquiries Log Table -->
      <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <!-- Search bar & filters -->
        <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input type="text" [(ngModel)]="searchQuery" (input)="filterInquiries()" placeholder="Search inquiries by client name, email, phone..."
                 class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm max-w-md w-full focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
          
          <div class="flex items-center gap-2 text-sm">
            <span class="text-slate-400">Filter Status:</span>
            <select [(ngModel)]="selectedStatus" (change)="filterInquiries()"
                    class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-slate-700">
              <option value="ALL">All Stage</option>
              <option [value]="InquiryStatus.NEW">New</option>
              <option [value]="InquiryStatus.CONTACTED">Contacted</option>
              <option [value]="InquiryStatus.VISIT_SCHEDULED">Visit Scheduled</option>
              <option [value]="InquiryStatus.CLOSED">Closed</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th class="p-5">Client</th>
                <th class="p-5">Message</th>
                <th class="p-5">Property Ref</th>
                <th class="p-5">Created On</th>
                <th class="p-5">Pipeline Status</th>
                <th class="p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-600">
              <tr *ngFor="let inquiry of filteredInquiries()" class="hover:bg-slate-50/60 transition-colors">
                <!-- User details -->
                <td class="p-5">
                  <div class="font-bold text-slate-900">{{ inquiry.name }}</div>
                  <div class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <span>{{ inquiry.email }}</span>
                  </div>
                  <div class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span>{{ inquiry.phoneNumber }}</span>
                  </div>
                </td>
                
                <!-- Inquiry text -->
                <td class="p-5 max-w-xs">
                  <p class="line-clamp-3 text-slate-600 italic leading-relaxed">
                    "{{ inquiry.message }}"
                  </p>
                </td>

                <!-- Property title link -->
                <td class="p-5 font-semibold text-slate-800">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span>{{ inquiry.propertyTitle }}</span>
                  </div>
                </td>

                <!-- Created Date -->
                <td class="p-5 text-xs text-slate-400">
                  {{ inquiry.createdAt | date:'medium' }}
                </td>

                <!-- Pipeline Status dropdown -->
                <td class="p-5">
                  <select [ngModel]="inquiry.status" (change)="changeStatus(inquiry.id, $event)"
                          [ngClass]="{
                            'bg-rose-50 text-rose-700 border-rose-200': inquiry.status === InquiryStatus.NEW,
                            'bg-blue-50 text-blue-700 border-blue-200': inquiry.status === InquiryStatus.CONTACTED,
                            'bg-purple-50 text-purple-700 border-purple-200': inquiry.status === InquiryStatus.VISIT_SCHEDULED,
                            'bg-emerald-50 text-emerald-700 border-emerald-200': inquiry.status === InquiryStatus.CLOSED
                          }"
                          class="border text-xs font-bold py-1.5 px-3 rounded-xl focus:outline-none">
                    <option [value]="InquiryStatus.NEW">New</option>
                    <option [value]="InquiryStatus.CONTACTED">Contacted</option>
                    <option [value]="InquiryStatus.VISIT_SCHEDULED">Visit Scheduled</option>
                    <option [value]="InquiryStatus.CLOSED">Closed</option>
                  </select>
                </td>

                <!-- Delete inquiry -->
                <td class="p-5 text-right">
                  <button (click)="deleteInquiry(inquiry.id)" title="Purge Inquiry"
                          class="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors focus:outline-none inline-flex items-center justify-center">
                    <svg class="w-4 h-4 text-rose-650" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredInquiries().length === 0" class="text-center text-slate-400">
                <td colspan="6" class="p-10">No inquiries match your current search/filter metrics.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminInquiriesComponent implements OnInit, OnDestroy {
  inquiryService = inject(InquiryService);
  toastService = inject(ToastService);

  InquiryStatus = InquiryStatus;

  allInquiries = signal<InquiryResponse[]>([]);
  filteredInquiries = signal<InquiryResponse[]>([]);

  searchQuery = '';
  selectedStatus = 'ALL';
  private pollIntervalId: any;

  ngOnInit() {
    this.fetchInquiries();
    // Poll for new inquiries every 10 seconds so they appear in real-time
    this.pollIntervalId = setInterval(() => {
      this.fetchInquiriesSilent();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
    }
  }

  fetchInquiries() {
    this.inquiryService.getAllInquiries().subscribe({
      next: (list) => {
        this.allInquiries.set(list);
        this.filterInquiries();
      },
      error: () => {
        this.toastService.error('Failed to load inquiries list from database.');
      }
    });
  }

  fetchInquiriesSilent() {
    this.inquiryService.getAllInquiries().subscribe({
      next: (list) => {
        this.allInquiries.set(list);
        this.filterInquiries();
      }
    });
  }

  filterInquiries() {
    let list = this.allInquiries();
    
    // Status Filter
    if (this.selectedStatus !== 'ALL') {
      list = list.filter(inq => inq.status === this.selectedStatus);
    }

    // Text Search
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(inq => 
        inq.name.toLowerCase().includes(q) || 
        inq.email.toLowerCase().includes(q) || 
        inq.phoneNumber.includes(q) ||
        inq.propertyTitle.toLowerCase().includes(q)
      );
    }

    this.filteredInquiries.set(list);
  }

  changeStatus(id: number, event: any) {
    const nextStatus = event.target.value as InquiryStatus;
    this.inquiryService.updateInquiryStatus(id, nextStatus).subscribe({
      next: () => {
        this.toastService.success('Lead status updated successfully.');
        this.fetchInquiries();
      },
      error: () => {
        this.toastService.error('Failed to update lead status on server.');
      }
    });
  }

  deleteInquiry(id: number) {
    if (confirm('Are you sure you want to permanently delete this customer lead inquiry?')) {
      this.inquiryService.deleteInquiry(id).subscribe({
        next: () => {
          this.toastService.success('Inquiry record deleted.');
          this.fetchInquiries();
        },
        error: () => {
          this.toastService.error('Error purging inquiry record.');
        }
      });
    }
  }
}
