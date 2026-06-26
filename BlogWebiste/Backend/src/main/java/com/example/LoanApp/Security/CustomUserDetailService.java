package com.example.LoanApp.Security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.LoanApp.Entity.RegisterEntity;
import com.example.LoanApp.Repository.UserRepository;


@Service
public class CustomUserDetailService implements UserDetailsService {
	
	private UserRepository userRepository;

	public CustomUserDetailService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}	
	@Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        RegisterEntity user = userRepository.findByEmail(email);

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("USER") // role
                .build();
    }
	
}
