package com.hejianzhong.Personal.repository;

import com.hejianzhong.Personal.model.Game;
import java.util.HashMap;
import com.hejianzhong.Personal.model.*;
import java.util.Map;
import java.util.Optional;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Component
@Service
@ComponentScan
public class gameRepo {

    private static Map<String, Game> games;
    private static gameRepo instance;

    private gameRepo() {
        games = new HashMap<>();
    }

    public static synchronized gameRepo getInstance() {
        if (instance == null) {
            instance = new gameRepo();
        }
        return instance;
    }
    public Map<String, Game> getGames() {
        return games;
    }

    public void addGame(Game game) {
        games.put(game.getID(), game);
    }


}
