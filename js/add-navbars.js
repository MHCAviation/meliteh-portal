
async function main() {
    const innerHTML = await fetch("/components/header.html").then(rs => rs.text());
    for (const header of document.getElementsByTagName("header")) {
        header.innerHTML = innerHTML;
        for (const a of header.getElementsByTagName("a")) {
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