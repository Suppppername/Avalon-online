package com.hejianzhong.Personal.controller;

import com.hejianzhong.Personal.model.*;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.hejianzhong.Personal.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    public ResponseEntity<Game> create(@RequestBody Player player, int numPlayer){
        log.info("Create game request : {}", player);
        return ResponseEntity.ok(service.createGame(player, numPlayer));
    }
}