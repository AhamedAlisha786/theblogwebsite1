package com.example.LoanApp.Entity.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.LoanApp.Security.JwtFilter;

@RestController
public class RefreshController {
	
	private JwtFilter jwtfilter;
	
	public RefreshController(JwtFilter jwtfilter) {
		this.jwtfilter = jwtfilter;
	}
	@PostMapping("/refresh")
	public ResponseEntity<?> refreshToken(@RequestBody String refreshToken) {
		String email = jwtfilter.extractEmail(refreshToken);

	    if (jwtfilter.validateToken(refreshToken, email)) {
	        String newAccessToken = jwtfilter.generateToken(email);

	        return ResponseEntity.ok(newAccessToken);
	    }

	    return ResponseEntity.status(401).body("Invalid refresh token");
		
	}

}
