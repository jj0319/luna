package com.example.googlesearch.service;

import com.example.googlesearch.config.GoogleApiConfig;
import com.example.googlesearch.model.SearchResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Service
public class GoogleSearchService {
    
    private static final Logger logger = LoggerFactory.getLogger(GoogleSearchService.class);
    private static final String GOOGLE_SEARCH_API_URL = "https://www.googleapis.com/customsearch/v1";
    
    private final WebClient webClient;
    private final GoogleApiConfig googleApiConfig;
    
    @Autowired
    public GoogleSearchService(WebClient.Builder webClientBuilder, GoogleApiConfig googleApiConfig) {
        this.webClient = webClientBuilder.build();
        this.googleApiConfig = googleApiConfig;
    }
    
    public SearchResponse search(String query) {
        logger.info("Searching for: {}", query);
        
        if (googleApiConfig.getKey() == null || googleApiConfig.getId() == null) {
            logger.error("Google API key or ID is not configured");
            throw new IllegalStateException("Google API configuration is missing");
        }
        
        URI uri = UriComponentsBuilder.fromUriString(GOOGLE_SEARCH_API_URL)
                .queryParam("key", googleApiConfig.getKey())
                .queryParam("cx", googleApiConfig.getId()) // Keep "cx" as the parameter name for the API call
                .queryParam("q", query)
                .build()
                .toUri();
        
        logger.debug("Request URI: {}", uri);
        
        try {
            SearchResponse response = webClient.get()
                    .uri(uri)
                    .retrieve()
                    .bodyToMono(SearchResponse.class)
                    .block();
            
            logger.info("Search completed successfully");
            return response;
        } catch (Exception e) {
            logger.error("Error performing search: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch search results", e);
        }
    }
    
    public boolean isApiKeyConfigured() {
        return googleApiConfig.getKey() != null && !googleApiConfig.getKey().trim().isEmpty();
    }
    
    public boolean isIdConfigured() {
        return googleApiConfig.getId() != null && !googleApiConfig.getId().trim().isEmpty();
    }
}
