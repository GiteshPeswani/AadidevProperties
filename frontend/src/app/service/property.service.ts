import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyRequest, PropertyResponse, PropertySearchRequest, ImageResponse } from '../model/property.model';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = '/api/properties';
  private imageApiUrl = '/api/images';

  constructor(private http: HttpClient) {}

  getAllProperties(): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(this.apiUrl);
  }

  getFeaturedProperties(): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(`${this.apiUrl}/featured`);
  }

  getPropertyById(id: number): Observable<PropertyResponse> {
    return this.http.get<PropertyResponse>(`${this.apiUrl}/${id}`);
  }

  searchProperties(
    searchParams: PropertySearchRequest,
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt,desc'
  ): Observable<PageResponse<PropertyResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    if (searchParams.location) params = params.set('location', searchParams.location);
    if (searchParams.propertyType) params = params.set('propertyType', searchParams.propertyType);
    if (searchParams.status) params = params.set('status', searchParams.status);
    if (searchParams.minPrice != null) params = params.set('minPrice', searchParams.minPrice.toString());
    if (searchParams.maxPrice != null) params = params.set('maxPrice', searchParams.maxPrice.toString());
    if (searchParams.minArea != null) params = params.set('minArea', searchParams.minArea.toString());
    if (searchParams.maxArea != null) params = params.set('maxArea', searchParams.maxArea.toString());
    if (searchParams.bedrooms != null) params = params.set('bedrooms', searchParams.bedrooms.toString());
    if (searchParams.bathrooms != null) params = params.set('bathrooms', searchParams.bathrooms.toString());
    if (searchParams.featured != null) params = params.set('featured', searchParams.featured.toString());

    return this.http.get<PageResponse<PropertyResponse>>(`${this.apiUrl}/search`, { params });
  }

  addProperty(property: PropertyRequest): Observable<PropertyResponse> {
    return this.http.post<PropertyResponse>(this.apiUrl, property);
  }

  updateProperty(id: number, property: PropertyRequest): Observable<PropertyResponse> {
    return this.http.put<PropertyResponse>(`${this.apiUrl}/${id}`, property);
  }

  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Image Upload / Retrieval
  uploadImage(propertyId: number, file: File): Observable<ImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImageResponse>(`${this.imageApiUrl}/property/${propertyId}`, formData);
  }

  uploadMultipleImages(propertyId: number, files: File[]): Observable<ImageResponse[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<ImageResponse[]>(`${this.imageApiUrl}/property/${propertyId}/multiple`, formData);
  }

  getPropertyImages(propertyId: number): Observable<ImageResponse[]> {
    return this.http.get<ImageResponse[]>(`${this.imageApiUrl}/property/${propertyId}`);
  }

  deleteImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.imageApiUrl}/${imageId}`, { responseType: 'text' as 'json' });
  }

  getImageUrl(imageId: number): string {
    return `${this.imageApiUrl}/${imageId}`;
  }
}
