package com.igorsouza.games.services.games;

import com.igorsouza.games.dtos.games.Game;
import com.igorsouza.games.dtos.games.epic.*;
import com.igorsouza.games.dtos.games.steam.SteamGameDetails;
import com.igorsouza.games.dtos.games.steam.SteamGamePriceOverview;
import com.igorsouza.games.services.integrations.epic.EpicGamesStoreService;
import com.igorsouza.games.services.integrations.steam.SteamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final SteamService steamService;
    private final EpicGamesStoreService epicGamesStoreService;

    @Override
    public List<Game> getSteamGames(String gameName) {
        List<SteamGameDetails> games = steamService.getGames(gameName);
        return formatSteamGames(games);
    }

    @Override
    public List<Game> getEpicStoreGames(String gameName) {
        List<EpicGamesStoreGame> games = epicGamesStoreService.getGames(gameName);
        List<EpicGamesStoreGame> availableGames = filterAvailableEpicStoreGames(games);
        return formatEpicStoreGames(availableGames);
    }

    private List<Game> formatSteamGames(List<SteamGameDetails> games) {
        return games.stream().map(game -> {
            SteamGamePriceOverview gamePrice = game.getPriceOverview();

            return new Game(
                    game.getName(),
                    game.getUrl(),
                    game.getHeaderImage(),
                     (double) gamePrice.getInitialPrice() / 100,
                    (double) gamePrice.getFinalPrice() / 100,
                    gamePrice.getDiscountPercent()
            );
        }).toList();
    }

    private List<EpicGamesStoreGame> filterAvailableEpicStoreGames(List<EpicGamesStoreGame> games) {
        return games.stream()
                .filter(game -> {
                    for (EpicGamesStoreGameCategory category : game.getCategories()) {
                        String path = category.getPath();
                        if (path.equals("testing")) return false;
                        if (path.equals("addons")) return true;
                    }

                    List<EpicGamesStoreGameCatalogNsMapping> catalogNsMappings = game.getCatalogNs().getMappings();
                    if (catalogNsMappings == null) return false;

                    return catalogNsMappings.stream()
                            .anyMatch(mapping -> "productHome".equals(mapping.getPageType()));
                }).toList();
    }

    private List<Game> formatEpicStoreGames(List<EpicGamesStoreGame> games) {
        return games.stream().map(game -> {
            String gameSlug = getGameSlug(game);
            List<EpicGamesStoreGameImage> gameImages = game.getKeyImages();
            EpicGamesStoreGameTotalPrice gamePrice = game.getPrice().getTotalPrice();
            double initialPrice = (double) gamePrice.getOriginalPrice() / 100;
            double discountPrice = (double) gamePrice.getDiscountPrice() / 100;
            int discountPercent = initialPrice == discountPrice
                    ? 0
                    : (int) (100 - ((discountPrice * 100) / initialPrice));

            return new Game(
                    game.getTitle(),
                    gameSlug == null ? null : "https://store.epicgames.com/pt-BR/p/" + gameSlug,
                    gameImages.isEmpty() ? null : gameImages.getFirst().getUrl(),
                    initialPrice,
                    discountPrice,
                    discountPercent
            );
        }).toList();
    }

    private String getGameSlug(EpicGamesStoreGame game) {
        for (EpicGamesStoreGameCategory category : game.getCategories()) {
            if (category.getPath().equals("addons")) {
                return game.getUrlSlug();
            }
        }

        String productSlug = game.getProductSlug();
        if (productSlug != null) return productSlug.replace("/", "--");

        return game.getCatalogNs().getMappings().stream()
                .filter(mapping -> "productHome".equals(mapping.getPageType()))
                .findFirst()
                .orElseThrow()
                .getPageSlug();
    }
}
