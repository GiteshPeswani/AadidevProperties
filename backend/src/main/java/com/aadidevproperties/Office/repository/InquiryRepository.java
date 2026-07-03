package com.aadidevproperties.Office.repository;

import com.aadidevproperties.Office.model.Inquiry;
import com.aadidevproperties.Office.model.InquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByStatus(InquiryStatus status);
    List<Inquiry> findByPropertyId(Long propertyId);
    long countByStatus(InquiryStatus status);
    List<Inquiry> findTop5ByOrderByCreatedAtDesc();
}
