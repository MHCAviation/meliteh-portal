function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

function showPopup() {
  document.getElementById('popup').style.display = 'flex';
}

window.onload = function() {
  showPopup();
}
