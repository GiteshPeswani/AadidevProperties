package com.aadidevproperties.Office.service;

import com.aadidevproperties.Office.dto.ImageResponseDTO;
import com.aadidevproperties.Office.exception.ImageNotFoundException;
import com.aadidevproperties.Office.exception.ImageUploadException;
import com.aadidevproperties.Office.exception.PropertyNotFoundException;
import com.aadidevproperties.Office.model.Property;
import com.aadidevproperties.Office.model.PropertyImage;
import com.aadidevproperties.Office.repository.PropertyImageRepository;
import com.aadidevproperties.Office.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImageServiceImpl implements ImageService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png", "image/webp");

    private final PropertyImageRepository propertyImageRepository;
    private final PropertyRepository propertyRepository;

    public ImageServiceImpl(PropertyImageRepository propertyImageRepository, PropertyRepository propertyRepository) {
        this.propertyImageRepository = propertyImageRepository;
        this.propertyRepository = propertyRepository;
    }

    @Override
    @Transactional
    public ImageResponseDTO uploadImage(Long propertyId, MultipartFile file) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + propertyId));

        validateFile(file);

        try {
            PropertyImage image = PropertyImage.builder()
                    .imageName(file.getOriginalFilename())
                    .contentType(file.getContentType())
                    .imageData(file.getBytes())
                    .property(property)
                    .build();

            PropertyImage savedImage = propertyImageRepository.save(image);
            return mapToResponseDTO(savedImage);
        } catch (IOException e) {
            throw new ImageUploadException("Failed to read image bytes: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public List<ImageResponseDTO> uploadMultipleImages(Long propertyId, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new ImageUploadException("No files uploaded");
        }

        return files.stream()
                .map(file -> uploadImage(propertyId, file))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] getImage(Long imageId) {
        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ImageNotFoundException("Image not found with id: " + imageId));
        return image.getImageData();
    }

    @Override
    @Transactional
    public void deleteImage(Long imageId) {
        if (!propertyImageRepository.existsById(imageId)) {
            throw new ImageNotFoundException("Image not found with id: " + imageId);
        }
        propertyImageRepository.deleteById(imageId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImageResponseDTO> getPropertyImages(Long propertyId) {
        if (!propertyRepository.existsById(propertyId)) {
            throw new PropertyNotFoundException("Property not found with id: " + propertyId);
        }
        return propertyImageRepository.findByPropertyId(propertyId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Validation helper
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ImageUploadException("File cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ImageUploadException("File size exceeds maximum limit of 10 MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new ImageUploadException("Unsupported file format. Only JPEG, PNG, and WEBP are allowed");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyImage getPropertyImageEntity(Long imageId) {
        return propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ImageNotFoundException("Image not found with id: " + imageId));
    }

    // Helper: Map Entity to Response DTO
    private ImageResponseDTO mapToResponseDTO(PropertyImage image) {
        return ImageResponseDTO.builder()
                .id(image.getId())
                .imageName(image.getImageName())
                .contentType(image.getContentType())
                .build();
    }
}
