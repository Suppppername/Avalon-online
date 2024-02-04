package com.hejianzhong.Personal.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
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
    private ArrayList<Player> players; // 1 - 10
    private int playerTurn;// 0 - 9
    private ArrayList<Boolean> rounds;
    private ArrayList<Boolean> tasks;
    private ArrayList<Boolean> vote;
//    private HashMap<Integer, List> setUpMap = new HashMap<Integer, List>();
    private int[] setUp;
    private boolean isVote;

    public Game() {
        this.playerTurn=0;
        this.numPlayers = 0;
        this.players = new ArrayList<Player>(10);
        for (int i = 0; i < 10; i++) {
            players.add(null);
        }
        this.rounds = new ArrayList<Boolean>(5);
        this.tasks = new ArrayList<Boolean>(5);
        this.vote = new ArrayList<Boolean>(10);
        for (int i = 0; i < 5; i++) {
            rounds.add(null);
            tasks.add(null);
        }
        this.isVote = false;
        this.setUp = new int[2];
//        setUpMap.put(5, Arrays.asList(3,2));
//        setUpMap.put(6, Arrays.asList(4,2));
//        setUpMap.put(7, Arrays.asList(4,3));
//        setUpMap.put(8, Arrays.asList(5,3));
//        setUpMap.put(9, Arrays.asList(6,3));
//        setUpMap.put(10, Arrays.asList(6,4));
    }
}
