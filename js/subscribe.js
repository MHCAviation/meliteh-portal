async function subscribeToNews(event) {
  event.preventDefault();
  const emailInput = document.querySelector(".subscribe-form-email-input");
  const email = emailInput.value.trim();

  if (!email) {
    alert("Please enter a valid email.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    console.log("Response:", result); // Log the response for debugging

    if (response.ok) {
      alert("Successfully subscribed! Check your email for job updates.");
      emailInput.value = "";
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error("Subscription failed:", error);
    alert("Something went wrong. Please try again later.");
  }
}
