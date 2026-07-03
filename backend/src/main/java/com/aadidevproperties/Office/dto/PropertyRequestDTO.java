package com.aadidevproperties.Office.dto;

import com.aadidevproperties.Office.model.PropertyStatus;
import com.aadidevproperties.Office.model.PropertyType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be a positive value")
    private BigDecimal price;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Property type is required")
    private PropertyType propertyType;

    @NotNull(message = "Property status is required")
    private PropertyStatus status;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be a positive value")
    private Double area;

    @Min(value = 0, message = "Bedrooms cannot be negative")
    private Integer bedrooms;

    @Min(value = 0, message = "Bathrooms cannot be negative")
    private Integer bathrooms;

    private Boolean parkingAvailable;

    private Boolean featured;

}
