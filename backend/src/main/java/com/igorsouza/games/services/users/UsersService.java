package com.igorsouza.games.services.users;

import com.igorsouza.games.dtos.auth.NewUser;
import com.igorsouza.games.exceptions.users.UserAlreadyExistsException;
import com.igorsouza.games.exceptions.users.UserNotFoundException;
import com.igorsouza.games.models.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UsersService {
    List<User> getAllUsers();
    void createUser(NewUser newUser) throws UserAlreadyExistsException;
    User getUserByEmail(String email) throws UserNotFoundException;
    UUID getAuthenticatedUserId();
    Optional<User> getAuthenticatedUser();
}
