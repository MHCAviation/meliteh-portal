
async function main() {
    const [headerHtml, footerHtml] = await Promise.all([
        fetch("/components/header.html").then(rs => rs.text()),
        fetch("/components/footer.html").then(rs => rs.text()),
    ]);
    for (const header of document.getElementsByTagName("header")) {
        header.innerHTML = headerHtml;
        for (const a of header.getElementsByTagName("a")) {
            if (window.location.href === a.href) {
                a.classList.add("current-page");
            }
        }
        const expandButton = header.querySelector("#expand-header-menu-button");
        expandButton.addEventListener("click", () => {
            header.classList.toggle("menu-expanded");
        });
    }

    for (const footer of document.getElementsByTagName("footer")) {
        footer.innerHTML = footerHtml;
        for (const a of footer.getElementsByTagName("a")) {
            if (window.location.href === a.href) {
                a.classList.add("current-page");
            }
        }
    }
}

main().catch(error => {
    console.error(error);
    alert("Failed to initialize page navigation!");
});