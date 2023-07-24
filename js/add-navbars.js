
async function main() {
    const innerHTML = await fetch("/components/header.html").then(rs => rs.text());
    for (const header of document.getElementsByTagName("header")) {
        header.innerHTML = innerHTML;
    }
}

main().catch(error => {
    console.error(error);
    alert("Failed to initialize page navigation!");
});