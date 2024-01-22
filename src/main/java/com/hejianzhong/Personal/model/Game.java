package com.hejianzhong.Personal.model;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

@AllArgsConstructor
@Data
@Builder
public class Game {
    @Id
    private String ID;
    private gameStatusEnum status;
    private int numPlayers;
    private List<Player> players;
    private int playerTurn;

    public Game() {
        this.playerTurn=1;
        this.players = new ArrayList<>();

    }
}
