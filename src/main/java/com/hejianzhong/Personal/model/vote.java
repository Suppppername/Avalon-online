package com.hejianzhong.Personal.model;

import lombok.Data;
import lombok.AllArgsConstructor;



@Data
@AllArgsConstructor
public class vote {
    private String gameId;
    private String playerName;
    private boolean vote;
}
