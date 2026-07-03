package com.aadidevproperties.Office.service;

import com.aadidevproperties.Office.dto.PropertyRequestDTO;
import com.aadidevproperties.Office.dto.PropertyResponseDTO;
import com.aadidevproperties.Office.exception.PropertyNotFoundException;
import com.aadidevproperties.Office.model.Property;
import com.aadidevproperties.Office.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyServiceImpl(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @Override
    @Transactional
    public PropertyResponseDTO addProperty(PropertyRequestDTO dto) {
        Property property = mapToEntity(dto);
        Property savedProperty = propertyRepository.save(property);
        return mapToResponseDTO(savedProperty);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponseDTO> getAllProperties() {
        return propertyRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyResponseDTO getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + id));
        return mapToResponseDTO(property);
    }

    @Override
    @Transactional
    public PropertyResponseDTO updateProperty(Long id, PropertyRequestDTO dto) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + id));

        // Update fields
        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setPrice(dto.getPrice());
        property.setLocation(dto.getLocation());
        property.setPropertyType(dto.getPropertyType());
        property.setStatus(dto.getStatus());
        property.setArea(dto.getArea());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setParkingAvailable(dto.getParkingAvailable());
        property.setFeatured(dto.getFeatured());

        Property updatedProperty = propertyRepository.save(property);
        return mapToResponseDTO(updatedProperty);
    }

    @Override
    @Transactional
    public void deleteProperty(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new PropertyNotFoundException("Property not found with id: " + id);
        }
        propertyRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponseDTO> getFeaturedProperties() {
        return propertyRepository.findByFeaturedTrue()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Helper: Map Request DTO to Entity
    private Property mapToEntity(PropertyRequestDTO dto) {
        return Property.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .location(dto.getLocation())
                .propertyType(dto.getPropertyType())
                .status(dto.getStatus())
                .area(dto.getArea())
                .bedrooms(dto.getBedrooms())
                .bathrooms(dto.getBathrooms())
                .parkingAvailable(dto.getParkingAvailable() != null ? dto.getParkingAvailable() : false)
                .featured(dto.getFeatured() != null ? dto.getFeatured() : false)
                .build();
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
