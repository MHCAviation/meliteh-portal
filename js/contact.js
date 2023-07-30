
async function main() {
    document.getElementById("message").focus();
}

main().catch(error => {
    console.error(error);
    alert("Failed to initialize page!");
});