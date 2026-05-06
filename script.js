const products = [
  {
    id: "resistance",
    title: "Resistance",
    copy: "Jaquetas criadas para enfrentar qualquer clima. Materiais duráveis, costuras reforçadas e proteção contra vento e chuva para acompanhar você em qualquer desafio.",
    price: 529,
    stock: 18,
    theme: "#72c958",
    deep: "#23820f",
    filter: "none",
    label: "Jaqueta verde acolchoada com capuz"
  },
  {
    id: "glacial",
    title: "Glacial",
    copy: "Volume acolchoado e quente com acabamento macio, feito para dias frios na cidade e deslocamentos com conforto.",
    price: 589,
    stock: 12,
    theme: "#7fcde2",
    deep: "#176b92",
    filter: "hue-rotate(112deg) saturate(.92) brightness(1.04)",
    label: "Jaqueta azul acolchoada com capuz"
  },
  {
    id: "ember",
    title: "Ember",
    copy: "Camada térmica marcante com enchimento leve, punhos macios e capuz protetor para temperaturas baixas.",
    price: 559,
    stock: 9,
    theme: "#e57952",
    deep: "#9a351e",
    filter: "hue-rotate(252deg) saturate(1.08) brightness(1.03)",
    label: "Jaqueta laranja acolchoada com capuz"
  },
  {
    id: "shadow",
    title: "Shadow",
    copy: "Construção minimalista resistente ao clima, bolsos profundos e acabamento versátil para uso diário.",
    price: 649,
    stock: 15,
    theme: "#7d838f",
    deep: "#29313d",
    filter: "grayscale(.72) saturate(.65) brightness(.82)",
    label: "Jaqueta escura acolchoada com capuz"
  }
];

const showcase = document.querySelector(".showcase");
const title = document.querySelector("#product-title");
const copy = document.querySelector("#product-copy");
const price = document.querySelector("#product-price");
const stock = document.querySelector("#product-stock");
const image = document.querySelector("#product-image");
const dots = Array.from(document.querySelectorAll(".slide-dot"));
const sizeButtons = Array.from(document.querySelectorAll(".size-option"));
const addToCartButton = document.querySelector("#add-to-cart");
const cartDrawer = document.querySelector(".cart-drawer");
const cartItems = document.querySelector("[data-cart-items]");
const cartCount = document.querySelector("[data-cart-count]");
const subtotalElement = document.querySelector("[data-subtotal]");
const shippingElement = document.querySelector("[data-shipping]");
const totalElement = document.querySelector("[data-total]");
const checkoutButton = document.querySelector("[data-checkout]");
const checkoutModal = document.querySelector(".checkout-modal");
const checkoutForm = document.querySelector("[data-checkout-form]");
const overlay = document.querySelector("[data-overlay]");
const toast = document.querySelector("[data-toast]");

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

let currentSlide = 0;
let selectedSize = "P";
let cart = loadCart();
let slideTimer = window.setInterval(showNextSlide, 4800);

function setSlide(index) {
  if (index === currentSlide) return;

  currentSlide = index;
  const product = products[index];

  showcase.classList.remove("is-changing");
  void showcase.offsetWidth;
  showcase.classList.add("is-changing");

  showcase.style.setProperty("--theme", product.theme);
  showcase.style.setProperty("--theme-deep", product.deep);
  showcase.style.setProperty("--image-filter", product.filter);

  title.textContent = product.title;
  copy.textContent = product.copy;
  price.textContent = currency.format(product.price);
  stock.textContent = `${product.stock} em estoque`;
  image.alt = product.label;

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });
}

function showNextSlide() {
  setSlide((currentSlide + 1) % products.length);
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    window.clearInterval(slideTimer);
    setSlide(index);
    slideTimer = window.setInterval(showNextSlide, 4800);
  });
});

sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedSize = button.dataset.size;
    sizeButtons.forEach((item) => item.classList.toggle("active", item === button));
  });
});

