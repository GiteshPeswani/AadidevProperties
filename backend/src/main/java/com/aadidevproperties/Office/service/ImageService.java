package com.aadidevproperties.Office.service;

import com.aadidevproperties.Office.dto.ImageResponseDTO;
import com.aadidevproperties.Office.model.PropertyImage;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    ImageResponseDTO uploadImage(Long propertyId, MultipartFile file);
    List<ImageResponseDTO> uploadMultipleImages(Long propertyId, List<MultipartFile> files);
    byte[] getImage(Long imageId);
    void deleteImage(Long imageId);
    List<ImageResponseDTO> getPropertyImages(Long propertyId);
    PropertyImage getPropertyImageEntity(Long imageId);
}
