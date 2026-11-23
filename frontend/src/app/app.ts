import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';
import { ToastComponent } from './shared/toast/toast';
import { BackendConnectingComponent } from './shared/backend-connecting/backend-connecting';
import { ClarityService } from './service/clarity.service';
import { BackendHealthService } from './service/backend-health.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    NavbarComponent, 
    FooterComponent, 
    ToastComponent,
    BackendConnectingComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  router = inject(Router);
  clarityService = inject(ClarityService);
  backendHealthService = inject(BackendHealthService);

  constructor() {
    this.clarityService.init();
    this.backendHealthService.init();
  }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
