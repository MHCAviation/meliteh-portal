
const VACANCIES_ENDPOINT = "https://meliteh.azurewebsites.net/highlighted-vacancies";

async function main() {
    const vacancies = await fetch(VACANCIES_ENDPOINT).then(rs => rs.json());
    document.getElementById("total-open-vacancies-counter").textContent = vacancies.length;
}

main().catch(error => {
    console.error(error);
    alert("Failed to initialize page!");
});