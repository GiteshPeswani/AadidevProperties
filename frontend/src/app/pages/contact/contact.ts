import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-20 pb-20 overflow-hidden">
      <!-- Banner -->
      <section class="relative h-[40vh] flex items-center justify-center overflow-hidden animate-fade-in">
        <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600');">
          <div class="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"></div>
        </div>
        <div class="relative max-w-4xl mx-auto px-4 text-center space-y-4 z-10 text-white">
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
          <p class="text-slate-300 text-base md:text-lg max-w-xl mx-auto font-light">
            We are always here to help you. Drop a message or ring our corporate office directly.
          </p>
        </div>
      </section>

      <!-- Main Layout -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 animate-slide-up delay-100">
        <!-- Contact Details -->
        <div class="space-y-8">
          <div class="space-y-3">
            <span class="text-amber-500 text-xs font-semibold uppercase tracking-widest font-mono">Connect</span>
            <h2 class="text-3xl font-extrabold text-slate-900 leading-tight">Get in Touch with Experts</h2>
            <p class="text-slate-500 text-sm">Have queries about pricing, legal procedures, or visit scheduling? Drop details here.</p>
          </div>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <span class="p-2.5 bg-slate-100 rounded-xl text-slate-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </span>
              <div>
                <h4 class="font-bold text-slate-900">Corporate Headquarters</h4>
                <p class="text-slate-500 text-sm leading-relaxed">
                  Madhav Srishti Umapati, Opp. Madhav Srishti Gate 3, Shop No. 9, Godrej Hill Road, Khadakpada, Kalyan West
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <span class="p-2.5 bg-slate-100 rounded-xl text-slate-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </span>
              <div>
                <h4 class="font-bold text-slate-900">Phone Support</h4>
                <p class="text-slate-500 text-sm hover:text-amber-500 transition-colors">
                  <a href="tel:+919822890024">+91 98228 90024</a>
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <span class="p-2.5 bg-slate-100 rounded-xl text-slate-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </span>
              <div>
                <h4 class="font-bold text-slate-900">Email Address</h4>
                <p class="text-slate-500 text-sm hover:text-amber-500 transition-colors">
                  <a href="mailto:deepakpeswani666&#64;gmail.com">deepakpeswani666&#64;gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Feedback Form -->
        <div class="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 class="font-bold text-xl text-slate-950">Send us a Message</h3>
          
          <form [formGroup]="contactForm" (submit)="onSubmit()" class="space-y-4 text-sm">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="font-semibold text-slate-700">First Name</label>
                <input type="text" formControlName="firstName" placeholder="John"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                <span *ngIf="contactForm.get('firstName')?.invalid && contactForm.get('firstName')?.touched" class="text-xs text-rose-500">
                  First name is required.
                </span>
              </div>
              <div class="space-y-1">
                <label class="font-semibold text-slate-700">Last Name</label>
                <input type="text" formControlName="lastName" placeholder="Doe"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="font-semibold text-slate-700">Email Address</label>
                <input type="email" formControlName="email" placeholder="john@example.com"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                <span *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" class="text-xs text-rose-500">
                  A valid email is required.
                </span>
              </div>
              <div class="space-y-1">
                <label class="font-semibold text-slate-700">Phone Number</label>
                <input type="text" formControlName="phoneNumber" placeholder="+91 98228 90024"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                <span *ngIf="contactForm.get('phoneNumber')?.invalid && contactForm.get('phoneNumber')?.touched" class="text-xs text-rose-500">
                  Phone number is required.
                </span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="font-semibold text-slate-700">Subject</label>
              <input type="text" formControlName="subject" placeholder="e.g. Schedule Visit, Bulk Inquiry"
                     class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              <span *ngIf="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched" class="text-xs text-rose-500">
                Subject is required.
              </span>
            </div>

            <div class="space-y-1">
              <label class="font-semibold text-slate-700">Message</label>
              <textarea formControlName="message" rows="4" placeholder="How can we help you?"
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors resize-none"></textarea>
              <span *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" class="text-xs text-rose-500">
                Message must be at least 10 characters.
              </span>
            </div>

            <button type="submit" [disabled]="contactForm.invalid || submitting()"
                    class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
              <span *ngIf="submitting()">Sending Message...</span>
              <span *ngIf="!submitting()">Send Message</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  `
})
export class ContactComponent {
  fb = inject(FormBuilder);
  toastService = inject(ToastService);

  submitting = signal(false);
  contactForm: FormGroup;

  constructor() {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s-]{10,15}$/)]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.submitting.set(true);
    
    const { firstName, lastName, email, phoneNumber, subject, message } = this.contactForm.value;
    const fullName = lastName ? `${firstName} ${lastName}` : firstName;
    
    const textMsg = `Hi Deepak Peswani,\n\nI have a query from Aadidev Properties Contact Form:\n\n*Name:* ${fullName}\n*Phone:* ${phoneNumber}\n*Email:* ${email}\n*Subject:* ${subject}\n*Message:* ${message}`;
    const encoded = encodeURIComponent(textMsg);
    const whatsappUrl = `https://wa.me/919822890024?text=${encoded}`;
    
    window.open(whatsappUrl, '_blank');
    
    this.toastService.success('Redirecting you to WhatsApp to send your query...');
    this.contactForm.reset();
    this.submitting.set(false);
  }
}
