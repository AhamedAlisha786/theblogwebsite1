package com.example.LoanApp.Dto;

public class UpdatePost {
	private String title;
	private String excerpt;
	private String content;
	private String coverImage;
	private String category;
	
	public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; } 
	
}
