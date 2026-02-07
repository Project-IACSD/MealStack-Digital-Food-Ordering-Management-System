# Multi-stage build for Spring Boot application

# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds)
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-jammy

# Set working directory
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/cms_backend-0.0.1.jar app.jar

# Expose port (Render will override this with $PORT)
EXPOSE 8080

# Set environment variable for Spring profile
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
# Use $PORT environment variable from Render
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE} -jar app.jar"]
