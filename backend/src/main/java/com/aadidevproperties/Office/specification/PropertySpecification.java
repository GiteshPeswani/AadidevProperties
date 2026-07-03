package com.aadidevproperties.Office.specification;

import com.aadidevproperties.Office.model.Property;
import com.aadidevproperties.Office.model.PropertyStatus;
import com.aadidevproperties.Office.model.PropertyType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class PropertySpecification {

    public static Specification<Property> hasLocation(String location) {
        return (root, query, cb) -> {
            if (location == null || location.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%");
        };
    }

    public static Specification<Property> hasPropertyType(PropertyType type) {
        return (root, query, cb) -> {
            if (type == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("propertyType"), type);
        };
    }

    public static Specification<Property> hasStatus(PropertyStatus status) {
        return (root, query, cb) -> {
            if (status == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<Property> priceGreaterThanOrEqual(BigDecimal minPrice) {
        return (root, query, cb) -> {
            if (minPrice == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
        };
    }

    public static Specification<Property> priceLessThanOrEqual(BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (maxPrice == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    public static Specification<Property> areaGreaterThanOrEqual(Double minArea) {
        return (root, query, cb) -> {
            if (minArea == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("area"), minArea);
        };
    }

    public static Specification<Property> areaLessThanOrEqual(Double maxArea) {
        return (root, query, cb) -> {
            if (maxArea == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("area"), maxArea);
        };
    }

    public static Specification<Property> hasBedrooms(Integer bedrooms) {
        return (root, query, cb) -> {
            if (bedrooms == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("bedrooms"), bedrooms);
        };
    }

    public static Specification<Property> hasBathrooms(Integer bathrooms) {
        return (root, query, cb) -> {
            if (bathrooms == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("bathrooms"), bathrooms);
        };
    }

    public static Specification<Property> isFeatured(Boolean featured) {
        return (root, query, cb) -> {
            if (featured == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("featured"), featured);
        };
    }
}
