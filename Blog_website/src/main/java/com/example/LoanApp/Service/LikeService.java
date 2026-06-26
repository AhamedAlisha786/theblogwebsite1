package com.example.LoanApp.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.LoanApp.Entity.LikeEntity;
import com.example.LoanApp.Entity.Post;
import com.example.LoanApp.Entity.RegisterEntity;
import com.example.LoanApp.Repository.LikeRepository;
import com.example.LoanApp.Repository.PostRepository;
import com.example.LoanApp.Repository.UserRepository;

@Service
public class LikeService {
	private LikeRepository likeRepository;
    private PostRepository postRepository;
    private UserRepository userRepository;
    
    public LikeService(LikeRepository likeRepository,PostRepository postRepository,UserRepository userRepository) {
    	this.likeRepository = likeRepository;
    	this.postRepository = postRepository;
    	this.userRepository = userRepository;
    }

    // Toggle like/unlike — returns true if liked, false if unliked
    public boolean toggleLike(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        RegisterEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<LikeEntity> existingLike = likeRepository.findByPostAndUser(post, user);

        if (existingLike.isPresent()) {
            // User already liked → Unlike it
            likeRepository.delete(existingLike.get());
            return false;
        } else {
            // User hasn't liked → Like it
            LikeEntity like = new LikeEntity(post, user);
            like.setLikedAt(LocalDateTime.now());
            likeRepository.save(like);
            return true;
        }
    }

    // Get total like count for a post
    public long getLikeCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return likeRepository.countByPost(post);
    }

    // Check if a specific user liked a post
    public boolean hasUserLiked(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        RegisterEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return likeRepository.existsByPostAndUser(post, user);
    }
}
