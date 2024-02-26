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
    private Player owner;
    private int task;
    private ArrayList<Boolean> vote;
    private ArrayList<Boolean> tasks;
    private ArrayList<Integer> proposal;
    private String leader;
    private ArrayList<String> playerProposed;
    private int failsRemain;
    private boolean goodWins;

    public Game() {
        this.numPlayers = 0;
        this.players = new ArrayList<Player>(10);
        for (int i = 0; i < 10; i++) {
            players.add(null);
        }
        this.vote = new ArrayList<Boolean>();
        this.owner = null;
        this.leader = null;
        this.status= gameStatusEnum.NEW;
        this.proposal = new ArrayList<Integer>();
        this.playerProposed = new ArrayList<String>();
        this.task = 0;
        this.failsRemain = 5;
        this.tasks= new ArrayList<Boolean>();
        this.goodWins = true;


//        setUpMap.put(5, Arrays.asList(3,2));
//        setUpMap.put(6, Arrays.asList(4,2));
//        setUpMap.put(7, Arrays.asList(4,3));
//        setUpMap.put(8, Arrays.asList(5,3));
//        setUpMap.put(9, Arrays.asList(6,3));
//        setUpMap.put(10, Arrays.asList(6,4));
    }
}
