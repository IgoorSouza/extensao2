package com.igorsouza.games.services.games;

import com.igorsouza.games.dtos.games.Game;

import java.util.List;

public interface GameService {
    List<Game> getSteamGames(String gameName);
    List<Game> getEpicStoreGames(String gameName);
}
