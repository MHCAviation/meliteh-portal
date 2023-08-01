
const SUBMIT_ENDPOINT = "https://meliteh-api.azurewebsites.net/submit-message";

async function main() {
    document.querySelector("textarea[name=\"message\"]").focus();
}

main().catch(error => {
    console.error(error);
    alert("Failed to initialize page!");
});

/**
 * @param {SubmitEvent} event
 */
window.submitMessage = async function(event) {
    event.preventDefault();
    /** @var {HTMLFormElement} */
    const form = event.target;
    const formData = new FormData(form);
    const fieldset = form.querySelector("#contact-form-root-fieldset");
    fieldset.setAttribute("disabled", "disabled");
    form.setAttribute("data-status", "SUBMITTING");
    form.querySelector(".status-message-content").textContent = "";
    try {
        const response = await fetch(SUBMIT_ENDPOINT, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        });
        form.setAttribute("data-status", "SUCCESS");
    } catch (error) {
        fieldset.removeAttribute("disabled");
        form.setAttribute("data-status", "ERROR");
        form.querySelector(".status-message-content").textContent = error?.message ?? String(error);
    }
    return false;
};