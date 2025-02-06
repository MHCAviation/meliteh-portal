document.addEventListener("DOMContentLoaded", () => {
  // Check if the popup has been shown before
  const hasShownPopup = localStorage.getItem("hasShownPopup");
  const hasVisitedLinkedIn = localStorage.getItem("hasVisitedLinkedIn");

  // Function to show the popup
  function showPopup() {
    const popup = document.getElementById("popup");
    if (popup && !hasShownPopup) {
      popup.classList.add("active");
      console.log("Popup shown");
    }
  }

  // Function to close the popup
  window.closePopup = function () {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.classList.remove("active");
      console.log("Popup closed");
      localStorage.setItem("hasShownPopup", "true");
    }
  };

  // Function to follow LinkedIn
  window.followLinkedin = function () {
    console.log("LinkedIn button clicked");
    // Open the LinkedIn page in a new tab
    window.open("https://www.linkedin.com/company/meliteh", "_blank");

    // Set the flag in localStorage
    localStorage.setItem("hasVisitedLinkedIn", "true");
    localStorage.setItem("hasShownPopup", "true");

    // Close the popup
    closePopup();
  };

  // Show the popup if it hasn't been shown before and the user hasn't visited LinkedIn
  if (!hasVisitedLinkedIn && !hasShownPopup) {
    showPopup();
  }
});
