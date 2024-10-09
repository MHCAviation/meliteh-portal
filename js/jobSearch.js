document.addEventListener("DOMContentLoaded", () => {
  const industryLinks = {
    "All Jobs": "/find-jobs-landing.html",
    Maritime: "/find-jobs-landing.html?industry=Maritime",
    Aviation: "/find-jobs-landing.html?industry=Aviation",
    "Information Technology": "/find-jobs-landing.html?industry=IT",
    Construction: "/find-jobs-landing.html?industry=Construction",
    Finance: "/find-jobs-landing.html?industry=Finance",
    Igaming: "/find-jobs-landing.html?industry=iGaming",
    Hospitality: "/find-jobs-landing.html?industry=Hospitality",
    Manufacturing: "/find-jobs-landing.html?industry=Manufacturing",
  };

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

    // Ensure the URL is updated with the query and industry
    if (!activeIndustry || !industryLinks.hasOwnProperty(activeIndustry)) {
      activeIndustry = "All Jobs"; // Default to "All Jobs" if no industry is active
    }

    let newUrl = industryLinks[activeIndustry];
    if (query) {
      newUrl += newUrl.includes("?")
        ? `&query=${encodeURIComponent(query)}`
        : `?query=${encodeURIComponent(query)}`;
    }

    console.log("New URL being pushed to history:", newUrl);
    history.pushState({}, "", newUrl); // Update the browser URL with the new query

    // Fetch vacancies based on the current industry or all vacancies
    let vacancies;
    if (activeIndustry && activeIndustry !== "All Jobs") {
      vacancies = await getVacanciesByIndustry(activeIndustry);
    } else {
      vacancies = await getAllVacancies();
    }

    console.log("Fetched vacancies for industry:", activeIndustry, vacancies);

    // Filter vacancies based on the search query
    const filteredData = vacancies.filter((job) =>
      job.JobTitle.toLowerCase().includes(query)
    );

    console.log("Filtered vacancies:", filteredData);

    const jobCardsContainer = document.getElementById("job-cards-container");
    const totalVacanciesCounter = document.getElementById(
      "total-open-vacancies-counter"
    );

    if (filteredData.length > 0) {
      displayVacancies(filteredData); // Display filtered vacancies
      totalVacanciesCounter.textContent = filteredData.length.toString();
    } else {
      jobCardsContainer.innerHTML = `
              <h2>Sorry, there are no jobs available for "${query}" in "${activeIndustry}"</h2>
              <img class="no-matching-jobs-illustration" src="img/no-matching-jobs.png">
          `;
      totalVacanciesCounter.textContent = "0";
    }
  };

  // Attach event listeners
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

  // Check for any initial query in the URL and trigger search when page loads
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("query");
  if (initialQuery) {
    searchInput.value = initialQuery; // Keep the query in the input field
    handleSearch(new Event("input")); // Trigger search for the initial query
  }
});
