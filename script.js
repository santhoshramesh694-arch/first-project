/* =========================================================
   ARCTURA — script.js
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Product data ---------- */
  const PRODUCTS = [
    { id: "p1", brand: "Nordair", name: "Nordair Frostline 1.5T 5-Star Inverter Split AC", desc: "Copper condenser · dual filtration · Wi-Fi ready", type: "split", cap: "1.5", star: 5, price: 42990, mrp: 52990, rating: 4.6, reviews: 812, tag: "svg1" },
    { id: "p2", brand: "Polara", name: "Polara ArcCool 1.0T 3-Star Split AC", desc: "Compact outdoor unit · quick-cool mode", type: "split", cap: "1.0", star: 3, price: 28990, mrp: 33990, rating: 4.1, reviews: 402, tag: "svg2" },
    { id: "p3", brand: "Vortix", name: "Vortix Glide 2.0T 4-Star Inverter Split AC", desc: "Anti-corrosive coil · self-clean function", type: "split", cap: "2.0", star: 4, price: 54990, mrp: 64990, rating: 4.4, reviews: 566, tag: "svg3" },
    { id: "p4", brand: "Glaciera", name: "Glaciera Chill Pro 1.5T Window AC", desc: "Rugged single-body build · low maintenance", type: "window", cap: "1.5", star: 3, price: 26990, mrp: 31990, rating: 4.0, reviews: 289, tag: "svg4" },
    { id: "p5", brand: "Kelvinox", name: "Kelvinox Breeze 1.0T 5-Star Window AC", desc: "Turbo cooling · washable dust filter", type: "window", cap: "1.0", star: 5, price: 24990, mrp: 29990, rating: 4.3, reviews: 341, tag: "svg5" },
    { id: "p6", brand: "Arione", name: "Arione Nomad 1.0T Portable AC", desc: "No installation needed · caster wheels", type: "portable", cap: "1.0", star: 3, price: 32990, mrp: 37990, rating: 3.9, reviews: 158, tag: "svg6" },
    { id: "p7", brand: "Nordair", name: "Nordair Frostline 2.0T 3-Star Inverter Split AC", desc: "Large room coverage · sleep mode", type: "split", cap: "2.0", star: 3, price: 46990, mrp: 55990, rating: 4.2, reviews: 274, tag: "svg1" },
    { id: "p8", brand: "Polara", name: "Polara ArcCool 1.5T 5-Star Inverter Split AC", desc: "38dB silent night mode · 4-way swing", type: "split", cap: "1.5", star: 5, price: 44990, mrp: 54990, rating: 4.7, reviews: 933, tag: "svg2" },
    { id: "p9", brand: "Vortix", name: "Vortix Glide 1.0T 4-Star Split AC", desc: "Fast-cool boost · dust filter", type: "split", cap: "1.0", star: 4, price: 31990, mrp: 36990, rating: 4.3, reviews: 221, tag: "svg3" },
    { id: "p10", brand: "Glaciera", name: "Glaciera Chill Pro 1.5T 4-Star Window AC", desc: "Auto-restart · anti-bacterial filter", type: "window", cap: "1.5", star: 4, price: 27990, mrp: 32990, rating: 4.1, reviews: 198, tag: "svg4" },
    { id: "p11", brand: "Kelvinox", name: "Kelvinox Breeze 2.0T 3-Star Window AC", desc: "High static pressure fan · heavy duty", type: "window", cap: "2.0", star: 3, price: 33990, mrp: 39990, rating: 3.8, reviews: 143, tag: "svg5" },
    { id: "p12", brand: "Arione", name: "Arione Nomad 1.5T Portable AC", desc: "Dual hose venting · remote control", type: "portable", cap: "1.5", star: 4, price: 38990, mrp: 44990, rating: 4.0, reviews: 176, tag: "svg6" },
  ];

  const GRAD = {
    svg1: ["#0B3C5D", "#2EC4B6"], svg2: ["#124A70", "#7FD9CE"], svg3: ["#071B2B", "#2EC4B6"],
    svg4: ["#22A99C", "#0B3C5D"], svg5: ["#FF8552", "#0B3C5D"], svg6: ["#2EC4B6", "#124A70"]
  };

  function productSvg(tag) {
    const [c1, c2] = GRAD[tag] || GRAD.svg1;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="g-${tag}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
      </linearGradient></defs>
      <rect width="300" height="300" fill="url(#g-${tag})"/>
      <rect x="70" y="110" width="160" height="60" rx="14" fill="rgba(255,255,255,.92)"/>
      <rect x="82" y="124" width="30" height="8" rx="4" fill="#0B3C5D" opacity=".5"/>
      <rect x="82" y="140" width="60" height="8" rx="4" fill="#0B3C5D" opacity=".3"/>
      <circle cx="205" cy="140" r="14" fill="none" stroke="#2EC4B6" stroke-width="3"/>
      <path d="M60 172 q90 26 180 0" stroke="rgba(255,255,255,.5)" stroke-width="4" fill="none"/>
    </svg>`;
  }

  const state = {
    filters: { type: new Set(), cap: new Set(), star: new Set(), brand: new Set() },
    maxPrice: 70000,
    sort: "popular",
    wishlist: new Set(),
    compare: new Set(),
    cart: [] // {id, qty}
  };

  /* ---------- Helpers ---------- */
  const inr = n => "₹" + n.toLocaleString("en-IN");
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  function starRow(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let html = "";
    for (let i = 0; i < full; i++) html += '<i class="bi bi-star-fill"></i>';
    if (half) html += '<i class="bi bi-star-half"></i>';
    for (let i = full + (half ? 1 : 0); i < 5; i++) html += '<i class="bi bi-star"></i>';
    return html;
  }

  function discountPct(price, mrp) {
    return Math.round(((mrp - price) / mrp) * 100);
  }

  /* ---------- Render products ---------- */
  function applyFiltersAndSort() {
    let list = PRODUCTS.filter(p => {
      if (state.filters.type.size && !state.filters.type.has(p.type)) return false;
      if (state.filters.cap.size && !state.filters.cap.has(p.cap)) return false;
      if (state.filters.star.size && !state.filters.star.has(String(p.star))) return false;
      if (state.filters.brand.size && !state.filters.brand.has(p.brand)) return false;
      if (p.price > state.maxPrice) return false;
      return true;
    });

    switch (state.sort) {
      case "low": list.sort((a, b) => a.price - b.price); break;
      case "high": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "discount": list.sort((a, b) => discountPct(b.price, b.mrp) - discountPct(a.price, a.mrp)); break;
      default: list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }

  function cardHtml(p) {
    const wished = state.wishlist.has(p.id);
    const compared = state.compare.has(p.id);
    const off = discountPct(p.price, p.mrp);
    const emi = Math.round(p.price / 12);
    return `
    <div class="col-sm-6 col-xl-4">
      <div class="product-card reveal in" data-id="${p.id}">
        <div class="product-media">
          ${productSvg(p.tag)}
          <span class="badge-discount">${off}% OFF</span>
          <span class="badge-emi">EMI from ${inr(emi)}/mo</span>
          <div class="card-hover-actions">
            <button class="chip-btn wish-btn ${wished ? "active" : ""}" title="Wishlist" data-id="${p.id}"><i class="bi ${wished ? "bi-heart-fill" : "bi-heart"}"></i></button>
            <button class="chip-btn compare-btn ${compared ? "active" : ""}" title="Compare" data-id="${p.id}"><i class="bi bi-arrow-left-right"></i></button>
            <button class="chip-btn quick-btn" title="Quick view" data-id="${p.id}"><i class="bi bi-eye"></i></button>
          </div>
        </div>
        <div class="product-body">
          <span class="product-brand">${p.brand}</span>
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="rating-dial">
            <span class="stars">${starRow(p.rating)}</span>
            <span class="rating-count">${p.rating} (${p.reviews})</span>
          </div>
          <div class="price-row">
            <span class="price-offer">${inr(p.price)}</span>
            <span class="price-original">${inr(p.mrp)}</span>
            <span class="price-off-pct">${off}% off</span>
          </div>
          <div class="card-cta">
            <button class="btn btn-add add-btn" data-id="${p.id}"><i class="bi bi-bag-plus"></i> Add to cart</button>
            <button class="btn btn-buy buy-btn" data-id="${p.id}">Buy now</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  function renderProducts() {
    const list = applyFiltersAndSort();
    const grid = $("#productGrid");
    grid.innerHTML = list.length
      ? list.map(cardHtml).join("")
      : `<div class="col-12 text-center py-5 text-muted">No products match these filters. <button class="btn btn-link" id="resetFromEmpty">Clear filters</button></div>`;
    $("#resultCount").textContent = list.length;
    bindCardEvents();
    const resetBtn = $("#resetFromEmpty");
    if (resetBtn) resetBtn.addEventListener("click", clearAllFilters);
  }

  function renderSkeleton() {
    const skel = $("#skeletonGrid");
    let html = "";
    for (let i = 0; i < 6; i++) {
      html += `<div class="col-sm-6 col-xl-4"><div class="skel-card">
        <div class="skel-media"></div>
        <div class="skel-line"></div><div class="skel-line short"></div>
        <div class="skel-line" style="width:70%"></div>
      </div></div>`;
    }
    skel.innerHTML = html;
  }

  /* ---------- Filters ---------- */
  function bindFilterEvents() {
    $$(".filter-check").forEach(chk => {
      chk.addEventListener("change", () => {
        const group = state.filters[chk.dataset.filter];
        if (chk.checked) group.add(chk.value); else group.delete(chk.value);
        renderProducts();
      });
    });
    $$('a[data-filter]').forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        const filterName = a.dataset.filter;
        const val = a.dataset.value;
        const targetChk = document.getElementById(
          filterName === "type" ? "fType" + (["split", "window", "portable"].indexOf(val) + 1) :
          filterName === "cap" ? "fCap" + (["1.0", "1.5", "2.0"].indexOf(val) + 1) :
          filterName === "star" ? "fStar" + (["5", "4", "3"].indexOf(val) + 1) : null
        );
        state.filters[filterName].clear();
        state.filters[filterName].add(val);
        if (targetChk) {
          $$(".filter-check[data-filter='" + filterName + "']").forEach(c => c.checked = false);
          targetChk.checked = true;
        }
        renderProducts();
        document.getElementById("products").scrollIntoView({ behavior: "smooth" });
      });
    });
    $("#priceRange").addEventListener("input", e => {
      state.maxPrice = Number(e.target.value);
      $("#priceVal").textContent = inr(state.maxPrice);
      renderProducts();
    });
    $("#sortSelect").addEventListener("change", e => {
      state.sort = e.target.value;
      renderProducts();
    });
    $("#clearFilters").addEventListener("click", clearAllFilters);
  }

  function clearAllFilters() {
    Object.values(state.filters).forEach(s => s.clear());
    state.maxPrice = 70000;
    $$(".filter-check").forEach(c => c.checked = false);
    $("#priceRange").value = 70000;
    $("#priceVal").textContent = inr(70000);
    renderProducts();
  }

  /* ---------- Cards actions ---------- */
  function showToast(msg) {
    $("#toastBody").textContent = msg;
    new bootstrap.Toast($("#appToast"), { delay: 2200 }).show();
  }

  function bindCardEvents() {
    $$(".wish-btn").forEach(btn => btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (state.wishlist.has(id)) state.wishlist.delete(id); else state.wishlist.add(id);
      $("#wishCount").textContent = state.wishlist.size;
      renderProducts();
      showToast(state.wishlist.has(id) ? "Added to wishlist" : "Removed from wishlist");
    }));
    $$(".compare-btn").forEach(btn => btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (state.compare.has(id)) state.compare.delete(id);
      else {
        if (state.compare.size >= 4) { showToast("You can compare up to 4 products"); return; }
        state.compare.add(id);
      }
      $("#compareCount").textContent = state.compare.size;
      renderProducts();
    }));
    $$(".quick-btn").forEach(btn => btn.addEventListener("click", () => openQuickView(btn.dataset.id)));
    $$(".add-btn").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.id)));
    $$(".buy-btn").forEach(btn => btn.addEventListener("click", () => {
      addToCart(btn.dataset.id);
      new bootstrap.Offcanvas($("#cartCanvas")).show();
    }));
  }

  function openQuickView(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const off = discountPct(p.price, p.mrp);
    $("#quickViewBody").innerHTML = `
      <div class="modal-header border-0">
        <h5 class="modal-title">${p.name}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="row g-4">
          <div class="col-md-5"><div class="product-media" style="border-radius:12px;">${productSvg(p.tag)}</div></div>
          <div class="col-md-7">
            <span class="product-brand">${p.brand}</span>
            <p class="product-desc mb-2">${p.desc}</p>
            <div class="rating-dial mb-2"><span class="stars">${starRow(p.rating)}</span><span class="rating-count">${p.rating} (${p.reviews} reviews)</span></div>
            <div class="price-row mb-3"><span class="price-offer">${inr(p.price)}</span><span class="price-original">${inr(p.mrp)}</span><span class="price-off-pct">${off}% off</span></div>
            <ul class="small text-muted mb-3">
              <li>Type: ${p.type} AC · ${p.cap} Ton · ${p.star} Star</li>
              <li>Free standard installation included</li>
              <li>1-year comprehensive warranty</li>
            </ul>
            <div class="d-flex gap-2">
              <button class="btn btn-add flex-fill add-btn" data-id="${p.id}"><i class="bi bi-bag-plus"></i> Add to cart</button>
              <button class="btn btn-buy flex-fill buy-btn" data-id="${p.id}">Buy now</button>
            </div>
          </div>
        </div>
      </div>`;
    bindCardEvents();
    new bootstrap.Modal($("#quickViewModal")).show();
  }

  function addToCart(id) {
    const existing = state.cart.find(c => c.id === id);
    if (existing) existing.qty += 1; else state.cart.push({ id, qty: 1 });
    renderCart();
    showToast("Added to bag");
  }

  function renderCart() {
    const wrap = $("#cartItems");
    if (!state.cart.length) {
      wrap.innerHTML = `<p class="text-muted small">Your bag is empty. Add a product to see it here.</p>`;
      $("#cartSubtotal").textContent = inr(0);
      $("#cartCount").textContent = "0";
      return;
    }
    let subtotal = 0;
    wrap.innerHTML = state.cart.map(c => {
      const p = PRODUCTS.find(x => x.id === c.id);
      subtotal += p.price * c.qty;
      return `<div class="d-flex gap-3 align-items-center border-bottom pb-3">
        <div style="width:60px;height:60px;border-radius:10px;overflow:hidden;flex-shrink:0;">${productSvg(p.tag)}</div>
        <div class="flex-grow-1">
          <div class="small fw-semibold">${p.name}</div>
          <div class="small text-muted">${inr(p.price)} × ${c.qty}</div>
        </div>
        <button class="btn btn-sm btn-outline-secondary remove-cart" data-id="${c.id}"><i class="bi bi-trash"></i></button>
      </div>`;
    }).join("");
    $("#cartSubtotal").textContent = inr(subtotal);
    $("#cartCount").textContent = state.cart.reduce((n, c) => n + c.qty, 0);
    $$(".remove-cart").forEach(btn => btn.addEventListener("click", () => {
      state.cart = state.cart.filter(c => c.id !== btn.dataset.id);
      renderCart();
    }));
  }

  /* ---------- Header scroll / progress / back to top ---------- */
  function bindScrollUI() {
    const header = $("#mainHeader");
    const backTop = $("#backToTop");
    const bar = $("#scrollBar");
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 10);
      backTop.classList.toggle("show", y > 500);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      revealOnScroll();
    });
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function revealOnScroll() {
    $$(".why-card, .promo-card, .review-card").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) el.classList.add("in");
    });
  }

  /* ---------- Counter animation ---------- */
  function animateCounters() {
    $$(".stat-num").forEach(el => {
      const target = Number(el.dataset.count);
      let cur = 0;
      const step = Math.max(1, Math.round(target / 40));
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = cur;
      }, 25);
    });
  }

  /* ---------- Hero dial ---------- */
  function animateHeroDial() {
    const circle = $("#heroDial");
    const circumference = 2 * Math.PI * 120;
    const targetPct = 0.72; // fill amount
    setTimeout(() => {
      circle.style.strokeDashoffset = circumference * (1 - targetPct);
    }, 400);
  }

  /* ---------- Newsletter validation ---------- */
  function bindNewsletter() {
    $("#newsletterForm").addEventListener("submit", e => {
      e.preventDefault();
      const input = $("#newsletterEmail");
      const msg = $("#newsletterMsg");
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      if (!valid) {
        msg.textContent = "Enter a valid email address.";
        msg.style.color = "#FF8552";
        input.classList.add("is-invalid");
      } else {
        msg.textContent = "Subscribed — watch your inbox for season alerts.";
        msg.style.color = "";
        input.classList.remove("is-invalid");
        input.value = "";
      }
    });
  }

  /* ---------- Init ---------- */
  function init() {
    renderSkeleton();
    bindFilterEvents();
    bindScrollUI();
    bindNewsletter();
    animateHeroDial();

    // simulate initial load
    setTimeout(() => {
      $("#loadScreen").classList.add("hide");
    }, 700);

    setTimeout(() => {
      $("#skeletonGrid").classList.add("d-none");
      $("#productGrid").classList.remove("d-none");
      renderProducts();
      animateCounters();
      revealOnScroll();
    }, 900);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
