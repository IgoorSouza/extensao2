package com.igorsouza.games.models;

import com.igorsouza.games.enums.GamePlatform;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "games", uniqueConstraints = { @UniqueConstraint(columnNames = { "user_id", "platform_identifier", "platform" }) })
public class Game {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private UUID id;

    @Column(name = "platform_identifier", nullable = false)
    private String platformIdentifier;

    @Column(name = "platform", nullable = false)
    @Enumerated(EnumType.STRING)
    private GamePlatform platform;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
