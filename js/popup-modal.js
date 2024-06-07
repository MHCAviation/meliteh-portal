function closePopup() {
  document.getElementById("popup").style.display = "none";
  document.body.style.overflow = "visible";
}

function showPopup() {
  document.getElementById("popup").style.display = "flex";
  document.body.style.overflow = "hidden";
}

window.onload = function () {
  // Check if the current URL has query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const hasQueryParams = urlParams.toString().length > 0;

  // If the current URL has query parameters, skip showing the popup
  if (!hasQueryParams) {
    showPopup();
  }
};
