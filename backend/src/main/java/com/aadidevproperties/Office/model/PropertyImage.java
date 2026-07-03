package com.aadidevproperties.Office.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_name", nullable = false)
    private String imageName;

    @Column(name = "content_type", nullable = false)
    private String contentType;

    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB", nullable = false)
    private byte[] imageData;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
}
