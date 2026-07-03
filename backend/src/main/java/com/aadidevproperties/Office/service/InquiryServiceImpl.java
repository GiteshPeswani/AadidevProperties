package com.aadidevproperties.Office.service;

import com.aadidevproperties.Office.dto.InquiryRequestDTO;
import com.aadidevproperties.Office.dto.InquiryResponseDTO;
import com.aadidevproperties.Office.exception.InquiryNotFoundException;
import com.aadidevproperties.Office.exception.PropertyNotFoundException;
import com.aadidevproperties.Office.model.Inquiry;
import com.aadidevproperties.Office.model.InquiryStatus;
import com.aadidevproperties.Office.model.Property;
import com.aadidevproperties.Office.repository.InquiryRepository;
import com.aadidevproperties.Office.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InquiryServiceImpl implements InquiryService {

    private final InquiryRepository inquiryRepository;
    private final PropertyRepository propertyRepository;

    public InquiryServiceImpl(InquiryRepository inquiryRepository, PropertyRepository propertyRepository) {
        this.inquiryRepository = inquiryRepository;
        this.propertyRepository = propertyRepository;
    }

    @Override
    @Transactional
    public InquiryResponseDTO createInquiry(InquiryRequestDTO dto) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + dto.getPropertyId()));

        Inquiry inquiry = Inquiry.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .message(dto.getMessage())
                .status(InquiryStatus.NEW)
                .property(property)
                .build();

        Inquiry savedInquiry = inquiryRepository.save(inquiry);
        return mapToResponseDTO(savedInquiry);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InquiryResponseDTO> getAllInquiries() {
        return inquiryRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InquiryResponseDTO getInquiryById(Long id) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new InquiryNotFoundException("Inquiry not found with id: " + id));
        return mapToResponseDTO(inquiry);
    }

    @Override
    @Transactional
    public InquiryResponseDTO updateInquiryStatus(Long id, InquiryStatus status) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new InquiryNotFoundException("Inquiry not found with id: " + id));

        inquiry.setStatus(status);
        Inquiry updatedInquiry = inquiryRepository.save(inquiry);
        return mapToResponseDTO(updatedInquiry);
    }

    @Override
    @Transactional
    public void deleteInquiry(Long id) {
        if (!inquiryRepository.existsById(id)) {
            throw new InquiryNotFoundException("Inquiry not found with id: " + id);
        }
        inquiryRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InquiryResponseDTO> getInquiriesByProperty(Long propertyId) {
        if (!propertyRepository.existsById(propertyId)) {
            throw new PropertyNotFoundException("Property not found with id: " + propertyId);
        }
        return inquiryRepository.findByPropertyId(propertyId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Helper: Map Entity to Response DTO
    private InquiryResponseDTO mapToResponseDTO(Inquiry inquiry) {
        return InquiryResponseDTO.builder()
                .id(inquiry.getId())
                .name(inquiry.getName())
                .email(inquiry.getEmail())
                .phoneNumber(inquiry.getPhoneNumber())
                .message(inquiry.getMessage())
                .status(inquiry.getStatus())
                .propertyTitle(inquiry.getProperty() != null ? inquiry.getProperty().getTitle() : null)
                .createdAt(inquiry.getCreatedAt())
                .build();
    }
}
