let stompClient;
let gameID;
let name;
let gameConfirmed = false;
let teamOrTask; // 1 == task, 0 == team
let isAssassin = false;

// Session storage:
// firstTime: 1 if it's the first time the user enters the game, 0 otherwise
// name: the name of the player
// gameID: the id of the game

function connectToSocket(gameID) {
  console.log("connecting to the game");
  let socket = new SockJS("/avalon");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, function (frame) {
    console.log("connecting to frame: " + frame);
    stompClient.subscribe("/topic/game/" + gameID,
        function (response) {
          let data = JSON.parse(response.body);
          if (data.status === "NEW") {
            // for debugging, not visible for users for fairness reasons
            displayPlayers(data);
          } else if (data.status === "CHARACTER_NOTIFY") {
            gameSetup(data);
            firstLeaderPropose(data); // first leader propose
          } else if (data.status === "VOTE_TEAM") { // vote team
            teamOrTask = 0;
            voteTeam(data);
          } else if (data.status === "TEAM_PROPOSAL") { // fails
            leaderPropose(data);
          } else if (data.status === "VOTE_TASK") { // successes
            teamOrTask = 1;
            voteTask(data);
          } else if (data.status === "ASSASSIN") {
            assassin(data);
          } else if (data.status === "FINISHED") {
            finishUp(data);
          }
        });
  });
}

function finishUp(data) {
  document.getElementById("gameInfo").style.display = "none";
  document.getElementById("pregameInfo").style.display = "block";
  if (data.goodWins) {
    alert("Good wins");
    gameConfirmed = false;
    isAssassin = false;
  } else {
    alert("Evil wins");
    gameConfirmed = false;
    isAssassin = false;
  }

}

function assassin(data) {
  document.getElementById('proposal').textContent = "";
  document.getElementById('playerProposed').textContent = "";
  document.getElementById("gameStatus").textContent = "";
  for (let i = 1; i < 11; i++) {
    document.getElementById("checkbox" + i).style.display = "none";
  }
  for (let i = 1; i < data.vote.length + 1; i++) {
    if (data.vote[i - 1]) {
      document.getElementById("checkbox" + i).style.display = "inline";
      document.getElementById("checkbox" + i).textContent = "\u2713";
      document.getElementById("checkbox" + i).style.color = "#009933";
    } else {
      document.getElementById("checkbox" + i).style.display = "inline";
      document.getElementById("checkbox" + i).textContent = "\u2717";
      document.getElementById("checkbox" + i).style.color = "#ff6666";
    }
  }
  for (let i = 1; i < data.tasks.length + 1; i++) {
    if (data.tasks[i - 1]) {
      document.getElementById("dot" + i).style.backgroundColor = "#009933";
    } else {
      document.getElementById("dot" + i).style.backgroundColor = "#ff6666";
    }
  }
  document.getElementById('failsRemain').textContent = "";
  for (let i = 0; i < 10; i++) {
    if (data.players[i] != null && data.players[i].character === "ASSASSIN"
        && name === data.players[i].name) {
      isAssassin = true;
      document.getElementById(
          'proposal').textContent = "Please assassinate merlin";
      document.getElementById('proposal').style.display = "block";
      document.getElementById('submitButtons').style.display = "block";
      const playerSpans = document.querySelectorAll('.seat span');
      const proposalArea = document.getElementById('playerProposed');
      proposalArea.style.display = "block";
      proposalArea.textContent = "";
      let selectedPlayers = [];

      function handlePlayerClick(event) {
        const playerName = event.target.textContent;
        const isPlayerSelected = selectedPlayers.includes(playerName);

        if (isPlayerSelected) {
          selectedPlayers = selectedPlayers.filter(name => name !== playerName);
        } else {
          selectedPlayers.push(playerName);
        }
        // Update the proposal area with the names of selected players
        proposalArea.textContent = selectedPlayers.join(', ');
      }

      playerSpans.forEach(
          player => player.addEventListener('click', handlePlayerClick));

    }
  }
  if (!isAssassin) {
    for (let i = 0; i < 10; i++) {
      if (data.players[i] != null && data.players[i].character === "ASSASSIN") {
        document.getElementById('proposal').textContent = "Waiting for "
            + data.players[i].name + " to assassinate merlin";
        document.getElementById('proposal').style.display = "block";
      }
    }

    // not assassin

  }

}

