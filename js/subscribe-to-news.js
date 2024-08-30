
const SUBSCRIBE_ENDPOINT = "https://api.mhcaviation.com/subscribe-to-news";

/**
 * @param {SubmitEvent} event
 */
window.subscribeToNews = async function(event) {
    event.preventDefault();
    /** @var {HTMLFormElement} */
    const form = event.target;
    const formData = new FormData(form);
    const input = form.elements["email"];
    const button = form.querySelector("button");
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
        button.textContent = "Subscribed";
        button.setAttribute("disabled", "disabled");
    } catch (error) {
        input.removeAttribute("disabled", "disabled");
        alert("Failed to subscribe: " + (error?.message ?? String(error)));
    }
};