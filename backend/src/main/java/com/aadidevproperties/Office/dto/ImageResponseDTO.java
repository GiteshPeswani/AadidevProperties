package com.aadidevproperties.Office.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageResponseDTO {
    private Long id;
    private String imageName;
    private String contentType;
}
