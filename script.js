const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const reveals = document.querySelectorAll(".reveal");
const testimonialTrack = document.querySelector(".testimonial-track");
const testimonials = document.querySelectorAll(".testimonial-track article");
const previousButton = document.querySelector(".slider-prev");
const nextButton = document.querySelector(".slider-next");
const testimonialViewport = document.querySelector(".testimonial-viewport");
const testimonialCurrent = document.querySelector(".testimonial-current");
const testimonialTotal = document.querySelector(".testimonial-total");
const testimonialProgress = document.querySelector(".testimonial-progress span");

let testimonialIndex = 0;
let testimonialTimer;
let pointerStartX = 0;

function toggleMenu(forceOpen) {
  const isOpen = forceOpen ?? !siteNav.classList.contains("open");
  siteNav.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function testimonialsPerView() {
  if (window.innerWidth <= 780) return 1;
  if (window.innerWidth <= 1050) return 2;
  return 3;
}

function updateTestimonials() {
  const perView = testimonialsPerView();
  const maxIndex = Math.max(0, testimonials.length - perView);
  testimonialIndex = Math.min(testimonialIndex, maxIndex);
  const card = testimonials[0];
  const gap = Number.parseFloat(getComputedStyle(testimonialTrack).gap) || 0;
  const distance = card ? card.getBoundingClientRect().width + gap : 0;

  testimonialTrack.style.transform = `translateX(-${testimonialIndex * distance}px)`;
  testimonialCurrent.textContent = String(testimonialIndex + 1).padStart(2, "0");
  testimonialTotal.textContent = String(testimonials.length).padStart(2, "0");
  testimonialProgress.style.width = `${100 / (maxIndex + 1)}%`;
  testimonialProgress.style.transform = `translateX(${testimonialIndex * 100}%)`;
}

function moveTestimonials(direction) {
  const maxIndex = Math.max(0, testimonials.length - testimonialsPerView());
  testimonialIndex += direction;
  if (testimonialIndex > maxIndex) testimonialIndex = 0;
  if (testimonialIndex < 0) testimonialIndex = maxIndex;
  updateTestimonials();
}

function startTestimonialAutoplay() {
  window.clearInterval(testimonialTimer);
  testimonialTimer = window.setInterval(() => moveTestimonials(1), 5000);
}

function pauseTestimonialAutoplay() {
  window.clearInterval(testimonialTimer);
}

menuToggle.addEventListener("click", () => toggleMenu());
navLinks.forEach((link) => link.addEventListener("click", () => toggleMenu(false)));

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 90);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

reveals.forEach((element) => revealObserver.observe(element));

previousButton.addEventListener("click", () => {
  moveTestimonials(-1);
  startTestimonialAutoplay();
});

nextButton.addEventListener("click", () => {
  moveTestimonials(1);
  startTestimonialAutoplay();
});

testimonialViewport.addEventListener("mouseenter", pauseTestimonialAutoplay);
testimonialViewport.addEventListener("mouseleave", startTestimonialAutoplay);
testimonialViewport.addEventListener("focusin", pauseTestimonialAutoplay);
testimonialViewport.addEventListener("focusout", startTestimonialAutoplay);
testimonialViewport.addEventListener("pointerdown", (event) => {
  pointerStartX = event.clientX;
  pauseTestimonialAutoplay();
});
testimonialViewport.addEventListener("pointerup", (event) => {
  const movement = event.clientX - pointerStartX;
  if (Math.abs(movement) > 45) moveTestimonials(movement < 0 ? 1 : -1);
  startTestimonialAutoplay();
});

window.addEventListener("resize", () => {
  testimonialIndex = 0;
  updateTestimonials();
});
document.querySelector("#year").textContent = new Date().getFullYear();
updateTestimonials();
startTestimonialAutoplay();
