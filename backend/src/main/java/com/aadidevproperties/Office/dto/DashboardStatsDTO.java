package com.aadidevproperties.Office.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private Long totalProperties;
    private Long featuredProperties;
    private Long soldProperties;
    private Long rentProperties;
    private Long totalInquiries;
    private Long newInquiries;
    private Long contactedInquiries;
    private Long scheduledVisits;
    private Long closedInquiries;
    private List<InquiryResponseDTO> recentInquiries;
    private List<PropertyResponseDTO> recentProperties;
}
