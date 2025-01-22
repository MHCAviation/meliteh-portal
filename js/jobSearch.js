document.addEventListener("DOMContentLoaded", () => {
  const handleSearch = async (event) => {
    // Prevent default behavior for form submissions
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const searchInput = document.getElementById("job-search-input");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const urlParams = new URLSearchParams(window.location.search);
    let activeIndustry = urlParams.get("industry");

    console.log("Search initiated with query:", query);
    console.log("Active industry:", activeIndustry);

    // Default to "All Jobs" if no valid industry is active
    if (!activeIndustry) {
      activeIndustry = "All Jobs";
    }

    // Update URL parameters based on search input and active industry
    let newUrlParams = new URLSearchParams(window.location.search);

    if (query) {
      newUrlParams.set("query", query);
    } else {
      newUrlParams.delete("query");
    }

    if (activeIndustry && activeIndustry !== "All Jobs") {
      newUrlParams.set("industry", activeIndustry);
    } else {
      newUrlParams.delete("industry");
    }

    const newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;
    console.log("New URL being pushed to history:", newUrl);
    history.pushState({}, "", newUrl);

    // Fetch vacancies and filter by query
    let vacancies = [];
    if (window.getAllVacancies) {
      vacancies = await window.getAllVacancies();
    } else {
      console.error("getAllVacancies function is not defined.");
    }

    console.log("Fetched vacancies:", vacancies);

    const filteredData = vacancies.filter((job) =>
      job.JobTitle.toLowerCase().includes(query)
    );

    console.log("Filtered vacancies:", filteredData);

    // Update DOM with filtered vacancies or show no matches message
    const jobCardsContainer = document.getElementById("job-cards-container");
    const totalVacanciesCounter = document.getElementById(
      "total-open-vacancies-counter"
    );

    if (filteredData.length > 0) {
      if (window.displayVacancies) {
        window.displayVacancies(filteredData);
      }
      totalVacanciesCounter.textContent = filteredData.length.toString();
    } else {
      jobCardsContainer.innerHTML = `
        <h2>Sorry, there are no jobs available for "${query}" in "${activeIndustry}"</h2>
        <img class="no-matching-jobs-illustration" src="img/no-matching-jobs.png" alt="No jobs found" />
      `;
      totalVacanciesCounter.textContent = "0";
    }
  };

  // Attach event listeners for search functionality
  const searchInput = document.getElementById("job-search-input");
  const searchButton = document.getElementById("job-search-button");
  const searchForm = document.getElementById("job-search-form");

  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        handleSearch(event);
      }
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", handleSearch);
  }

  if (searchButton) {
    searchButton.addEventListener("click", handleSearch);
  }

  // Trigger initial search if query exists in URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("query");

  if (initialQuery) {
    if (searchInput) {
      searchInput.value = initialQuery;
    }
    handleSearch(new Event("input"));
  }
});
