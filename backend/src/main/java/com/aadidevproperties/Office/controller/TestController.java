package com.aadidevproperties.Office.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public ResponseEntity<String> publicEndpoint() {
        return ResponseEntity.ok("Public content: accessible by anyone.");
    }

    @GetMapping("/private")
    public ResponseEntity<String> privateEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication != null ? authentication.getName() : "anonymous";
        return ResponseEntity.ok("Secured content: accessible by authenticated users only. Hello, " + username + "!");
    }
}