function voteTask(data) {
  for (let i = 1; i < data.numPlayers + 1; i++) {
    document.getElementById("checkbox" + i).style.display = "inline";
    if (data.vote[i - 1]) {
      document.getElementById("checkbox" + i).textContent = "\u2713";
      document.getElementById("checkbox" + i).style.color = "#009933"
    } else {
      document.getElementById("checkbox" + i).textContent = "\u2717";
      document.getElementById("checkbox" + i).style.color = "#ff6666"
    }
  }
  teamOrTask = 1;
  setTimeout(() => {
    document.getElementById('failsRemain').textContent = "fails remaining: "
        + data.failsRemain;
    document.getElementById('proposal').style.display = "none";
    document.getElementById('playerProposed').textContent = "task " + (data.task
        + 1) + ": " + data.playerProposed;
    for (let i = 1; i < 11; i++) {
      document.getElementById("checkbox" + i).style.display = "none";
      document.getElementById("checkbox" + i).style.color = "black";
      document.getElementById("checkbox" + i).textContent = "\u2610";
    }
    for (let i = 1; i < data.playerProposed.length + 1; i++) {
      document.getElementById("checkbox" + i).style.display = "inline";
    }

    for (let i = 0; i < data.playerProposed.length; i++) {
      if (name === data.playerProposed[i]) {
        document.getElementById('approve').style.display = "inline";
        document.getElementById('reject').style.display = "inline";
      }
    }
  }, 2500)
}

function leaderPropose(data) {
  teamOrTask = 0;
  for (let i = 1; i < data.vote.length + 1; i++) {
    document.getElementById("checkbox" + i).style.display = "inline";
    if (data.vote[i - 1]) {
      document.getElementById("checkbox" + i).textContent = "\u2713";
      document.getElementById("checkbox" + i).style.color = "#009933"
    } else {
      document.getElementById("checkbox" + i).textContent = "\u2717";
      document.getElementById("checkbox" + i).style.color = "#ff6666"
    }
    document.getElementById('failsRemain').textContent = "fails remaining: "
        + data.failsRemain;
  }

  for (let i = 1; i < 6; i++) {
    if (data.tasks[i - 1] != null) {
      if (data.tasks[i - 1]) {
        document.getElementById("dot" + (i)).style.backgroundColor = "#009933";
      } else {
        document.getElementById("dot" + (i)).style.backgroundColor = "#ff6666";
      }
    }

  }

  if (data.leader === name) {
    document.getElementById('submitButtons').style.display = "block";
    document.getElementById('proposal').style.display = "block";
    document.getElementById(
        'proposal').textContent = "Please propose a team of "
        + data.proposal[data.task] + " by clicking names."
    const playerSpans = document.querySelectorAll('.seat span');
    const proposalArea = document.getElementById('playerProposed');
    proposalArea.style.display = "block";
    proposalArea.textContent = "";
    let selectedPlayers = [];

    function handlePlayerClick(event) {
      const playerName = event.target.textContent;
      const isPlayerSelected = selectedPlayers.includes(playerName);

      if (isPlayerSelected) {
        selectedPlayers = selectedPlayers.filter(name => name !== playerName);
      } else {
        selectedPlayers.push(playerName);
      }
      // Update the proposal area with the names of selected players
      proposalArea.textContent = selectedPlayers.join(', ');
    }

    playerSpans.forEach(
        player => player.addEventListener('click', handlePlayerClick));
  } else {
    document.getElementById('submitButtons').style.display = "none";
    document.getElementById('proposal').style.display = "block";
    document.getElementById('proposal').textContent = "Waiting for "
        + data.leader + " to propose a team";
    document.getElementById('playerProposed').style.display = "none";
  }
}

