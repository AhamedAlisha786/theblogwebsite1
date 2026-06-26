package com.example.LoanApp.Security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtFilter {
	
	@Value("${jwt.secret}")
	private String SECRET_KEY;
	private static final long ACCESS_TOKEN_EXPIRATION = 86400000; // 1 day
	private static final long REFRESH_TOKEN_EXPIRATION = 604800000; // 7 days
	
	public String generateToken(String email) {
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new java.util.Date())
				.signWith(SignatureAlgorithm.HS256, SECRET_KEY)
				.setExpiration(new java.util.Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
				.compact();
	}
	
	public String generateRefreshToken(String email) {
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new java.util.Date())
				.signWith(SignatureAlgorithm.HS256, SECRET_KEY)
				.setExpiration(new java.util.Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION ))
				.compact();
	}
	
	public Claims extractClaims(String token) {
		return Jwts.parser()
				.setSigningKey(SECRET_KEY)
				.parseClaimsJws(token)
				.getBody();
	}
	public String extractEmail(String token) {
		return extractClaims(token).getSubject();
		
	}
	
	public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new java.util.Date());
    }
	public boolean validateToken(String token, String email) {
        String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }
	
}
