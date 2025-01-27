const EMAILJS_PUBLIC_KEY = "rVo2Vl1YSL1wp0yWe"; // Replace with your EmailJS public key
const EMAILJS_PRIVATE_KEY = "2EeUhv9bhnPGViMpyvWOF"; // Replace with your EmailJS private key
const EMAILJS_SERVICE_ID = "service_8wru0ec"; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = "template_846t1ps"; // Replace with your EmailJS template ID
const RECAPTCHA_SITE_KEY = "6Le03vIpAAAAAMhlxHbQuNoTYSDSVA6_0rBNPGRI"; // Replace with your reCAPTCHA site key

async function loadPageContent(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    return html;
  } catch (error) {
    console.error("Failed to load page content:", error);
    throw error;
  }
}

function highlightActivePage() {
  const currentPageUrl = window.location.pathname;
  const navigationLinks = document.querySelectorAll("header a");

  navigationLinks.forEach((link) => {
    link.classList.remove("current-page");
  });

  navigationLinks.forEach((link) => {
    const linkUrl = new URL(link.href, window.location.origin).pathname;
    if (linkUrl === currentPageUrl) {
      link.classList.add("current-page");
    }
  });
}

async function initializePage() {
  try {
    console.log("Initializing page..."); // Debug log
    const basePath = "/components/";

    const [headerHtml, footerHtml] = await Promise.all([
      loadPageContent(basePath + "header.html"),
      loadPageContent(basePath + "footer.html"),
    ]);

    console.log("Header and footer loaded successfully."); // Debug log

    document.querySelectorAll("header").forEach((header) => {
      header.innerHTML = headerHtml;
    });

    document.querySelectorAll("footer").forEach((footer) => {
      footer.innerHTML = footerHtml;
    });

    console.log("Header and footer injected into the DOM."); // Debug log

    // Highlight active navigation link
    highlightActivePage();

    console.log("Navigation links highlighted."); // Debug log

    const expandButton = document.querySelector("#expand-header-menu-button");
    if (expandButton) {
      expandButton.addEventListener("click", () => {
        document.querySelector("header").classList.toggle("menu-expanded");
        console.log("Menu expanded/collapsed."); // Debug log
      });
    }

    // Handle popup overlay for "Hire Staff" button
    const popupOverlay = document.getElementById("popupOverlay");
    if (popupOverlay) {
      popupOverlay.addEventListener("click", function (event) {
        if (event.target === this) {
          console.log("Popup overlay clicked, closing..."); // Debug log
          closePopupOverlay();
        }
      });
    }

    const closePopupBtn = document.querySelector("#closePopupBtn");
    if (closePopupBtn) {
      closePopupBtn.addEventListener("click", closePopupOverlay);
      console.log("Close popup button initialized."); // Debug log
    }

    const hireStaffButton = document.querySelector("#openFormBtn");
    if (hireStaffButton) {
      hireStaffButton.addEventListener("click", openPopupOverlay);
      console.log("Hire Staff button initialized."); // Debug log
    }
    
    // Initialize contact form logic
    initializeContactForm();
    console.log("Contact form initialized."); // Debug log
  } catch (error) {
    console.error("Error during page initialization:", error); // Debug error
    alert("Failed to initialize page navigation!");
  }
}

function openPopupOverlay(event) {
  event.preventDefault();
  const popupOverlay = document.getElementById("popupOverlay");
  if (popupOverlay) {
    popupOverlay.classList.add("active");
    document.body.classList.add("no-scroll");
  }
}

function closePopupOverlay() {
  const popupOverlay = document.getElementById("popupOverlay");
  if (popupOverlay) {
    popupOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
}

async function initializeContactForm() {
  try {
    document.querySelector("textarea[name='message']").focus();
  } catch (error) {
    console.error("Failed to initialize contact form:", error);
  }
}

window.submitMessage = async function (event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const fieldset = form.querySelector("#contact-form-root-fieldset") || form;
  fieldset.setAttribute("disabled", "disabled");
  form.setAttribute("data-status", "SUBMITTING");
  form.querySelector(".status-message-content").textContent = "";

  grecaptcha.ready(function () {
    grecaptcha
      .execute(RECAPTCHA_SITE_KEY, { action: "submit" })
      .then(async function (token) {
        formData.append("g-recaptcha-response", token);

        const data = {
          senderName: formData.get("senderName"),
          senderEmail: formData.get("senderEmail"),
          senderPhoneNumber: formData.get("senderPhoneNumber"),
          subject: formData.get("subject"),
          industry: formData.get("industry"),
          message: formData.get("message"),
          "g-recaptcha-response": formData.get("g-recaptcha-response"), // Add reCAPTCHA token
        };

        try {
          const response = await fetch(
            "https://api.emailjs.com/api/v1.0/email/send",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                accessToken: EMAILJS_PRIVATE_KEY,
                template_params: data,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              "Unsuccessful server response: " + response.statusText
            );
          }

          form.setAttribute("data-status", "SUCCESS");
          form.querySelector(".status-message-content").textContent =
            "Message sent successfully!";
        } catch (error) {
          fieldset.removeAttribute("disabled");
          form.setAttribute("data-status", "ERROR");
          form.querySelector(".status-message-content").textContent =
            error?.message ?? String(error);
        }
      })
      .catch((error) => {
        console.error("reCAPTCHA execution error:", error);
        form.setAttribute("data-status", "ERROR");
        form.querySelector(".status-message-content").textContent =
          "reCAPTCHA failed. Please try again.";
      });
  });
};

initializePage(); // Initialize the page immediately on script load

window.addEventListener("popstate", initializePage); // Re-initialize page when popstate event occurs

// Add the Cookiebot script to the head section
const cookiebotScript = document.createElement("script");
cookiebotScript.id = "Cookiebot";
cookiebotScript.src = "https://consent.cookiebot.com/uc.js";
cookiebotScript.dataset.cbid = "a59dd3af-e684-456a-ac66-13065d599510";
cookiebotScript.dataset.blockingmode = "auto";
cookiebotScript.type = "text/javascript";
document.head.appendChild(cookiebotScript);

// Add the Google reCAPTCHA script to the head section
const recaptchaScript = document.createElement("script");
recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
recaptchaScript.async = true;
document.head.appendChild(recaptchaScript);
