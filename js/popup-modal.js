function closePopup() {
  document.getElementById("popup").style.display = "none";
  document.body.style.overflow = "visible";
}

function showPopup() {
  document.getElementById("popup").style.display = "flex";
  document.body.style.overflow = "hidden";
}

window.onload = function () {
  showPopup();
};
