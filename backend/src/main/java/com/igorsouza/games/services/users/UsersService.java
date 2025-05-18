package com.igorsouza.games.services.users;

import com.igorsouza.games.dtos.auth.NewUser;
import com.igorsouza.games.exceptions.ConflictException;
import com.igorsouza.games.exceptions.NotFoundException;
import com.igorsouza.games.exceptions.UnauthorizedException;
import com.igorsouza.games.models.User;

import java.util.List;
import java.util.UUID;

public interface UsersService {
    List<User> getAllUsers();
    void createUser(NewUser newUser) throws ConflictException;
    User getUserByEmail(String email) throws NotFoundException;
    UUID getAuthenticatedUserId();
    User getAuthenticatedUser() throws UnauthorizedException;
}
