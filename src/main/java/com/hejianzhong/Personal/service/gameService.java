package com.hejianzhong.Personal.service;

import com.hejianzhong.Personal.repository.gameRepo;
import com.hejianzhong.Personal.model.*;
import com.hejianzhong.Personal.exception.*;

import java.util.ArrayList;
import java.util.Collections;
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

    public Game createGame() {
        Game game = new Game();
        game.setID(UUID.randomUUID().toString().substring(0, 5).toUpperCase());
        game.setStatus(gameStatusEnum.NEW);
        game.setNumPlayers(0);
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
                if (i == 0) {
                    game.setOwner(player);
                }
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

    public Game getGame(String gameID) {
        gameID = gameID.toUpperCase();
        if (!gameRepo.getInstance().getGames().containsKey(gameID)) {
            throw new gameException("Game not found");
        }
        return gameRepo.getInstance().getGames().get(gameID);
    }

    public Game startGame(String gameID, setting setting) {
        gameID = gameID.toUpperCase();
        if (!gameRepo.getInstance().getGames().containsKey(gameID)) {
            throw new gameException("Game not found");
        }
        Game game = gameRepo.getInstance().getGames().get(gameID);
        if (game.getStatus() != gameStatusEnum.NEW) {
            throw new gameException("Game is already started");
        }
        if (game.getNumPlayers() < 5) {
            throw new gameException("Not enough players");
        }
        ArrayList<Integer> randomArray = randomArray(game.getNumPlayers());
        ArrayList<Player> players = game.getPlayers();
        players.get(randomArray.get(0)).setCharacter(charactersEnum.MERLIN);
        players.get(randomArray.get(0)).setSide(sideEnum.GOOD);
        players.get(randomArray.get(1)).setCharacter(charactersEnum.ASSASSIN);
        players.get(randomArray.get(1)).setSide(sideEnum.EVIL);
        for (int i = 0; i < setting.getMinions(); i++) {
            players.get(randomArray.get(i + 2)).setCharacter(charactersEnum.MINION);
            players.get(randomArray.get(i + 2)).setSide(sideEnum.EVIL);
        }
        for (int i = 0; i < setting.getServant(); i++) {
            players.get(randomArray.get(i + 2 + setting.getMinions())).setCharacter(charactersEnum.SERVANT);
            players.get(randomArray.get(i + 2 + setting.getMinions())).setSide(sideEnum.GOOD);
        }
        if (setting.getPercival() == 1) {
            players.get(randomArray.get(setting.getMinions() + setting.getServant() + 2)).setCharacter(charactersEnum.PERCIVAL);
            players.get(randomArray.get(setting.getMinions() + setting.getServant() + 2)).setSide(sideEnum.GOOD);
        }
        if (setting.getMorgana() == 1) {
            players.get(randomArray.get(setting.getMinions() + setting.getServant() + setting.getPercival() + 2)).setCharacter(charactersEnum.MORGANA);
            players.get(randomArray.get(setting.getMinions() + setting.getServant() + setting.getPercival() + 2)).setSide(sideEnum.EVIL);
        }
        if (setting.getMordred() == 1) {
            players.get(randomArray.get(setting.getMinions() + setting.getServant() + setting.getPercival() + setting.getMorgana() + 2)).setCharacter(charactersEnum.MORDRED);
            players.get(randomArray.get(setting.getMinions() + setting.getServant() + setting.getPercival() + setting.getMorgana() + 2)).setSide(sideEnum.EVIL);
        }
        Collections.shuffle(players);
        game.setPlayers(players);
        game.setStatus(gameStatusEnum.IN_PROGRESS);
        gameRepo.getInstance().addGame(game);
        return game;
    }

    private ArrayList<Integer> randomArray (int numPlayers) {
        ArrayList<Integer> randomArray = new ArrayList<Integer>();
        for (int i = 0; i < numPlayers; i++) {
            randomArray.add(i);
        }
        Collections.shuffle(randomArray);
        return randomArray;
    }



}