function approve() {
  if (teamOrTask === 0) { // team
    $.ajax({
      url: "game/" +gameID + "/approveTeam",
      type: 'POST',
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        "approve": true
      }),
      success: function (data) {
        document.getElementById('approve').style.display = "none";
        document.getElementById('reject').style.display = "none";
      },
      error: function (error) {
      }
    });
  } else { // task
    $.ajax({
      url: "game/"  + gameID + "/approveTask",
      type: 'POST',
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        "approve": true
      }),
      success: function (data) {
        document.getElementById('approve').style.display = "none";
        document.getElementById('reject').style.display = "none";
      }, error: function (error) {
      }

    })
  }
}

function reject() {
  if (teamOrTask === 0) { // team
    $.ajax({
      url: "game/" + gameID + "/rejectTeam",
      type: 'POST',
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        "approve": false
      }),
      success: function (data) {
        document.getElementById('approve').style.display = "none";
        document.getElementById('reject').style.display = "none";
      },
      error: function (error) {
      }
    });
  } else { // task
    $.ajax({
      url: "game/" + gameID + "/rejectTask",
      type: 'POST',
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        "approve": false
      }),
      success: function (data) {
        document.getElementById('approve').style.display = "none";
        document.getElementById('reject').style.display = "none";
      }, error: function (error) {
      }

    })
  }
}

function voteTeam(data) {

  for (let i = 1; i < data.numPlayers + 1; i++) {
    document.getElementById("checkbox" + i).style.display = "inline";
    document.getElementById("checkbox" + i).textContent = "\u2610";
    document.getElementById("checkbox" + i).style.color = "black";
  }
  document.getElementById('playerProposed').style.display = "block";
  document.getElementById('playerProposed').textContent = "Player proposed: "
      + data.playerProposed;
  document.getElementById('approve').style.display = "inline";
  document.getElementById('reject').style.display = "inline";

}

function firstLeaderPropose(data) {
  teamOrTask = 0;
  if (data.leader === name) {
    let proposalTest = "Please propose a team of " + data.proposal[data.task]
        + " by clicking names."
    document.getElementById('submitButtons').style.display = "block";
    document.getElementById('proposal').textContent = proposalTest;
    document.getElementById('proposal').style.display = "block";
    const playerSpans = document.querySelectorAll('.seat span');
    const proposalArea = document.getElementById('playerProposed');
    proposalArea.textContent = "";
    let selectedPlayers = [];

    function handlePlayerClick(event) {
      const playerName = event.target.textContent;
      const isPlayerSelected = selectedPlayers.includes(playerName);

      if (isPlayerSelected) {
        selectedPlayers = selectedPlayers.filter(name => name !== playerName);
      } else {
        selectedPlayers.push(playerName);
      }
      // Update the proposal area with the names of selected players
      proposalArea.textContent = selectedPlayers.join(', ');
    }

    playerSpans.forEach(
        player => player.addEventListener('click', handlePlayerClick));
  } else {
    document.getElementById('playerProposed').style.display = "none";
    document.getElementById('submitButtons').style.display = "none";
    document.getElementById('proposal').style.display = "block";
    document.getElementById('proposal').textContent = "Waiting for "
        + data.leader + " to propose a team";
  }

}

function submitProposal() {
  if (isAssassin) {
    if (document.getElementById('playerProposed').textContent === ""
        || document.getElementById('playerProposed').textContent.includes(
            ",")) {
      alert("Please select one player to assassinate");
    } else {
      $.ajax({
        url: "game/"+gameID + "/assassin",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: document.getElementById('playerProposed').textContent,
        success: function (data) {
        },
        error: function (error) {
        }
      });
    }
  } else {
    let selectedPlayers = document.getElementById(
        'playerProposed').textContent;
    let selectedPlayersArray = selectedPlayers ? selectedPlayers.split(', ')
        : [];
    $.ajax({
      url: "game/" + gameID + "/proposeTeam",
      type: 'POST',
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(selectedPlayersArray),
      success: function (data) {
        document.getElementById('submitButtons').style.display = "none";
      },
      error: function (error) {
        alert("Incorrect number of players selected");
      }
    });
  }
}

