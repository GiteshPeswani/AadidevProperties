export enum InquiryStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  VISIT_SCHEDULED = 'VISIT_SCHEDULED',
  CLOSED = 'CLOSED'
}

export interface InquiryRequest {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  propertyId: number;
}

export interface InquiryResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  status: InquiryStatus;
  propertyTitle: string;
  createdAt: string;
}
