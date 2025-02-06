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
    const basePath = "/components/";

    // Load header and footer concurrently
    const [headerHtml, footerHtml] = await Promise.all([
      loadPageContent(basePath + "header.html"),
      loadPageContent(basePath + "footer.html"),
    ]);

    // Inject header & footer into the DOM
    document.querySelectorAll("header").forEach((header) => {
      header.innerHTML = headerHtml;
    });

    document.querySelectorAll("footer").forEach((footer) => {
      footer.innerHTML = footerHtml;
    });

    // Highlight active navigation link
    highlightActivePage();

    // Menu toggle functionality
    const expandButton = document.querySelector("#expand-header-menu-button");
    const buttonContainer = document.querySelector(".button-container");
    const topMenu = document.querySelector(".top-menu");

    if (expandButton && buttonContainer && topMenu) {
      expandButton.addEventListener("click", () => {
        document.querySelector("header").classList.toggle("menu-expanded");

        if (
          document.querySelector("header").classList.contains("menu-expanded")
        ) {
          // When menu is expanded, keep the hamburger and close button in the button container
          buttonContainer.appendChild(expandButton);
        } else {
          // When menu is collapsed, move the hamburger back to its original position in the top menu
          topMenu.appendChild(expandButton);
        }
      });
    }

    // Submit CV dropdown with smooth animation
    const submitCvBtn = document.getElementById("submitCvBtn");
    const cvDropdown = document.getElementById("cvDropdown");

    if (submitCvBtn && cvDropdown) {
      submitCvBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents immediate closing when clicked
        cvDropdown.classList.toggle("show");
        this.querySelector("i").classList.toggle("rotate");

        // GTM tracking for Submit CV button click using dataLayer
        window.dataLayer.push({
          event: "submit_cv_button_click",
          event_category: "Submit CV",
          event_label: "Clicked Submit CV button",
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", function (event) {
        if (
          !submitCvBtn.contains(event.target) &&
          !cvDropdown.contains(event.target)
        ) {
          cvDropdown.classList.remove("show");
          submitCvBtn.querySelector("i").classList.remove("rotate");
        }
      });
    }

    // Track industry selection via GTM using dataLayer
    const industryLinks = document.querySelectorAll("#cvDropdown a");
    industryLinks.forEach((link) => {
      link.addEventListener("click", function () {
        const industry = this.textContent.trim();

        // GTM tracking for industry selection using dataLayer
        window.dataLayer.push({
          event: "industry_selected",
          event_category: "Submit CV",
          industry_label: industry,
        });
      });
    });

    // Handle popup overlay for "Hire Staff" button
    const hireStaffButton = document.querySelector("#openFormBtn");
    if (hireStaffButton) {
      hireStaffButton.addEventListener("click", openPopupOverlay);
    }

    // Initialize contact form logic
    initializeContactForm();
  } catch (error) {
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

const gtmScript = document.createElement("script");
gtmScript.async = true;
gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=GTM-K9KM9HF6";
document.head.appendChild(gtmScript);

window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-6NM1J03PQF");
