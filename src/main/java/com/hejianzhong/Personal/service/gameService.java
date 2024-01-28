package com.hejianzhong.Personal.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hejianzhong.Personal.repository.gameRepo;
import com.hejianzhong.Personal.model.*;
import com.hejianzhong.Personal.exception.*;
import java.security.PublicKey;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@ComponentScan
@Component
@Service
@AllArgsConstructor
public class gameService {

    public Game createGame(Player player, int numPlayer) {
        Game game = new Game();
        game.setID(UUID.randomUUID().toString().substring(0, 5).toLowerCase());
        game.setNumPlayers(numPlayer);
        game.setStatus(gameStatusEnum.NEW);
        gameRepo.getInstance().addGame(game);
        return game;
    }

    public Game connectToGame(Player player, String gameID) {
        gameID = gameID.toLowerCase();
        if (!gameRepo.getInstance().getGames().containsKey(gameID)) {
            throw new gameException("Game not found");
        }
        Game game = gameRepo.getInstance().getGames().get(gameID);
        if (game.getStatus() != gameStatusEnum.NEW) {
            throw new gameException("Game is already started");
        }
        if (game.getPlayers().size() >= game.getNumPlayers()) {
            throw new gameException("Game is full");
        }
        game.getPlayers().add(player);
        return game;
    }


}
