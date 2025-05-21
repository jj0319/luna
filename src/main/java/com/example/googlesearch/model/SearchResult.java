package com.example.googlesearch.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchResult {
    
    private String title;
    private String link;
    private String snippet;
    private String displayLink;
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getLink() {
        return link;
    }
    
    public void setLink(String link) {
        this.link = link;
    }
    
    public String getSnippet() {
        return snippet;
    }
    
    public void setSnippet(String snippet) {
        this.snippet = snippet;
    }
    
    public String getDisplayLink() {
        return displayLink;
    }
    
    public void setDisplayLink(String displayLink) {
        this.displayLink = displayLink;
    }
}
