export enum PropertyType {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  PLOT = 'PLOT',
  COMMERCIAL = 'COMMERCIAL'
}

export enum PropertyStatus {
  FOR_SALE = 'FOR_SALE',
  FOR_RENT = 'FOR_RENT',
  SOLD = 'SOLD'
}

export interface PropertyRequest {
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingAvailable: boolean;
  featured: boolean;
}

export interface PropertyResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingAvailable: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertySearchRequest {
  location?: string;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  featured?: boolean;
}

export interface ImageResponse {
  id: number;
  imageName: string;
  contentType: string;
}
