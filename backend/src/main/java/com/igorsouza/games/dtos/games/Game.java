package com.igorsouza.games.dtos.games;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Game {
    private String title;
    private String url;
    private String image;
    private double initialPrice;
    private double discountPrice;
    private int discountPercent;
}
