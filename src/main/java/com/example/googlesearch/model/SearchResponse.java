package com.example.googlesearch.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchResponse {
    
    private List<SearchResult> items;
    
    public List<SearchResult> getItems() {
        return items;
    }
    
    public void setItems(List<SearchResult> items) {
        this.items = items;
    }
}
