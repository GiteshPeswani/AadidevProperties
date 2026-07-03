package com.aadidevproperties.Office.service;

import com.aadidevproperties.Office.dto.PropertySearchRequestDTO;
import com.aadidevproperties.Office.dto.PropertyResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PropertySearchService {
    Page<PropertyResponseDTO> searchProperties(PropertySearchRequestDTO dto, Pageable pageable);
}
