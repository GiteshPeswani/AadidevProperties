import { Routes } from '@angular/router';
import { adminGuard } from './guard/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'properties',
    loadComponent: () => import('./pages/properties/properties').then(m => m.PropertiesComponent)
  },
  {
    path: 'properties/:id',
    loadComponent: () => import('./pages/property-details/property-details').then(m => m.PropertyDetailsComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'properties',
        loadComponent: () => import('./pages/admin/properties/admin-properties').then(m => m.AdminPropertiesComponent)
      },
      {
        path: 'inquiries',
        loadComponent: () => import('./pages/admin/inquiries/admin-inquiries').then(m => m.AdminInquiriesComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/admin/profile/profile').then(m => m.AdminProfileComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundComponent)
  }
];
