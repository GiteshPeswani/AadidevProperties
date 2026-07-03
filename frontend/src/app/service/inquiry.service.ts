import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InquiryRequest, InquiryResponse, InquiryStatus } from '../model/inquiry.model';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private apiUrl = '/api/inquiries';

  constructor(private http: HttpClient) {}

  createInquiry(request: InquiryRequest): Observable<InquiryResponse> {
    return this.http.post<InquiryResponse>(this.apiUrl, request);
  }

  getAllInquiries(): Observable<InquiryResponse[]> {
    return this.http.get<InquiryResponse[]>(this.apiUrl);
  }

  getInquiryById(id: number): Observable<InquiryResponse> {
    return this.http.get<InquiryResponse>(`${this.apiUrl}/${id}`);
  }

  updateInquiryStatus(id: number, status: InquiryStatus): Observable<InquiryResponse> {
    let params = new HttpParams().set('status', status);
    return this.http.put<InquiryResponse>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  deleteInquiry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' });
  }

  getInquiriesByProperty(propertyId: number): Observable<InquiryResponse[]> {
    return this.http.get<InquiryResponse[]>(`${this.apiUrl}/property/${propertyId}`);
  }
}
