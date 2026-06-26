package com.example.LoanApp.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="post")
public class CommentEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String comment;

	@ManyToOne
	@JoinColumn(name = "post_id")
	@JsonIgnoreProperties({"comments", "content", "coverImage", "user"})
	private Post post;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	@JsonIgnoreProperties({"comments", "posts", "password", "roles"}) 
	private RegisterEntity user;
	
	private LocalDateTime createdAt;
	
	public void setId(Long id) {
		this.id = id;
	}
	public Long getId() {
		return id;
	}
	
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	public void setPost(Post post){
		this.post= post;
	}
	
	public Post getPost(){
		return post;
	}
	public String getComment() {
		return comment;
	}
	public void setUser(RegisterEntity user) {
		this.user = user;
	}
	
	public RegisterEntity getUser(){
		return user;
	}
	public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
	
}
