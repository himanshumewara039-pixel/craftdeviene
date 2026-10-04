"use strict";


/* =========================================================
   CRAFTDEFINE - MAIN JAVASCRIPT
   ========================================================= */


/* PRODUCTS */

const products = [

  {
    id: 1,
    name: "Handcrafted Moonwalk Mandala",
    cat: "Mandala",
    price: 5940,
    old: 10000,
    desc: "A statement handcrafted wall accent inspired by natural forms and traditional mandala geometry."
  },

  {
    id: 2,
    name: "Hammered Brass Wall Accent",
    cat: "Brass Art",
    price: 2890,
    old: 4800,
    desc: "Textured brass artwork designed to bring warm, timeless character to your wall."
  },

  {
    id: 3,
    name: "Golden Circle Mandala",
    cat: "Wall Decor",
    price: 3490,
    old: 5990,
    desc: "Layered circular mandala with a handcrafted antique-gold finish."
  },

  {
    id: 4,
    name: "Sunburst Handmade Art",
    cat: "Handmade",
    price: 2190,
    old: 3990,
    desc: "Hand-finished sunburst artwork made for calm, elegant interiors."
  },

  {
    id: 5,
    name: "Sacred Geometry Mandala",
    cat: "Mandala",
    price: 4290,
    old: 6990,
    desc: "Intricate sacred geometry composition for a refined art wall."
  },

  {
    id: 6,
    name: "Nature Bloom Wall Art",
    cat: "Paintings",
    price: 2690,
    old: 4490,
    desc: "A nature-inspired handmade piece with earthy tones and organic detail."
  },

  {
    id: 7,
    name: "Antique Brass Lotus",
    cat: "Brass Art",
    price: 3190,
    old: 5200,
    desc: "A sculptural lotus-inspired brass accent with an artisanal finish."
  },

  {
    id: 8,
    name: "Minimal Mandala Panel",
    cat: "Wall Decor",
    price: 1990,
    old: 3500,
    desc: "Minimal handcrafted mandala panel for modern spaces."
  }

];


/* =========================================================
   SAFE LOCAL STORAGE
   ========================================================= */

function safeGet(key, fallback){

  try{

    const value = localStorage.getItem(key);

    if(value === null){
      return fallback;
    }

    return JSON.parse(value);

  }catch(error){

    console.warn("Invalid saved data:", key);

    localStorage.removeItem(key);

    return fallback;
  }
}


function safeSet(key, value){

  try{

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

  }catch(error){

    console.error("Could not save data:", error);
  }
}


/* =========================================================
   APPLICATION STATE
   ========================================================= */

let cart = safeGet("craftdefine_cart", []);

let wish = safeGet("craftdefine_wish", []);

let cat = "All";

let selected = null;


/* Make sure saved data has correct format */

if(!Array.isArray(cart)){
  cart = [];
}

if(!Array.isArray(wish)){
  wish = [];
}


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

function $(id){
  return document.getElementById(id);
}


function money(number){

  return "₹" + Number(number).toLocaleString("en-IN");

}


/* =========================================================
   SAVE DATA
   ========================================================= */

function save(){

  safeSet("craftdefine_cart", cart);

  safeSet("craftdefine_wish", wish);

  counts();

}


/* =========================================================
   CART / WISHLIST COUNTERS
   ========================================================= */

