const url = 'http://localhost:8080';
let stompClient;
let gameID;

function connectToSocket(gameID) {
  console.log("connecting to the game");
  let socket = new SockJS(url + "/vote");
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    console.log("connecting to frame: " + frame);
    stompClient.subscribe("/topic/gameProgress/" + gameID,
        function (response) {
          let data = JSON.parse(response.body);
          console.log(data);

        });
  });
}

function createGame() {
  let name = document.getElementById("name").value;
  let prepPage = document.getElementById("prepPage");
  let roomPage = document.getElementById("roomPage");

  if (name == null || name === "" || name.length > 10) {
    alert("Please enter a valid name");
    return;
  }
  $.ajax({
        url: url + "/game/Avalon/create",
        type: 'POST',
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify({
          "name": name
        }),
        success: function (data) {
            console.log(data);
          gameID = data.id;
          connectToSocket(gameID);
          prepPage.style.display = "none";
          roomPage.style.display = "block";
          let roomID = document.getElementById("roomID");
          roomID.textContent = "Room ID: " + gameID;
          let player1 = document.getElementById("player1");
          player1.textContent = name;
          player1.style.fontSize = "20px";
          history.pushState({}, null, url + "/Avalon/" + gameID);
        },
        error: function (error) {
          console.log(error);
        },

      }
  )
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
      for (let i = 0; i < 10; i++) {
        if (game.players[i] != null) {
          let player = document.getElementById("player" + (i + 1));
          player.textContent = game.players[i].name;
          player.style.fontSize = "20px";
        }
      }
    },
    error: function (error) {
      console.log(error);
      alert("the roomID " + roomID + " does not exist or room is full");

    },
  })

}

function openSettings() {
  document.getElementById('settingsModal').style.display = "block";
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

function openSettings() {

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

