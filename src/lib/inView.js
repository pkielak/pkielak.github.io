export function inView(entry) {
  const anchor = entry.target;
  const index = Array.from(document.querySelectorAll(".scroll-anchor")).indexOf(
    anchor,
  );
  const section = document.querySelectorAll(".content-section")[index];

  if (!section) return;

  const ratio = entry.intersectionRatio;
  const rect = entry.boundingClientRect;
  const viewportHeight = window.innerHeight;

  let scale, opacity;

  if (ratio === 0) {
    // Not visible at all
    scale = 0;
    opacity = 0;
  } else if (ratio === 1) {
    // Fully in viewport
    scale = 1;
    opacity = 1;
  } else {
    // Partially visible
    if (rect.top >= 0 && rect.bottom <= viewportHeight) {
      // Fully in viewport (edge case)
      scale = 1;
      opacity = 1;
    } else if (rect.top < 0) {
      // Scrolled past - exiting viewport
      // ratio goes from 1 to 0 as we scroll past
      scale = 1 + (1 - ratio);
      opacity = 1 - (1 - ratio);
    } else {
      // Entering viewport
      // ratio goes from 0 to 1 as anchor enters
      scale = ratio;
      opacity = ratio;
    }
  }

  // Clamp values
  scale = Math.max(0, Math.min(2, scale));
  opacity = Math.max(0, Math.min(1, opacity));

  section.style.transform = `scale(${scale})`;
  section.style.opacity = `${opacity}`;
  section.style.transition = "transform 0.05s linear, opacity 0.05s linear";
}
