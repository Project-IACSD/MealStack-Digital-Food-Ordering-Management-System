package com.app.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.dto.AdminLoginDTO;
import com.app.entities.Role;
import com.app.entities.User;
import com.app.repository.UserRepository;
import com.app.security.JwtUtils;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AdminService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public String login(AdminLoginDTO dto) {

        User admin = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied");
        }

        if (!passwordEncoder.matches(dto.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtils.generateToken(
                admin.getEmail(),
                admin.getRole().name()
        );
    }
}

