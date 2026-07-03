import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-24 right-4 z-50 flex flex-col gap-3 w-80 max-w-full pointer-events-none">
      <div *ngFor="let toast of toastService.toasts()" 
           [ngClass]="{
             'bg-emerald-50 text-emerald-900 border-emerald-200': toast.type === 'success',
             'bg-rose-50 text-rose-900 border-rose-200': toast.type === 'error',
             'bg-amber-50 text-amber-900 border-amber-200': toast.type === 'warning',
             'bg-blue-50 text-blue-900 border-blue-200': toast.type === 'info'
           }"
           class="pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-slide-in">
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <span class="text-xl">
            <span *ngIf="toast.type === 'success'">✅</span>
            <span *ngIf="toast.type === 'error'">❌</span>
            <span *ngIf="toast.type === 'warning'">⚠️</span>
            <span *ngIf="toast.type === 'info'">ℹ️</span>
          </span>
          <p class="text-sm font-medium">{{ toast.message }}</p>
        </div>
        <button (click)="toastService.remove(toast.id)" class="text-slate-400 hover:text-slate-600 transition-colors ml-4 focus:outline-none">
          ✕
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
