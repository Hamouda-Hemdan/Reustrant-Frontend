
function getAuthToken() {
  return localStorage.getItem("token");
}

function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

let currentPage = 1;
const token = getAuthToken();
const params = new URLSearchParams();

function fetchCartData() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const token = getAuthToken();

  if (!isLoggedIn || !token) {
    console.log("User is not logged in or authorization token is missing.");
    return Promise.resolve([]); // Return an empty array if not logged in
  }

  return fetch("https://food-delivery.int.kreosoft.space/api/basket", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching cart data:", error);
      return []; // Return an empty array if there's an error
    });
}

// Function to fetch dishes
async function fetchCartData() {
  if (!isUserLoggedIn() || !getAuthToken()) {
    console.log("User not logged in or token missing");
    return [];
  }

  try {
    const response = await fetch("https://food-delivery.int.kreosoft.space/api/basket", {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        Accept: "application/json",
      },
    });
    return response.ok ? response.json() : [];
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

// Dish Rendering Components
function createDishCard(dish, cartItem) {
  const dishElement = document.createElement("div");
  dishElement.classList.add("dishCard");
  
  dishElement.innerHTML = `
    <div class="dish-image-container">
      <img src="${dish.image}" alt="${dish.name}" class="dish-image">
      ${dish.vegetarian ? '<span class="vegetarian-symbol">☘️</span>' : ''}
    </div>
    <a href="../Menu-item/item.html?id=${dish.id}" class="dish-link">
      <h2>${dish.name}</h2>
    </a>
    <p>Category: ${dish.category}</p>
    ${createRatingSection(dish, cartItem)}
    <div class="price-container">
      <p>${dish.price} ₽</p>
      ${createCartControls(dish.id, cartItem?.amount || 0)}
    </div>
  `;

  return dishElement;
}

function createCartControls(dishId, amount) {
  if (!isUserLoggedIn()) return "";

  return amount > 0
    ? `
      <div class="cart-controls">
        <button onclick="updateQuantity('${dishId}', -1)">-</button>
        <span id="count-${dishId}">${amount}</span>
        <button onclick="updateQuantity('${dishId}', 1)">+</button>
      </div>
    `
    : `<button onclick="addToCart('${dishId}')">Add to Cart</button>`;
}

function createRatingSection(dish, cartItem) {
  return `
    <div class="rating-section">
      <p>Rating: ${generateStarRating(dish.rating)}</p>
      ${isUserLoggedIn() ? `
        <div class="user-rating">
          <p>Your Rating:</p>
          ${generateInteractiveStarRating(cartItem?.userRating || 0, dish.id)}
        </div>
      ` : ''}
    </div>
  `;
}

// Main Dish Fetching Logic
async function fetchDishes(page) {
  try {
    const [cartData, dishesData] = await Promise.all([
      fetchCartData(),
      fetchDishesData(page)
    ]);
    
    renderDishes(dishesData.dishes, cartData);
    updatePagination(dishesData.pagination);
    
  } catch (error) {
    console.error("Dish loading failed:", error);
  }
}

async function fetchDishesData(page) {
  const url = new URL("https://food-delivery.int.kreosoft.space/api/dish");
  url.searchParams.set("page", page);
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("API request failed");
  return response.json();
}

function renderDishes(dishes, cartData) {
  const container = document.getElementById("dishes-container");
  container.innerHTML = dishes.map(dish => 
    createDishCard(dish, cartData.find(item => item.id === dish.id))
  ).join("");
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  fetchDishes(1);
});