function counts(){

  const cartCount = $("cartCount");

  const wishCount = $("wishCount");


  if(cartCount){

    cartCount.textContent =
      cart.reduce(
        (total, item) => total + Number(item.qty || 0),
        0
      );

  }


  if(wishCount){

    wishCount.textContent = wish.length;

  }

}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function toast(message){

  const box = $("toast");

  if(!box){
    return;
  }

  box.textContent = message;

  box.classList.add("show");


  setTimeout(() => {

    box.classList.remove("show");

  }, 2200);

}


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin(){

  const loginForm = $("loginForm");

  if(!loginForm){
    return;
  }


  loginForm.addEventListener("submit", function(event){

    event.preventDefault();

    const emailInput = $("loginEmail");

    const passwordInput = $("loginPassword");

    const errorBox = $("loginError");


    const email = emailInput
      ? emailInput.value.trim()
      : "";

    const password = passwordInput
      ? passwordInput.value
      : "";


    /* Clear old error */

    if(errorBox){

      errorBox.textContent = "";

    }


    /* Validate email */

    if(!email){

      if(errorBox){
        errorBox.textContent =
          "Please enter your email address.";
      }

      emailInput.focus();

      return;
    }


    /* Browser email validation */

    if(!emailInput.checkValidity()){

      if(errorBox){
        errorBox.textContent =
          "Please enter a valid email address.";
      }

      emailInput.focus();

      return;
    }


    /* Validate password */

    if(password.length < 4){

      if(errorBox){
        errorBox.textContent =
          "Password must contain at least 4 characters.";
      }

      passwordInput.focus();

      return;
    }


    /*
      LOGIN SUCCESS
    */

    try{

      localStorage.setItem(
        "craftdefine_user",
        email
      );

    }catch(error){

      console.warn(
        "Could not save login:",
        error
      );

    }


    const loginPage = $("login");

    const app = $("app");


    if(loginPage){
      loginPage.classList.add("hidden");
    }

    if(app){
      app.classList.remove("hidden");
    }


    render();

    counts();

    toast("Welcome to CRAFTDEFINE!");


    window.scrollTo({
      top:0,
      behavior:"smooth"
    });

  });

}


/* =========================================================
   CHECK EXISTING LOGIN
   ========================================================= */

