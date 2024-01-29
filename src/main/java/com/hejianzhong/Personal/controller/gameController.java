package com.hejianzhong.Personal.controller;

import com.hejianzhong.Personal.model.*;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.hejianzhong.Personal.service.*;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/game")
public class gameController {

    private final gameService service;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/create")
    public ResponseEntity<Game> create(@RequestBody Player player) {
        log.info("Create game request : {}", player);
        return ResponseEntity.ok(service.createGame(player));
    }

    @PostMapping("/{gameID}")
    public ResponseEntity<Game> join(@RequestBody Player player, @PathVariable(value = "gameID") String gameID) {
        log.info("Connect to game request : {}" + "/n gameID : " + gameID, player);
        return ResponseEntity.ok(service.joinGame(player, gameID));
    }

    @PostMapping("/{gameID}/collectVote")
    public ResponseEntity<Game> collectVote(@RequestBody vote vote, @PathVariable(value = "gameID") String gameID) {
        log.info("vote : {}", vote);
        return ResponseEntity.ok(service.collectVote(vote, gameID));
    }










}
