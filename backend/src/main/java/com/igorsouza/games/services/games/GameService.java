package com.igorsouza.games.services.games;

import com.igorsouza.games.dtos.games.GenericGame;
import com.igorsouza.games.dtos.games.WishlistGame;
import com.igorsouza.games.exceptions.games.GameAlreadyWishlistedException;
import com.igorsouza.games.models.Game;

import java.util.List;
import java.util.UUID;

public interface GameService {
    List<GenericGame> getSteamGames(String gameName);
    GenericGame getSteamGameById(String identifier);
    List<GenericGame> getEpicStoreGames(String gameName);
    GenericGame getEpicStoreGameById(String identifier);
    List<Game> getGamesByUserId(UUID userId);
    List<GenericGame> getAuthenticatedUserGames();
    void addGame(WishlistGame game) throws GameAlreadyWishlistedException;
}
