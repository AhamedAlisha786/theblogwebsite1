package com.example.LoanApp.Entity.Controller;

//import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.LoanApp.Dto.CreatePostRequest;
import com.example.LoanApp.Dto.UpdatePost;
import com.example.LoanApp.Entity.Post;
import com.example.LoanApp.Service.PostService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:8081") // Adjust the origin as needed for your frontend
@RequestMapping("/api/posts")
@RestController
public class PostController {
	private final PostService postService;
	public PostController(PostService postService) {
		this.postService = postService;
	}
	
	@PostMapping("/create")
	public ResponseEntity<Post> createPost(@Valid @RequestBody CreatePostRequest request) {
		Post createdPost = postService.createPost(request);
		return ResponseEntity.ok(createdPost);
	}	
	
	@GetMapping("/getAll")
	public ResponseEntity<?> getAllPosts() {
		return ResponseEntity.ok(postService.getAllPosts());
	}
	
	@GetMapping("/{authorId}")
	public ResponseEntity<?> getPostsByAuthorId(@PathVariable Long authorId){
		return ResponseEntity.ok(postService.getPostsByAuthorId(authorId));
	}
//	@GetMapping("/author/{authorId}")
//    public List<Post> getPostsByAuthor(@PathVariable Long authorId) {
//        return postService.getPostsByAuthor(authorId);
//    }
	
	@PutMapping("/update/{postId}")
	public ResponseEntity<Post> updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody UpdatePost request) {
        Post updatedPost = postService.updatePost(postId, request);
        return ResponseEntity.ok(updatedPost);
    }
	
	@DeleteMapping("/delete/{postId}")
	public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok("Post deleted successfully.");
    }
	
}