// Function to add a dish to the cart
function addToCart(dishID) {
  const token = getAuthToken();
  const isLoggedIn = isUserLoggedIn();
  if (!isLoggedIn) {
    console.error("User is not signed in.");
    alert("You need to sign in to add items to your cart.");
    return;
  }

  if (!token) {
    console.error("Authorization token is missing.");
    return;
  }

  const addToCartButton = document.getElementById(`add-to-cart-${dishID}`);
  if (!addToCartButton) {
    console.error(`Button with ID 'add-to-cart-${dishID}' not found.`);
    return;
  }

  addToCartButton.disabled = true;
  fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${dishID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      quantity: 1,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }
      return fetchCartData();
    })
    .then(() => {
      const cartItem = cartData.find((item) => item.id === dishID);
      const amount = cartItem ? cartItem.amount : 1;

      const cartCountElement = document.getElementById("cart-count");
      if (cartCountElement) {
        const currentCount = parseInt(cartCountElement.textContent);
        cartCountElement.textContent = currentCount + 1;
      }
      const countDisplay = document.createElement("div");
      countDisplay.classList.add("add-to-cart-quantity");
      const dishCountID = `count-${dishID}`;
      countDisplay.innerHTML = `
    <button class="add-to-cart-more" onclick="updateQuantity('${dishID}', -1)">-</button>
    <span class="quantity-number" id="${dishCountID}">${amount}</span>
    <button class="sub-from-cart" onclick="updateQuantity('${dishID}', 1)">+</button
  `;

      addToCartButton.parentNode.replaceChild(countDisplay, addToCartButton);
    })
    .catch((error) => {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart. Please try again later.");
      addToCartButton.disabled = false;
    });
}

// Function to update quantity of a dish in the cart
function updateQuantity(dishID, change) {
  const token = getAuthToken();

  if (!token) {
    console.error("Authorization token is missing.");
    return;
  }

  const countElement = document.getElementById(`count-${dishID}`);
  if (countElement) {
    let count = parseInt(countElement.textContent);
    count += change;
    if (count < 1) {
      count = 1;
    }

    // Determine endpoint and method based on change
    const endpoint =
      change > 0
        ? `https://food-delivery.int.kreosoft.space/api/basket/dish/${dishID}`
        : `https://food-delivery.int.kreosoft.space/api/basket/dish/${dishID}?increase=true`;
    const method = change > 0 ? "POST" : "DELETE";

    fetch(endpoint, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: Math.abs(change) }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update quantity");
        }
        countElement.textContent = count;
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
      });
  }
}

// Function to generate star rating HTML with empty stars
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  let starHTML = "";

  for (let i = 0; i < fullStars; i++) {
    starHTML += '<i class="fas fa-star"></i>';
  }

  if (halfStar) {
    starHTML += '<i class="fas fa-star-half-alt"></i>';
  }

  const remainingStars = 10 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    starHTML += '<i class="far fa-star"></i>';
  }

  return starHTML;
}

// Function to generate interactive star rating HTML
function generateInteractiveStarRating(rating, dishId) {
  let starHTML = "";
  for (let i = 1; i <= 10; i++) {
    const isChecked = i <= rating;
    starHTML += `<i class="fas fa-star ${
      isChecked ? "checked" : ""
    }" data-rating="${i}" data-dish-id="${dishId}" style="cursor: pointer;"></i>`;
  }
  return starHTML;
}
// Unnecessary wrapper for fetchCartData()
function getCart() {
  return fetchCartData(); // Just returns the result of another function
}
// Function to handle star rating events
function handleStarRating() {
  const starIcons = document.querySelectorAll(".star-rating .fas.fa-star");
  starIcons.forEach((starIcon) => {
    starIcon.addEventListener("mouseenter", function () {
      const rating = parseInt(this.getAttribute("data-rating"));
      highlightStars(rating, this.getAttribute("data-dish-id"));
    });

    starIcon.addEventListener("mouseleave", function () {
      const dishId = this.getAttribute("data-dish-id");
      const rating = parseInt(
        document
          .querySelector(
            `.star-rating .fas.fa-star[data-dish-id="${dishId}"].checked`
          )
          .getAttribute("data-rating")
      );
      highlightStars(rating, dishId);
    });

    starIcon.addEventListener("click", function () {
      const dishId = this.getAttribute("data-dish-id");
      const rating = parseInt(this.getAttribute("data-rating"));
      submitRating(dishId, rating);
    });
  });
}

