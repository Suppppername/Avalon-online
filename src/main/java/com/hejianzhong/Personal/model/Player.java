package com.hejianzhong.Personal.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Player {
    private String name;
    private charactersEnum character;
    private sideEnum side;

}
