package com.example.LoanApp.Entity.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.LoanApp.Dto.LoginRequestDto;
import com.example.LoanApp.Dto.SendingResponse;
import com.example.LoanApp.Entity.RegisterEntity;
import com.example.LoanApp.Repository.UserRepository;
import com.example.LoanApp.Security.JwtFilter;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin(origins = "http://localhost:8081",allowCredentials = "true") // Adjust the origin as needed for your frontend
@RequestMapping("/api/auth")
public class AuthController {
	private UserRepository userRepository;
	private BCryptPasswordEncoder passwordEncoder;
	private AuthenticationManager authenticationManager;
	private JwtFilter jwtFilter;
	
	
	public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager, JwtFilter jwtFilter) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.jwtFilter = jwtFilter;
	}
	
	@PostMapping("/register")
	public void register(@RequestBody RegisterEntity registerEntity) {
		String encodedPassword = passwordEncoder.encode(registerEntity.getPassword());
		registerEntity.setPassword(encodedPassword);
		userRepository.save(registerEntity);	
	}
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest,HttpServletResponse response) {
		try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = jwtFilter.generateToken(loginRequest.getEmail());
            String refreshtoken = jwtFilter.generateRefreshToken(loginRequest.getEmail());
            RegisterEntity register = userRepository.findByEmail(loginRequest.getEmail());
            SendingResponse res = new SendingResponse();
            res.setId(register.getId());
            res.setName(register.getName());
            res.setToken(token);
            Cookie cookie = new Cookie("refreshToken", refreshtoken);
            cookie.setHttpOnly(true);      
            cookie.setSecure(true);        
            cookie.setPath("/");          
            cookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(cookie);
            return ResponseEntity.ok(res);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
	}

}
