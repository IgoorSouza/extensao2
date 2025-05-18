package com.igorsouza.games.services.users;

import com.igorsouza.games.dtos.auth.NewUser;
import com.igorsouza.games.exceptions.ConflictException;
import com.igorsouza.games.exceptions.UnauthorizedException;
import com.igorsouza.games.models.User;
import com.igorsouza.games.repositories.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService, UserDetailsService {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public List<User> getAllUsers() {
        return usersRepository.findAll();
    }

    @Override
    public User getUserByEmail(String email) throws UsernameNotFoundException {
        return usersRepository.findByEmail(email).orElseThrow(() ->
                new UsernameNotFoundException("User not found."));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return getUserByEmail(username);
    }

    @Override
    public UUID getAuthenticatedUserId() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return UUID.fromString(userId);
    }

    @Override
    public User getAuthenticatedUser() throws UnauthorizedException {
        Optional<User> user = usersRepository.findById(getAuthenticatedUserId());

        if (user.isEmpty()) {
            throw new UnauthorizedException("User is not authenticated.");
        }

        return user.get();
    }

    @Override
    public void createUser(NewUser newUser) throws ConflictException {
        try {
            User user = User.builder()
                    .name(newUser.getName())
                    .email(newUser.getEmail())
                    .password(passwordEncoder.encode(newUser.getPassword()))
                    .build();

            usersRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("User already exists.");
        }
    }
}
