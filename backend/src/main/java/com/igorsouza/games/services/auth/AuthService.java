package com.igorsouza.games.services.auth;

import com.igorsouza.games.dtos.auth.Login;
import com.igorsouza.games.dtos.auth.LoginResponse;
import com.igorsouza.games.dtos.auth.NewUser;
import com.igorsouza.games.exceptions.auth.WrongPasswordException;
import com.igorsouza.games.exceptions.users.UserAlreadyExistsException;
import com.igorsouza.games.exceptions.users.UserNotFoundException;

public interface AuthService {
    void register(NewUser newUser) throws UserAlreadyExistsException;
    LoginResponse login(Login login) throws UserNotFoundException, WrongPasswordException;
}
