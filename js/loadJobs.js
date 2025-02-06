document.addEventListener("DOMContentLoaded", () => {
  const VACANCIES_ENDPOINT = "https://api.mhcaviation.com/category_vacancies";
  const urlParams = new URLSearchParams(window.location.search);
  const activeIndustry = urlParams.get("industry");
  const query = urlParams.get("query");

  async function fetchVacancies(params) {
    try {
      const response = await fetch(
        VACANCIES_ENDPOINT + "?" + params.toString()
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching job data:", error);
      return [];
    }
  }

  async function getAllVacancies() {
    const params = new URLSearchParams({ categoryId: 17 });
    return fetchVacancies(params);
  }

  async function getVacanciesByIndustry(industry) {
    const params = new URLSearchParams({ categoryId: 17 });

    switch (industry) {
      case "Aviation":
        [36, 37, 38, 39, 40].forEach((id) =>
          params.append("oneOfAttributeIds", id)
        );
        break;
      case "Hospitality":
        params.append("oneOfAttributeIds", 274);
        break;
      case "Construction":
        params.append("oneOfAttributeIds", 275);
        break;
      case "Maritime":
        params.append("oneOfAttributeIds", 276);
        break;
      case "IT":
        params.append("oneOfAttributeIds", 277);
        break;
      case "Finance":
        params.append("oneOfAttributeIds", 278);
        break;
      case "iGaming":
        params.append("oneOfAttributeIds", 279);
        break;
      case "Manufacturing":
        params.append("oneOfAttributeIds", 280);
        break;
      default:
        return [];
    }

    console.log("Fetching vacancies with params:", params.toString());
    return fetchVacancies(params);
  }

  async function getVacancies() {
    if (activeIndustry) {
      return getVacanciesByIndustry(activeIndustry);
    } else {
      return getAllVacancies();
    }
  }

  function filterVacancies(vacancies, query) {
    console.log("Filtering vacancies with query:", query);
    return vacancies.filter((job) =>
      job.JobTitle.toLowerCase().includes(query.toLowerCase())
    );
  }

  window.displayVacancies = function (data) {
    const jobCardsContainer = document.getElementById("job-cards-container");
    const totalVacanciesCounter = document.getElementById(
      "total-open-vacancies-counter"
    );
    jobCardsContainer.innerHTML = "";

    totalVacanciesCounter.textContent = data.length;

    if (data.length === 0) {
      const noJobsMessage = document.createElement("h2");
      if (query) {
        noJobsMessage.textContent = `Sorry, there are no jobs available for "${query}" in "${
          activeIndustry || "All Industries"
        }"`;
      } else {
        jobCardsContainer.classList.remove("grid-layout");
        jobCardsContainer.classList.add("flex-layout");

        noJobsMessage.textContent = `Sorry, there are no jobs available in "${
          activeIndustry || "All Industries"
        }"`;
      }

      const noJobsIllustration = document.createElement("img");
      noJobsIllustration.classList.add("no-matching-jobs-illustration");
      noJobsIllustration.src = "img/no-matching-jobs.png";

      jobCardsContainer.appendChild(noJobsMessage);
      jobCardsContainer.appendChild(noJobsIllustration);
    } else {
      data.forEach((job) => {
        const jobCard = document.createElement("a");
        jobCard.classList.add("job-card", "no-gtm-link-tracking");
        jobCard.href = `https://portal.meliteh.com/Secure/Membership/Registration/JobDetails.aspx?JobId=${job.JobId}`;
        jobCard.target = "_blank";

        jobCard.setAttribute(
          "data-location",
          job.Location ? job.Location : "Global"
        );
        jobCard.setAttribute("data-date", job.StartDate);
        jobCard.setAttribute("data-type", job.EmploymentType);

        const jobWrapper = document.createElement("div");
        jobWrapper.classList.add("job-title-wrapper");

        const companyLogo = document.createElement("img");
        companyLogo.classList.add("company-logo");
        companyLogo.src = `https://hiportal.eu/Secure/api/Job/GetClientLogoFromDb?clientId=${job.ClientId}`;

        const titleCompanyWrapper = document.createElement("div");
        titleCompanyWrapper.classList.add("title-company-wrapper");

        const jobTitle = document.createElement("p");
        jobTitle.classList.add("job-title");
        jobTitle.textContent = job.JobTitle;

        const jobDetailsWrapper = document.createElement("div");
        jobDetailsWrapper.classList.add("job-info-wrapper");

        const jobLocation = document.createElement("p");
        jobLocation.classList.add("job-location");
        jobLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${
          job.Location ? job.Location : "Global"
        }`;

        const jobDate = document.createElement("p");
        jobDate.classList.add("job-date");
        jobDate.innerHTML = `<i class="fas fa-calendar-alt"></i> ${new Date(
          job.StartDate
        ).toLocaleDateString()}`;

        const jobType = document.createElement("p");
        jobType.classList.add("job-type");
        jobType.innerHTML = `<i class="fas fa-briefcase"></i> ${job.EmploymentType}`;

        const jobDescription = document.createElement("p");
        jobDescription.classList.add("job-description");
        jobDescription.textContent =
          job.PublishedJobDescription.split("\r\n")[0];

        jobDetailsWrapper.appendChild(jobLocation);
        jobDetailsWrapper.appendChild(jobDate);
        jobDetailsWrapper.appendChild(jobType);

        titleCompanyWrapper.appendChild(jobTitle);

        jobWrapper.appendChild(companyLogo);
        jobWrapper.appendChild(titleCompanyWrapper);

        jobCard.appendChild(jobWrapper);
        jobCard.appendChild(jobDetailsWrapper);
        jobCard.appendChild(jobDescription);

        jobCard.addEventListener("click", () => {
          window.dataLayer = window.dataLayer || [];
          dataLayer.push({
            event: "job_card_click",
            job_id: job.JobId,
            job_title: job.JobTitle,
            industry: activeIndustry || "All Industries",
            transport_type: "beacon", // ✅ Critical for tracking outbound clicks
          });
        });

        jobCardsContainer.appendChild(jobCard);
      });
    }
  };

  window.getAllVacancies = getAllVacancies;
  window.getVacanciesByIndustry = getVacanciesByIndustry;
  window.searchVacancies = function (query) {
    return getAllVacancies().then((vacancies) =>
      filterVacancies(vacancies, query)
    );
  };

  async function loadVacancies() {
    try {
      let vacancies = await getVacancies();

      if (query) {
        vacancies = filterVacancies(vacancies, query);
        console.log("Vacancies after filtering:", vacancies);
      }

      displayVacancies(vacancies);
    } catch (error) {
      console.error("Error loading vacancies:", error);
      const jobCardsContainer = document.getElementById("job-cards-container");
      jobCardsContainer.innerHTML =
        "<p>Error loading vacancies. Please try again later.</p>";
    }
  }

  loadVacancies();

  const industryLinks = {
    "All Jobs": "find-jobs-landing.html",
    Maritime: "find-jobs-landing.html?industry=Maritime",
    Aviation: "find-jobs-landing.html?industry=Aviation",
    "Information Technology": "find-jobs-landing.html?industry=IT",
    Construction: "find-jobs-landing.html?industry=Construction",
    Finance: "find-jobs-landing.html?industry=Finance",
    Igaming: "find-jobs-landing.html?industry=iGaming",
    Hospitality: "find-jobs-landing.html?industry=Hospitality",
    Manufacturing: "find-jobs-landing.html?industry=Manufacturing",
  };

  document.querySelectorAll(".industry-categories").forEach((link) => {
    const industryName = link.querySelector(".pills-title").textContent.trim();
    if (industryLinks[industryName]) {
      link.href = industryLinks[industryName];
    }
  });

  if (activeIndustry) {
    document.querySelectorAll(".industry-categories").forEach((link) => {
      const industryName = link.href.split("industry=")[1];
      if (
        industryName &&
        industryName.toLowerCase() === activeIndustry.toLowerCase()
      ) {
        link.classList.add("active");
      }
    });
  } else {
    document.querySelectorAll(".industry-categories").forEach((link) => {
      const industryName = link
        .querySelector(".pills-title")
        .textContent.trim();
      if (industryName === "All Jobs") {
        link.classList.add("active");
      }
    });
  }

  const industryNameElement = document.querySelector(
    ".breadcrumbs-industry-name"
  );
  if (activeIndustry) {
    industryNameElement.textContent = activeIndustry;
  } else {
    industryNameElement.textContent = "All Jobs";
  }
});
