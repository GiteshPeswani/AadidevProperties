import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
      <!-- Image Placeholder -->
      <div class="h-64 bg-slate-200 w-full"></div>
      
      <!-- Content Placeholder -->
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div class="h-4 bg-slate-200 rounded w-1/3"></div>
          <div class="h-6 bg-slate-200 rounded w-1/4"></div>
        </div>
        
        <div class="h-6 bg-slate-200 rounded w-3/4"></div>
        <div class="h-4 bg-slate-200 rounded w-1/2"></div>
        
        <!-- Specs -->
        <div class="flex gap-4 pt-2">
          <div class="h-4 bg-slate-200 rounded w-1/4"></div>
          <div class="h-4 bg-slate-200 rounded w-1/4"></div>
          <div class="h-4 bg-slate-200 rounded w-1/4"></div>
        </div>
        
        <!-- Action Button -->
        <div class="pt-4 border-t border-slate-100">
          <div class="h-10 bg-slate-200 rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  `
})
export class SkeletonComponent {}
