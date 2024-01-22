const url = 'http://hejianzhong.org/avalon'
let stompClient;
let playerType;
let gameID;



function createGame() {
    let name = document.getElementById("name").value;
    if (name == null || name === "" || name.length > 10) {
        alert("Please enter a valid name");
        return;
    }

    var numPlayer = parseInt(prompt("How many players?", "Enter between 5 - 10"), 10);
    if (isNaN(numPlayer)) {
        alert("That's not a number!");
        return;
    }
    if (numPlayer < 5 || numPlayer > 10) {
        alert(numPlayer + " players not supported");
        return;
    }

    $.ajax({
        url: url + "/game/create",
        type: 'POST',
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify({
            "name": name,
            "numPlayer": numPlayer

        }),
        success: function (data) {
            gameID = data.id;

            playerType = ""; // characters
            //refresh
            connectToSocket(gameID);
            // 跳转到room

        },
        error: function (error) {
            console.log(error);
        },

    })

    // jump to next html file
    // prob hejianzhong.org/avalon/room/create
    window.location.href='room/index.html'
}

function connectToRoom() {
    let name = document.getElementById("name").value;
    if (name == null || name === "" || name.length > 10) {
        alert("Please enter a valid name");
        return;
    }
    var roomID = parseInt(prompt("Please enter room ID"), 10);
    $.ajax({
        url: url + "/game/connect",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "player": {
                "name": name
            },
            "roomID": roomID
        }),
        success: function (data) {
            gameID = data.id;
            playerType = "";
            //refresh
            connectToSocket(gameID);
            // 跳转到room
        },
        error: function (error) {
            console.log(error);
            alart("the roomID " + roomID + "does not exist");

        },
    })


}

function connectToSocket(gameID) {
    console.log("connecting to the game");
    let socket = new socketJS(url+"/gamePlay");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("connecting to frame: " + frame);
        stompClient.subscribe("/topic/gameProgress/" + gameID,
            function (response) {
                let data = JSON.parse(response.body);
                console.log(data);
                //refresh
            });
    });
}



function openSettings() {
    document.getElementById('settingsModal').style.display = "block";
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = "none";
}

window.onclick = function(event) {
    var settingsModal = document.getElementById('settingsModal');
    var rulesModal = document.getElementById('rulesModal');
    var charactersModal = document.getElementById('charactersModal');
    if (event.target == settingsModal) {
        settingsModal.style.display = "none";
    }else if (event.target == rulesModal) {
        rulesModal.style.display = "none";
    }else if (event.target == charactersModal) {
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