function gameSetup(data) {
  displayPlayersExceptNull(data);
  document.getElementById('pregameInfo').style.display = "none";
  document.getElementById('gameInfo').style.display = "block";
  // numbers in dots
  for (let i = 1; i < 6; i++) {
    document.getElementById("dot" + (i)).textContent = data.proposal[i - 1];
    document.getElementById("dot" + (i)).style.backgroundColor = "#bbb";

  }
  for (let i = 1; i < data.numPlayers + 1; i++) {
    document.getElementById("checkbox" + (i)).style.display = "inline";
    document.getElementById("checkbox" + (i)).textContent = "\u2610";
    document.getElementById("checkbox" + (i)).style.color = "black";
  }
  document.getElementById('failsRemain').textContent = "fails remaining: "
      + data.failsRemain;
  var character = data.players.find(
      player => player != null && player.name === name).character;
  document.getElementById('character').textContent = "Your character is: "
      + character;
  for (let i = 1; i < data.numPlayers + 1; i++) {
    document.getElementById("player" + i).style.color = "black";

  }
  if (character === "MERLIN") {
    document.getElementById('character').style.color = "#009933"
    var validPlayers = data.players.filter((player) => player != null);
    var evilPlayers = validPlayers.filter(
        (player) => player.character === "MORGANA" || player.character
            === "ASSASSIN" || player.character === "MINION");
    var evilPlayersNames = evilPlayers.map(player => player.name);
    for (let i = 1; i < 11; i++) {
      for (let j = 0; j < evilPlayersNames.length; j++) {
        if (document.getElementById("player" + i).textContent
            === evilPlayersNames[j]) {
          document.getElementById("player" + i).style.color = "#ff6666";
        } else if (document.getElementById("player" + i).textContent === name) {
          document.getElementById("player" + i).style.color = "#009933";
        }
      }
    }
    alert("Your character is " + character + ". The evil players are: "
        + evilPlayersNames);
  } else if (character === "PERCIVAL") {
    document.getElementById('character').style.color = "#009933"
    let validPlayers = data.players.filter((player) => player != null);
    let morgana = validPlayers.find(player => player.character === "MORGANA");
    let merlin = validPlayers.find(player => player.character === "MERLIN");
    for (let i = 1; i < 11; i++) {
      if (document.getElementById("player" + i).textContent === name) {
        document.getElementById("player" + i).style.color = "#009933";
      }
    }
    if (!morgana) {
      alert(
          "Your character is Percival. There is no Morgana in the game. Merlin is "
          + merlin.name);
    } else {
      alert(
          "Your character is Percival. The two characters are: " + morgana.name
          + " and " + merlin.name);
    }
  } else if (character === "MORGANA" || character === "ASSASSIN" || character
      === "MINION" || character === "MORDRED") {
    document.getElementById('character').style.color = "#ff6666";
    var validPlayers = data.players.filter((player) => player != null);
    var evilPlayers = validPlayers.filter((player) =>
        player.character === "MORGANA" || player.character
        === "ASSASSIN" || player.character === "MINION"
        || player.character === "MORDRED");
    var evilPlayersNames = evilPlayers.map(player => player.name);
    for (let i = 1; i < 11; i++) {
      for (let j = 0; j < evilPlayersNames.length; j++) {
        if (document.getElementById("player" + i).textContent
            === evilPlayersNames[j]) {
          document.getElementById("player" + i).style.color = "#ff6666";
        }
      }
    }
    alert("Your character is " + character + ". The evil players are: "
        + evilPlayersNames);
  } else if (character === "SERVANT") {
    document.getElementById('character').style.color = "#009933";
    for (let i = 1; i < 11; i++) {
      if (document.getElementById("player" + i).textContent === name) {
        document.getElementById("player" + i).style.color = "#009933";
      }
    }
    alert("Your character is " + character + ". You are a good guy.");
  }
}

