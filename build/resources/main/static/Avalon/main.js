const url = 'http://localhost:8080';
let stompClient;
let gameID;
let name;
let gameConfirmed = false;
let characterNotified = false;

// Session storage:
// firstTime: 1 if it's the first time the user enters the game, 0 otherwise
// name: the name of the player
// gameID: the id of the game

function connectToSocket(gameID) {
  console.log("connecting to the game");
  let socket = new SockJS(url+"/avalon");
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    console.log("connecting to frame: " + frame);
    stompClient.subscribe("/topic/game/" + gameID,
        function (response) {
          let data = JSON.parse(response.body);
          if (data.status === "NEW") {
            console.log(data); // for debugging, not visible for users for fairness reasons
            displayPlayers(data);
          }else if (data.status === "IN_PROGRESS") {
            gameSetup(data);
          }
        });
  });
}

function gameSetup(data) {
  console.log(data);
  displayPlayersExceptNull(data);
  document.getElementById('pregameInfo').style.display = "none";
  document.getElementById('gameInfo').style.display = "block";
  var character = data.players.find(
      player => player != null && player.name === name).character;
  document.getElementById('character').textContent= "Your character is: " + character;
  if (character === "MERLIN") {
    document.getElementById('character').style.color = "#009933"
    var validPlayers = data.players.filter((player) => player != null);
    var evilPlayers = validPlayers.filter((player) => player.character === "MORGANA" ||  player.character === "ASSASSIN" || player.character === "MINION");
    var evilPlayersNames = evilPlayers.map(player => player.name);
    for (let i = 1; i < 11; i++) {
      for (let j = 0; j < evilPlayersNames.length; j++) {
        if (document.getElementById("player" + i).textContent === evilPlayersNames[j] || (document.getElementById("player" + i).textContent.length>7 && document.getElementById("player" + i).textContent.slice(0,-7) === evilPlayersNames[j])) {
          document.getElementById("player" + i).style.color = "#ff6666";
        }else if (document.getElementById("player" + i).textContent === name || (document.getElementById("player" + i).textContent.length>7 && document.getElementById("player" + i).textContent.slice(0,-7) === name)){
          document.getElementById("player" + i).style.color = "#009933";
        }
      }
    }
    alert("Your character is " + character + ". The evil players are: " + evilPlayersNames);
  }else if (character === "PERCIVAL") {
    document.getElementById('character').style.color = "#009933"
    var validPlayers = data.players.filter((player) => player != null);
    var morgana = validPlayers.find(player => player.character === "MORGANA");
    var merlin = validPlayers.find(player => player.character === "MERLIN");
    for (let i = 1; i < 11; i++) {
         if (document.getElementById("player" + i).textContent === name || (document.getElementById("player" + i).textContent.length>7 && document.getElementById("player" + i).textContent.slice(0,-7) === name)){
          document.getElementById("player" + i).style.color = "#009933";
        }
    }
    alert("Your character is Percival. The two characters are: " + morgana.name + " and " + merlin.name);
  }else if (character === "MORGANA" || character === "ASSASSIN" || character === "MINION" || character === "MORDRED") {
    document.getElementById('character').style.color = "#ff6666";
    var validPlayers = data.players.filter((player) => player != null);
    var evilPlayers = validPlayers.filter((player) =>
        player.character === "MORGANA" || player.character
        === "ASSASSIN" || player.character === "MINION"
        || player.character === "MORDRED");
    var evilPlayersNames = evilPlayers.map(player => player.name);
    for (let i = 1; i < 11; i++) {
      for (let j = 0; j < evilPlayersNames.length; j++) {
        if (document.getElementById("player" + i).textContent === evilPlayersNames[j] || (document.getElementById("player" + i).textContent.length>7 && document.getElementById("player" + i).textContent.slice(0,-7) === evilPlayersNames[j])) {
          document.getElementById("player" + i).style.color = "#ff6666";
        }
      }
    }
    alert("Your character is " + character + ". The evil players are: " + evilPlayersNames);
  }else if (character === "SERVANT") {
    document.getElementById('character').style.color = "#009933";
    for (let i = 1; i < 11; i++) {
      if (document.getElementById("player" + i).textContent === name || (document.getElementById("player" + i).textContent.length>7 && document.getElementById("player" + i).textContent.slice(0,-7) === name)){
          document.getElementById("player" + i).style.color = "#009933";
        }
    }
    alert("Your character is " + character + ". You are a good guy.");
  }
}

