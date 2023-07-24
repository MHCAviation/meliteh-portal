
async function main() {
    const selectionHolder = document.getElementById("selected-service-holder");
    for (const serviceCard of document.getElementsByClassName("service-card")) {
        const service = serviceCard.getAttribute("data-service");
        serviceCard.addEventListener("click", () => {
            return selectionHolder.setAttribute("data-selected-service", service);
        });
    }
}

main().catch(error => {
    console.error(error);
    alert("Failed to initialize page!");
});