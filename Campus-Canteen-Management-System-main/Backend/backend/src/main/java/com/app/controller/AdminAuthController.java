package com.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.app.dto.AuthResponse;
import com.app.dto.SignInDTO;
import com.app.entities.Role;
import com.app.entities.User;
import com.app.repository.UserRepository;
import com.app.security.JwtUtils;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminAuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AdminAuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    // ✅ ADMIN LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody SignInDTO dto) {

        User admin = userRepository.findByEmail(dto.getUserName())
                .orElseThrow(() -> new RuntimeException("Invalid admin email"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Not an admin");
        }

        if (!passwordEncoder.matches(dto.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid admin password");
        }

        String token = jwtUtils.generateToken(
                admin.getEmail(),
                admin.getRole().name());

        return ResponseEntity.ok(new AuthResponse(token));
    }
}
