package com.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

        @Value("${cors.allowed.origins:http://localhost:3000}")
        private String allowedOrigins;

        @Override
        public void addCorsMappings(CorsRegistry registry) {
                String[] origins = allowedOrigins.split(",");
                registry.addMapping("/**")
                                .allowedOrigins(origins)
                                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                                .allowedHeaders("*")
                                .allowCredentials(true)
                                .maxAge(3600);
        }

        @Bean
        public CorsFilter corsFilter() {
                CorsConfiguration corsConfiguration = new CorsConfiguration();
                corsConfiguration.setAllowCredentials(true);
                List<String> origins = Arrays.asList(allowedOrigins.split(","));
                corsConfiguration.setAllowedOrigins(origins);
                corsConfiguration.setAllowedHeaders(Arrays.asList(
                                "Origin", "Access-Control-Allow-Origin", "Content-Type",
                                "Accept", "Authorization", "Origin, Accept", "X-Requested-With",
                                "Access-Control-Request-Method", "Access-Control-Request-Headers"));
                corsConfiguration.setExposedHeaders(Arrays.asList(
                                "Origin", "Content-Type", "Accept", "Authorization",
                                "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
                corsConfiguration.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

                UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
                urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

                return new CorsFilter(urlBasedCorsConfigurationSource);
        }
}