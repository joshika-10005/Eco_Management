package com.ewaste.controller;

import com.ewaste.dto.AuthRequest;
import com.ewaste.dto.AuthResponse;
import com.ewaste.model.User;
import com.ewaste.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User created = userService.register(user);
            String token = "jwt_" + UUID.randomUUID();
            created.setPassword(null); // Never return password in response
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(token, created, "User registered successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        return userService.authenticate(authRequest.getEmail(), authRequest.getPassword())
                .map(user -> {
                    String token = "jwt_" + UUID.randomUUID();
                    user.setPassword(null);
                    return ResponseEntity.ok(new AuthResponse(token, user, "Login successful"));
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(null, null, "Invalid email or password")));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.findAll().stream().peek(u -> u.setPassword(null)).toList());
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable String id) {
        return userService.findById(id)
                .map(u -> {
                    u.setPassword(null);
                    return ResponseEntity.ok((Object) u);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
