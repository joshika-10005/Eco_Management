# Multi-stage Docker build for Java Spring Boot Backend
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Cache dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy source code and package application jar
COPY src ./src
RUN mvn clean package -DskipTests

# Lean JRE 21 runtime container
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Run container as non-root user for security best practices
RUN addgroup -S ewaste && adduser -S ewaste -G ewaste
USER ewaste

# Copy compiled executable JAR
COPY --from=build /app/target/ewaste-backend-1.0.0.jar app.jar

# MongoDB Atlas URI injected via environment variable
ENV MONGODB_URI=""
ENV PORT=8081

EXPOSE 8081

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
