import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../service/property.service';
import { ToastService } from '../../service/toast.service';
import { PropertyResponse, PropertyType, PropertyStatus, PropertySearchRequest, ImageResponse } from '../../model/property.model';
import { SkeletonComponent } from '../../shared/skeleton/skeleton';
import { forkJoin, map } from 'rxjs';

interface PropertyWithImage extends PropertyResponse {
  firstImageId?: number;
}

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SkeletonComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <!-- Page Title -->
      <div class="space-y-2">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Browse Properties</h1>
        <p class="text-slate-500 text-sm">Find premium listings curated for luxury and functionality.</p>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <div class="lg:col-span-1 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-fit space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 class="font-bold text-slate-950 flex items-center gap-2">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              <span>Filters</span>
            </h2>
            <button (click)="resetFilters()" class="text-xs text-amber-600 hover:text-amber-500 font-semibold focus:outline-none">
              Reset All
            </button>
          </div>

          <form (submit)="applyFilters()" class="space-y-5 text-sm">
            <!-- Location -->
            <div class="space-y-1.5">
              <label class="font-semibold text-slate-700">Location</label>
              <input type="text" [(ngModel)]="filters.location" name="location" placeholder="City or area..."
                     class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
            </div>

            <!-- Property Type -->
            <div class="space-y-1.5">
              <label class="font-semibold text-slate-700">Property Type</label>
              <select [(ngModel)]="filters.propertyType" name="propertyType"
                      class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                <option [value]="undefined">Any Type</option>
                <option [value]="PropertyType.APARTMENT">Apartment</option>
                <option [value]="PropertyType.VILLA">Villa</option>
                <option [value]="PropertyType.COMMERCIAL">Commercial</option>
                <option [value]="PropertyType.PLOT">Plot</option>
              </select>
            </div>

            <!-- Property Status -->
            <div class="space-y-1.5">
              <label class="font-semibold text-slate-700">Status</label>
              <select [(ngModel)]="filters.status" name="status"
                      class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                <option [value]="undefined">Any Status</option>
                <option [value]="PropertyStatus.FOR_SALE">For Sale</option>
                <option [value]="PropertyStatus.FOR_RENT">For Rent</option>
                <option [value]="PropertyStatus.SOLD">Sold</option>
              </select>
            </div>

            <!-- Price Range -->
            <div class="space-y-1.5">
              <label class="font-semibold text-slate-700">Price Range (₹)</label>
              <div class="grid grid-cols-2 gap-2">
                <input type="number" [(ngModel)]="filters.minPrice" name="minPrice" placeholder="Min"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                <input type="number" [(ngModel)]="filters.maxPrice" name="maxPrice" placeholder="Max"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              </div>
            </div>

            <!-- Area Range -->
            <div class="space-y-1.5">
              <label class="font-semibold text-slate-700">Area Range (sqft)</label>
              <div class="grid grid-cols-2 gap-2">
                <input type="number" [(ngModel)]="filters.minArea" name="minArea" placeholder="Min"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                <input type="number" [(ngModel)]="filters.maxArea" name="maxArea" placeholder="Max"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              </div>
            </div>

            <!-- Rooms -->
            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1.5">
                <label class="font-semibold text-slate-700">Bedrooms</label>
                <input type="number" [(ngModel)]="filters.bedrooms" name="bedrooms" placeholder="Any"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              </div>
              <div class="space-y-1.5">
                <label class="font-semibold text-slate-700">Bathrooms</label>
                <input type="number" [(ngModel)]="filters.bathrooms" name="bathrooms" placeholder="Any"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              </div>
            </div>

            <!-- Featured check -->
            <div class="flex items-center gap-2 pt-2">
              <input type="checkbox" [(ngModel)]="filters.featured" name="featured" id="featured"
                      class="h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-300 rounded">
              <label for="featured" class="font-semibold text-slate-700 select-none">Featured Only</label>
            </div>

            <button type="submit" 
                    class="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4">
              Apply Filters
            </button>
          </form>
        </div>

        <!-- Properties Grid Area -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Control Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <p class="text-sm text-slate-500">
              Showing <span class="font-bold text-slate-900">{{ totalElements() }}</span> properties found
            </p>
            
            <div class="flex items-center gap-2 text-sm self-end sm:self-auto">
              <label class="text-slate-400">Sort By:</label>
              <select [(ngModel)]="sortBy" (change)="onSortChange()"
                      class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-slate-800">
                <option value="createdAt,desc">Newest Listings</option>
                <option value="price,asc">Price: Low to High</option>
                <option value="price,desc">Price: High to Low</option>
                <option value="area,desc">Largest Area</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-skeleton *ngFor="let s of [1,2,3,4]"></app-skeleton>
          </div>

          <!-- Results Grid -->
          <div *ngIf="!loading() && properties().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngFor="let property of properties()" 
                 class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              <!-- Image -->
              <div class="relative h-60 bg-slate-100">
                <img [src]="property.firstImageId ? propertyService.getImageUrl(property.firstImageId) : getFallbackImage(property.propertyType)" 
                     [alt]="property.title"
                     class="w-full h-full object-cover">
                
                <span [ngClass]="{
                        'bg-emerald-500': property.status === PropertyStatus.FOR_SALE,
                        'bg-blue-500': property.status === PropertyStatus.FOR_RENT,
                        'bg-slate-500': property.status === PropertyStatus.SOLD
                      }"
                      class="absolute top-4 left-4 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
                  {{ property.status.replace('_', ' ') }}
                </span>
                
                <span *ngIf="property.featured" class="absolute top-4 right-4 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase py-1 px-2.5 rounded-full shadow-sm">
                  ★ Featured
                </span>
              </div>

              <!-- Details -->
              <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div class="space-y-1.5">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {{ property.propertyType }}
                  </span>
                  <h3 class="text-lg font-bold text-slate-900 group-hover:text-amber-500 transition-colors line-clamp-1">
                    {{ property.title }}
                  </h3>
                  <p class="text-slate-500 text-xs flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-slate-450 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {{ property.location }}
                  </p>
                </div>

                <div class="flex items-center gap-4 py-2 border-t border-b border-slate-100 text-slate-500 text-xs">
                  <span *ngIf="property.bedrooms > 0" class="flex items-center gap-1.5"><svg class="w-4 h-4 text-slate-450" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10V6a2 2 0 012-2h14a2 2 0 012 2v4M3 10v9a1 1 0 001 1h16a1 1 0 001-1v-9M3 10h18M7 14h10"></path></svg> {{ property.bedrooms }} Bed</span>
                  <span *ngIf="property.bathrooms > 0" class="flex items-center gap-1.5"><svg class="w-4 h-4 text-slate-450" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 10V5a2 2 0 012-2h12a2 2 0 012 2v5M2 10h20M7 15h10M4 19a2 2 0 002 2h12a2 2 0 002-2v-9H4v9z"></path></svg> {{ property.bathrooms }} Bath</span>
                  <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-slate-450" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4h16v16H4zM9 9h6v6H9z"></path></svg> {{ property.area }} sqft</span>
                </div>

                <div class="flex items-center justify-between pt-2">
                  <span class="text-lg font-extrabold text-[#0F172A]">
                    ₹{{ property.price | number:'1.0-0' }}
                  </span>
                  <a [routerLink]="['/properties', property.id]" 
                     class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-2 px-3.5 rounded-lg transition-colors">
                    View Details
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loading() && properties().length === 0" 
               class="text-center py-20 bg-white border border-slate-100 rounded-2xl space-y-4 shadow-sm">
            <svg class="w-12 h-12 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <h3 class="text-xl font-bold text-slate-900">No properties match your search</h3>
            <p class="text-slate-500 max-w-sm mx-auto text-sm">Try resetting your filters or adjusting price range values to find properties.</p>
            <button (click)="resetFilters()" class="bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold py-2 px-6 rounded-xl transition-colors">
              Reset Filters
            </button>
          </div>

          <!-- Pagination Controls -->
          <div *ngIf="!loading() && totalPages() > 1" class="flex items-center justify-center gap-2 pt-4">
            <button (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 0"
                    class="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 disabled:hover:bg-transparent transition-colors">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <span class="text-sm font-semibold text-slate-700 px-4">
              Page {{ currentPage() + 1 }} of {{ totalPages() }}
            </span>
            <button (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() === totalPages() - 1"
                    class="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 disabled:hover:bg-transparent transition-colors">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PropertiesComponent implements OnInit {
  propertyService = inject(PropertyService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  PropertyType = PropertyType;
  PropertyStatus = PropertyStatus;

  properties = signal<PropertyWithImage[]>([]);
  loading = signal(true);

  // Pagination and Sort
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  pageSize = 6;
  sortBy = 'createdAt,desc';

  // Filters object
  filters: PropertySearchRequest = {
    location: undefined,
    propertyType: undefined,
    status: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minArea: undefined,
    maxArea: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    featured: undefined
  };

  ngOnInit() {
    // Read route query parameters (for quick-search redirection)
    this.route.queryParams.subscribe(params => {
      this.filters.location = params['location'] || undefined;
      this.filters.propertyType = params['propertyType'] || undefined;
      this.filters.status = params['status'] || undefined;
      if (params['minPrice']) this.filters.minPrice = Number(params['minPrice']);
      if (params['maxPrice']) this.filters.maxPrice = Number(params['maxPrice']);
      
      this.currentPage.set(0);
      this.fetchProperties();
    });
  }

  fetchProperties() {
    this.loading.set(true);
    this.propertyService.searchProperties(
      this.filters,
      this.currentPage(),
      this.pageSize,
      this.sortBy
    ).subscribe({
      next: (response) => {
        this.totalPages.set(response.totalPages);
        this.totalElements.set(response.totalElements);

        if (response.content.length > 0) {
          // Fetch image lists for each property on current page
          const imageFetches = response.content.map(property =>
            this.propertyService.getPropertyImages(property.id).pipe(
              map((images: ImageResponse[]) => ({
                ...property,
                firstImageId: images.length > 0 ? images[0].id : undefined
              }))
            )
          );

          forkJoin(imageFetches).subscribe({
            next: (mapped) => {
              this.properties.set(mapped);
              this.loading.set(false);
            },
            error: () => {
              this.properties.set(response.content);
              this.loading.set(false);
            }
          });
        } else {
          this.properties.set([]);
          this.loading.set(false);
        }
      },
      error: () => {
        this.toastService.error('Error fetching property search results.');
        this.loading.set(false);
      }
    });
  }

  applyFilters() {
    this.currentPage.set(0);
    this.fetchProperties();
  }

  resetFilters() {
    this.filters = {
      location: undefined,
      propertyType: undefined,
      status: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minArea: undefined,
      maxArea: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      featured: undefined
    };
    this.currentPage.set(0);
    
    // Clear query parameters in URL without reloading
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
    this.fetchProperties();
  }

  onSortChange() {
    this.currentPage.set(0);
    this.fetchProperties();
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.fetchProperties();
      // Scroll to top of listings
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
