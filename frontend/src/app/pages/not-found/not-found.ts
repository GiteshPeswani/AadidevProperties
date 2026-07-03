import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-slate-50 text-center">
      <div class="max-w-md w-full space-y-6">
        <h1 class="text-9xl font-extrabold text-[#0F172A] tracking-widest">
          404
        </h1>
        <div class="bg-amber-500 text-slate-950 px-2 py-1 text-sm font-semibold uppercase tracking-widest rounded rotate-12 inline-block">
          Page Not Found
        </div>
        <p class="text-slate-500 text-lg">
          The luxury property or page you are looking for does not exist or has been relocated to another domain.
        </p>
        <div class="pt-4">
          <a routerLink="/" class="inline-block bg-[#0F172A] hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-md">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
