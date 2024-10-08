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

  const handleSearch = async function (query) {
    const urlParams = new URLSearchParams(window.location.search);
    const activeIndustry = urlParams.get("industry");

    console.log("Search query:", query); // Debugging line
    console.log("Active industry:", activeIndustry); // Debugging line

    let newUrl;
    if (activeIndustry && industryLinks.hasOwnProperty(activeIndustry)) {
      newUrl = `${industryLinks[activeIndustry]}&query=${encodeURIComponent(
        query
      )}`;
    } else {
      newUrl = `/find-jobs-landing.html?query=${encodeURIComponent(query)}`;
    }

    history.pushState({}, "", newUrl);

    let vacancies;
    if (activeIndustry) {
      vacancies = await getVacanciesByIndustry(activeIndustry); // Assuming getVacanciesByIndustry is globally accessible
    } else {
      vacancies = await getAllVacancies(); // Assuming getAllVacancies is globally accessible
    }

    // Filter the vacancies based on the job title
    const filteredData = vacancies.filter((job) =>
      job.JobTitle.toLowerCase().includes(query.toLowerCase())
    );

    const jobCardsContainer = document.getElementById("job-cards-container");
    const totalVacanciesCounter = document.getElementById(
      "total-open-vacancies-counter"
    );

    if (filteredData.length > 0) {
      displayVacancies(filteredData); // Assuming displayVacancies is globally accessible
      totalVacanciesCounter.textContent = filteredData.length.toString();
    } else {
      jobCardsContainer.innerHTML = `
        <h2>Sorry, no jobs available for "${query}" in "${
        activeIndustry || "All Industries"
      }"</h2>
      <img class="no-matching-jobs-illustration" src="img/no-matching-jobs.png">
      `;
      totalVacanciesCounter.textContent = "0";
    }
  };

  // Call handleSearch initially if there's a query parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("query");
  if (initialQuery) {
    document.getElementById("job-search-input").value = initialQuery;
    handleSearch(initialQuery);
  }

  // Add event listener to the input field to trigger search on typing
  const searchInput = document.getElementById("job-search-input");
  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim();
    handleSearch(query);
  });
});
