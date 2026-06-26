package com.example.LoanApp.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.LoanApp.Entity.CommentEntity;
import com.example.LoanApp.Entity.Post;
import com.example.LoanApp.Entity.RegisterEntity;
import com.example.LoanApp.Repository.CommentRepository;

@Service
public class CommentService {
    private CommentRepository commentRepository;
    
    public CommentService(CommentRepository commentRepository) {
    	this.commentRepository = commentRepository;
    }

    // Create a new comment
    public CommentEntity addComment(String commentText, Post post, RegisterEntity user) {
        CommentEntity comment = new CommentEntity();
        comment.setComment(commentText);
        comment.setPost(post);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());  // auto-set timestamp
        return commentRepository.save(comment);
    }

    // Get a single comment by ID
    public CommentEntity getCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
    }

    // Get all comments for a specific post
    public List<CommentEntity> getCommentsByPost(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    // Get all comments (admin use case)
    public List<CommentEntity> getAllComments() {
        return commentRepository.findAll();
    }

    // Update a comment
    public CommentEntity updateComment(Long id, String newText) {
        CommentEntity existing = getCommentById(id);
        existing.setComment(newText);
        return commentRepository.save(existing);
    }

    // Delete a comment
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
