package com.igorsouza.games.dtos.games.steam;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SteamGamePriceOverview {

    private String currency;

    @JsonProperty("initial")
    private int initialPrice;

    @JsonProperty("final")
    private int finalPrice;

    @JsonProperty("discount_percent")
    private int discountPercent;

    @JsonProperty("initial_formatted")
    private String initialFormattedPrice;

    @JsonProperty("final_formatted")
    private String finalFormattedPrice;
}
