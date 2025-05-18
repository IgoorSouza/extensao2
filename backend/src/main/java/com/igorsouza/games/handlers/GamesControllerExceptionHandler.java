package com.igorsouza.games.handlers;

import com.igorsouza.games.exceptions.games.GameAlreadyWishlistedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GamesControllerExceptionHandler {

    @ExceptionHandler(GameAlreadyWishlistedException.class)
    public ResponseEntity<String> gameAlreadyWishlistedException(GameAlreadyWishlistedException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
}
