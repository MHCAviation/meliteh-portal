document.addEventListener("DOMContentLoaded", function () {
    const rightJobElement = document.querySelector(".right-job");
    const jobTitles = ["Right Job", "Dream Job", "Future Job"];
    let currentIndex = 0;
  
    function changeJobTitle() {
      rightJobElement.innerHTML = jobTitles[currentIndex] + "<br />";
      currentIndex = (currentIndex + 1) % jobTitles.length;
    }
  
    setInterval(changeJobTitle, 2000); // Change every 2 seconds
  });
  