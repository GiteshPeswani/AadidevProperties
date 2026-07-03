package com.aadidevproperties.Office.controller;

import com.aadidevproperties.Office.dto.InquiryRequestDTO;
import com.aadidevproperties.Office.dto.InquiryResponseDTO;
import com.aadidevproperties.Office.model.InquiryStatus;
import com.aadidevproperties.Office.service.InquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping
    public ResponseEntity<InquiryResponseDTO> createInquiry(@Valid @RequestBody InquiryRequestDTO dto) {
        InquiryResponseDTO response = inquiryService.createInquiry(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<InquiryResponseDTO>> getAllInquiries() {
        List<InquiryResponseDTO> response = inquiryService.getAllInquiries();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InquiryResponseDTO> getInquiryById(@PathVariable Long id) {
        InquiryResponseDTO response = inquiryService.getInquiryById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<InquiryResponseDTO> updateInquiryStatus(
            @PathVariable Long id,
            @RequestParam InquiryStatus status
    ) {
        InquiryResponseDTO response = inquiryService.updateInquiryStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInquiry(@PathVariable Long id) {
        inquiryService.deleteInquiry(id);
        return ResponseEntity.ok("Inquiry deleted successfully!");
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<InquiryResponseDTO>> getInquiriesByProperty(@PathVariable Long propertyId) {
        List<InquiryResponseDTO> response = inquiryService.getInquiriesByProperty(propertyId);
        return ResponseEntity.ok(response);
    }
}
