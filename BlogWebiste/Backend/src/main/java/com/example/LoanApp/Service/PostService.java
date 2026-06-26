package com.example.LoanApp.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.LoanApp.Dto.CreatePostRequest;
import com.example.LoanApp.Dto.UpdatePost;
import com.example.LoanApp.Entity.Post;
import com.example.LoanApp.Entity.RegisterEntity;
import com.example.LoanApp.Repository.PostRepository;
import com.example.LoanApp.Repository.UserRepository;

@Service
public class PostService {
	private PostRepository postRepository;
	private UserRepository userRepository;
	
	public PostService(PostRepository postRepository, UserRepository userRepository) {
		this.postRepository = postRepository;
		this.userRepository = userRepository;
	}
	
	public Post createPost(CreatePostRequest request) {
		RegisterEntity author = userRepository.findById(request.getAuthorId())
				.orElseThrow(() -> new RuntimeException("Author not found"));
		Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getContent().substring(0, Math.min(120, request.getContent().length())) + "...");
        post.setCoverImage(request.getCoverImage() != null && !request.getCoverImage().isBlank()
            ? request.getCoverImage()
            : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop");
        post.setCategory(request.getCategory());
        post.setDate(LocalDate.now());
        post.setAuthor(author);  // ✅ Full entity set here
        return postRepository.save(post);
	}
	public List<Post> getAllPosts() {
		return postRepository.findAll();
	}
	
	public List<Post> getPostsByAuthorId(Long authorId) {
		return postRepository.findByAuthorIdOrderByDateDesc(authorId);
	}
	public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }
	public Post updatePost(Long postId,UpdatePost request) {
		Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        post.setTitle(request.getTitle());
        post.setExcerpt(request.getExcerpt());
        post.setContent(request.getContent());
        post.setCoverImage(request.getCoverImage());
        post.setCategory(request.getCategory());

        return postRepository.save(post);
	}
	
	public void deletePost(Long postId) {
		Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        postRepository.delete(post);
	}
}
