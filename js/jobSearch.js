document.addEventListener("DOMContentLoaded", () => {
  const handleSearch = async function (event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const searchInput = document.getElementById("job-search-input");
    const query = searchInput.value.trim().toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    let activeIndustry = urlParams.get("industry");

    console.log("Search initiated with query:", query);
    console.log("Active industry:", activeIndustry);

    // Build the new URL by updating existing parameters
    if (!activeIndustry) {
      activeIndustry = "All Jobs"; // Default to "All Jobs" if no industry is active
    }

    let newUrlParams = new URLSearchParams(window.location.search);

    if (query) {
      newUrlParams.set("query", query); // Set or update the 'query' parameter
    } else {
      newUrlParams.delete("query"); // Remove 'query' if it's empty
    }

    if (activeIndustry && activeIndustry !== "All Jobs") {
      newUrlParams.set("industry", activeIndustry); // Set the industry
    } else {
      newUrlParams.delete("industry"); // Remove industry if it's "All Jobs"
    }

    let newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;

    console.log("New URL being pushed to history:", newUrl);
    history.pushState({}, "", newUrl); // Update the browser URL with the new query

    // Reset the fetch process: ignore previous filters and get fresh data
    let vacancies;
    if (activeIndustry === "All Jobs") {
      vacancies = await window.getAllVacancies(); // Always fetch all vacancies
    } else {
      vacancies = await window.getVacanciesByIndustry(activeIndustry);
    }

    console.log("Fetched vacancies for industry:", activeIndustry, vacancies);

    // Now filter based on the search query
    const filteredData = vacancies.filter((job) =>
      job.JobTitle.toLowerCase().includes(query)
    );

    console.log("Filtered vacancies:", filteredData);

    const jobCardsContainer = document.getElementById("job-cards-container");
    const totalVacanciesCounter = document.getElementById(
      "total-open-vacancies-counter"
    );

    if (filteredData.length > 0) {
      // Show job cards in grid layout
      jobCardsContainer.classList.remove("flex-layout");
      jobCardsContainer.classList.add("grid-layout");

      jobCardsContainer.innerHTML = ""; // Clear previous results
      window.displayVacancies(filteredData); // Populate job cards dynamically

      totalVacanciesCounter.textContent = filteredData.length.toString();
    } else {
      // Show "No Matching Jobs" in flex layout
      jobCardsContainer.classList.remove("grid-layout");
      jobCardsContainer.classList.add("flex-layout");

      jobCardsContainer.innerHTML = `
        <div class="no-matching-jobs">
          <h2>Sorry, there are no jobs available for "${query}" in "${activeIndustry}"</h2>
          <img class="no-matching-jobs-illustration" src="img/no-matching-jobs.png" />
        </div>`;
      totalVacanciesCounter.textContent = "0";
    }
  };

  const searchInput = document.getElementById("job-search-input");
  const searchButton = document.getElementById("job-search-button");

  if (searchInput) {
    searchInput.addEventListener("input", handleSearch); // Trigger search on typing
    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        handleSearch(event); // Trigger search on pressing Enter
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", handleSearch); // Trigger search on button click
  }

  const searchForm = document.getElementById("job-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", handleSearch); // Handle form submission
  }

  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("query");
  if (initialQuery) {
    searchInput.value = initialQuery; // Keep the query in the input field
    handleSearch(new Event("input")); // Trigger search for the initial query
  }
});
