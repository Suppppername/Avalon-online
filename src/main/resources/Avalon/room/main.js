function copyLink() {
  var textarea = document.createElement('textarea');
  textarea.value = document.getElementById('link-to-copy').innerText;
  document.body.appendChild(textarea);

  textarea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
    alert('Link copied to clipboard!');
  } catch (err) {
    console.log('Unable to copy', err);
    alert('Oops, unable to copy');
  }

  // Remove the textarea from the document
  document.body.removeChild(textarea);
}