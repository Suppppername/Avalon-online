package com.hejianzhong.Personal.service;

import com.hejianzhong.Personal.repository.gameRepo;
import com.hejianzhong.Personal.model.*;
import com.hejianzhong.Personal.exception.*;

import java.util.ArrayList;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@ComponentScan
@Component
@Service
@AllArgsConstructor
public class gameService {

    public final int MAX_PLAYERS = 10;

    public Game createGame(Player player) {
        Game game = new Game();
        game.setID(UUID.randomUUID().toString().substring(0, 5).toUpperCase());
        game.setStatus(gameStatusEnum.NEW);
        game.setNumPlayers(1);
        ArrayList<Player> players = game.getPlayers();
        for (int i = 0; i < MAX_PLAYERS; i++) {
            if (players.get(i) == null) {
                players.set(i, player);
                break;
            }
            if (players.get(i).getName().equals(player.getName())) {
                throw new gameException("Player name already exists");
            }
            if (i == players.size() - 1) {
                throw new gameException("Game is full");
            }
        }

        gameRepo.getInstance().addGame(game);
        return game;
    }

    public Game joinGame(Player player, String gameID) {
        gameID = gameID.toUpperCase();
        if (!gameRepo.getInstance().getGames().containsKey(gameID)) {
            throw new gameException("Game not found");
        }
        Game game = gameRepo.getInstance().getGames().get(gameID);
        if (game.getStatus() != gameStatusEnum.NEW) {
            throw new gameException("Game is already started");
        }
        ArrayList<Player> players = game.getPlayers();
        for (int i = 0; i < MAX_PLAYERS; i++) {
            if (players.get(i) == null) {
                players.set(i, player);
                break;
            }
            if (players.get(i).getName().equals(player.getName())) {
                throw new gameException("Player name already exists");
            }
            if (i == players.size() - 1) {
                throw new gameException("Game is full");
            }
        }
        game.setNumPlayers(game.getNumPlayers() + 1);
        gameRepo.getInstance().addGame(game);
        return game;
    }

    public Game collectVote(vote vote, String gameID) {
        gameID = gameID.toUpperCase();
        if (!gameRepo.getInstance().getGames().containsKey(gameID)) {
            throw new gameException("Game not found");
        }
        Game game = gameRepo.getInstance().getGames().get(gameID);
        if (game.getStatus() != gameStatusEnum.IN_PROGRESS) {
            throw new gameException("Game is not in progress");
        }
        return game;




    }


}
