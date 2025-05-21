package com.example.googlesearch.controller;

import com.example.googlesearch.model.SearchResponse;
import com.example.googlesearch.service.GoogleSearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class SearchWebController {
    
    private static final Logger logger = LoggerFactory.getLogger(SearchWebController.class);
    
    private final GoogleSearchService googleSearchService;
    
    @Autowired
    public SearchWebController(GoogleSearchService googleSearchService) {
        this.googleSearchService = googleSearchService;
    }
    
    @GetMapping("/")
    public String index() {
        return "index";
    }
    
    @GetMapping("/search")
    public String search(@RequestParam(required = false) String query, Model model) {
        model.addAttribute("query", query);
        
        if (query != null && !query.trim().isEmpty()) {
            try {
                SearchResponse response = googleSearchService.search(query.trim());
                model.addAttribute("results", response.getItems());
            } catch (Exception e) {
                logger.error("Search error: {}", e.getMessage(), e);
                model.addAttribute("error", "Failed to fetch search results: " + e.getMessage());
            }
        }
        
        return "search";
    }
    
    @GetMapping("/diagnostics")
    public String diagnostics(Model model) {
        model.addAttribute("apiKeyConfigured", googleSearchService.isApiKeyConfigured());
        model.addAttribute("idConfigured", googleSearchService.isIdConfigured());
        model.addAttribute("timestamp", new java.util.Date());
        
        return "diagnostics";
    }
}
