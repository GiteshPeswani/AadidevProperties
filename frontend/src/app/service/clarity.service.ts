import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClarityService {
  private isLoaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  init(): void {
    // 1. Ensure this only runs on the client browser (safe for SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // 2. Ensure script is only loaded in production
    if (!environment.production) {
      console.log('[ClarityService] Non-production environment. Clarity tracking is disabled.');
      return;
    }

    const projectId = environment.clarityProjectId;
    if (!projectId) {
      console.warn('[ClarityService] Clarity Project ID is missing. Clarity tracking is disabled.');
      return;
    }

    // 3. Ensure script is loaded only once
    if (this.isLoaded || (window as any).clarity) {
      return;
    }

    try {
      this.isLoaded = true;

      // Inject the Clarity snippet exactly as provided
      (function(c: any, l: Document, a: string, r: string, i: string, t?: any, y?: any) {
        c[a] = c[a] || function() {
          (c[a].q = c[a].q || []).push(arguments);
        };
        t = l.createElement(r);
        t.async = 1;
        t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0];
        if (y && y.parentNode) {
          y.parentNode.insertBefore(t, y);
        }
      })(window, document, 'clarity', 'script', projectId);

      console.log(`[ClarityService] Microsoft Clarity successfully initialized with Project ID: ${projectId}`);
    } catch (e) {
      console.error('[ClarityService] Failed to load Microsoft Clarity script:', e);
    }
  }
}
