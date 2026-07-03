package com.aadidevproperties.Office.dto;

import com.aadidevproperties.Office.model.InquiryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String message;
    private InquiryStatus status;
    private String propertyTitle;
    private LocalDateTime createdAt;
}
