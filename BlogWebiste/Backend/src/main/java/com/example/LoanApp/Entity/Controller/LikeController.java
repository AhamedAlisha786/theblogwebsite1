package com.example.LoanApp.Entity.Controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.LoanApp.Service.LikeService;


@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private LikeService likeService;
    
    public LikeController(LikeService likeService) {
    	this.likeService = likeService;
    }

    // POST /api/likes/toggle?postId=1&userId=2
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(@RequestParam Long postId,
                                        @RequestParam Long userId) {
        boolean liked = likeService.toggleLike(postId, userId);
        long count = likeService.getLikeCount(postId);

        return ResponseEntity.ok(Map.of(
            "liked", liked,
            "likeCount", count
        ));
    }

    // GET /api/likes/count?postId=1
    @GetMapping("/count")
    public ResponseEntity<?> getLikeCount(@RequestParam Long postId) {
        long count = likeService.getLikeCount(postId);
        return ResponseEntity.ok(Map.of("likeCount", count));
    }

    // GET /api/likes/status?postId=1&userId=2
    @GetMapping("/status")
    public ResponseEntity<?> getLikeStatus(@RequestParam Long postId,
                                           @RequestParam Long userId) {
        boolean liked = likeService.hasUserLiked(postId, userId);
        long count = likeService.getLikeCount(postId);

        return ResponseEntity.ok(Map.of(
            "liked", liked,
            "likeCount", count
        ));
    }
}
