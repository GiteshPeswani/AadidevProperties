import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-[#0F172A] text-slate-400 border-t border-slate-800/60 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <!-- Brand -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-xl font-extrabold tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Aadidev Properties
            </span>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed">
            Crafting custom luxury real estate experiences. We connect distinguished buyers with exclusive architectural masterpieces.
          </p>
          <div class="flex gap-4 pt-2">
            <!-- Social Icons -->
            <a href="https://www.facebook.com/share/1ECmevsS4K/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
            </a>
            <a href="https://www.instagram.com/aadidevproperties/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul class="space-y-3.5 text-sm">
            <li>
              <a routerLink="/" class="hover:text-amber-500 transition-colors">Home</a>
            </li>
            <li>
              <a routerLink="/properties" class="hover:text-amber-500 transition-colors">Properties</a>
            </li>
            <li>
              <a routerLink="/about" class="hover:text-amber-500 transition-colors">About Us</a>
            </li>
            <li>
              <a routerLink="/contact" class="hover:text-amber-500 transition-colors">Contact</a>
            </li>
          </ul>
        </div>

        <!-- Property Types -->
        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Property Types</h4>
          <ul class="space-y-3.5 text-sm">
            <li>
              <a [routerLink]="['/properties']" [queryParams]="{propertyType: 'APARTMENT'}" class="hover:text-amber-500 transition-colors">Luxury Apartments</a>
            </li>
            <li>
              <a [routerLink]="['/properties']" [queryParams]="{propertyType: 'VILLA'}" class="hover:text-amber-500 transition-colors">Exclusive Villas</a>
            </li>
            <li>
              <a [routerLink]="['/properties']" [queryParams]="{propertyType: 'COMMERCIAL'}" class="hover:text-amber-500 transition-colors">Commercial Hubs</a>
            </li>
            <li>
              <a [routerLink]="['/properties']" [queryParams]="{propertyType: 'PLOT'}" class="hover:text-amber-500 transition-colors">Premium Plots</a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="space-y-3 text-sm">
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Get In Touch</h4>
          <p class="flex items-start gap-2.5">
            <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span>Madhav Srishti Umapati, Opp. Madhav Srishti Gate 3, Shop No. 9, Godrej Hill Road, Khadakpada, Kalyan West</span>
          </p>
          <p class="flex items-center gap-2.5">
            <svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <a href="tel:+919822890024" class="hover:text-white transition-colors">+91 98228 90024</a>
          </p>
          <p class="flex items-center gap-2.5">
            <svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <a href="mailto:deepakpeswani666@gmail.com" class="hover:text-white transition-colors">deepakpeswani666&#64;gmail.com</a>
          </p>
        </div>
      </div>

      <!-- Copyright -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/40 text-center text-xs">
        <p>&copy; {{ currentYear }} Aadidev Properties. All rights reserved.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
