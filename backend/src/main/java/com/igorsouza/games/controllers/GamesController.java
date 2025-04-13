package com.igorsouza.games.controllers;

import com.igorsouza.games.dtos.games.steam.SteamGameDetails;
import com.igorsouza.games.services.games.steam.SteamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
@CrossOrigin(origins = "${FRONTEND_URL}")
public class GamesController {

    private final SteamService steamService;

    @GetMapping
    public ResponseEntity<List<SteamGameDetails>> getGames(@RequestParam String gameName) {
        List<SteamGameDetails> games = steamService.getGames(gameName);
        return ResponseEntity.ok(games);
    }
}
