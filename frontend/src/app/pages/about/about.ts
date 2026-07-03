import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-24 pb-20 overflow-hidden">
      <!-- Banner -->
      <section class="relative h-[40vh] flex items-center justify-center overflow-hidden animate-fade-in">
        <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600');">
          <div class="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"></div>
        </div>
        <div class="relative max-w-4xl mx-auto px-4 text-center space-y-4 z-10 text-white">
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">About Us</h1>
          <p class="text-slate-300 text-base md:text-lg max-w-xl mx-auto font-light">
            Guiding you through bespoke real estate journeys with premium residential and commercial spaces.
          </p>
        </div>
      </section>

      <!-- Description & Story -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-slide-up delay-100">
        <div class="space-y-6">
          <span class="text-amber-500 text-xs font-semibold uppercase tracking-widest font-mono">Our Story</span>
          <h2 class="text-3xl font-extrabold text-slate-900 leading-tight">
            Redefining Luxury Real Estate Standards Since 2014
          </h2>
          <p class="text-slate-600 text-sm leading-relaxed">
            Aadidev Properties was founded on a simple premise: real estate transactions should be completely transparent, highly personalized, and focused on exceptional quality. Over the years, we have built a trusted legacy by serving premium clients, developers, and corporate entities.
          </p>
          <p class="text-slate-600 text-sm leading-relaxed">
            Whether you are purchasing your very first apartment, investing in plots for custom constructions, or expanding commercial hubs, our team combines local insight and meticulous support to turn goals into actual assets.
          </p>
        </div>
        <div class="relative rounded-3xl overflow-hidden h-[400px] shadow-lg">
          <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800" 
               alt="Luxury Villa Interior"
               class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
        </div>
      </section>

      <!-- Leadership / Founder Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-slide-up delay-200">
        <div class="order-2 md:order-1 relative rounded-3xl overflow-hidden aspect-square w-full shadow-xl group border border-slate-100">
          <img src="/deepak_peswani_hq.jpg" 
               alt="Deepak Peswani - Founder of Aadidev Properties"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <div class="space-y-6 order-1 md:order-2">
          <span class="text-amber-500 text-xs font-semibold uppercase tracking-widest font-mono">Our Leadership</span>
          <h2 class="text-3xl font-extrabold text-slate-900 leading-tight">
            Meet the Visionary: Deepak Peswani
          </h2>
          <p class="text-slate-600 text-sm leading-relaxed">
            As the Founder and Managing Director of Aadidev Properties, Deepak Peswani has been driving the company's commitment to excellence, integrity, and transparency. With years of experience in the luxury real estate sector, Deepak has established a reputation for offering elite clients curated residential properties, premium plots, and corporate offices.
          </p>
          <p class="text-slate-600 text-sm leading-relaxed">
            Deepak believes in a customer-centric, tailored search strategy. He works directly with buyers and developers to ensure every transaction is handled with meticulous attention to detail and zero compromises on title transparency. Under his leadership, Aadidev Properties has grown into one of Gurugram's premier real estate consultancy firms.
          </p>
          <div class="pt-4 flex flex-wrap gap-4">
            <a href="tel:+919822890024" class="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md text-sm">
              <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              Call Deepak Peswani
            </a>
            <a href="https://wa.me/919822890024" target="_blank" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.016 14.062.99 11.457.99c-5.438 0-9.863 4.373-9.867 9.801-.001 1.73.473 3.41 1.373 4.877L1.93 21.085l5.068-1.849c.001-.001.002-.001.003-.001zM17.5 15.6c-.3-.15-1.7-.85-1.95-.95-.25-.1-.45-.15-.65.15-.2.3-.75.95-.95 1.15-.2.2-.4.25-.7.1-1.1-.5-2-1.1-2.8-2.5-.2-.35 0-.6.15-.8.15-.15.3-.35.45-.5.15-.15.2-.25.3-.45.1-.2.05-.4 0-.55-.05-.15-.65-1.55-.9-2.1-.25-.6-.5-.5-.65-.5-.15 0-.35-.05-.55-.05s-.5.05-.8.35c-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.25 3.25c.15.25 2.15 3.3 5.2 4.6.7.3 1.25.5 1.7.65.7.2 1.35.15 1.85.1.55-.1 1.7-.7 1.95-1.35.25-.65.25-1.2.15-1.35-.1-.2-.3-.3-.6-.45z"/></svg>
              WhatsApp Agent
            </a>
          </div>
        </div>
      </section>

      <!-- Stats counter banner -->
      <section class="bg-slate-900 text-white py-16 animate-slide-up delay-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="space-y-2">
            <h3 class="text-4xl font-extrabold text-amber-400">500+</h3>
            <p class="text-xs text-slate-400 uppercase tracking-widest">Properties Managed</p>
          </div>
          <div class="space-y-2 border-l border-slate-800">
            <h3 class="text-4xl font-extrabold text-amber-400">300+</h3>
            <p class="text-xs text-slate-400 uppercase tracking-widest">Happy Clients</p>
          </div>
          <div class="space-y-2 border-l border-slate-800">
            <h3 class="text-4xl font-extrabold text-amber-400">15+</h3>
            <p class="text-xs text-slate-400 uppercase tracking-widest">Industry Awards</p>
          </div>
          <div class="space-y-2 border-l border-slate-800">
            <h3 class="text-4xl font-extrabold text-amber-400">12+</h3>
            <p class="text-xs text-slate-400 uppercase tracking-widest">Years of Excellence</p>
          </div>
        </div>
      </section>

      <!-- Pillars / Values -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-slide-up delay-450">
        <div class="text-center space-y-3 mb-16">
          <span class="text-amber-500 text-sm font-semibold uppercase tracking-widest font-mono">Our Foundations</span>
          <h2 class="text-3xl font-extrabold text-slate-900">Core Corporate Values</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7h3.5m5.5 0h-3.5m3.5 0l3 9a5.002 5.002 0 01-6 0M17 7l-3 9M17 7l-3-1M12 3v18"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900">Uncompromising Integrity</h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              We verify and record every dimension, title documentation, and amenity listing beforehand to ensure client protection.
            </p>
          </div>

          <div class="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900">Laser Focus</h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              We specialize in top-tier luxury markets, offering a highly curated experience instead of generalized options.
            </p>
          </div>

          <div class="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900">Constant Innovation</h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              From robust search filters to digital inquiries and high-fidelity uploads, we make property search modern and effortless.
            </p>
          </div>
        </div>
      </section>

      <!-- Visit Our Office Gallery -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-slide-up delay-500">
        <div class="text-center space-y-3 mb-16">
          <span class="text-amber-500 text-sm font-semibold uppercase tracking-widest font-mono">Our Location</span>
          <h2 class="text-3xl font-extrabold text-slate-900">Visit Our Office</h2>
          <p class="text-slate-500 text-sm max-w-xl mx-auto">
            Located in Kalyan West, our doors are always open for personalized real estate consultations. Step inside our workspace.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Main Workstation (Large Panel) -->
          <div class="md:col-span-2 lg:row-span-2 relative rounded-3xl overflow-hidden shadow-md group h-[300px] md:h-[500px]">
            <img src="/office/office_1.png" alt="Aadidev Properties Office Main Workstations" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6 md:p-8">
              <div class="space-y-2">
                <span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider font-mono">Office Layout</span>
                <h3 class="text-white text-xl md:text-2xl font-bold">Main Workspace & Meeting Room</h3>
                <p class="text-slate-300 text-xs md:text-sm font-light max-w-md">Our main office layout showcasing the front consultation desks and the glass-partitioned private meeting room in the background.</p>
              </div>
            </div>
          </div>

          <!-- Consultation Desk -->
          <div class="relative rounded-3xl overflow-hidden shadow-md group h-[238px]">
            <img src="/office/office_2.png" alt="Aadidev Properties Consultation Desk" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
              <div class="space-y-1">
                <span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider font-mono">Meeting Area</span>
                <h3 class="text-white text-base font-bold">Consultation Desk</h3>
                <p class="text-slate-300 text-[11px] font-light">Where documentations are reviewed and custom strategies are finalized.</p>
              </div>
            </div>
          </div>

          <!-- Client Reception -->
          <div class="relative rounded-3xl overflow-hidden shadow-md group h-[238px]">
            <img src="/office/office_3.png" alt="Aadidev Properties Client Reception" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
              <div class="space-y-1">
                <span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider font-mono">Consultation</span>
                <h3 class="text-white text-base font-bold">Private Discussion Space</h3>
                <p class="text-slate-300 text-[11px] font-light">Ensuring complete confidentiality and ease during customer meets.</p>
              </div>
            </div>
          </div>

          <!-- Office Storefront -->
          <div class="relative rounded-3xl overflow-hidden shadow-md group h-[238px]">
            <img src="/office/office_4.jpg" alt="Aadidev Properties Storefront" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
              <div class="space-y-1">
                <span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider font-mono">Storefront</span>
                <h3 class="text-white text-base font-bold">Office Storefront (Shop No. 9)</h3>
                <p class="text-slate-300 text-[11px] font-light">Our street-level entrance in Khadakpada, Kalyan West.</p>
              </div>
            </div>
          </div>

          <!-- Location View -->
          <div class="relative rounded-3xl overflow-hidden shadow-md group h-[238px] md:col-span-2 lg:col-span-1">
            <img src="/office/office_5.jpg" alt="Madhav Srishti Complex Road View" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
              <div class="space-y-1">
                <span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider font-mono">Surroundings</span>
                <h3 class="text-white text-base font-bold">Madhav Srishti Complex</h3>
                <p class="text-slate-300 text-[11px] font-light">Right opposite Madhav Srishti Gate 3 on Godrej Hill Road.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class AboutComponent {}
