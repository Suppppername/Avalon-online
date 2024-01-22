package com.hejianzhong.Personal.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hejianzhong.Personal.repository.gameRepo;
import com.hejianzhong.Personal.model.*;
import com.hejianzhong.Personal.exception.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
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
        gameRepo.insert(game); // potentially buggy, might be repo.save
        return game;
    }

    public Game gamePlay(gamePlay gamePlay) throws NotFoundException {
        Optional<Game> optionalGame = gameRepo.findByID(gamePlay.getId().toLowerCase());
        optionalGame.orElseThrow(() -> new gameException("Room with provided id does not exist"));
        Game game = optionalGame.get();

        return game;

    }

}