function checkLogin(){

  let savedUser = null;


  try{

    savedUser =
      localStorage.getItem(
        "craftdefine_user"
      );

  }catch(error){

    savedUser = null;

  }


  if(savedUser && savedUser.trim()){

    $("login").classList.add("hidden");

    $("app").classList.remove("hidden");

  }else{

    $("login").classList.remove("hidden");

    $("app").classList.add("hidden");

  }

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function render(){

  const grid = $("grid");

  if(!grid){
    return;
  }


  const searchElement = $("search");

  const query = searchElement
    ? searchElement.value.trim().toLowerCase()
    : "";


  const list = products.filter(product => {

    const categoryMatch =
      cat === "All" ||
      product.cat === cat;


    const searchMatch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.cat.toLowerCase().includes(query);


    return categoryMatch && searchMatch;

  });


  if(!list.length){

    grid.innerHTML = `
      <p style="
        grid-column:1/-1;
        text-align:center;
        padding:40px;
      ">
        No artworks found.
      </p>
    `;

    return;
  }


  grid.innerHTML = list.map(product => {

    const discount =
      Math.round(
        (1 - product.price / product.old) * 100
      );


    const liked =
      wish.includes(product.id);


    return `

      <article class="card">

        <div
          class="pimg"
          onclick="openProduct(${product.id})"
        >

          <span class="sale">
            -${discount}%
          </span>

          <button
            class="wish ${liked ? "active" : ""}"
            onclick="
              event.stopPropagation();
              toggleWish(${product.id})
            "
          >
            ${liked ? "♥" : "♡"}
          </button>

        </div>


        <div class="info">

          <h3>
            ${product.name}
          </h3>

          <div class="stars">
            ★★★★★
          </div>

          <div class="price">

            <span class="old">
              ${money(product.old)}
            </span>

            <span class="new">
              ${money(product.price)}
            </span>

          </div>

          <button
            class="view"
            onclick="openProduct(${product.id})"
          >
            VIEW PRODUCT
          </button>

        </div>

      </article>

    `;

  }).join("");

}


/* =========================================================
   PRODUCT DETAILS
   ========================================================= */

function openProduct(id){

  selected =
    products.find(product => product.id === Number(id));


  if(!selected){
    return;
  }


  const detail = $("detail");

  if(!detail){
    return;
  }


  detail.innerHTML = `

    <div class="layout">

      <div class="detail-art">
        ✺
      </div>


      <div class="detail">

        <div class="eyebrow">
          ${selected.cat.toUpperCase()}
        </div>

        <h2>
          ${selected.name}
        </h2>

        <div class="stars">
          ★★★★★
        </div>

        <p>
          ${selected.desc}
        </p>

        <div class="dprice">

          ${money(selected.price)}

          <span class="old">
            ${money(selected.old)}
          </span>

        </div>


        <div class="group">

          <b>
            Choose Size
          </b>

          <div class="options">

            <button class="option">
              12 inch
            </button>

            <button class="option selected">
              18 inch
            </button>

            <button class="option">
              24 inch
            </button>

          </div>

        </div>


        <div class="group">

          <b>
            Choose Finish
          </b>

          <div class="options">

            <button class="option">
              Wooden
            </button>

            <button class="option selected">
              Antique Gold
            </button>

            <button class="option">
              Pure Brass
            </button>

          </div>

        </div>


        <div class="qty">

          <b>
            Quantity
          </b>

          <button onclick="changeQty(-1)">
            −
          </button>

          <span id="qv">
            1
          </span>

          <button onclick="changeQty(1)">
            +
          </button>

        </div>


        <button
          class="gold"
          onclick="addCart()"
        >
          ADD TO CART
        </button>

        <button
          class="dark"
          onclick="buyNow()"
        >
          BUY NOW
        </button>

      </div>

    </div>

  `;


  $("productModal").classList.remove("hidden");


  document
    .querySelectorAll("#productModal .option")
    .forEach(button => {

      button.addEventListener("click", function(){

        const parent =
          button.parentElement;


        parent
          .querySelectorAll(".option")
          .forEach(item => {

            item.classList.remove(
              "selected"
            );

          });


        button.classList.add("selected");

      });

    });

}


/* =========================================================
   QUANTITY
   ========================================================= */

function changeQty(amount){

  const quantityElement = $("qv");

  if(!quantityElement){
    return;
  }


  const current =
    Number(quantityElement.textContent) || 1;


  quantityElement.textContent =
    Math.max(1, current + amount);

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addCart(){

  if(!selected){
    return;
  }


  const quantityElement = $("qv");

  const quantity =
    quantityElement
      ? Number(quantityElement.textContent) || 1
      : 1;


  const existing =
    cart.find(
      item => item.id === selected.id
    );


  if(existing){

    existing.qty += quantity;

  }else{

    cart.push({
      id:selected.id,
      qty:quantity
    });

  }


  save();

  closeM("productModal");

  toast("Added to your cart");

}


/* =========================================================
   BUY NOW
   ========================================================= */

function buyNow(){

  addCart();

  setTimeout(() => {

    checkout();

  }, 250);

}


/* =========================================================
   WISHLIST
   ========================================================= */

function toggleWish(id){

  id = Number(id);


  if(wish.includes(id)){

    wish =
      wish.filter(item => item !== id);

    toast("Removed from wishlist");

  }else{

    wish.push(id);

    toast("Added to wishlist");

  }


  save();

  render();

}


/* =========================================================
   CART
   ========================================================= */

function openCart(){

  renderCart();

  $("cart").classList.add("open");

}


function closeCart(){

  $("cart").classList.remove("open");

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart(){

  const cartItems = $("cartItems");

  const totalElement = $("total");


  if(!cartItems){
    return;
  }


  if(!cart.length){

    cartItems.innerHTML = `

      <p style="
        text-align:center;
        color:#777;
        padding:50px;
      ">
        Your cart is empty.
      </p>

    `;


    if(totalElement){
      totalElement.textContent =
        money(0);
    }

    return;
  }


  let total = 0;


  cartItems.innerHTML =
    cart.map(item => {

      const product =
        products.find(
          p => p.id === Number(item.id)
        );


      if(!product){
        return "";
      }


      const quantity =
        Number(item.qty) || 1;


      total +=
        product.price * quantity;


      return `

        <div class="cart-item">

          <div class="cart-art">
            ✺
          </div>

          <div>

            <b>
              ${product.name}
            </b>

            <br>

            <small>
              ${money(product.price)}
              × ${quantity}
            </small>

          </div>

          <button
            class="x static"
            onclick="removeCart(${product.id})"
          >
            ×
          </button>

        </div>

      `;

    }).join("");


  if(totalElement){

    totalElement.textContent =
      money(total);

  }

}


/* =========================================================
   REMOVE CART ITEM
   ========================================================= */

function removeCart(id){

  id = Number(id);


  cart =
    cart.filter(
      item => Number(item.id) !== id
    );


  save();

  renderCart();

  toast("Item removed from cart");

}


/* =========================================================
   CART TOTAL
   ========================================================= */

function cartTotal(){

  return cart.reduce(
    (total, item) => {

      const product =
        products.find(
          p => p.id === Number(item.id)
        );


      if(!product){
        return total;
      }


      return total +
        product.price *
        (Number(item.qty) || 1);

    },
    0
  );

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout(){

  if(!cart.length){

    toast("Your cart is empty");

    return;

  }


  closeCart();


  const checkoutTotal =
    $("checkoutTotal");


  if(checkoutTotal){

    checkoutTotal.textContent =
      money(cartTotal());

  }


  $("checkoutModal")
    .classList
    .remove("hidden");

}


/* =========================================================
   CHECKOUT FORM
   ========================================================= */

function setupCheckout(){

  const form =
    $("checkoutForm");


  if(!form){
    return;
  }


  form.addEventListener(
    "submit",
    function(event){

      event.preventDefault();


      const id =
        "ART" +
        Math.floor(
          10000 +
          Math.random() * 89999
        );


      const total =
        cartTotal();


      $("orderId").textContent =
        `Order ID: #${id} • Total: ${money(total)}`;


      cart = [];

      save();


      closeM("checkoutModal");


      $("success")
        .classList
        .remove("hidden");

    }
  );

}


/* =========================================================
   CLOSE MODALS
   ========================================================= */

function closeM(id){

  const element = $(id);

  if(element){

    element.classList.add(
      "hidden"
    );

  }

}


/* =========================================================
   HOME
   ========================================================= */

function home(){

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}


/* =========================================================
   PRODUCTS SECTION
   ========================================================= */

function goProducts(){

  const productsSection =
    $("products");


  if(productsSection){

    productsSection.scrollIntoView({
      behavior:"smooth"
    });

  }

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch(){

  const searchButton =
    $("searchBtn");

  const searchBox =
    $("searchBox");

  const searchInput =
    $("search");


  if(searchButton){

    searchButton.addEventListener(
      "click",
      function(){

        searchBox.classList.toggle(
          "hidden"
        );


        if(
          !searchBox.classList.contains(
            "hidden"
          )
        ){

          searchInput.focus();

        }

      }
    );

  }


  if(searchInput){

    searchInput.addEventListener(
      "input",
      render
    );

  }

}


/* =========================================================
   HEADER BUTTONS
   ========================================================= */

function setupButtons(){

  const cartButton =
    $("cartBtn");

  const wishlistButton =
    $("wishBtn");

  const menuButton =
    $("menu");


  if(cartButton){

    cartButton.addEventListener(
      "click",
      openCart
    );

  }


  if(wishlistButton){

    wishlistButton.addEventListener(
      "click",
      function(){

        if(wish.length){

          toast(
            `${wish.length} item(s) in wishlist`
          );

        }else{

          toast(
            "Wishlist is empty"
          );

        }

      }
    );

  }


  if(menuButton){

    menuButton.addEventListener(
      "click",
      goProducts
    );

  }

}


/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

function setupCategories(){

  document
    .querySelectorAll(".chip")
    .forEach(button => {

      button.addEventListener(
        "click",
        function(){

          document
            .querySelectorAll(".chip")
            .forEach(item => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );


          cat =
            button.dataset.cat ||
            "All";


          render();

          goProducts();

        }
      );

    });

}


/* =========================================================
   INITIALIZE WEBSITE
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function(){

    setupLogin();

    setupCheckout();

    setupSearch();

    setupButtons();

    setupCategories();

    checkLogin();

    render();

    counts();

  }
);