// Function to highlight stars up to a given rating
function highlightStars(rating, dishId) {
  const starIcons = document.querySelectorAll(
    `.star-rating .fas.fa-star[data-dish-id="${dishId}"]`
  );
  starIcons.forEach((starIcon) => {
    const starRating = parseInt(starIcon.getAttribute("data-rating"));
    starIcon.style.color = starRating <= rating ? "rgb(255, 174, 0)" : "gray";
    starIcon.classList.toggle("checked", starRating <= rating);
  });
}

// Function to submit a rating for a dish
function submitRating(dishId, rating) {
  console.log("Rating:", rating);

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authorization token is missing.");
    return;
  }

  fetch(
    `https://food-delivery.int.kreosoft.space/api/dish/${dishId}/rating/check`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to check rating");
      }
      return fetch(
        `https://food-delivery.int.kreosoft.space/api/dish/${dishId}/rating?ratingScore=${rating}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        alert("You can not rate this dish, order it first");
        throw new Error("Failed to submit rating");
      }
      console.log("Rating submitted successfully");
      window.alert("Rating submitted successfully!");
    })
    .catch((error) => {
      console.error("Error submitting rating:", error);
    });
}

// Function to handle pagination
function handlePagination(newPage) {
  currentPage = newPage;
  sessionStorage.setItem("currentPage", currentPage);
  fetchDishes(currentPage);
}

// Function to apply filters
document.getElementById("filter").addEventListener("click", applyFilters);

function applyFilters() {
  const sortOption = document.getElementById("sort").value;
  const categoryCheckboxes = document.querySelectorAll(
    '.categories input[type="checkbox"]:checked'
  );
  const categoryOptions = Array.from(categoryCheckboxes).map(
    (checkbox) => checkbox.value
  );
  const vegetarianOption = document.getElementById("vegetarianSwitch").checked;

  params.delete("sorting");
  params.delete("categories");
  params.delete("vegetarian");

  if (sortOption) {
    params.set("sorting", sortOption);
  }

  if (categoryOptions.length > 0) {
    categoryOptions.forEach((category) => {
      params.append("categories", category);
    });
  }

  if (vegetarianOption) {
    params.set("vegetarian", vegetarianOption);
  }

  fetchDishes(currentPage);
}

// Initialize functions on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  const selectBox = document.querySelector(".select-box");

  selectBox.addEventListener("click", function () {
    selectBox.classList.toggle("show");
  });

  fetchDishes(currentPage);
  fetchCartData();
});

// Function to fetch and update total amount of dishes in the cart
async function fetchAndUpdateTotalAmount() {
  try {
    const apiUrl = "https://food-delivery.int.kreosoft.space/api/basket";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const basketData = await response.json();

    let totalAmount = 0;
    for (const dish of basketData) {
      totalAmount += dish.amount;
    }

    document.getElementById("totalAmount").textContent = `${totalAmount}`;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Function to check token expiration and logout if expired
function checkTokenExpiration() {
  const token = getAuthToken();
  if (!token) {
    // Token not found, user is already logged out
    return;
  }

  try {
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const tokenExp = tokenPayload.exp * 1000; // Convert to milliseconds
    const currentTime = new Date().getTime();

    if (currentTime >= tokenExp) {
      // Token has expired, perform logout
      console.log("Token expired. Logging out...");
      logoutUser();
    } else {
      // Token still valid, continue checking
      const timeToExpire = tokenExp - currentTime;
      setTimeout(checkTokenExpiration, timeToExpire);
    }
  } catch (error) {
    console.error("Error parsing token:", error);
    logoutUser(); // Force logout on token parse error
  }
}

// Function to logout user and clear token
function logoutUser() {
  // Clear token and update UI
  localStorage.removeItem("token");
  localStorage.setItem("isLoggedIn", "false"); // Update login status if needed
  // Redirect to login page or show appropriate message
  window.location.href = "Authorization/login.html";
}

checkTokenExpiration();

if (token) {
  // Start polling to update total amount every 1 second
  function startPolling(interval = 1000) {
    fetchAndUpdateTotalAmount();

    setInterval(fetchAndUpdateTotalAmount, interval);
  }

  startPolling(1000);
}
