console.log("Script loaded");

// =====================
// 🛒 GET CART
// =====================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// =====================
// 💾 SAVE CART
// =====================
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// =====================
// ➕ INCREASE QTY
// =====================
function increaseQty(id, name, price, image) {
  let cart = getCart();

  let item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      id,
      name,
      price: Number(price),
      image,
      qty: 1
    });
  }

  saveCart(cart);

  refreshUI();   // 🔥 NEW
}
function decreaseQty(id) {
  let cart = getCart();

  let item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty--;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart(cart);

  refreshUI();   // 🔥 NEW
}
function refreshUI() {
  updateCartCount();

  // if cart page
  if (document.getElementById("cartItems")) {
    loadCart();
  }

  // if product pages (cakes, cookies, breads)
  let cart = getCart();
  cart.forEach(item => {
    updateQtyUI(item.id);
  });
}
// =====================
// 🔄 UPDATE UI QTY
// =====================
function updateQtyUI(id) {
  let cart = getCart();

  let item = cart.find(i => i.id === id);
  let qty = item ? item.qty : 0;

  const el = document.getElementById(id);
  if (el) el.innerText = qty;
}

// =====================
// 🧮 UPDATE CART COUNT
// =====================
function updateCartCount() {
  let cart = getCart();
  let total = cart.reduce((sum, i) => sum + i.qty, 0);

  const el = document.getElementById("cart-count");
  if (el) el.innerText = total;
}

// =====================
// 📦 LOAD CART PAGE
// =====================
function loadCart() {
  const cart = getCart();

  const cartContainer = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  if (!cartContainer || !totalEl) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p style='text-align:center;'>Your cart is empty</p>";
    totalEl.innerText = "0";
    return;
  }

  let total = 0;
  let html = "";

  cart.forEach(item => {
    html += `
      <div class="cart-item">

        <div class="item-info">
          <img src="${item.image}" class="cart-img">

          <div>
            <h4>${item.name}</h4>
            <p>₹${item.price}</p>
          </div>
        </div>

        <div class="qty-controls">
          <button onclick="decreaseQty('${item.id}')">-</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty('${item.id}','${item.name}',${item.price},'${item.image}')">+</button>
        </div>

      </div>
    `;

    total += Number(item.price) * Number(item.qty);
  });

  cartContainer.innerHTML = html;
  totalEl.innerText = total || 0;
}

// =====================
// 🧾 PLACE ORDER (BACKEND)
// =====================
async function placeOrder() {
  const cart = getCart();
  const userEmail = localStorage.getItem("user");

  if (!userEmail) {
    alert("Please login first");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    const res = await fetch("https://bakery-website-cyk9.onrender.com/api/order/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userEmail,
        items: cart,
        total
      })
    });

    const data = await res.json();
    console.log(data);

    showSuccessMessage();

    localStorage.removeItem("cart");
    loadCart();
    updateCartCount();

  } catch (err) {
    console.log(err);
    alert("Error placing order ❌");
  }
}
// =====================
// 🚀 ON PAGE LOAD
// =====================
window.onload = function () {
  let cart = getCart();

  cart.forEach(item => {
    updateQtyUI(item.id);
  });

  updateCartCount();

  if (document.getElementById("cartItems")) {
    loadCart();
  }
};

function openCart() {
  window.location.href = "cart.html";
}
// =====================
// ✅ SUCCESS POPUP
// =====================
function showSuccessMessage() {
  const box = document.getElementById("successBox");

  if (!box) return;

  box.classList.remove("hidden");

  setTimeout(() => {
    box.classList.add("show");
  }, 10);

  setTimeout(() => {
    box.classList.remove("show");

    setTimeout(() => {
      box.classList.add("hidden");
      window.location.href = "login.html";
    }, 300);

  }, 2000);
}
// =====================
// 🧾 GO TO CHECKOUT
// =====================
function goToCheckout() {
  window.location.href = "checkout.html";
}