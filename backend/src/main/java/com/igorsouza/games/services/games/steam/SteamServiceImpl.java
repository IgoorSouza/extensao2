package com.igorsouza.games.services.games.steam;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.igorsouza.games.dtos.games.steam.SteamGame;
import com.igorsouza.games.dtos.games.steam.SteamGameDetails;
import com.igorsouza.games.dtos.games.steam.SteamGameSearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SteamServiceImpl implements SteamService {

    private final ObjectMapper objectMapper;

    @Override
    public List<SteamGameDetails> getGames(String gameName) {
        List<SteamGame> games = getGamesByName(gameName);

        return games.stream().map(game ->
                getGameDetails(String.valueOf(game.getId()))).toList();
    }

    private List<SteamGame> getGamesByName(String gameName) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://store.steampowered.com/api/storesearch?cc=br&l=portuguese&term=" + gameName;
        SteamGameSearchResponse response = restTemplate.getForObject(url, SteamGameSearchResponse.class);

        return response.getItems();
    }

    private SteamGameDetails getGameDetails(String gameId) {
        String url = "https://store.steampowered.com/api/appdetails?cc=br&l=portuguese&appids=" + gameId;
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> gameDetailsResponse = restTemplate.getForObject(url, Map.class);
        Map<String, Object> gameDetailsWrapper = (Map<String, Object>) gameDetailsResponse.get(gameId);
        SteamGameDetails gameDetails = objectMapper.convertValue(gameDetailsWrapper.get("data"), SteamGameDetails.class);

        gameDetails.setUrl("https://store.steampowered.com/app/" + gameId);
        return gameDetails;
    }
}
