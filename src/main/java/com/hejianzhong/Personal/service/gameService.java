package com.hejianzhong.Personal.service;

import com.hejianzhong.Personal.exception.gameException;
import com.hejianzhong.Personal.model.Game;
import com.hejianzhong.Personal.model.Player;
import com.hejianzhong.Personal.model.charactersEnum;
import com.hejianzhong.Personal.model.gameStatusEnum;
import com.hejianzhong.Personal.model.setting;
import com.hejianzhong.Personal.model.sideEnum;
import com.hejianzhong.Personal.repository.gameRepo;
import java.util.ArrayList;
import java.util.Collections;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@ComponentScan
@Component
@Service
@AllArgsConstructor
public class gameService {

    public final int MAX_PLAYERS = 10;
    private final SimpMessagingTemplate simpMessagingTemplate;

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

        if (game.getNumPlayers() > MAX_PLAYERS) {
            throw new gameException("Too many players");
        }

        if (game.getNumPlayers() == 5) {
            ArrayList<Integer> temp = new ArrayList<>(5);
            temp.add(2);
            temp.add(3);
            temp.add(2);
            temp.add(3);
            temp.add(3);
            game.setProposal(temp);
        }
        if (game.getNumPlayers() == 6) {
            ArrayList<Integer> temp = new ArrayList<>(5);
            temp.add(2);
            temp.add(3);
            temp.add(4);
            temp.add(3);
            temp.add(4);
            game.setProposal(temp);
        }

        // two more fails
        if (game.getNumPlayers() == 7) {
            ArrayList<Integer> temp = new ArrayList<>(5);
            temp.add(2);
            temp.add(3);
            temp.add(3);
            temp.add(4);
            temp.add(4);
            game.setProposal(temp);
        }

        if (game.getNumPlayers() == 8 || game.getNumPlayers() == 9 || game.getNumPlayers() == 10) {
            ArrayList<Integer> temp = new ArrayList<>(5);
            temp.add(3);
            temp.add(4);
            temp.add(4);
            temp.add(5);
            temp.add(5);
            game.setProposal(temp);
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
            players.get(randomArray.get(i + 2 + setting.getMinions()))
                .setCharacter(charactersEnum.SERVANT);
            players.get(randomArray.get(i + 2 + setting.getMinions())).setSide(sideEnum.GOOD);
        }
        if (setting.getPercival() == 1) {
            players.get(randomArray.get(setting.getMinions() + setting.getServant() + 2))
                .setCharacter(charactersEnum.PERCIVAL);
            players.get(randomArray.get(setting.getMinions() + setting.getServant() + 2))
                .setSide(sideEnum.GOOD);
        }
        if (setting.getMorgana() == 1) {
            players.get(randomArray.get(
                    setting.getMinions() + setting.getServant() + setting.getPercival() + 2))
                .setCharacter(charactersEnum.MORGANA);
            players.get(randomArray.get(
                    setting.getMinions() + setting.getServant() + setting.getPercival() + 2))
                .setSide(sideEnum.EVIL);
        }
        if (setting.getMordred() == 1) {
            players.get(randomArray.get(
                setting.getMinions() + setting.getServant() + setting.getPercival()
                    + setting.getMorgana() + 2)).setCharacter(charactersEnum.MORDRED);
            players.get(randomArray.get(
                setting.getMinions() + setting.getServant() + setting.getPercival()
                    + setting.getMorgana() + 2)).setSide(sideEnum.EVIL);
        }
        Collections.shuffle(players);
        game.setPlayers(players);
        game.setStatus(gameStatusEnum.CHARACTER_NOTIFY);
        for (int i = 0; i < players.size(); i++) {
            if (players.get(i) != null) {
                game.setLeader(players.get(i).getName());
                break;
            }
        }
        gameRepo.getInstance().addGame(game);
        return game;
    }

    private ArrayList<Integer> randomArray(int numPlayers) {
        ArrayList<Integer> randomArray = new ArrayList<Integer>();
        for (int i = 0; i < numPlayers; i++) {
            randomArray.add(i);
        }
        Collections.shuffle(randomArray);
        return randomArray;
    }

    public Game proposeTeam(ArrayList<String> proposal, String gameID) {
        Game game = gameRepo.getInstance().getGames().get(gameID);
        if (proposal.size() != game.getProposal().get(game.getTask())) {
            throw new gameException("Wrong number of players");
        }
        game.setStatus(gameStatusEnum.TEAM_PROPOSAL);
        game.setPlayerProposed(proposal);
        game.setStatus(gameStatusEnum.VOTE_TEAM);
        return game;
    }


    public Game approveTeam(String gameID) {
        Game game = gameRepo.getInstance().getGames().get(gameID);
        game.getVote().add(true);
        if (game.getVote().size() == game.getNumPlayers()) {
            game = countVotes(game);
            simpMessagingTemplate.convertAndSend("/topic/game/" + gameID, game);
        }
        return game;
    }

    public Game rejectTeam(String gameID) {
        Game game = gameRepo.getInstance().getGames().get(gameID);
        game.getVote().add(false);
        if (game.getVote().size() == game.getProposal().get(game.getTask())) {
            game = countVotes(game);
            simpMessagingTemplate.convertAndSend("/topic/game/" + gameID, game);

        }
        return game;
    }

    public Game countVotes(Game game) {
        int count = 0;
        for (int i = 0; i < game.getVote().size(); i++) {
            if (game.getVote().get(i)) {
                count++;
            }
        }
        if (count > game.getProposal().get(game.getTask()) / 2) {// success if approves > 50%
            game.setFailsRemain(5);// refresh fails
            game.setStatus(gameStatusEnum.VOTE_TASK); // set status to vote task
            newLeader(game);
        } else { // fail
            game.setFailsRemain(game.getFailsRemain() - 1);
            if (game.getFailsRemain() == 0) {
                game.setStatus(gameStatusEnum.FINISHED);
            } else {
                game.setStatus(gameStatusEnum.TEAM_PROPOSAL);
                game.setPlayerProposed(new ArrayList<>());// clear player proposed
                newLeader(game);
            }

        }
        return game;
    }

    public void newLeader(Game game) {
        int temp = 0;// find the new leader for next round
        //
        for (int i = 0; i < game.getPlayers().size(); i++) {
            if (game.getPlayers().get(i) != null && game.getPlayers().get(i).getName()
                .equals(game.getLeader())) {
                temp = i + 1;
                if (temp == game.getPlayers().size()) {
                    temp = 0;
                }
                break;
            }
        }
        while (temp < game.getPlayers().size()) {
            if (game.getPlayers().get(temp) != null) {
                break;
            }
            if (temp + 1 == game.getPlayers().size()) {
                temp = 0;
            } else {
                temp++;
            }
        }
        game.setLeader(game.getPlayers().get(temp).getName());
        game.setVote(new ArrayList<>());// clear votes
    }


}
