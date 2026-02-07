package com.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.app.security.JwtAuthFilter;

import org.springframework.http.HttpMethod; // Added import

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // 🔓 PUBLIC
                        .requestMatchers(
                                "/student/login",
                                "/student/register",
                                "/admin/login",
                                "/actuator/health",
                                "/actuator/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html")
                        .permitAll()

                        // 🎓 STUDENT APIs (Allow ADMIN to manage students)
                        .requestMatchers("/student/**").hasAnyRole("STUDENT", "ADMIN")

                        // ✅ Allow Students to VIEW daily items (GET only)
                        .requestMatchers(HttpMethod.GET, "/dailyitems/**").hasAnyRole("ADMIN", "STUDENT")

                        // ✅ Allow access to Recharge History
                        .requestMatchers("/recharge/**").hasAnyRole("ADMIN", "STUDENT")

                        // 🛠 ADMIN APIs
                        .requestMatchers(
                                "/admin/**",
                                "/items/**",
                                "/dailyitems/**")
                        .hasRole("ADMIN")

                        // 🔐 EVERYTHING ELSE
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔐 Authentication manager
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
