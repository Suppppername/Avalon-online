const url = 'http://hejianzhong.org/avalon'

function createGame() {
    let name = document.getElementById("name").value;
    if (name == null || name === "" || name.length > 10) {
        alert("Please enter a valid name");
        return;
    }

    var numPlayer = parseInt(prompt("How many players?", "Enter between 5 - 10"), 10);
    if (isNaN(numPlayer)) {
        alert("That's not a number!");
    }
    if (numPlayer < 5 || numPlayer > 10) {
        alert(numPlayer + " players not supported");
    }

    // jump to next html file
    // prob hejianzhong.org/avalon/room/create




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
    if (event.target == settingsModal) {
        settingsModal.style.display = "none";
    }else if (event.target == rulesModal) {
        rulesModal.style.display = "none";
    }
}

function openRules() {
    document.getElementById('rulesModal').style.display = "block";
}

function closeRules() {
    document.getElementById('rulesModal').style.display = "none";
}
