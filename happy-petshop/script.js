'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}

// Update badge jumlah keranjang dari localStorage
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").innerText = totalQty;
}

// Fungsi untuk menambah produk ke keranjang di localStorage
function addToCart(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showPopup(`${name} berhasil ditambahkan ke keranjang!`);
}

// function addToCart(productId, productData) {
//   const user = auth.currentUser;
//   if (!user) {
//     alert('Silakan login dulu');
//     return;
//   }

//   const cartRef = db.collection('carts').doc(user.uid).collection('items').doc(productId);

//   cartRef.get().then(doc => {
//     if (doc.exists) {
//       // Kalau produk sudah ada, update quantity
//       cartRef.update({
//         quantity: doc.data().quantity + 1
//       });
//     } else {
//       // Kalau belum ada, tambah baru
//       cartRef.set({
//         quantity: 1,
//         price: productData.price,
//         name: productData.name
//       });
//     }
//   })
//   .then(() => {
//     alert('Produk berhasil ditambahkan ke keranjang');
//     window.location.href = 'cart coba.html'; // Redirect ke halaman cart
//   })
//   .catch(error => {
//     console.error("Error adding to cart: ", error);
//   });
// }

function addToCart(button) {
  const id = parseInt(button.getAttribute("data-id"));
  const name = button.getAttribute("data-name");
  const price = parseFloat(button.getAttribute("data-price"));

  auth.onAuthStateChanged(user => {
    if (!user) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    const variant = button.getAttribute("data-variant") || "";
    const docId = id.toString() + (variant ? "_" + variant : "");
    const itemRef = db.collection("carts").doc(user.uid).collection("items").doc(docId);

    itemRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        itemRef.update({
          quantity: firebase.firestore.FieldValue.increment(1)
        });
      } else {
        itemRef.set({
          name,
          price,
          quantity: 1
        });
      }

      alert(`${name} ditambahkan ke keranjang!`);
      window.location.href = 'cart coba.html';  // <-- Tambahkan ini agar pindah halaman
    });
  });
}


function loadCart() {
  const user = auth.currentUser;
  if (!user) {
    alert('Silakan login dulu');
    return;
  }

  const cartItemsRef = db.collection('carts').doc(user.uid).collection('items');
  
  cartItemsRef.get().then(snapshot => {
    snapshot.forEach(doc => {
      const item = doc.data();
      console.log(`Produk: ${item.name}, Qty: ${item.quantity}, Harga: ${item.price}`);
      // Render item ke halaman cart sesuai desain
    });
  });
}

// Simpan produk yang di-add ke cart ke localStorage

function addToCart(product) {
  // Ambil cart dari localStorage atau buat array kosong
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Cek apakah produk sudah ada di cart
  let index = cart.findIndex(item => item.id === product.id);
  if(index > -1){
    // Kalau ada, tambah qty
    cart[index].qty += 1;
  } else {
    // Kalau belum ada, tambah produk baru
    product.qty = 1;
    cart.push(product);
  }

// Render list produk cart di halaman keranjang

  function renderCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let cartContainer = document.getElementById('cart-items'); // div/element untuk daftar produk

  cartContainer.innerHTML = ''; // Kosongkan dulu

  cart.forEach(item => {
    let el = document.createElement('div');
    el.innerText = `${item.name} - Qty: ${item.qty} - Price: $${item.price}`;
    cartContainer.appendChild(el);
  });
}


  // Simpan kembali ke localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}


// Fungsi popup (bisa kamu pakai dari kode kamu)
function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup-message";
  popup.innerText = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2000);
}

// Panggil ini saat halaman load untuk update jumlah keranjang di badge
updateCartCount();

 // Fungsi untuk update badge cart
  function updateCartBadge(userId) {
    const cartItemsRef = db.collection('carts').doc(userId).collection('items');

    cartItemsRef.onSnapshot(snapshot => {
      let totalQty = 0;

      snapshot.forEach(doc => {
        const item = doc.data();
        totalQty += item.quantity;
      });

      const badge = document.getElementById('cart-count');
      if (badge) {
        badge.innerText = totalQty;
      }
    });
  }

  // Jalankan saat user login
  auth.onAuthStateChanged(user => {
    if (user) {
      updateCartBadge(user.uid);
    } else {
      // Kalau belum login, tetap set 0
      const badge = document.getElementById('cart-count');
      if (badge) {
        badge.innerText = 0;
      }
    }
  });
// Simulasi jumlah keranjang, bisa diganti dengan Firebase / LocalStorage
// let cartCount = 0;
// document.getElementById("cart-count").innerText = cartCount;

// // Misal, nanti kamu bisa tambahkan fungsi addToCart() untuk memperbarui ini
// function addToCart() {
//   cartCount++;
//   document.getElementById("cart-count").innerText = cartCount;
// }

function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup-message";
  popup.innerText = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2000);
}

/**
 * navbar toggle
 */

const navToggler = document.querySelector("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
}

addEventOnElem(navToggler, "click", toggleNavbar);


const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);

/**
 * active header when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElemOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", activeElemOnScroll);


function openLoginModal() {
  document.getElementById("loginModal").style.display = "block";
}

function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}


function openSignupModal() {
  document.getElementById("signupModal").style.display = "block";
}

function closeSignupModal() {
  document.getElementById("signupModal").style.display = "none";
}


// Optional: close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById("loginModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}





