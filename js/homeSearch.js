document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("job-text-search-form");
  const searchInput = document.getElementById("jobs-text-search-input");

  function handleSearch(event) {
    event.preventDefault(); // Prevent the default form submission

    const query = searchInput.value.trim().toLowerCase(); // Get the trimmed, lowercase query

    if (query) {
      // If there is a query, construct a new URL and redirect to it
      let newUrl = `/find-jobs-landing.html?query=${encodeURIComponent(query)}`;
      console.log("New URL:", newUrl); // Debugging line

      window.location.href = newUrl; // Redirect to the new URL
    } else {
      // If the input is empty, display a warning message
      searchInput.style.borderColor = "red"; // Set border color to red
      searchInput.placeholder = "Please enter a keyword"; // Change placeholder text

      searchInput.style.color = "red"; // Set text color to red
    }
  }

  // Reset the input style and placeholder on input focus
  searchInput.addEventListener("focus", () => {
    searchInput.style.borderColor = ""; // Reset border color
    searchInput.style.color = ""; // Reset text color
    searchInput.placeholder = "What job are you looking for?"; // Reset placeholder
  });

  searchForm.addEventListener("submit", handleSearch); // Attach the handleSearch function to the form's submit event
});
