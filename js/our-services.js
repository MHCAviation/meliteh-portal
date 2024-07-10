window.onload = function() {
    // Fetch the content of popup-hire-staff.html using fetch API
    fetch("popup-hire-staff.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.text();
      })
      .then((html) => {
        // Append the HTML content to the body
        document.body.innerHTML += html;
        // Initialize the service cards functionality
        initializeServiceCards();
      })
      .catch((error) => {
        console.error("Error fetching popup-hire-staff.html:", error);
      });
  
    function initializeServiceCards() {
      // Select all service cards
      const serviceCards = document.querySelectorAll(".service-card");
      // Select all service descriptions
      const serviceDescriptions = document.querySelectorAll(".service-description");
  
      // Function to handle service card click
      function handleServiceCardClick(event) {
        // Get the clicked service card
        const selectedService = event.currentTarget.getAttribute("data-service");
  
        // Update data-selected-service attribute in the holder
        document.getElementById("selected-service-holder").setAttribute("data-selected-service", selectedService);
  
        // Hide all service descriptions
        serviceDescriptions.forEach(description => {
          description.style.display = "none";
        });
  
        // Show the selected service description
        document.querySelector(`.service-description[data-service="${selectedService}"]`).style.display = "block";
      }
  
      // Attach click event listeners to each service card
      serviceCards.forEach(card => {
        card.addEventListener("click", handleServiceCardClick);
      });
  
      // Initial display setup: show the description of the default selected service
      const defaultSelectedService = document.getElementById("selected-service-holder").getAttribute("data-selected-service");
      document.querySelector(`.service-description[data-service="${defaultSelectedService}"]`).style.display = "block";
    }
  };
  