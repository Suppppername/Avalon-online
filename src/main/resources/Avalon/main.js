document.addEventListener('DOMContentLoaded', function () {
    var newGameButton = document.getElementById('newGameButton');

    newGameButton.addEventListener('click', function () {
        var username = prompt("Please enter your username", "Username");
        console.log(username);
    });
});
