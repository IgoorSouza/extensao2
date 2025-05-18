package com.igorsouza.games.repositories;

import com.igorsouza.games.models.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GamesRepository extends JpaRepository<Game, UUID> {
    List<Game> findAllByUserId(UUID userId);
}