addToCartButton.addEventListener("click", () => {
  const product = products[currentSlide];
  const itemKey = `${product.id}-${selectedSize}`;
  const existingItem = cart.find((item) => item.key === itemKey);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      key: itemKey,
      productId: product.id,
      size: selectedSize,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  showToast(`${product.title} tamanho ${selectedSize} adicionada ao carrinho`);
  openCart();
});

document.querySelector(".cart-toggle").addEventListener("click", openCart);
document.querySelector(".drawer-close").addEventListener("click", closePanels);
overlay.addEventListener("click", closePanels);

checkoutButton.addEventListener("click", () => {
  if (!cart.length) return;
  checkoutModal.classList.add("open");
  checkoutModal.setAttribute("aria-hidden", "false");
  overlay.classList.add("open");
});

document.querySelector("[data-close-checkout]").addEventListener("click", closePanels);

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(checkoutForm);
  const name = formData.get("name");

  cart = [];
  saveCart();
  renderCart();
  checkoutForm.reset();
  closePanels();
  showToast(`Pedido realizado. Obrigado, ${name}!`);
});

cartItems.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const key = actionButton.dataset.key;
  const item = cart.find((cartItem) => cartItem.key === key);
  if (!item) return;

  if (actionButton.dataset.action === "increase") {
    item.quantity += 1;
  }

  if (actionButton.dataset.action === "decrease") {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart = cart.filter((cartItem) => cartItem.key !== key);
    }
  }

  if (actionButton.dataset.action === "remove") {
    cart = cart.filter((cartItem) => cartItem.key !== key);
  }

  saveCart();
  renderCart();
});

showcase.addEventListener("animationend", (event) => {
  if (event.animationName === "jacketSlide") {
    showcase.classList.remove("is-changing");
  }
});

function renderCart() {
  const enrichedCart = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return { ...item, product };
  }).filter((item) => item.product);

  if (!enrichedCart.length) {
    cartItems.innerHTML = `<p class="empty-cart">Seu carrinho está vazio. Escolha o tamanho da jaqueta e adicione para iniciar o pedido.</p>`;
  } else {
    cartItems.innerHTML = enrichedCart.map((item) => `
      <article class="cart-item">
        <img src="assets/jacket-green.jpg" alt="${item.product.label}" style="--item-filter: ${item.product.filter};">
        <div>
          <h3>${item.product.title}</h3>
          <p>Tamanho ${item.size} / ${currency.format(item.product.price)}</p>
          <div class="cart-item-footer">
            <strong>${currency.format(item.product.price * item.quantity)}</strong>
            <div class="cart-item-actions" aria-label="Controles de quantidade">
              <button type="button" data-action="decrease" data-key="${item.key}" aria-label="Diminuir quantidade">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="increase" data-key="${item.key}" aria-label="Aumentar quantidade">+</button>
              <button type="button" data-action="remove" data-key="${item.key}" aria-label="Remover item">x</button>
            </div>
          </div>
        </div>
      </article>
    `).join("");
  }

  const subtotal = enrichedCart.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);
  const shipping = subtotal > 0 ? 8 : 0;
  const total = subtotal + shipping;
  const quantity = enrichedCart.reduce((sum, item) => sum + item.quantity, 0);

  subtotalElement.textContent = currency.format(subtotal);
  shippingElement.textContent = currency.format(shipping);
  totalElement.textContent = currency.format(total);
  cartCount.textContent = quantity;
  checkoutButton.disabled = quantity === 0;
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("open");
}

function closePanels() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  checkoutModal.classList.remove("open");
  checkoutModal.setAttribute("aria-hidden", "true");
  overlay.classList.remove("open");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function loadCart() {
  try {
    return JSON.parse(window.localStorage.getItem("next-level-cart")) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  window.localStorage.setItem("next-level-cart", JSON.stringify(cart));
}

renderCart();
