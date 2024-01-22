package com.hejianzhong.Personal.service;

import com.hejianzhong.Personal.repository.gameRepo;
import com.hejianzhong.Personal.model.*;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@ComponentScan
@Service
@AllArgsConstructor
public class gameService {

    private final gameRepo gameRepo;

    public Game createGame(Player player, int numPlayer) {
        Game game = new Game();
        game.setID(UUID.randomUUID().toString().substring(0, 5).toLowerCase());
        game.setNumPlayers(numPlayer);
        game.setStatus(gameStatusEnum.NEW);
        gameRepo.save(game);
        return game;
    }

}
