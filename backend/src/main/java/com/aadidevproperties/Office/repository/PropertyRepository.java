package com.aadidevproperties.Office.repository;

import com.aadidevproperties.Office.model.Property;
import com.aadidevproperties.Office.model.PropertyStatus;
import com.aadidevproperties.Office.model.PropertyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    List<Property> findByLocation(String location);
    List<Property> findByPropertyType(PropertyType type);
    List<Property> findByStatus(PropertyStatus status);
    List<Property> findByFeaturedTrue();
    long countByFeaturedTrue();
    long countByStatus(PropertyStatus status);
    List<Property> findTop5ByOrderByCreatedAtDesc();
}
