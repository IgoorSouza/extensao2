package com.igorsouza.games.controllers;

import com.igorsouza.games.dtos.auth.Login;
import com.igorsouza.games.dtos.auth.LoginResponse;
import com.igorsouza.games.dtos.auth.NewUser;
import com.igorsouza.games.exceptions.auth.WrongPasswordException;
import com.igorsouza.games.exceptions.users.UserAlreadyExistsException;
import com.igorsouza.games.exceptions.users.UserNotFoundException;
import com.igorsouza.games.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody NewUser newUser)
            throws UserAlreadyExistsException {
        authService.register(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("User successfully registered.");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody Login login)
            throws UserNotFoundException, WrongPasswordException {
        LoginResponse authData = authService.login(login);
        return ResponseEntity.ok(authData);
    }
}
