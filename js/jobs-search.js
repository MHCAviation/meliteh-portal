
const VACANCIES_ENDPOINT = "https://meliteh-api.azurewebsites.net/vacancies";

class Vacancy {
    JobId = 476;
    ClientId = "13592";
    Company = "DAT LT";
    Location = "Karmelava,Lithuania (LT / LTU)";
    JobTitle = "ATR Engineer (1) - DAT";
    StartDate = "2023-04-27 00:00:00";
    StatusDate = "2023-04-27 14:53:49.957000";
    CurrencyName = "EUR";
    CurrencySymbol = "€";
    Category = "F2R Jobs";
    PublishedJobDescription = "First2 Resource behalf of DAT Airlines is looking for ATR MX.\r\n\r\nREQUIREMENTS:\r\n\r\n•\tValid Aircraft Engineer License, EASA Part 66 B1 or CAT A as minimum. B2 is also preferable.\r\n•\t6 months relevant experience in the last 2 consecutive years on ATR family aircrafts.\r\n•\tDeep knowledge of aircraft maintenance and operation.\r\n•\tValid certificates of HF, FTS and EWIS.\r\n•\tCitizenship of EU or other countries of Schengen area.\r\n•\tMust have a valid driver license & can pass the security clearance to access the airport\r\n\r\nPERSONAL QUANTITIES:\r\n\r\n•\tHigh sense of commitment and responsibility\r\n•\tAble to deal with various tasks in timely manner \r\n•\tVery good communication skills both oral and written English is essential \r\n•\tGood knowledge or ability to use software related to Aircraft Maintenance\r\n•\tAbility to learn\r\n\r\nWHAT WE OFFER:\r\n\r\n•\tCompetetive Fees\r\n•\tContract for 1 year with possibility to extend\r\n•\tWork Pattern: from 14/14 to 21/12 shift pattern or as agreed\r\n\r\nOnly successful candidates will be contacted.";
    CreatedOn = "2023-04-27 14:48:50.263000";
    NoOfPlaces = "6";
    EmploymentType = "Contract";
    Salary = "0E-7";
    MinBasic = "0E-7";
    MaxBasic = "0E-7";
    MinPackage = "0E-7";
    MaxPackage = "0E-7";
}

/**
 * @param {HTMLElement} card
 * @param {Vacancy} vacancy
 */
function fillCard(card, vacancy) {
    const [jobTitle, companyFromTitle] = vacancy.JobTitle.split("-");
    const timePosted = new Date(vacancy.CreatedOn);
    const postedForMs = Date.now() - timePosted.getTime();
    const postedForDays = postedForMs / 1000 / 60 / 60 / 24;
    card.setAttribute("data-employment-type", vacancy.EmploymentType);
    card.classList.toggle("posted-over-7-days-ago", postedForDays > 7);
    card.classList.toggle("posted-over-14-days-ago", postedForDays > 14);
    card.classList.toggle("posted-over-28-days-ago", postedForDays > 28);
    card.setAttribute("href", "https://1rww.eu/Secure/Login.aspx?JobId=" + vacancy.JobId);
    card.querySelector(".company-name").textContent = vacancy.Company;
    card.querySelector(".job-title-text").textContent = jobTitle.replace(/\(\d+\)\s*$/, "");
    card.querySelector(".vacancy-card-company-logo").style.backgroundImage = `url('img/company-logos/${vacancy.ClientId}.png')`;
    card.querySelector(".vacancy-description").textContent = (vacancy.PublishedJobDescription ?? "").split(/[\r\n]+/)[0];
    card.querySelector(".location-field").textContent = (vacancy.Location ?? "Globe").replace(/\(.*/, "").replace(/,.*/, "");
    card.querySelector(".time-posted-field").textContent = timePosted.toISOString().slice(0, 10);
    card.querySelector(".currency-symbol").textContent = vacancy.CurrencySymbol ?? vacancy.CurrencyName ?? "$";
    card.querySelector(".employment-type").textContent = vacancy.EmploymentType;
    let salaryRangeStr;
    if (vacancy.Salary && vacancy.Salary !== "0E-7") {
        salaryRangeStr = vacancy.Salary
    } else if (vacancy.MinBasic && vacancy.MinBasic !== "0E-7") {
        salaryRangeStr = vacancy.MinBasic + "-" + vacancy.MaxBasic;
    } else if (vacancy.MinPackage && vacancy.MinPackage !== "0E-7") {
        salaryRangeStr = vacancy.MinPackage + "-" + vacancy.MaxPackage;
    } else {
        card.classList.add("no-salary-range");
        salaryRangeStr = "";
    }
    card.querySelector(".salary-range").textContent = salaryRangeStr;
}

function isHidden(el) {
    return (el.offsetParent === null)
}

/**
 * @param {HTMLFormElement} sidePanelFilters
 * @param {HTMLElement} list
 * @param {HTMLElement} counter
 * @param {HTMLElement} main
 */
function handleFiltersChange(sidePanelFilters, list, counter, main) {
    const formData = new FormData(sidePanelFilters);
    list.setAttribute("data-distance-type", formData.get("distanceType"));
    list.setAttribute("data-max-posted-for-days", formData.get("maxPostedForDays"));
    list.classList.toggle(
        "include-permanent-employment-type",
        formData.get("includePermanentEmployment")
    );
    list.classList.toggle(
        "include-contract-employment-type",
        formData.get("includeContractEmployment")
    );
    list.classList.toggle(
        "include-temp-employment-type",
        formData.get("includeTempEmployment")
    );
    let matching = 0;
    for (const card of list.children) {
        matching += !isHidden(card);
    }
    counter.textContent = matching;
    main.setAttribute("total-jobs-matched", matching);
}

/**
 * @param {Document} document
 * @param {Vacancy[]} vacancies
 */
function placeVacancies(document, vacancies) {
    const main = document.querySelector("main");
    document.getElementById("data-loading-spinner").style.display = "none";
    const template = document.getElementById("open-vacancy-card-template");
    const list = document.getElementsByClassName("open-vacancy-cards-list")[0];
    const counter = document.getElementById("total-open-vacancies-counter");
    const cards = vacancies.map(vacancy => {
        const card = template.content.firstElementChild.cloneNode(true);
        fillCard(card, vacancy);
        return card;
    });
    list.prepend(...cards);

    /** @var {HTMLFormElement} */
    const sidePanelFilters = document.getElementById("side-panel-filters");
    sidePanelFilters.addEventListener("change", () => {
        handleFiltersChange(sidePanelFilters, list, counter, main);
    });
    handleFiltersChange(sidePanelFilters, list, counter, main);
}

async function main() {
    const search = new URLSearchParams(window.location.search);
    const industry = search.get("industry") ?? "aviation";
    document.body.setAttribute("data-industry", industry);
    document.querySelector(".industry-name").textContent = {
        "maritime": "Maritime",
        "aviation": "Aviation",
        "it": "Information Technologies",
        "other": "Any Industry",
    }[industry];

    /** @var {Vacancy[]} */
    const vacancies = await fetch(VACANCIES_ENDPOINT).then(rs => rs.json());
    placeVacancies(document, vacancies);
}

main().catch(error => {
    console.error(error);
    alert("Failed to initialize page!");
});