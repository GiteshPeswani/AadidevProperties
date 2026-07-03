package com.aadidevproperties.Office.controller;

import com.aadidevproperties.Office.dto.ImageResponseDTO;
import com.aadidevproperties.Office.model.PropertyImage;
import com.aadidevproperties.Office.service.ImageService;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/property/{propertyId}")
    public ResponseEntity<ImageResponseDTO> uploadImage(
            @PathVariable Long propertyId,
            @RequestParam("file") MultipartFile file
    ) {
        ImageResponseDTO response = imageService.uploadImage(propertyId, file);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/property/{propertyId}/multiple")
    public ResponseEntity<List<ImageResponseDTO>> uploadMultipleImages(
            @PathVariable Long propertyId,
            @RequestParam("files") List<MultipartFile> files
    ) {
        List<ImageResponseDTO> response = imageService.uploadMultipleImages(propertyId, files);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long imageId) {
        byte[] data = imageService.getImage(imageId);
        PropertyImage image = imageService.getPropertyImageEntity(imageId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getContentType()))
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).mustRevalidate())
                .body(data);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<ImageResponseDTO>> getPropertyImages(@PathVariable Long propertyId) {
        List<ImageResponseDTO> response = imageService.getPropertyImages(propertyId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<String> deleteImage(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.ok("Image deleted successfully!");
    }
}
