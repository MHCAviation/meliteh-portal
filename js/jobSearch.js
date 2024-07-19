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
      event.preventDefault(); // Prevent form submission
  
      const searchInput = document.getElementById("job-search-input");
      const query = searchInput.value.trim().toLowerCase();
      const urlParams = new URLSearchParams(window.location.search);
      const activeIndustry = urlParams.get("industry");
  
      console.log("Search query:", query); // Debugging line
      console.log("Active industry:", activeIndustry); // Debugging line
  
      if (query) {
        // Update URL based on active industry link
        let newUrl;
        if (activeIndustry && industryLinks.hasOwnProperty(activeIndustry)) {
          newUrl = `${industryLinks[activeIndustry]}&query=${encodeURIComponent(query)}`;
        } else {
          newUrl = `/find-jobs-landing.html?query=${encodeURIComponent(query)}`;
        }
  
        history.pushState({}, "", newUrl);
  
        // Fetch vacancies based on the current industry or all vacancies
        let vacancies;
        if (activeIndustry) {
          vacancies = await getVacanciesByIndustry(activeIndustry); // Assuming getVacanciesByIndustry is globally accessible
        } else {
          vacancies = await getAllVacancies(); // Assuming getAllVacancies is globally accessible
        }
  
        // Filter the vacancies based on the search query matching job titles
        const filteredData = vacancies.filter((job) =>
          job.JobTitle.toLowerCase().includes(query)
        );
  
        console.log("Filtered vacancies data:", filteredData); // Debugging line
  
        const jobCardsContainer = document.getElementById("job-cards-container");
        const totalVacanciesCounter = document.getElementById("total-open-vacancies-counter");
  
        if (filteredData.length > 0) {
          displayVacancies(filteredData); // Assuming displayVacancies is globally accessible
          totalVacanciesCounter.textContent = filteredData.length.toString();
        } else {
          // Display message when no jobs are found
          jobCardsContainer.innerHTML = `
            <h2>Sorry, there are no jobs available for "${query}" in "${activeIndustry || "All Industries"}"</h2>
            <img class="no-matching-jobs-illustration" src="img/no-matching-jobs.png">
          `;
          totalVacanciesCounter.textContent = "0";
        }
      } else {
        // Clear the job cards and reset the counter when the search query is empty
        const jobCardsContainer = document.getElementById("job-cards-container");
        jobCardsContainer.innerHTML = "<p>Please enter a search query.</p>";
        document.getElementById("total-open-vacancies-counter").textContent = "0";
        console.log("Empty search query, not fetching vacancies."); // Debugging line
      }
    };
  
    // Call handleSearch initially if there's a query parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get("query");
    if (initialQuery) {
      document.getElementById("job-search-input").value = initialQuery;
      handleSearch(new Event("submit"));
    }
  
    // Add event listener to the search form
    const searchForm = document.getElementById("job-search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", handleSearch);
    }
  });
  