function createGame() {
  $.ajax({
        url: url + "/game/Avalon/create",
        type: 'POST',
        dataType: "JSON",
        contentType: "application/json",
        success: function (data) {
          gameID = data.id;
          sessionStorage.setItem("firstTime", "1");
          window.location.href = url + "/Avalon/" + data.id;
        },
        error: function (error) {
          console.log(error);
        },

      }
  )
}

function enter() {
  var path = window.location.pathname.split('/');
  gameID = path[path.length - 1];
  let roomID = document.getElementById("roomID");
  roomID.textContent = "Room ID: " + gameID;
  let linkToCopy = document.getElementById("link-to-copy");
  linkToCopy.textContent = window.location.href;
  linkToCopy.style.textDecoration = "underline";
  if (sessionStorage.getItem("firstTime") == "1" || sessionStorage.getItem("firstTime") == null){
    name = window.prompt("Please enter your name");
    while (name == null || name === "" || name.length > 10) {
      name = window.prompt("Please enter a valid name");
    }
    $.ajax({
      url: url + "/game/Avalon/join/" + gameID,
      type: 'POST',
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        "name": name
      }),
      success: function (data) {
        console.log(data);
        gameID = data.id;
        sessionStorage.setItem("firstTime", "0");
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("gameID", gameID);
        console.log(data);
        gameID = data.id;
        connectToSocket(gameID);
        displayPlayers(data);
      },
      error: function (error) {
        console.log(error);
        alert("error joining the game, please close browser and try again, possibly name issues");
      },
    });
  } else {
    $.ajax({
      url: url + "/game/Avalon/" + gameID,
      type: 'GET',
      dataType: "json",
      contentType: "application/json",
      success: function (data) {
        console.log(data);
        gameID = data.id;
        connectToSocket(gameID);
        displayPlayers(data);
      },
      error: function (error) {
        console.log(error);
        alert("please refresh");
      },
    });
    }
}

function joinGame() {
  let name = document.getElementById("name").value;
  if (name == null || name === "" || name.length > 10) {
    alert("Please enter a valid name");
    return;
  }
  var roomID = prompt("Please enter room ID");
  $.ajax({
    url: url + "/game/Avalon/join/" + roomID,
    type: 'POST',
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      "name": name
    }),
    success: function (game) {
      console.log(game);
      gameID = game.id;
      playerType = "";
      connectToSocket(gameID);
      let prepPage = document.getElementById("prepPage");
      let roomPage = document.getElementById("roomPage");
      prepPage.style.display = "none";
      roomPage.style.display = "block";
      let roomID = document.getElementById("roomID");
      roomID.textContent = "Room ID: " + gameID;
      displayPlayers(game);
    },
    error: function (error) {
      console.log(error);
      alert("the roomID " + roomID + " does not exist or room is full");
    },
  })

}

function openSettings() {
  document.getElementById('settingsModal').style.display = "block";

  $.ajax({
    url: url + "/game/Avalon/" + gameID,
    type: 'GET',
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      var players = data.players;
      var count = 0;
      for (let i = 0; i < 10; i++) {
        if (players[i] != null) {
          count++;
        }
      }
      document.getElementById("currentPlayers").textContent = count.toString();
      if (count <= 5) {
        document.getElementById("goodSide").textContent = 3;
        document.getElementById("badSide").textContent = 2;
      } else if (count === 6) {
        document.getElementById("goodSide").textContent = 4;
        document.getElementById("badSide").textContent = 2;
      } else if (count === 7) {
        document.getElementById("goodSide").textContent = 4;
        document.getElementById("badSide").textContent = 3;
      } else if (count === 8) {
        document.getElementById("goodSide").textContent = 5;
        document.getElementById("badSide").textContent = 3;
      } else if (count === 9) {
        document.getElementById("goodSide").textContent = 6;
        document.getElementById("badSide").textContent = 3;
      } else if (count === 10) {
        document.getElementById("goodSide").textContent = 6;
        document.getElementById("badSide").textContent = 4;
      }
    }
  });

}

