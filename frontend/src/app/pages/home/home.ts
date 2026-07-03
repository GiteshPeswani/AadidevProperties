import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../service/property.service';
import { PropertyResponse, PropertyType, PropertyStatus } from '../../model/property.model';
import { ToastService } from '../../service/toast.service';
import { forkJoin, map, of } from 'rxjs';

interface PropertyWithImage extends PropertyResponse {
  firstImageId?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-24 pb-20">
      <!-- Hero Section -->
      <section class="relative h-[80vh] flex items-center justify-center overflow-hidden animate-fade-in">
        <!-- Hero Background -->
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 scale-105" 
             style="background-image: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600');">
          <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]"></div>
        </div>

        <div class="relative max-w-5xl mx-auto px-4 text-center space-y-8 z-10">
          <span class="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            Exquisite Real Estate Listings
          </span>
          <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Find Your Dream Luxury Home
          </h1>
          <p class="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Discover a curated collection of premium apartments, villas, commercial hubs, and plots.
          </p>

          <!-- Search Bar -->
          <div class="glass-card max-w-4xl mx-auto p-4 sm:p-6 rounded-2xl border border-slate-700/40 shadow-2xl mt-8">
            <form (submit)="onSearch()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end text-left">
              <!-- Location -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Location</label>
                <input type="text" [(ngModel)]="searchQuery.location" name="location" placeholder="e.g. Gurugram"
                       class="w-full bg-slate-900/60 text-white border border-slate-700/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors">
              </div>

              <!-- Property Type -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Type</label>
                <select [(ngModel)]="searchQuery.propertyType" name="propertyType"
                        class="w-full bg-slate-900/60 text-white border border-slate-700/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors">
                  <option [value]="undefined">Any Type</option>
                  <option [value]="PropertyType.APARTMENT">Apartment</option>
                  <option [value]="PropertyType.VILLA">Villa</option>
                  <option [value]="PropertyType.COMMERCIAL">Commercial</option>
                  <option [value]="PropertyType.PLOT">Plot</option>
                </select>
              </div>

              <!-- Min Price -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Min Price (₹)</label>
                <input type="number" [(ngModel)]="searchQuery.minPrice" name="minPrice" placeholder="Min"
                       class="w-full bg-slate-900/60 text-white border border-slate-700/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors">
              </div>

              <!-- Max Price -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Max Price (₹)</label>
                <input type="number" [(ngModel)]="searchQuery.maxPrice" name="maxPrice" placeholder="Max"
                       class="w-full bg-slate-900/60 text-white border border-slate-700/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors">
              </div>

              <!-- Search Button -->
              <div>
                <button type="submit" 
                        class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- Featured Properties -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-slide-up delay-100">
        <div class="text-center space-y-3 mb-16">
          <span class="text-amber-500 text-sm font-semibold uppercase tracking-widest">Handpicked Listings</span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">Featured Properties</h2>
          <p class="text-slate-500 max-w-xl mx-auto">Explore some of our most exclusive properties currently available.</p>
        </div>

        <!-- Skeleton Loader -->
        <div *ngIf="loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let i of [1,2,3]" class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
            <div class="h-64 bg-slate-200"></div>
            <div class="p-6 space-y-4">
              <div class="h-4 bg-slate-200 rounded w-1/3"></div>
              <div class="h-6 bg-slate-200 rounded w-3/4"></div>
              <div class="h-4 bg-slate-200 rounded w-1/2"></div>
              <div class="h-10 bg-slate-200 rounded-lg w-full"></div>
            </div>
          </div>
        </div>

        <!-- Property Grid -->
        <div *ngIf="!loading() && featuredProperties().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let property of featuredProperties()" 
               class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
            <!-- Property Image -->
            <div class="relative h-64 overflow-hidden bg-slate-100">
              <img [src]="property.firstImageId ? propertyService.getImageUrl(property.firstImageId) : getFallbackImage(property.propertyType)" 
                   [alt]="property.title"
                   class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              
              <!-- Badges -->
              <span [ngClass]="{
                      'bg-emerald-500': property.status === PropertyStatus.FOR_SALE,
                      'bg-blue-500': property.status === PropertyStatus.FOR_RENT,
                      'bg-slate-500': property.status === PropertyStatus.SOLD
                    }"
                    class="absolute top-4 left-4 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-full shadow-sm">
                {{ property.status.replace('_', ' ') }}
              </span>
              
              <span *ngIf="property.featured" class="absolute top-4 right-4 bg-amber-500 text-slate-950 text-xs font-extrabold uppercase py-1.5 px-3 rounded-full shadow-sm">
                ★ Featured
              </span>
            </div>

            <!-- Card Details -->
            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <span class="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {{ property.propertyType }}
                </span>
                <h3 class="text-xl font-bold text-slate-900 group-hover:text-amber-500 transition-colors line-clamp-1">
                  {{ property.title }}
                </h3>
                <p class="text-slate-500 text-sm flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {{ property.location }}
                </p>
              </div>

              <!-- Specs -->
              <div class="flex items-center justify-between py-3 border-t border-b border-slate-100 text-slate-500 text-sm">
                <span class="flex items-center gap-1.5" *ngIf="property.bedrooms > 0">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10V6a2 2 0 012-2h14a2 2 0 012 2v4M3 10v9a1 1 0 001 1h16a1 1 0 001-1v-9M3 10h18M7 14h10"></path></svg>
                  {{ property.bedrooms }} Bed
                </span>
                <span class="flex items-center gap-1.5" *ngIf="property.bathrooms > 0">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 10V5a2 2 0 012-2h12a2 2 0 012 2v5M2 10h20M7 15h10M4 19a2 2 0 002 2h12a2 2 0 002-2v-9H4v9z"></path></svg>
                  {{ property.bathrooms }} Bath
                </span>
                <span class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4h16v16H4zM9 9h6v6H9z"></path></svg>
                  {{ property.area }} sqft
                </span>
              </div>

              <!-- Price & CTA -->
              <div class="flex items-center justify-between pt-2">
                <span class="text-xl font-extrabold text-[#0F172A]">
                  ₹{{ property.price | number:'1.0-0' }}
                </span>
                <a [routerLink]="['/properties', property.id]" 
                   class="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                  Details
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading() && featuredProperties().length === 0" 
             class="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
          <p class="text-slate-500 text-lg">No featured properties found at this time.</p>
        </div>
      </section>

      <!-- Why Choose Us -->
      <section class="bg-slate-900 text-white py-24 animate-slide-up delay-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center space-y-4 mb-20">
            <span class="text-amber-400 text-sm font-semibold uppercase tracking-widest font-mono">Our Legacy</span>
            <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight">Why Choose Aadidev Properties</h2>
            <p class="text-slate-400 max-w-xl mx-auto">Providing unmatched expertise, transparency, and tailored search outcomes.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <!-- Quality 1 -->
            <div class="bg-slate-800/50 border border-slate-700/40 p-8 rounded-2xl space-y-4 hover:border-amber-500/40 transition-all duration-300 group">
              <div class="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h3 class="text-xl font-bold">Premium Portfolio</h3>
              <p class="text-slate-400 leading-relaxed text-sm">
                Access verified deluxe residential complexes, duplex villas, and premium commercial estates in core zones.
              </p>
            </div>

            <!-- Quality 2 -->
            <div class="bg-slate-800/50 border border-slate-700/40 p-8 rounded-2xl space-y-4 hover:border-amber-500/40 transition-all duration-300 group">
              <div class="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <h3 class="text-xl font-bold">Client-First Approach</h3>
              <p class="text-slate-400 leading-relaxed text-sm">
                Our relationship managers guide you closely through inquiry scheduling, tours, and legal paperwork.
              </p>
            </div>

            <!-- Quality 3 -->
            <div class="bg-slate-800/50 border border-slate-700/40 p-8 rounded-2xl space-y-4 hover:border-amber-500/40 transition-all duration-300 group">
              <div class="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path></svg>
              </div>
              <h3 class="text-xl font-bold">Transparent Valuations</h3>
              <p class="text-slate-400 leading-relaxed text-sm">
                Get full visibility into true market values without concealed brokerages or unexpected overheads.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-slide-up delay-300">
        <div class="text-center space-y-3 mb-16">
          <span class="text-amber-500 text-sm font-semibold uppercase tracking-widest font-mono">Our Clients</span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">What People Say</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm space-y-4 relative">
            <span class="text-5xl text-amber-500/20 absolute top-4 right-6 font-serif">“</span>
            <div class="flex text-amber-500 gap-0.5">
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p class="text-slate-600 text-sm leading-relaxed">
              "Working with Aadidev Properties was an absolute pleasure. They helped us secure our luxury duplex in Gurugram. Highly professional services!"
            </p>
            <div class="flex items-center gap-3 pt-2">
              <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                AS
              </div>
              <div>
                <h4 class="font-bold text-sm text-slate-900">Amit Sharma</h4>
                <p class="text-xs text-slate-400">Villa Owner</p>
              </div>
            </div>
          </div>

          <div class="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm space-y-4 relative">
            <span class="text-5xl text-amber-500/20 absolute top-4 right-6 font-serif">“</span>
            <div class="flex text-amber-500 gap-0.5">
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p class="text-slate-600 text-sm leading-relaxed">
              "Their online platform is simple, verified, and completely transparent. The response to our inquiries was incredibly prompt."
            </p>
            <div class="flex items-center gap-3 pt-2">
              <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                NK
              </div>
              <div>
                <h4 class="font-bold text-sm text-slate-900">Neha Kapoor</h4>
                <p class="text-xs text-slate-400">Apartment Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-slide-up delay-450">
        <div class="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white rounded-3xl p-10 md:p-16 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div class="space-y-4 max-w-xl text-center md:text-left z-10">
            <h2 class="text-3xl md:text-4xl font-extrabold">Ready to Find Your Place?</h2>
            <p class="text-slate-300 font-light">
              Connect with our property specialists today to schedule tours or ask questions. We're here to guide you home.
            </p>
          </div>
          <div class="z-10 flex flex-col sm:flex-row gap-4">
            <a routerLink="/properties" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-8 rounded-xl transition-all text-center shadow-lg shadow-amber-900/10">
              Browse Listings
            </a>
            <a routerLink="/contact" class="bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-8 rounded-xl border border-slate-700 transition-colors text-center">
              Contact Support
            </a>
          </div>
          <!-- Grid Overlay Pattern -->
          <div class="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  propertyService = inject(PropertyService);
  toastService = inject(ToastService);
  router = inject(Router);

  PropertyType = PropertyType;
  PropertyStatus = PropertyStatus;

  featuredProperties = signal<PropertyWithImage[]>([]);
  loading = signal(true);

  // Search parameters bound to hero form
  searchQuery: {
    location?: string;
    propertyType?: PropertyType;
    minPrice?: number;
    maxPrice?: number;
  } = {};

  ngOnInit() {
    this.fetchFeatured();
  }

  fetchFeatured() {
    this.propertyService.getFeaturedProperties().subscribe({
      next: (properties) => {
        if (properties && properties.length > 0) {
          // Fetch the first image for each property
          const imageFetches = properties.map(property => 
            this.propertyService.getPropertyImages(property.id).pipe(
              map(images => ({
                ...property,
                firstImageId: images.length > 0 ? images[0].id : undefined
              }))
            )
          );

          forkJoin(imageFetches).subscribe({
            next: (mappedProperties) => {
              this.featuredProperties.set(mappedProperties);
              this.loading.set(false);
            },
            error: () => {
              // Fallback to unmapped if image check fails
              this.featuredProperties.set(properties);
              this.loading.set(false);
            }
          });
        } else {
          this.featuredProperties.set([]);
          this.loading.set(false);
        }
      },
      error: () => {
        this.toastService.error('Failed to load featured properties.');
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    const queryParams: any = {};
    if (this.searchQuery.location) queryParams.location = this.searchQuery.location;
    if (this.searchQuery.propertyType) queryParams.propertyType = this.searchQuery.propertyType;
    if (this.searchQuery.minPrice != null) queryParams.minPrice = this.searchQuery.minPrice;
    if (this.searchQuery.maxPrice != null) queryParams.maxPrice = this.searchQuery.maxPrice;

    this.router.navigate(['/properties'], { queryParams });
  }

  getFallbackImage(type: PropertyType): string {
    switch (type) {
      case PropertyType.APARTMENT:
        return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600';
      case PropertyType.COMMERCIAL:
        return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600';
      case PropertyType.PLOT:
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600';
      case PropertyType.VILLA:
      default:
        return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600';
    }
  }
}
