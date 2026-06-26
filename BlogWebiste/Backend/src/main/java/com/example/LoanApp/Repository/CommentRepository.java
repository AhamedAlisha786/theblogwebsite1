package com.example.LoanApp.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.LoanApp.Entity.CommentEntity;
//import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

	Optional<CommentEntity> findById(Long id);

    // Bonus: fetch all comments for a specific post
    List<CommentEntity> findByPostId(Long postId);
}