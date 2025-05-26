package com.igorsouza.games.dtos.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateUser {
    private String name;
    private String email;
}
