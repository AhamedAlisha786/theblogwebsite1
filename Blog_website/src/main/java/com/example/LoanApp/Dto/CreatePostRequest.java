package com.example.LoanApp.Dto;

import jakarta.validation.constraints.NotBlank;

public class CreatePostRequest {
	@NotBlank(message = "Title is required")
	private String title;
	@NotBlank(message = "Conten its required")
	private String content;
	private String coverImage;
	private String category;
	private long authorId;
	
	public CreatePostRequest(String title, String content, String coverImage, String category, long authorId) {
		this.title = title;
		this.content = content;
		this.coverImage = coverImage;
		this.category = category;
		this.authorId = authorId;
	}
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getCoverImage() {
		return coverImage;
	}
	public void setCoverImage(String coverImage) {
		this.coverImage = coverImage;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public long getAuthorId() {
		return authorId;
	}
	public void setAuthorId(long authorId) {
		this.authorId = authorId;
	}
}
