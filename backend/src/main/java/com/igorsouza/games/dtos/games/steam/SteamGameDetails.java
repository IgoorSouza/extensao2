package com.igorsouza.games.dtos.games.steam;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SteamGameDetails {

    private String name;

    @JsonProperty("required_age")
    private String requiredAge;

    @JsonProperty("is_free")
    private boolean isFree;

    @JsonProperty("short_description")
    private String shortDescription;

    @JsonProperty("header_image")
    private String headerImage;

    @JsonProperty("price_overview")
    private SteamGamePriceOverview priceOverview;

    private SteamGamePlatforms platforms;

    private String url;
}
