// filterJobs.js - With Debug Logs
function applyFilters() {
  console.groupCollapsed("Applying Filters");

  // Get fresh DOM references
  const jobCards = document.querySelectorAll(".job-card");
  const totalVacanciesCounter = document.getElementById(
    "total-open-vacancies-counter"
  );

  // Gather selected filter values
  const locationFilters = Array.from(
    document.querySelectorAll('input[name="distanceType"]:checked')
  ).map((input) => input.value.toLowerCase());

  const dateFilter = document.querySelector(
    'input[name="maxPostedForDays"]:checked'
  )?.value;

  const employmentTypeFilters = Array.from(
    document.querySelectorAll('input[name="employmentType"]:checked')
  ).map((input) => input.value.toLowerCase());

  console.log("📌 Active Filters:", {
    Locations: locationFilters,
    Date: dateFilter || "All time",
    EmploymentTypes: employmentTypeFilters,
  });

  let visibleCount = 0;

  jobCards.forEach((jobCard, index) => {
    console.groupCollapsed(`🔍 Checking Job #${index + 1}`);

    const jobLocation = (jobCard.dataset.location || "global").toLowerCase();
    const jobDate = new Date(jobCard.dataset.date);
    const jobType = (jobCard.dataset.type || "").toLowerCase();

    console.log("📄 Job Data:", {
      Location: jobLocation,
      Date: jobDate.toISOString().split("T")[0],
      Type: jobType,
    });

    // Location filter logic
    const matchesExact =
      locationFilters.includes("exact") &&
      ["malta", "valletta", "mosta", "sliema"].some((loc) =>
        jobLocation.includes(loc)
      );
    const matchesGlobal =
      locationFilters.includes("global") &&
      (jobLocation === "global" || jobLocation === "");
    const matchesLocation =
      locationFilters.length === 0 || matchesExact || matchesGlobal;

    console.log("📍 Location Check:", {
      filters: locationFilters,
      matchesExact,
      matchesGlobal,
      final: matchesLocation,
    });

    // Date filter logic
    let matchesDate = true;
    if (dateFilter) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateFilter));
      matchesDate = jobDate >= cutoffDate;

      console.log("📅 Date Check:", {
        filterDays: dateFilter,
        jobDate: jobDate.toISOString().split("T")[0],
        cutoffDate: cutoffDate.toISOString().split("T")[0],
        matchesDate,
      });
    }

    // Employment type filter logic
    const matchesEmploymentType =
      employmentTypeFilters.length === 0 ||
      employmentTypeFilters.some((type) => jobType.includes(type));

    console.log("👔 Employment Type Check:", {
      filters: employmentTypeFilters,
      jobType,
      matchesEmploymentType,
    });

    const shouldDisplay =
      matchesLocation && matchesDate && matchesEmploymentType;
    console.log("🎯 Final Decision:", shouldDisplay ? "SHOW" : "HIDE");

    jobCard.style.display = shouldDisplay ? "" : "none";
    if (shouldDisplay) visibleCount++;

    console.groupEnd(); // End job card group
  });

  console.log("📊 Total Visible Jobs:", visibleCount);
  console.groupEnd(); // End filter group

  // Update counter
  totalVacanciesCounter.textContent = visibleCount;

  // Analytics sync
  gtag("config", "G-6NM1J03PQF", {
    page_path: window.location.pathname,
    transport_type: "beacon",
  });
}

// Rest of the code remains the same
