export function inView(entry) {
  const anchor = entry.target;
  const index = Array.from(document.querySelectorAll(".scroll-anchor")).indexOf(
    anchor,
  );
  const section = document.querySelectorAll(".content-section")[index];
  const sections = document.querySelectorAll(".content-section");
  const isLastSection = index === sections.length - 1;

  if (!section) return;

  const ratio = entry.intersectionRatio;
  const rect = entry.boundingClientRect;
  const viewportHeight = window.innerHeight;

  let scale, opacity;

  // Set global flag for last section visibility
  window.isLastSectionFullyVisible = isLastSection && ratio === 1;

  // Reset flag when leaving the last section
  if (isLastSection && ratio < 1) {
    window.isLastSectionFullyVisible = false;
  }

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
      scale = 1 + 7 * (1 - ratio);
      opacity = 1 - 7 * (1 - ratio); // Fade out when leaving
    } else {
      // Entering viewport
      // ratio goes from 0 to 1 as anchor enters
      scale = ratio;
      opacity = 1; // Keep opacity at 1 when entering
    }
  }

  // Clamp values
  scale = Math.max(0, Math.min(2, scale));
  opacity = Math.max(0, Math.min(1, opacity));

  section.style.transform = `scale(${scale})`;
  section.style.opacity = `${opacity}`;
  section.style.transition = "transform 0.05s linear, opacity 0.05s linear";
}
