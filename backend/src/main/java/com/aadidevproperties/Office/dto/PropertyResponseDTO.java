package com.aadidevproperties.Office.dto;

import com.aadidevproperties.Office.model.PropertyStatus;
import com.aadidevproperties.Office.model.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyResponseDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String location;
    private PropertyType propertyType;
    private PropertyStatus status;
    private Double area;
    private Integer bedrooms;
    private Integer bathrooms;
    private Boolean parkingAvailable;
    private Boolean featured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
