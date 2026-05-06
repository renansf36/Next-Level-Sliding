const slides = [
  {
    title: "Resistance",
    copy: "Jackets designed to withstand anything. Durable materials, reinforced seams, and wind and rain protection to accompany you through any challenge.",
    price: "$105.00",
    theme: "#72c958",
    deep: "#23820f",
    filter: "none",
    label: "Green padded hooded jacket"
  },
  {
    title: "Glacial",
    copy: "Warm puffer volume with a smooth insulated shell, made for cold commutes and fast-moving city days.",
    price: "$118.00",
    theme: "#7fcde2",
    deep: "#176b92",
    filter: "hue-rotate(112deg) saturate(.92) brightness(1.04)",
    label: "Blue padded hooded jacket"
  },
  {
    title: "Ember",
    copy: "A bold thermal layer with high loft padding, soft cuffs, and a protective hood for low-temperature runs.",
    price: "$112.00",
    theme: "#e57952",
    deep: "#9a351e",
    filter: "hue-rotate(252deg) saturate(1.08) brightness(1.03)",
    label: "Orange padded hooded jacket"
  },
  {
    title: "Shadow",
    copy: "Minimal weatherproof construction, compact storage, and deep pockets for everyday performance.",
    price: "$129.00",
    theme: "#7d838f",
    deep: "#29313d",
    filter: "grayscale(.72) saturate(.65) brightness(.82)",
    label: "Dark padded hooded jacket"
  }
];

const showcase = document.querySelector(".showcase");
const title = document.querySelector("#product-title");
const copy = document.querySelector("#product-copy");
const price = document.querySelector("#product-price");
const image = document.querySelector("#product-image");
const dots = Array.from(document.querySelectorAll(".slide-dot"));

let currentSlide = 0;
let slideTimer = window.setInterval(showNextSlide, 4800);

function setSlide(index) {
  if (index === currentSlide) return;

  currentSlide = index;
  const slide = slides[index];

  showcase.classList.remove("is-changing");
  void showcase.offsetWidth;
  showcase.classList.add("is-changing");

  showcase.style.setProperty("--theme", slide.theme);
  showcase.style.setProperty("--theme-deep", slide.deep);
  showcase.style.setProperty("--image-filter", slide.filter);

  title.textContent = slide.title;
  copy.textContent = slide.copy;
  price.textContent = slide.price;
  image.alt = slide.label;

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });
}

function showNextSlide() {
  setSlide((currentSlide + 1) % slides.length);
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    window.clearInterval(slideTimer);
    setSlide(index);
    slideTimer = window.setInterval(showNextSlide, 4800);
  });
});

showcase.addEventListener("animationend", (event) => {
  if (event.animationName === "jacketSlide") {
    showcase.classList.remove("is-changing");
  }
});
