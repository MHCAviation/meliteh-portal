// Filter function
function applyFilters() {
  console.log("Applying filters...");

  // Gather selected filter values
  const locationFilters = Array.from(document.querySelectorAll('input[name="distanceType"]:checked')).map(input => input.value);
  const dateFilter = document.querySelector('input[name="maxPostedForDays"]:checked')?.value || null;
  const employmentTypeFilters = Array.from(document.querySelectorAll('input[name="employmentType"]:checked')).map(input => input.value);

  // Log selected filter values for clarity
  console.log("Selected Location Filters:", locationFilters);
  console.log("Selected Date Filter:", dateFilter);
  console.log("Selected Employment Type Filters:", employmentTypeFilters);

  // Fetch all job cards
  const jobCards = document.querySelectorAll(".job-card");

  // Filter and display job cards based on selected filters
  jobCards.forEach(jobCard => {
    const jobLocation = jobCard.getAttribute("data-location");
    const jobDate = jobCard.getAttribute("data-date");
    const jobType = jobCard.getAttribute("data-type");

    console.log(`Job Card Data: Location=${jobLocation}, Date=${jobDate}, Type=${jobType}`);

    // Location filter logic
    let matchesLocation = false;

    if (locationFilters.includes("Exact")) {
      matchesLocation = jobLocation.toLowerCase().includes("malta");
    }

    if (locationFilters.includes("Global")) {
      matchesLocation = matchesLocation || jobLocation === "" || jobLocation.toLowerCase() === "global";
    }

    if (locationFilters.length === 0) {
      matchesLocation = true;
    }

    // Date filter logic
    let matchesDate = true;
    if (dateFilter) {
      const today = new Date();
      let filterDate = new Date();

      if (dateFilter === "7") {
        filterDate.setDate(today.getDate() - 7);
      } else if (dateFilter === "14") {
        filterDate.setDate(today.getDate() - 14);
      } else if (dateFilter === "28") {
        filterDate.setDate(today.getDate() - 28);
      }

      matchesDate = new Date(jobDate) >= filterDate;
    }

    // Employment type filter logic
    const matchesEmploymentType = employmentTypeFilters.length === 0 || employmentTypeFilters.includes(jobType);

    // Determine if the job card matches all selected filters
    const shouldDisplay = matchesLocation && matchesDate && matchesEmploymentType;

    // Update display style based on filters
    jobCard.style.display = shouldDisplay ? "" : "none";

    console.log(`Should Display Job Card: ${shouldDisplay}`);
  });

  // Count visible job cards after filtering
  const visibleJobCards = document.querySelectorAll(".job-card:not([style*='display: none'])");
  console.log("Total Visible Job Cards:", visibleJobCards.length);

  // Update the total vacancies counter
  const totalVacanciesCounter = document.getElementById("total-open-vacancies-counter");
  totalVacanciesCounter.textContent = visibleJobCards.length;

  console.log("Filters applied successfully.");
}

// Event listener for the filter form changes
const filterForm = document.getElementById("side-panel-filters");
if (filterForm) {
  filterForm.addEventListener("change", () => {
    console.log("Filter form changed. Reapplying filters...");
    applyFilters();
  });
} else {
  console.error("Filter form element not found.");
}

// Initial application of filters on page load
console.log("Initial application of filters...");
applyFilters();
