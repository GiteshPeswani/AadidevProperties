package com.aadidevproperties.Office.controller;

import com.aadidevproperties.Office.dto.PropertyRequestDTO;
import com.aadidevproperties.Office.dto.PropertyResponseDTO;
import com.aadidevproperties.Office.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aadidevproperties.Office.dto.PropertySearchRequestDTO;
import com.aadidevproperties.Office.service.PropertySearchService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final PropertySearchService propertySearchService;

    public PropertyController(PropertyService propertyService, PropertySearchService propertySearchService) {
        this.propertyService = propertyService;
        this.propertySearchService = propertySearchService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PropertyResponseDTO>> searchProperties(
            PropertySearchRequestDTO request,
            Pageable pageable
    ) {
        Page<PropertyResponseDTO> response = propertySearchService.searchProperties(request, pageable);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<PropertyResponseDTO> addProperty(@Valid @RequestBody PropertyRequestDTO dto) {
        PropertyResponseDTO createdProperty = propertyService.addProperty(dto);
        return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponseDTO>> getAllProperties() {
        List<PropertyResponseDTO> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> getPropertyById(@PathVariable Long id) {
        PropertyResponseDTO property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequestDTO dto
    ) {
        PropertyResponseDTO updatedProperty = propertyService.updateProperty(id, dto);
        return ResponseEntity.ok(updatedProperty);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PropertyResponseDTO>> getFeaturedProperties() {
        List<PropertyResponseDTO> featuredProperties = propertyService.getFeaturedProperties();
        return ResponseEntity.ok(featuredProperties);
    }
}