function closeSettings() {
  document.getElementById('settingsModal').style.display = "none";
}

window.onclick = function (event) {
  var settingsModal = document.getElementById('settingsModal');
  var rulesModal = document.getElementById('rulesModal');
  var charactersModal = document.getElementById('charactersModal');
  if (event.target == settingsModal) {
    settingsModal.style.display = "none";
  } else if (event.target == rulesModal) {
    rulesModal.style.display = "none";
  } else if (event.target == charactersModal) {
    charactersModal.style.display = "none";
  }
}

function openRules() {
  document.getElementById('rulesModal').style.display = "block";
}

function closeRules() {
  document.getElementById('rulesModal').style.display = "none";
}

function openCharacters() {
  document.getElementById('charactersModal').style.display = "block";
}

function closeCharacters() {
  document.getElementById('charactersModal').style.display = "none";
}



function copyLink() {
  var paragraph = document.getElementById("hiddenParagraph");
  if (!paragraph.style.display || paragraph.style.display === "none") {
    paragraph.style.display = "block";
  } else {
    paragraph.style.display = "none";
  }

  var textarea = document.createElement('textarea');
  textarea.value = document.getElementById('link-to-copy').innerText;
  document.body.appendChild(textarea);

  textarea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
  } catch (err) {
  }
  document.body.removeChild(textarea);
}

function displayPlayers(game) {
  for (let i = 0; i < 10; i++) {
    if (game.players[i] != null) {
      let player = document.getElementById("player" + (i + 1));
      if (game.owner.name === game.players[i].name) {
        player.textContent = game.players[i].name + "(owner)";
      }else{
        player.textContent = game.players[i].name;
      }
      player.style.fontSize = "20px";
    }
  }
}

function confirm(){
  $.ajax({
    url: url + "/game/Avalon/" + gameID,
    type: 'GET',
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      if (name != data.owner.name) {
        alert("Only the owner (" + data.owner.name +") can confirm the setting the game");
        return;
      }
      var players = data.players;
      var count = 0;
      for (let i = 0; i < 10; i++) {
        if (players[i] != null) {
          count++;
        }
      }
      if (count < 5) {
        alert("You need at least 5 players to start the game");
        return;
      }
      if (document.getElementById('mordred') + document.getElementById(
              'morgana') + document.getElementById('percival')
          + document.getElementById('minions') + document.getElementById(
              'servant') + 2 < 5) {
        alert("Incorrect setting! Please adjust the number for each character");
        return;
      }
      gameConfirmed = true;
      closeSettings();
      alert("Game is ready to start");
    },
    error: function (error) {
      console.log(error);
      alert("Please close setting and try again.");
    }
  })

}

function startGame() {
  if (!gameConfirmed) {
    alert("Please confirm the game setting first");
    return;
  }
  $.ajax({
    url:url+"/game/Avalon/"+gameID+"/start",
    type: 'POST',
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      "mordred": document.getElementById('mordred').value,
      "morgana": document.getElementById('morgana').value,
      "percival": document.getElementById('percival').value,
      "minions": document.getElementById('minions').value,
      "servant": document.getElementById('servant').value,
    }),
    success: function (data) {
      console.log(data);
      displayPlayersExceptNull(data);
    },
    error: function (error) {
      console.log(error);
      alert("Please try again.");
    }
  })
}

function displayPlayersExceptNull(data) {
  var count = 0;
  for (let i = 0; i < 10; i++) {
    if (data.players[i] != null) {
      let player = document.getElementById("player" + (count + 1));
      if (data.owner.name === data.players[i].name) {
        player.textContent = data.players[i].name + "(Owner)";
      } else {
        player.textContent = data.players[i].name;
      }
      player.style.fontSize = "20px";
      count++;
    }
  }
  for (let i = count; i < 10; i++) {
    let player = document.getElementById("player" + (i + 1));
    player.textContent = "";
  }
}
