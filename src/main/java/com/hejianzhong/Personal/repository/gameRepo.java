package com.hejianzhong.Personal.repository;

import com.hejianzhong.Personal.model.Game;
import com.hejianzhong.Personal.model.*;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface gameRepo extends MongoRepository<Game, String> {

    //    Optional<Game> findFirstByStatusAndSecondPlayerIsNull(gameStatusEnum status);
    Optional<Game> findByID(String ID);

}
