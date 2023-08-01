
const SUBSCRIBE_ENDPOINT = "https://meliteh-api.azurewebsites.net/subscribe-to-news";

async function main() {
    const bg = document.getElementById("title-banner-slideshow-image");
    let iteration = 0;
    setInterval(() => {
        ++iteration;
        bg.setAttribute("data-slide-iteration", iteration % 4);
    }, 8000);
}

/**
 * @param {SubmitEvent} event
 */
window.subscribeToNews = async function(event) {
    event.preventDefault();
    /** @var {HTMLFormElement} */
    const form = event.target;
    const formData = new FormData(form);
    const input = form.elements["email"];
    input.setAttribute("disabled", "disabled");
    try {
        const response = await fetch(SUBSCRIBE_ENDPOINT, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email: formData.get("email"),
            }),
        });
        if (response.status !== 200) {
            throw new Error("unsuccessful server response: " + response.statusText);
        }
        // TODO: show as just a message
        alert("Subscribed Successfully!");
    } catch (error) {
        input.removeAttribute("disabled", "disabled");
        alert("Failed to subscribe: " + (error?.message ?? String(error)));
    }
};

main().catch(error => {
    console.error(error);
    alert("Failed to initialize page!");
});