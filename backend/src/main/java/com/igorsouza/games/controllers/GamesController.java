package com.igorsouza.games.controllers;

import com.igorsouza.games.dtos.games.Game;
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
    public ResponseEntity<List<Game>> getGames(@RequestParam String gameName) {
        List<Game> games = gameService.getSteamGames(gameName);
        return ResponseEntity.ok(games);
    }

    @GetMapping("/epic")
    public ResponseEntity<List<Game>> getEpicGamesStoreGames(@RequestParam String gameName) {
        List<Game> games = gameService.getEpicStoreGames(gameName);
        return ResponseEntity.ok(games);
    }
}
