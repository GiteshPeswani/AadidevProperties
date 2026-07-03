import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '../../service/property.service';
import { InquiryService } from '../../service/inquiry.service';
import { ToastService } from '../../service/toast.service';
import { PropertyResponse, PropertyType, PropertyStatus, ImageResponse } from '../../model/property.model';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      <!-- Loading State -->
      <div *ngIf="loading()" class="space-y-6 animate-pulse">
        <div class="h-8 bg-slate-200 rounded w-1/3"></div>
        <div class="h-[50vh] bg-slate-200 rounded-2xl w-full"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            <div class="h-6 bg-slate-200 rounded w-full"></div>
            <div class="h-4 bg-slate-200 rounded w-5/6"></div>
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
          <div class="bg-slate-200 rounded-2xl h-80"></div>
        </div>
      </div>

      <!-- Main Content -->
      <ng-container *ngIf="!loading() && property()">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-2">
            <!-- Breadcrumbs -->
            <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <a routerLink="/" class="hover:text-slate-600">Home</a>
              <span>/</span>
              <a routerLink="/properties" class="hover:text-slate-600">Properties</a>
              <span>/</span>
              <span class="text-slate-600">{{ property()?.title }}</span>
            </div>
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ property()?.title }}</h1>
            <p class="text-slate-500 text-sm flex items-center gap-1.5">
              <svg class="w-4 h-4 text-slate-450 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {{ property()?.location }}
            </p>
          </div>

          <div class="flex flex-col items-end gap-1.5 self-start md:self-auto">
            <span [ngClass]="{
                    'bg-emerald-500': property()?.status === PropertyStatus.FOR_SALE,
                    'bg-blue-500': property()?.status === PropertyStatus.FOR_RENT,
                    'bg-slate-500': property()?.status === PropertyStatus.SOLD
                  }"
                  class="text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4.5 rounded-full shadow-sm">
              {{ property()?.status?.replace('_', ' ') }}
            </span>
            <span class="text-3xl font-black text-[#0F172A]">
              ₹{{ property()?.price | number:'1.0-0' }}
            </span>
          </div>
        </div>

        <!-- Image Carousel -->
        <div class="relative bg-slate-950 rounded-3xl overflow-hidden h-[55vh] shadow-lg group">
          <ng-container *ngIf="images().length > 0; else noImagesTpl">
            <img [src]="propertyService.getImageUrl(images()[activeImageIndex()].id)" 
                 [alt]="property()?.title"
                 class="w-full h-full object-contain transition-opacity duration-300">
            
            <!-- Slides Controls -->
            <button *ngIf="images().length > 1" (click)="prevImage()"
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button *ngIf="images().length > 1" (click)="nextImage()"
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>

            <!-- Dots -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <span *ngFor="let img of images(); let idx = index" 
                    (click)="activeImageIndex.set(idx)"
                    [ngClass]="activeImageIndex() === idx ? 'bg-amber-500 w-6' : 'bg-white/60 hover:bg-white w-2'"
                    class="h-2 rounded-full cursor-pointer transition-all duration-300"></span>
            </div>
          </ng-container>

          <ng-template #noImagesTpl>
            <img [src]="getFallbackImage(property()!.propertyType)" 
                 [alt]="property()?.title"
                 class="w-full h-full object-cover">
          </ng-template>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Description & Amenities -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Specification Cards -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div class="text-center space-y-1">
                <span class="text-slate-400 text-xs font-semibold uppercase">Bedrooms</span>
                <p class="text-lg font-bold text-slate-900 flex items-center justify-center gap-1.5">
                  <span>{{ property()?.bedrooms ?? 0 > 0 ? property()?.bedrooms : 'N/A' }}</span>
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10V6a2 2 0 012-2h14a2 2 0 012 2v4M3 10v9a1 1 0 001 1h16a1 1 0 001-1v-9M3 10h18M7 14h10"></path></svg>
                </p>
              </div>
              <div class="text-center space-y-1 border-l border-slate-100">
                <span class="text-slate-400 text-xs font-semibold uppercase">Bathrooms</span>
                <p class="text-lg font-bold text-slate-900 flex items-center justify-center gap-1.5">
                  <span>{{ property()?.bathrooms ?? 0 > 0 ? property()?.bathrooms : 'N/A' }}</span>
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 10V5a2 2 0 012-2h12a2 2 0 012 2v5M2 10h20M7 15h10M4 19a2 2 0 002 2h12a2 2 0 002-2v-9H4v9z"></path></svg>
                </p>
              </div>
              <div class="text-center space-y-1 border-l border-slate-100">
                <span class="text-slate-400 text-xs font-semibold uppercase">Area</span>
                <p class="text-lg font-bold text-slate-900 flex items-center justify-center gap-1.5">
                  <span>{{ property()?.area }} sqft</span>
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4h16v16H4zM9 9h6v6H9z"></path></svg>
                </p>
              </div>
              <div class="text-center space-y-1 border-l border-slate-100">
                <span class="text-slate-400 text-xs font-semibold uppercase">Parking</span>
                <p class="text-lg font-bold text-slate-900 flex items-center justify-center gap-1.5">
                  <span>{{ property()?.parkingAvailable ? 'Yes' : 'No' }}</span>
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 10a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8z M12 8v8M9 11h6"></path></svg>
                </p>
              </div>
            </div>

            <!-- Description -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 class="text-xl font-bold text-slate-955">Property Description</h2>
              <p class="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                {{ property()?.description }}
              </p>
            </div>

            <!-- Amenities -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 class="text-xl font-bold text-slate-955">Key Amenities</h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-slate-600 text-sm">
                <span class="flex items-center gap-2">✓ High-speed Internet</span>
                <span class="flex items-center gap-2">✓ Power Backup</span>
                <span class="flex items-center gap-2">✓ Security Surveillance</span>
                <span class="flex items-center gap-2">✓ Water Supply 24/7</span>
                <span class="flex items-center gap-2">✓ Elevators</span>
                <span class="flex items-center gap-2">✓ Firefighting Systems</span>
              </div>
            </div>
          </div>

          <!-- Contact / Inquiry Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Direct Shortcuts -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 class="font-bold text-slate-955 text-base">Direct Contacts</h3>
              
              <div class="grid grid-cols-1 gap-3">
                <!-- WhatsApp Button -->
                <a [href]="getWhatsAppLink()" target="_blank"
                   class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.493 4.93 1.494 5.31 0 9.638-4.307 9.64-9.604 0-2.567-1.002-4.98-2.822-6.797C16.574 2.43 14.16 1.432 11.6 1.435c-5.31 0-9.638 4.307-9.64 9.605 0 1.882.49 3.719 1.42 5.33l-1.01 3.68 3.78-1.02zM17.15 14.4c-.305-.152-1.804-.89-2.084-.99-.28-.102-.485-.153-.69.152-.203.305-.79.99-.97 1.193-.18.203-.36.228-.665.076-1.72-.88-2.87-1.53-3.83-3.17-.25-.43.25-.4.72-.94a.5.5 0 00-.02-.45c-.076-.153-.69-1.66-.945-2.277-.25-.6-.5-.52-.69-.53-.18-.01-.38-.01-.58-.01-.2 0-.53.07-.81.38-.28.3-.96.94-.96 2.29s.99 2.66 1.13 2.85c.14.19 1.95 2.97 4.72 4.17 2.27.98 3.12.82 4.23.63 1.2-.2 2.48-.96 2.83-1.88.35-.91.35-1.7.24-1.85-.11-.15-.41-.24-.71-.39z"/></svg>
                  <span>WhatsApp Agent</span>
                </a>

                <!-- Phone Link -->
                <a href="tel:+919822890024"
                   class="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <span>Call support</span>
                </a>
              </div>
            </div>

            <!-- Inquiry Lead Form -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 class="font-bold text-slate-950 text-base">Send Inquiry Message</h3>
              
              <form [formGroup]="inquiryForm" (submit)="submitInquiry()" class="space-y-4 text-sm">
                <div class="space-y-1">
                  <label class="font-semibold text-slate-700">Full Name</label>
                  <input type="text" formControlName="name" placeholder="John Doe"
                         class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                  <span *ngIf="inquiryForm.get('name')?.invalid && inquiryForm.get('name')?.touched" class="text-xs text-rose-500">
                    Name is required (min 2 chars).
                  </span>
                </div>

                <div class="space-y-1">
                  <label class="font-semibold text-slate-700">Email Address</label>
                  <input type="email" formControlName="email" placeholder="john@example.com"
                         class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                  <span *ngIf="inquiryForm.get('email')?.invalid && inquiryForm.get('email')?.touched" class="text-xs text-rose-500">
                    A valid email is required.
                  </span>
                </div>

                <div class="space-y-1">
                  <label class="font-semibold text-slate-700">Phone Number</label>
                  <input type="text" formControlName="phoneNumber" placeholder="+91 98765 43210"
                         class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                  <span *ngIf="inquiryForm.get('phoneNumber')?.invalid && inquiryForm.get('phoneNumber')?.touched" class="text-xs text-rose-500">
                    Valid phone number is required.
                  </span>
                </div>

                <div class="space-y-1">
                  <label class="font-semibold text-slate-700">Your Message</label>
                  <textarea formControlName="message" rows="4" placeholder="Hi, I am interested in scheduling a visit..."
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors resize-none"></textarea>
                  <span *ngIf="inquiryForm.get('message')?.invalid && inquiryForm.get('message')?.touched" class="text-xs text-rose-500">
                    Message must be at least 10 characters.
                  </span>
                </div>

                <button type="submit" [disabled]="inquiryForm.invalid || submitting()"
                        class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                  <span *ngIf="submitting()">Sending...</span>
                  <span *ngIf="!submitting()">Submit Inquiry</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </ng-container>

      <div *ngIf="!loading() && !property()" class="text-center py-20 bg-white border border-slate-100 rounded-2xl">
        <p class="text-slate-500">Property details could not be loaded.</p>
        <a routerLink="/properties" class="text-amber-500 font-semibold mt-4 hover:underline inline-block">Back to listings</a>
      </div>
    </div>
  `
})
export class PropertyDetailsComponent implements OnInit {
  propertyService = inject(PropertyService);
  inquiryService = inject(InquiryService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  PropertyType = PropertyType;
  PropertyStatus = PropertyStatus;

  property = signal<PropertyResponse | null>(null);
  images = signal<ImageResponse[]>([]);
  activeImageIndex = signal(0);
  loading = signal(true);
  submitting = signal(false);

  inquiryForm!: FormGroup;

  ngOnInit() {
    const propertyId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm(propertyId);
    if (propertyId) {
      this.fetchDetails(propertyId);
    } else {
      this.loading.set(false);
    }
  }

  initForm(propertyId: number) {
    this.inquiryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s-]{10,15}$/)]],
      message: ['Hi, I am interested in this listing. Please let me know the availability.', [Validators.required, Validators.minLength(10)]],
      propertyId: [propertyId, Validators.required]
    });
  }

  fetchDetails(id: number) {
    this.propertyService.getPropertyById(id).subscribe({
      next: (prop) => {
        this.property.set(prop);
        // Fetch uploaded property images
        this.propertyService.getPropertyImages(id).subscribe({
          next: (imgs) => {
            this.images.set(imgs);
            this.loading.set(false);
          },
          error: () => {
            this.images.set([]);
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.toastService.error('Failed to load property details.');
        this.loading.set(false);
      }
    });
  }

  prevImage() {
    if (this.images().length > 0) {
      const idx = this.activeImageIndex();
      this.activeImageIndex.set(idx === 0 ? this.images().length - 1 : idx - 1);
    }
  }

  nextImage() {
    if (this.images().length > 0) {
      const idx = this.activeImageIndex();
      this.activeImageIndex.set(idx === this.images().length - 1 ? 0 : idx + 1);
    }
  }

  getWhatsAppLink(): string {
    const title = this.property()?.title || 'Property';
    const text = encodeURIComponent(`Hi, I'm interested in the property "${title}" listed on Aadidev Properties. Please share the details!`);
    return `https://wa.me/919822890024?text=${text}`;
  }

  submitInquiry() {
    if (this.inquiryForm.invalid) return;

    this.submitting.set(true);
    const formValue = { ...this.inquiryForm.value };
    
    // Sanitize phone number for backend: strip spaces, dashes, +, and keep last 10 digits
    let cleanPhone = formValue.phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.slice(2);
    }
    if (cleanPhone.length > 10) {
      cleanPhone = cleanPhone.slice(-10);
    }
    formValue.phoneNumber = cleanPhone;

    const propertyTitle = this.property()?.title || '';

    this.inquiryService.createInquiry(formValue).subscribe({
      next: () => {
        this.toastService.success('Inquiry submitted! Redirecting to WhatsApp...');
        
        const textMsg = `Hi Deepak Peswani,\n\nI would like to inquire about the property: "${propertyTitle}"\n\n*My Details:*\n*Name:* ${formValue.name}\n*Phone:* ${this.inquiryForm.value.phoneNumber}\n*Email:* ${formValue.email}\n\n*Message:* ${formValue.message}`;
        const encoded = encodeURIComponent(textMsg);
        const whatsappUrl = `https://wa.me/919822890024?text=${encoded}`;
        
        window.open(whatsappUrl, '_blank');

        this.inquiryForm.reset({
          name: '',
          email: '',
          phoneNumber: '',
          message: 'Hi, I am interested in this listing. Please let me know the availability.',
          propertyId: this.property()?.id
        });
        this.submitting.set(false);
      },
      error: () => {
        this.toastService.error('Failed to submit inquiry. Please try again.');
        this.submitting.set(false);
      }
    });
  }

  getFallbackImage(type: PropertyType): string {
    switch (type) {
      case PropertyType.APARTMENT:
        return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600';
      case PropertyType.COMMERCIAL:
        return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600';
      case PropertyType.PLOT:
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600';
      case PropertyType.VILLA:
      default:
        return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600';
    }
  }
}
