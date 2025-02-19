// JavaScript function for subscribing
async function subscribeToNews(event) {
  event.preventDefault(); // Prevent the form from reloading the page

  // Get the email input value
  const emailInput = document.querySelector(".subscribe-form-email-input");
  const email = emailInput.value.trim();

  // Validate email input
  if (!email) {
    alert("Please enter a valid email.");
    return;
  }

  // Prepare data to be sent to the server
  const data = { email };

  try {
    // Send the data to the server via POST request
    const response = await fetch("http://localhost:7777/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Send email data
    });

    const result = await response.json();

    // Handle the server response
    if (response.ok) {
      alert("Successfully subscribed! Check your email for job updates.");
      emailInput.value = ""; // Clear input field after successful subscription
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error("Subscription failed:", error);
    alert("Something went wrong. Please try again later.");
  }
}
