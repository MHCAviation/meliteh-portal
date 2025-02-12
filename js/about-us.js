async function main() {
  const bg = document.getElementById("title-banner-slideshow-image");
  let iteration = 0;
  setInterval(() => {
    ++iteration;
    bg.setAttribute("data-slide-iteration", iteration % 5);
  }, 8000);

  await initializePage(); // Initialize the page functionality
}

async function initializePage() {
  try {
    const basePath = "/components/";

    const [headerHtml, footerHtml] = await Promise.all([
      loadPageContent(basePath + "header.html"),
      loadPageContent(basePath + "footer.html"),
    ]);

    document.querySelectorAll("header").forEach((header) => {
      header.innerHTML = headerHtml;
    });

    document.querySelectorAll("footer").forEach((footer) => {
      footer.innerHTML = footerHtml;
    });

    highlightActivePage();
    initializeHeader();
    initializeFooter();
    initializePopup();
    initializeContactForm();
  } catch (error) {
    console.error("Failed to initialize page navigation:", error);
    alert("Failed to initialize page navigation!");
  }
}

function initializeHeader() {
  const expandButton = document.querySelector("#expand-header-menu-button");
  if (expandButton) {
    expandButton.addEventListener("click", () => {
      document.querySelector("header").classList.toggle("menu-expanded");
    });
  }
}

function initializeFooter() {
  console.log("Footer initialized");
}

function initializePopup() {
  const popupOverlay = document.getElementById("popupOverlay");
  if (popupOverlay) {
    popupOverlay.addEventListener("click", function (event) {
      if (event.target === this) {
        closePopupOverlay();
      }
    });
  }

  const closePopupBtn = document.querySelector("#closePopupBtn");
  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", closePopupOverlay);
  }

  const hireStaffButton = document.querySelector("#openFormBtn");
  if (hireStaffButton) {
    hireStaffButton.addEventListener("click", openPopupOverlay);
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

async function loadPageContent(url) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error("Failed to load page content:", error);
    throw error;
  }
}

function highlightActivePage() {
  const currentPageUrl = window.location.pathname;
  document.querySelectorAll("header a").forEach((link) => {
    link.classList.toggle(
      "current-page",
      new URL(link.href, window.location.origin).pathname === currentPageUrl
    );
  });
}

async function initializeContactForm() {
  try {
    document.querySelector("textarea[name='message']").focus();
  } catch (error) {
    console.error("Failed to initialize contact form:", error);
  }
}

window.addEventListener("popstate", initializePage);

main().catch((error) => {
  console.error(error);
  alert("Failed to initialize page!");
});
