document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".client-image-track");
  // duplicate all logos for looping
  track.innerHTML += track.innerHTML;

  let offset = 0;
  const speed = 0.5; // px per frame — increase for faster scroll

  function step() {
    offset -= speed;
    // when we've scrolled one full copy, reset to 0
    if (Math.abs(offset) >= track.scrollWidth / 2) {
      offset = 0;
    }
    track.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
});
