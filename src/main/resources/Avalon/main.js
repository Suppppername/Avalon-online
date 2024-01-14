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
