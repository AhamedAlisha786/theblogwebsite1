package com.example.LoanApp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.LoanApp.Entity.LikeEntity;
import com.example.LoanApp.Entity.Post;
import com.example.LoanApp.Entity.RegisterEntity;

public interface LikeRepository extends JpaRepository<LikeEntity,Long> {
	// Check if a user already liked a post
    boolean existsByPostAndUser(Post post, RegisterEntity user);

    // Find a specific like to delete (unlike)
    Optional<LikeEntity> findByPostAndUser(Post post, RegisterEntity user);

    // Count total likes for a post
    long countByPost(Post post);
}
