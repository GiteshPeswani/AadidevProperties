import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PropertyService } from '../../../service/property.service';
import { ToastService } from '../../../service/toast.service';
import { PropertyResponse, PropertyType, PropertyStatus, ImageResponse } from '../../../model/property.model';

@Component({
  selector: 'app-admin-properties',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-8">
      <!-- Title & CTA -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Property Management</h1>
          <p class="text-slate-500 text-sm">Add, update, upload images, or delete property listings.</p>
        </div>
        <button (click)="openAddModal()" 
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span>Add New Property</span>
        </button>
      </div>

      <!-- Properties Table -->
      <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <!-- Table Search / Header -->
        <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input type="text" [(ngModel)]="searchQuery" (input)="filterTable()" placeholder="Search properties by title or location..."
                 class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm max-w-md w-full focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
          <span class="text-xs text-slate-400 font-semibold">{{ filteredProperties().length }} Items Listed</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th class="p-5">ID</th>
                <th class="p-5">Title</th>
                <th class="p-5">Location</th>
                <th class="p-5">Type / Status</th>
                <th class="p-5">Price</th>
                <th class="p-5">Featured</th>
                <th class="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-600">
              <tr *ngFor="let prop of filteredProperties()" class="hover:bg-slate-50/60 transition-colors">
                <td class="p-5 font-bold text-slate-900">#{{ prop.id }}</td>
                <td class="p-5">
                  <div class="font-bold text-slate-900">{{ prop.title }}</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">Area: {{ prop.area }} sqft &bull; Bed: {{ prop.bedrooms }} &bull; Bath: {{ prop.bathrooms }}</div>
                </td>
                <td class="p-5">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>{{ prop.location }}</span>
                  </div>
                </td>
                <td class="p-5">
                  <div class="font-medium text-slate-700 text-xs uppercase">{{ prop.propertyType }}</div>
                  <span [ngClass]="{
                          'bg-emerald-50 text-emerald-700 border-emerald-100': prop.status === PropertyStatus.FOR_SALE,
                          'bg-blue-50 text-blue-700 border-blue-100': prop.status === PropertyStatus.FOR_RENT,
                          'bg-slate-50 text-slate-600 border-slate-200': prop.status === PropertyStatus.SOLD
                        }"
                        class="border text-[9px] font-bold py-0.5 px-2 rounded-full uppercase tracking-wider mt-1 inline-block">
                    {{ prop.status.replace('_', ' ') }}
                  </span>
                </td>
                <td class="p-5 font-extrabold text-slate-950">₹{{ prop.price | number }}</td>
                <td class="p-5">
                  <span *ngIf="prop.featured" class="text-amber-500">
                    <svg class="w-4 h-4 text-amber-500 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </span>
                  <span *ngIf="!prop.featured" class="text-slate-300">-</span>
                </td>
                <td class="p-5 text-right space-x-1.5 flex items-center justify-end">
                  <button (click)="openImageModal(prop)" title="Manage Images" 
                          class="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors focus:outline-none flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </button>
                  <button (click)="openEditModal(prop)" title="Edit" 
                          class="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors focus:outline-none flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button (click)="deleteProperty(prop.id)" title="Delete" 
                          class="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors focus:outline-none flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredProperties().length === 0" class="text-center text-slate-400">
                <td colspan="7" class="p-10">No properties matching filters found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="isModalOpen()" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="bg-slate-900 text-white p-6 flex justify-between items-center">
            <h3 class="font-extrabold text-lg">{{ modalTitle() }}</h3>
            <button (click)="closeModal()" class="text-slate-400 hover:text-white transition-colors text-xl focus:outline-none">✕</button>
          </div>

          <!-- Modal Body Form -->
          <form [formGroup]="propertyForm" (submit)="saveProperty()" class="p-6 overflow-y-auto space-y-4 text-sm flex-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Title -->
              <div class="space-y-1.5">
                <label class="font-semibold text-slate-700">Property Title</label>
                <input type="text" formControlName="title" placeholder="e.g. Skyline Duplex Apartment"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              </div>

              <!-- Location -->
              <div class="space-y-1.5">
                <label class="font-semibold text-slate-700">Location</label>
                <input type="text" formControlName="location" placeholder="e.g. Sector 54, Gurugram"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-1.5">
              <label class="font-semibold text-slate-700">Description</label>
              <textarea formControlName="description" rows="4" placeholder="Describe the listing amenities, highlights..."
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors resize-none"></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Price -->
              <div class="space-y-1.5">
                <label class="font-semibold text-slate-700">Price (₹)</label>
                <input type="number" formControlName="price" placeholder="15000000"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              </div>

              <!-- Property Type -->
              <div class="space-y-1.5">
                <label class="font-semibold text-slate-700">Property Type</label>
                <select formControlName="propertyType"
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                  <option [value]="PropertyType.APARTMENT">Apartment</option>
                  <option [value]="PropertyType.VILLA">Villa</option>
                  <option [value]="PropertyType.COMMERCIAL">Commercial</option>
                  <option [value]="PropertyType.PLOT">Plot</option>
                </select>
              </div>

              <!-- Property Status -->
              <div class="space-y-1.5">
                <label class="font-semibold text-slate-700">Property Status</label>
                <select formControlName="status"
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
                  <option [value]="PropertyStatus.FOR_SALE">For Sale</option>
                  <option [value]="PropertyStatus.FOR_RENT">For Rent</option>
                  <option [value]="PropertyStatus.SOLD">Sold</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Area -->
              <div class="space-y-1.5">
                <label class="font-semibold text-slate-700">Area (sqft)</label>
                <input type="number" formControlName="area" placeholder="1800"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              </div>

              <!-- Bedrooms -->
              <div class="space-y-1.5">
                <label class="font-semibold text-slate-700">Bedrooms</label>
                <input type="number" formControlName="bedrooms" placeholder="3"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              </div>

              <!-- Bathrooms -->
              <div class="space-y-1.5">
                <label class="font-semibold text-slate-700">Bathrooms</label>
                <input type="number" formControlName="bathrooms" placeholder="3"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-2">
              <!-- Parking -->
              <div class="flex items-center gap-2">
                <input type="checkbox" formControlName="parkingAvailable" id="modalParking"
                       class="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500">
                <label for="modalParking" class="font-semibold text-slate-700 select-none">Parking Available</label>
              </div>

              <!-- Featured -->
              <div class="flex items-center gap-2">
                <input type="checkbox" formControlName="featured" id="modalFeatured"
                       class="h-4 w-4 text-amber-500 border-slate-300 rounded focus:ring-amber-500">
                <label for="modalFeatured" class="font-semibold text-slate-700 select-none">Mark as Featured</label>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <button type="button" (click)="closeModal()"
                      class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-5 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" [disabled]="propertyForm.invalid || saving()"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-md">
                {{ saving() ? 'Saving...' : 'Save Catalog' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Image Management Modal -->
      <div *ngIf="isImageModalOpen()" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[85vh]">
          <!-- Header -->
          <div class="bg-slate-900 text-white p-6 flex justify-between items-center">
            <div>
              <h3 class="font-extrabold text-lg">Manage Property Images</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ selectedProperty()?.title }}</p>
            </div>
            <button (click)="closeImageModal()" class="text-slate-400 hover:text-white transition-colors text-xl focus:outline-none">✕</button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
            <!-- Upload Box -->
            <div class="border-2 border-dashed border-slate-200 hover:border-amber-500/80 rounded-2xl p-6 text-center transition-all bg-slate-50/50">
              <input type="file" multiple (change)="onFileSelected($event)" id="imageUploadInput" class="hidden">
              <label for="imageUploadInput" class="cursor-pointer space-y-2.5 block">
                <svg class="w-8 h-8 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <p class="font-bold text-slate-700">Click to upload property images</p>
                <p class="text-xs text-slate-400">Supports PNG, JPG or JPEG. Multiple files allowed.</p>
              </label>
            </div>

            <!-- Current Images List -->
            <div class="space-y-3">
              <h4 class="font-bold text-slate-900 text-sm">Uploaded Images ({{ propertyImages().length }})</h4>
              
              <!-- Loader inside image list -->
              <div *ngIf="loadingImages()" class="grid grid-cols-3 gap-3 animate-pulse">
                <div *ngFor="let x of [1,2,3]" class="bg-slate-200 rounded-xl h-24"></div>
              </div>

              <!-- Images Grid -->
              <div *ngIf="!loadingImages() && propertyImages().length > 0" class="grid grid-cols-3 gap-3">
                <div *ngFor="let img of propertyImages()" class="relative rounded-xl overflow-hidden border border-slate-100 group h-24">
                  <img [src]="propertyService.getImageUrl(img.id)" 
                       class="w-full h-full object-cover">
                  <!-- Delete button overlay -->
                  <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <button (click)="deleteImage(img.id)" 
                            class="bg-rose-600 hover:bg-rose-500 text-white rounded-lg p-1.5 shadow-md focus:outline-none transition-colors text-xs">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div *ngIf="!loadingImages() && propertyImages().length === 0" class="text-center py-6 text-slate-400 border border-dashed border-slate-100 rounded-xl">
                No images uploaded yet.
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t border-slate-100 text-right">
            <button (click)="closeImageModal()" class="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-6 rounded-xl transition-colors">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in {
      animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class AdminPropertiesComponent implements OnInit {
  propertyService = inject(PropertyService);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);

  PropertyType = PropertyType;
  PropertyStatus = PropertyStatus;

  // States
  allProperties = signal<PropertyResponse[]>([]);
  filteredProperties = signal<PropertyResponse[]>([]);
  searchQuery = '';

  // Add/Edit Modal
  isModalOpen = signal(false);
  modalTitle = signal('Add Property');
  saving = signal(false);
  editMode = signal(false);
  editingId: number | null = null;
  propertyForm!: FormGroup;

  // Image Management Modal
  isImageModalOpen = signal(false);
  selectedProperty = signal<PropertyResponse | null>(null);
  propertyImages = signal<ImageResponse[]>([]);
  loadingImages = signal(false);

  ngOnInit() {
    this.initForm();
    this.fetchProperties();
  }

  initForm() {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      propertyType: [PropertyType.APARTMENT, Validators.required],
      status: [PropertyStatus.FOR_SALE, Validators.required],
      area: [0, [Validators.required, Validators.min(1)]],
      bedrooms: [0, [Validators.required, Validators.min(0)]],
      bathrooms: [0, [Validators.required, Validators.min(0)]],
      parkingAvailable: [false],
      featured: [false]
    });
  }

  fetchProperties() {
    this.propertyService.getAllProperties().subscribe({
      next: (list) => {
        this.allProperties.set(list);
        this.filterTable();
      },
      error: () => {
        this.toastService.error('Failed to retrieve properties inventory.');
      }
    });
  }

  filterTable() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredProperties.set(this.allProperties());
      return;
    }
    const filtered = this.allProperties().filter(p =>
      p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
    );
    this.filteredProperties.set(filtered);
  }

  openAddModal() {
    this.editMode.set(false);
    this.modalTitle.set('Add New Property');
    this.propertyForm.reset({
      title: '',
      description: '',
      price: '',
      location: '',
      propertyType: PropertyType.APARTMENT,
      status: PropertyStatus.FOR_SALE,
      area: '',
      bedrooms: 0,
      bathrooms: 0,
      parkingAvailable: false,
      featured: false
    });
    this.isModalOpen.set(true);
  }

  openEditModal(property: PropertyResponse) {
    this.editMode.set(true);
    this.editingId = property.id;
    this.modalTitle.set(`Edit Property #${property.id}`);
    this.propertyForm.patchValue({
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      propertyType: property.propertyType,
      status: property.status,
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parkingAvailable: property.parkingAvailable,
      featured: property.featured
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingId = null;
  }

  saveProperty() {
    if (this.propertyForm.invalid) return;

    this.saving.set(true);
    const formData = this.propertyForm.value;

    if (this.editMode()) {
      // Update Mode
      this.propertyService.updateProperty(this.editingId!, formData).subscribe({
        next: () => {
          this.toastService.success('Property details updated successfully.');
          this.fetchProperties();
          this.closeModal();
          this.saving.set(false);
        },
        error: () => {
          this.toastService.error('Error saving property changes.');
          this.saving.set(false);
        }
      });
    } else {
      // Create Mode
      this.propertyService.addProperty(formData).subscribe({
        next: () => {
          this.toastService.success('New property added to listings catalog.');
          this.fetchProperties();
          this.closeModal();
          this.saving.set(false);
        },
        error: () => {
          this.toastService.error('Error adding new property.');
          this.saving.set(false);
        }
      });
    }
  }

  deleteProperty(id: number) {
    if (confirm('Are you sure you want to permanently delete this property? This action cannot be undone.')) {
      this.propertyService.deleteProperty(id).subscribe({
        next: () => {
          this.toastService.success('Property deleted successfully.');
          this.fetchProperties();
        },
        error: () => {
          this.toastService.error('Error purging property from catalog.');
        }
      });
    }
  }

  // IMAGE MANAGEMENT
  openImageModal(property: PropertyResponse) {
    this.selectedProperty.set(property);
    this.isImageModalOpen.set(true);
    this.fetchImages();
  }

  closeImageModal() {
    this.isImageModalOpen.set(false);
    this.selectedProperty.set(null);
    this.propertyImages.set([]);
  }

  fetchImages() {
    const prop = this.selectedProperty();
    if (!prop) return;

    this.loadingImages.set(true);
    this.propertyService.getPropertyImages(prop.id).subscribe({
      next: (list) => {
        this.propertyImages.set(list);
        this.loadingImages.set(false);
      },
      error: () => {
        this.toastService.error('Failed to retrieve listing images.');
        this.loadingImages.set(false);
      }
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const prop = this.selectedProperty();
    if (!prop || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    this.loadingImages.set(true);

    this.propertyService.uploadMultipleImages(prop.id, fileList).subscribe({
      next: () => {
        this.toastService.success('Property image uploads complete.');
        this.fetchImages();
      },
      error: () => {
        this.toastService.error('Failed to complete upload of images.');
        this.loadingImages.set(false);
      }
    });
  }

  deleteImage(imageId: number) {
    if (confirm('Delete this image?')) {
      this.propertyService.deleteImage(imageId).subscribe({
        next: () => {
          this.toastService.success('Image deleted.');
          this.fetchImages();
        },
        error: () => {
          this.toastService.error('Error deleting image.');
        }
      });
    }
  }
}
