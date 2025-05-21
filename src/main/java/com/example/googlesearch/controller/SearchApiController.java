package com.example.googlesearch.controller;

import com.example.googlesearch.model.SearchResponse;
import com.example.googlesearch.service.GoogleSearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchApiController {
    
    private static final Logger logger = LoggerFactory.getLogger(SearchApiController.class);
    
    private final GoogleSearchService googleSearchService;
    
    @Autowired
    public SearchApiController(GoogleSearchService googleSearchService) {
        this.googleSearchService = googleSearchService;
    }
    
    @GetMapping
    public ResponseEntity<?> search(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Query parameter is required");
        }
        
        try {
            SearchResponse response = googleSearchService.search(query.trim());
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            logger.error("Configuration error: {}", e.getMessage());
            return ResponseEntity.status(500).body("API configuration is missing");
        } catch (Exception e) {
            logger.error("Search error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Failed to fetch search results: " + e.getMessage());
        }
    }
    
    @GetMapping("/debug")
    public ResponseEntity<?> debug() {
        try {
            return ResponseEntity.ok(Map.of(
                "diagnostics", Map.of(
                    "apiKeySet", googleSearchService.isApiKeyConfigured(),
                    "idSet", googleSearchService.isIdConfigured(),
                    "timestamp", new java.util.Date()
                )
            ));
        } catch (Exception e) {
            logger.error("Debug error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Failed to run diagnostics: " + e.getMessage());
        }
    }
}
