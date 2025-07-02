// Wait until DOM content is fully loaded.
document.addEventListener("DOMContentLoaded", function () {
  // Fetch and inject popup-hire-staff.html content.
  fetch("popup-hire-staff.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.text();
    })
    .then((html) => {
      // Append the fetched content to the body.
      document.body.insertAdjacentHTML("beforeend", html);
      
      // After popup content is added, initialize the service cards.
      initializeServiceCards();
      
      // IMPORTANT: Do not re-call initializePage() here if add-navbars.js is already included
      // and calling initializePage() on its own.
      // You can assume that add-navbars.js already handles the header and popup initialization.
    })
    .catch((error) => {
      console.error("Error fetching popup-hire-staff.html:", error);
    });

  // Function to initialize the service cards functionality.
  function initializeServiceCards() {
    const serviceCards = document.querySelectorAll(".service-card");
    const serviceDescriptions = document.querySelectorAll(".service-description");

    // Event listener for service card click.
    function handleServiceCardClick(event) {
      const selectedService = event.currentTarget.getAttribute("data-service");
      document
        .getElementById("selected-service-holder")
        .setAttribute("data-selected-service", selectedService);

      // Hide all service descriptions.
      serviceDescriptions.forEach((description) => {
        description.style.display = "none";
      });

      // Show the selected service description.
      const targetDescription = document.querySelector(
        `.service-description[data-service="${selectedService}"]`
      );
      if (targetDescription) {
        targetDescription.style.display = "block";
      }
    }

    // Attach click event listener to each service card.
    serviceCards.forEach((card) => {
      card.addEventListener("click", handleServiceCardClick);
    });

    // Display the default selected service description on page load.
    const defaultSelectedService = document
      .getElementById("selected-service-holder")
      .getAttribute("data-selected-service");
    const defaultDescription = document.querySelector(
      `.service-description[data-service="${defaultSelectedService}"]`
    );
    if (defaultDescription) {
      defaultDescription.style.display = "block";
    }
  }
});