function createGame() {
  $.ajax({
        url: "game/create",
        type: 'POST',
        dataType: "JSON",
        contentType: "application/json",
        success: function (data) {
          gameID = data.id;
          sessionStorage.setItem("firstTime", "1");
          window.location.href = data.id;
        },
        error: function (error) {
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
  if (sessionStorage.getItem("firstTime") == "1" || sessionStorage.getItem(
      "firstTime") == null) {
    name = window.prompt("Please enter your name");
    while (name == null || name === "" || name.length > 10) {
      name = window.prompt("Please enter a valid name");
    }
    $.ajax({
      url: "game/join/" + gameID,
      type: 'POST',
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        "name": name
      }),
      success: function (data) {
        gameID = data.id;
        sessionStorage.setItem("firstTime", "0");
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("gameID", gameID);
        gameID = data.id;
        connectToSocket(gameID);
        displayPlayers(data);
      },
      error: function (error) {
        alert("error joining the game, please close and try again");
      },
    });
  } else {
    $.ajax({
      url: "game/" + gameID,
      type: 'GET',
      dataType: "json",
      contentType: "application/json",
      success: function (data) {
        name = sessionStorage.getItem("name");
        gameID = sessionStorage.getItem("gameID");
        gameID = data.id;
        connectToSocket(gameID);
        displayPlayers(data);
      },
      error: function (error) {
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
    url: "game/join/" + roomID,
    type: 'POST',
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      "name": name
    }),
    success: function (game) {
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
      alert("the roomID " + roomID + " does not exist or room is full");
    },
  })

}

function openSettings() {
  document.getElementById('settingsModal').style.display = "block";

  $.ajax({
    url:"game/" + gameID,
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
        goodside = 3;
        document.getElementById("badSide").textContent = 2;
        badside = 2;
      } else if (count === 6) {
        document.getElementById("goodSide").textContent = 4;
        goodside = 4;
        document.getElementById("badSide").textContent = 2;
        badside = 2;
      } else if (count === 7) {
        document.getElementById("goodSide").textContent = 4;
        goodside = 4;
        document.getElementById("badSide").textContent = 3;
        badside = 3;
      } else if (count === 8) {
        document.getElementById("goodSide").textContent = 5;
        goodside = 5;
        document.getElementById("badSide").textContent = 3;
        badside = 3;
      } else if (count === 9) {
        document.getElementById("goodSide").textContent = 6;
        goodside = 6;
        document.getElementById("badSide").textContent = 3;
        badside = 3;
      } else if (count === 10) {
        document.getElementById("goodSide").textContent = 6;
        goodside = 6;
        document.getElementById("badSide").textContent = 4;
        badside = 4;
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
        player.textContent = game.players[i].name;
        player.style.cursor = "pointer";
      } else {
        player.textContent = game.players[i].name;
        player.style.cursor = "pointer";
      }
      player.style.fontSize = "20px";
    }
  }
}

function confirm() {
  $.ajax({
    url:  "game/" + gameID,
    type: 'GET',
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      if (name != data.owner.name) {
        alert("Only the owner (" + data.owner.name
            + ") can confirm the setting the game");
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

      let mordred = parseInt(document.getElementById('mordred').value);
      let morgana = parseInt(document.getElementById('morgana').value);
      let percival = parseInt(document.getElementById('percival').value);
      let minions = parseInt(document.getElementById('minions').value);
      let servant = parseInt(document.getElementById('servant').value);

      if (mordred + morgana + percival + minions + servant + 2
          !== data.numPlayers) {
        alert("Incorrect setting! Please adjust the number for each character");
        return;
      }
      if (mordred + morgana + percival + minions + servant + 2 < 5) {
        alert(
            "Incorrect setting1! Please adjust the number for each character");
        return;
      }

      // if (parseInt(document.getElementById('mordred')) + parseInt(document.getElementById(
      //     'morgana')) + parseInt(document.getElementById('minions')) != badside - 1) {
      //   alert("Incorrect setting2! Please adjust the number for each character");
      //   return;
      // }
      // if (parseInt(document.getElementById('percival')) + parseInt(document.getElementById('servant')) != goodside - 1) {
      //   alert("Incorrect setting3! Please adjust the number for each character");
      //   return;
      // }
      gameConfirmed = true;
      closeSettings();
      alert("Game is ready to start");
    },
    error: function (error) {
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
    url: "game/" + gameID + "/start",
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
      displayPlayersExceptNull(data);
    },
    error: function (error) {
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
        player.textContent = data.players[i].name;
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
