package com.igorsouza.games.services.auth;

import com.igorsouza.games.dtos.auth.Login;
import com.igorsouza.games.dtos.auth.LoginResponse;
import com.igorsouza.games.dtos.auth.NewUser;
import com.igorsouza.games.exceptions.BadRequestException;
import com.igorsouza.games.exceptions.ConflictException;
import com.igorsouza.games.exceptions.NotFoundException;
import com.igorsouza.games.models.User;
import com.igorsouza.games.services.jwt.JwtService;
import com.igorsouza.games.services.users.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsersService usersService;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void register(NewUser user) throws ConflictException {
        usersService.createUser(user);
    }

    @Override
    public LoginResponse login(Login login) throws BadRequestException, NotFoundException {
        try {
            User user = usersService.getUserByEmail(login.getEmail());
            boolean isPasswordCorrect = passwordEncoder.matches(login.getPassword(), user.getPassword());

            if (!isPasswordCorrect) {
                throw new BadRequestException("Wrong password.");
            }

            String token = jwtService.generateToken(user.getId());
            return new LoginResponse(user.getName(), user.getEmail(), token);
        } catch (UsernameNotFoundException e) {
            throw new NotFoundException("User not found.");
        }
    }
}
