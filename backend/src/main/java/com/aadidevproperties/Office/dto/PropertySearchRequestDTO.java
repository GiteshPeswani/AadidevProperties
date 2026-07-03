package com.aadidevproperties.Office.dto;

import com.aadidevproperties.Office.model.PropertyStatus;
import com.aadidevproperties.Office.model.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertySearchRequestDTO {
    private String location;
    private PropertyType propertyType;
    private PropertyStatus status;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Double minArea;
    private Double maxArea;
    private Integer bedrooms;
    private Integer bathrooms;
    private Boolean featured;
}
