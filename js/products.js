/* products.js - loads products from JSON, then search / filter / sort + lightbox */
document.addEventListener("DOMContentLoaded", initProducts);

async function initProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;
  const search = document.getElementById("product-search");
  const size = document.getElementById("product-size");
  const sort = document.getElementById("product-sort");
  const count = document.getElementById("product-count");
  const controls = document.getElementById("product-controls");
  let products = [];
  let visible = [];

  try {
    const res = await fetch("data/products.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    products = await res.json();
  } catch (err) {
    console.error("Could not load products:", err);
    return;                       // the static products already in the HTML stay visible
  }
  controls.hidden = false;

  const sorters = {
    default: (a, b) => a.id - b.id,
    "price-asc": (a, b) => a.priceLow - b.priceLow,
    "price-desc": (a, b) => b.priceLow - a.priceLow,
    name: (a, b) => a.name.localeCompare(b.name)
  };

  function render() {
    const term = search.value.trim().toLowerCase();
    visible = products
      .filter((p) => (size.value === "all" || p.size === size.value) &&
                     (p.name + " " + p.description).toLowerCase().includes(term))
      .sort(sorters[sort.value]);

    list.replaceChildren();
    count.textContent = visible.length + (visible.length === 1 ? " product" : " products") + " shown";
    if (!visible.length) {
      const msg = document.createElement("p");
      msg.className = "no-results";
      msg.textContent = "No products match your search. Try a different word or size.";
      list.append(msg);
      return;
    }
    visible.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "product";
      const img = document.createElement("img");
      img.src = p.image; img.alt = p.alt; img.loading = "lazy"; img.tabIndex = 0;
      img.addEventListener("click", () => openLightbox(i));
      img.addEventListener("keydown", (e) => { if (e.key === "Enter") openLightbox(i); });
      const h3 = document.createElement("h3"); h3.textContent = p.name;
      const desc = document.createElement("p"); desc.textContent = p.description;
      const price = document.createElement("p"); price.className = "price";
      price.textContent = "R" + p.priceLow + " - R" + p.priceHigh;
      card.append(img, h3, desc, price);
      list.append(card);
    });
  }
  [search, size, sort].forEach((el) => el.addEventListener("input", render));
  render();

  /* ---- Lightbox ---- */
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Product image viewer");
  box.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-prev" aria-label="Previous image">&#8249;</button><img alt="">' +
    '<p></p><button class="lb-next" aria-label="Next image">&#8250;</button>';
  document.body.append(box);
  const big = box.querySelector("img");
  const caption = box.querySelector("p");
  let current = 0;

  function openLightbox(i) {
    if (!visible.length) return;
    current = (i + visible.length) % visible.length;
    big.src = visible[current].image;
    big.alt = visible[current].alt;
    caption.textContent = visible[current].name;
    box.classList.add("show");
    box.querySelector(".lb-close").focus();
  }
  const close = () => box.classList.remove("show");
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", () => openLightbox(current - 1));
  box.querySelector(".lb-next").addEventListener("click", () => openLightbox(current + 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("show")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") openLightbox(current - 1);
    if (e.key === "ArrowRight") openLightbox(current + 1);
  });
}
