package com.aadidevproperties.Office.service;

import com.aadidevproperties.Office.dto.PropertySearchRequestDTO;
import com.aadidevproperties.Office.dto.PropertyResponseDTO;
import com.aadidevproperties.Office.model.Property;
import com.aadidevproperties.Office.repository.PropertyRepository;
import com.aadidevproperties.Office.specification.PropertySpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PropertySearchServiceImpl implements PropertySearchService {

    private final PropertyRepository propertyRepository;

    public PropertySearchServiceImpl(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyResponseDTO> searchProperties(PropertySearchRequestDTO dto, Pageable pageable) {
        Specification<Property> spec = Specification.where(PropertySpecification.hasLocation(dto.getLocation()))
                .and(PropertySpecification.hasPropertyType(dto.getPropertyType()))
                .and(PropertySpecification.hasStatus(dto.getStatus()))
                .and(PropertySpecification.priceGreaterThanOrEqual(dto.getMinPrice()))
                .and(PropertySpecification.priceLessThanOrEqual(dto.getMaxPrice()))
                .and(PropertySpecification.areaGreaterThanOrEqual(dto.getMinArea()))
                .and(PropertySpecification.areaLessThanOrEqual(dto.getMaxArea()))
                .and(PropertySpecification.hasBedrooms(dto.getBedrooms()))
                .and(PropertySpecification.hasBathrooms(dto.getBathrooms()))
                .and(PropertySpecification.isFeatured(dto.getFeatured()));

        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);
        return propertyPage.map(this::mapToResponseDTO);
    }

    // Helper: Map Entity to Response DTO
    private PropertyResponseDTO mapToResponseDTO(Property property) {
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
}
