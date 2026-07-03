package com.aadidevproperties.Office.service;

import com.aadidevproperties.Office.dto.PropertyRequestDTO;
import com.aadidevproperties.Office.dto.PropertyResponseDTO;

import java.util.List;

public interface PropertyService {
    PropertyResponseDTO addProperty(PropertyRequestDTO dto);
    List<PropertyResponseDTO> getAllProperties();
    PropertyResponseDTO getPropertyById(Long id);
    PropertyResponseDTO updateProperty(Long id, PropertyRequestDTO dto);
    void deleteProperty(Long id);
    List<PropertyResponseDTO> getFeaturedProperties();
}
