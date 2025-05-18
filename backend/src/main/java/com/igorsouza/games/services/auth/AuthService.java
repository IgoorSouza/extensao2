package com.igorsouza.games.services.auth;

import com.igorsouza.games.dtos.auth.Login;
import com.igorsouza.games.dtos.auth.LoginResponse;
import com.igorsouza.games.dtos.auth.NewUser;
import com.igorsouza.games.exceptions.BadRequestException;
import com.igorsouza.games.exceptions.ConflictException;
import com.igorsouza.games.exceptions.NotFoundException;

public interface AuthService {
    void register(NewUser newUser) throws ConflictException;
    LoginResponse login(Login login) throws NotFoundException, BadRequestException;
}
