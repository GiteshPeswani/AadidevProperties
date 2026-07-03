import { PropertyResponse } from './property.model';
import { InquiryResponse } from './inquiry.model';

export interface DashboardStats {
  totalProperties: number;
  featuredProperties: number;
  soldProperties: number;
  rentProperties: number;
  totalInquiries: number;
  newInquiries: number;
  contactedInquiries: number;
  scheduledVisits: number;
  closedInquiries: number;
  recentInquiries: InquiryResponse[];
  recentProperties: PropertyResponse[];
}
