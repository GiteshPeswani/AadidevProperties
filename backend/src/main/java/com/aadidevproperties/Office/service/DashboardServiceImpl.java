package com.aadidevproperties.Office.service;

import com.aadidevproperties.Office.dto.DashboardStatsDTO;
import com.aadidevproperties.Office.dto.InquiryResponseDTO;
import com.aadidevproperties.Office.dto.PropertyResponseDTO;
import com.aadidevproperties.Office.model.Inquiry;
import com.aadidevproperties.Office.model.InquiryStatus;
import com.aadidevproperties.Office.model.Property;
import com.aadidevproperties.Office.model.PropertyStatus;
import com.aadidevproperties.Office.repository.InquiryRepository;
import com.aadidevproperties.Office.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final PropertyRepository propertyRepository;
    private final InquiryRepository inquiryRepository;

    public DashboardServiceImpl(PropertyRepository propertyRepository, InquiryRepository inquiryRepository) {
        this.propertyRepository = propertyRepository;
        this.inquiryRepository = inquiryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        long totalProperties = propertyRepository.count();
        long featuredProperties = propertyRepository.countByFeaturedTrue();
        long soldProperties = propertyRepository.countByStatus(PropertyStatus.SOLD);
        long rentProperties = propertyRepository.countByStatus(PropertyStatus.FOR_RENT);

        long totalInquiries = inquiryRepository.count();
        long newInquiries = inquiryRepository.countByStatus(InquiryStatus.NEW);
        long contactedInquiries = inquiryRepository.countByStatus(InquiryStatus.CONTACTED);
        long scheduledVisits = inquiryRepository.countByStatus(InquiryStatus.VISIT_SCHEDULED);
        long closedInquiries = inquiryRepository.countByStatus(InquiryStatus.CLOSED);

        List<PropertyResponseDTO> recentProperties = propertyRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToPropertyResponseDTO)
                .collect(Collectors.toList());

        List<InquiryResponseDTO> recentInquiries = inquiryRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToInquiryResponseDTO)
                .collect(Collectors.toList());

        return DashboardStatsDTO.builder()
                .totalProperties(totalProperties)
                .featuredProperties(featuredProperties)
                .soldProperties(soldProperties)
                .rentProperties(rentProperties)
                .totalInquiries(totalInquiries)
                .newInquiries(newInquiries)
                .contactedInquiries(contactedInquiries)
                .scheduledVisits(scheduledVisits)
                .closedInquiries(closedInquiries)
                .recentProperties(recentProperties)
                .recentInquiries(recentInquiries)
                .build();
    }

    // Helper: Map Property Entity to Response DTO
    private PropertyResponseDTO mapToPropertyResponseDTO(Property property) {
        return PropertyResponseDTO.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .price(property.getPrice())
                .location(property.getLocation())
                .propertyType(property.getPropertyType())
                .status(property.getStatus())
                .area(property.getArea())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .parkingAvailable(property.getParkingAvailable())
                .featured(property.getFeatured())
                .createdAt(property.getCreatedAt())
                .updatedAt(property.getUpdatedAt())
                .build();
    }

    // Helper: Map Inquiry Entity to Response DTO
    private InquiryResponseDTO mapToInquiryResponseDTO(Inquiry inquiry) {
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
