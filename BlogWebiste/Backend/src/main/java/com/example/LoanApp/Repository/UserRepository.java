package com.example.LoanApp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.LoanApp.Entity.RegisterEntity;

public interface UserRepository extends JpaRepository<RegisterEntity, Long> {
	RegisterEntity findByEmail(String Email);
}
