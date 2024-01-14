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