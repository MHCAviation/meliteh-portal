
async function main() {
    const bg = document.getElementById("home-job-search-background");
    let iteration = 0;
    setInterval(() => {
        ++iteration;
        bg.setAttribute("data-slide-iteration", iteration % 4);
    }, 8000);
}

main().catch(error => {
    console.error(error);
    alert("Failed to initialize page!");
});