
const VACANCIES_ENDPOINT = "https://meliteh.azurewebsites.net/highlighted-vacancies";

class Vacancy {
    JobId = "523";
    ClientId = "24546";
    Location = "None";
    JobTitle = "A340 Captain (1) - Legend Airlines";
    StartDate = "2023-07-10 00:00:00";
    StatusDate = "2023-07-19 14:07:27.223000";
    CurrencyId = "12";
    Category = "F2R Jobs";
    PublishedJobDescription = "We are currently looking for experienced A340 Captain for the purpose of charter and cargo flight operations worldwide.\r\n\r\nQualification Requirements:\r\n- EASA Airline Transport Pilot’s License (ATPL)\r\n- Minimum 1500 hours on type (A340)\r\n- Minimum PIC 500 hours on type (A340)\r\n- Current on A340 or willing to endorse A340 in license by the time of joining (A320, A330 to A340 CCQ);\r\n- Valid EASA Class I Medical.\r\n- Minimum ICAO level 4 English proficiency\r\n- No Incidents, Accidents, Losses of Violations\r\n- Long- range flight experience, including Oceanic Area in advantage\r\n- Passed comprehensive background checks for drug and alcohol screening\r\n- Willing to relocate as per operational requirements during ACMI operations\r\n- Reference letters from previous employers.\r\n\r\nWe offer:\r\n- Great working conditions in young, friendly & professional team\r\n- Opportunity to grow in dynamically developing organization\r\n- Schedule planned according to EASA FTL requirements\r\n- Accommodation & travel costs covered by Legend Airlines during operations out of the base.";
    CreatedOn = "2023-07-19 14:07:27.223000";
    NoOfPlaces = "1";
    ROWORDER = "1";
}

async function main() {
    /** @var {Vacancy[]} */
    const vacancies = await fetch(VACANCIES_ENDPOINT).then(rs => rs.json());
    document.getElementById("total-open-vacancies-counter").textContent = vacancies.length;
    const template = document.getElementById("open-vacancy-card-template");
    const list = document.getElementsByClassName("open-vacancy-cards-list")[0];
    const cards = vacancies.map(vacancy => {
        const card = template.content.cloneNode(true);
        const [jobTitle, companyFromTitle] = vacancy.JobTitle.split("-");
        card.querySelector(".company-name").textContent = companyFromTitle ?? "Company #" + vacancy.ClientId;
        card.querySelector(".job-title-text").textContent = jobTitle.replace(/\(\d+\)\s*$/, "");
        card.querySelector(".vacancy-card-company-logo").style.backgroundImage = `url('img/company-logos/${vacancy.ClientId}.png')`;
        card.querySelector(".vacancy-description").textContent = (vacancy.PublishedJobDescription ?? "").split(/[\r\n]+/)[0];
        card.querySelector(".location-field").textContent = (vacancy.Location ?? "Globe").replace(/\(.*/, "");
        card.querySelector(".time-posted-field").textContent = new Date(vacancy.CreatedOn).toISOString().slice(0, 10);
        return card;
    });
    list.prepend(...cards)
}

main().catch(error => {
    console.error(error);
    alert("Failed to initialize page!");
});