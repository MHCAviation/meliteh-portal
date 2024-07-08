document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired");

  // Adding a delay to ensure everything is properly loaded
  setTimeout(function() {
    const rightJobElement = document.querySelector(".homeTitle-red");
    console.log("rightJobElement:", rightJobElement);

    const jobTitles = ["Right Job", "Dream Job", "Future Job"];
    let currentIndex = 0;
    let typingSpeed = 100; // Speed in milliseconds for each character
    let erasingSpeed = 50; // Speed in milliseconds for each character
    let delayBetweenTitles = 2000; // Delay between titles in milliseconds

    // Initialize with the default text
    rightJobElement.innerHTML = "Right Job";

    // Define the CSS for .cursor class
    const cursorStyle = `
      .cursor {
        display: inline-block;
        width: 4px;
        animation: blink 0.5s steps(1) infinite;
      }

      @keyframes blink {
        50% {
          opacity: 0;
        }
      }
    `;

    // Create a style element and append CSS to it
    const styleElement = document.createElement("style");
    styleElement.textContent = cursorStyle;
    document.head.appendChild(styleElement);

    function typeText(text, index = 0) {
      if (index < text.length) {
        rightJobElement.innerHTML = text.substring(0, index + 1) + "<span class='cursor'>|</span>";
        setTimeout(() => typeText(text, index + 1), typingSpeed);
      } else {
        setTimeout(eraseText, delayBetweenTitles);
      }
    }

    function eraseText(index = rightJobElement.innerText.length - 1) {
      if (index >= 0) {
        rightJobElement.innerHTML = rightJobElement.innerText.slice(0, index) + "<span class='cursor'>|</span>";
        setTimeout(() => eraseText(index - 1), erasingSpeed);
      } else {
        // Clear the entire line including the <br /> tag
        rightJobElement.innerHTML = "";
        currentIndex = (currentIndex + 1) % jobTitles.length;
        setTimeout(() => typeText(jobTitles[currentIndex]), 500); // Small delay before starting to type the next title
      }
    }

    // Start the typing effect after a short delay
    setTimeout(() => {
      typeText(jobTitles[currentIndex]);
    }, 500); // Adjust the delay as needed
  }, 100); // Adjust the delay as needed
});
