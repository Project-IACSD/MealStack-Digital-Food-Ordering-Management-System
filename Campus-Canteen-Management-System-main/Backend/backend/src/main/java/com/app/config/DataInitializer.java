package com.app.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.app.entities.Role;
import com.app.entities.User;
import com.app.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(UserRepository userRepository,
                                  PasswordEncoder passwordEncoder) {

        return args -> {
            userRepository.findByEmail("admin@gmail.com")
                .ifPresentOrElse(
                    user -> {
                        // admin already exists → do nothing
                    },
                    () -> {
                        User admin = new User();
                        admin.setEmail("admin@gmail.com");
                        admin.setPassword(passwordEncoder.encode("admin123"));
                        admin.setRole(Role.ADMIN);
                        userRepository.save(admin);

                        System.out.println("✅ Admin user created");
                    }
                );
        };
    }
}
