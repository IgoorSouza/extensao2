package com.igorsouza.games.controllers;

import com.igorsouza.games.dtos.games.GenericGame;
import com.igorsouza.games.dtos.games.WishlistGame;
import com.igorsouza.games.exceptions.games.GameAlreadyWishlistedException;
import com.igorsouza.games.models.Game;
import com.igorsouza.games.services.games.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GamesController {

    private final GameService gameService;

    @GetMapping("/steam")
    public ResponseEntity<List<GenericGame>> getGames(@RequestParam String gameName) {
        List<GenericGame> games = gameService.getSteamGames(gameName);
        return ResponseEntity.ok(games);
    }

    @GetMapping("/epic")
    public ResponseEntity<List<GenericGame>> getEpicGamesStoreGames(@RequestParam String gameName) {
        List<GenericGame> games = gameService.getEpicStoreGames(gameName);
        return ResponseEntity.ok(games);
    }

    @GetMapping("/wishlist")
    public ResponseEntity<List<GenericGame>> getWishlistedGames() {
        List<GenericGame> games = gameService.getAuthenticatedUserGames();
        return ResponseEntity.ok(games);
    }

    @PostMapping("/wishlist")
    public ResponseEntity<String> addGameToWishlist(@RequestBody WishlistGame game) throws GameAlreadyWishlistedException {
        gameService.addGame(game);
        return ResponseEntity.ok().body("Game successfully added to wishlist.");
    }
}
