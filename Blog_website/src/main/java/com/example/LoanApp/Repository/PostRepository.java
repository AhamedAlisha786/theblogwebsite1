package com.example.LoanApp.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.LoanApp.Entity.Post;
import com.example.LoanApp.Entity.RegisterEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostRepository extends JpaRepository<Post,Long> {
	List<Post> findByAuthorOrderByDateDesc(RegisterEntity author);
	
	//fetch posts by author id where it is useful to avoid fetching the entire author entity when we only need the id
	List<Post> findByAuthorIdOrderByDateDesc(Long authorId,Pageable pageable);
	
	List<Post> findByCategoryOrderByDateDesc(String category);
	
	Optional<Post> findById(Long id); 

}
