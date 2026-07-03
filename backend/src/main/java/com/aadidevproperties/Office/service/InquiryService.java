package com.aadidevproperties.Office.service;

import com.aadidevproperties.Office.dto.InquiryRequestDTO;
import com.aadidevproperties.Office.dto.InquiryResponseDTO;
import com.aadidevproperties.Office.model.InquiryStatus;

import java.util.List;

public interface InquiryService {
    InquiryResponseDTO createInquiry(InquiryRequestDTO dto);
    List<InquiryResponseDTO> getAllInquiries();
    InquiryResponseDTO getInquiryById(Long id);
    InquiryResponseDTO updateInquiryStatus(Long id, InquiryStatus status);
    void deleteInquiry(Long id);
    List<InquiryResponseDTO> getInquiriesByProperty(Long propertyId);
}
