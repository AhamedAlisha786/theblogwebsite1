package com.example.LoanApp.Entity.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.LoanApp.Entity.CommentEntity;
import com.example.LoanApp.Entity.Post;
import com.example.LoanApp.Entity.RegisterEntity;
import com.example.LoanApp.Repository.PostRepository;
import com.example.LoanApp.Repository.UserRepository;
import com.example.LoanApp.Service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    // Constructor injection (no @Autowired needed — Spring auto-detects single constructor)
    public CommentController(CommentService commentService,
                             UserRepository userRepository,
                             PostRepository postRepository) {
        this.commentService = commentService;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    // POST /api/comments?text=Hello&postId=1&userId=2
    @PostMapping("/post")
    public ResponseEntity<CommentEntity> addComment(
            @RequestParam String text,
            @RequestParam Long postId,
            @RequestParam Long userId) {

        // Fetch real Post from DB — findById returns Optional<Post>
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        // Fetch real User from DB — findById returns Optional<RegisterEntity>
        RegisterEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        CommentEntity saved = commentService.addComment(text, post, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // GET /api/comments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<CommentEntity> getComment(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getCommentById(id));
    }

    // GET /api/comments/post/{postId}
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentEntity>> getByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    // GET /api/comments
    @GetMapping("all")
    public ResponseEntity<List<CommentEntity>> getAll() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    // PUT /api/comments/{id}?text=UpdatedText
    @PutMapping("/update/{id}")
    public ResponseEntity<CommentEntity> updateComment(
            @PathVariable Long id,
            @RequestParam String text) {
        return ResponseEntity.ok(commentService.updateComment(id, text));
    }

    // DELETE /api/comments/{id}
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok("Comment deleted successfully");
    }
}