document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token not found in local storage");
    return;
  }

  populateProfileForm(token);
  populateBasketItems(token);
  setupOrderPlacing(token);
});

function populateProfileForm(token) {
  fetch("https://food-delivery.int.kreosoft.space/api/account/profile", {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(response => response.ok ? response.json() : Promise.reject("Failed to fetch profile"))
    .then(userData => {
      document.getElementById("email").value = userData.email;
      document.getElementById("phone").value = userData.phoneNumber;
    })
    .catch(error => console.error("Error fetching profile:", error));
}

function populateBasketItems(token) {
  const orderList = document.getElementById("orderList");

  fetch("https://food-delivery.int.kreosoft.space/api/basket", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    }
  })
    .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! Status: ${response.status}`))
    .then(orderData => {
      orderData.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        itemDiv.innerHTML = `
          <div class="item-image-container">
            <img src="${item.image}" alt="${item.name}" class="item-image" />
          </div>
          <div class="item-details">
            <div class="item-name-container"><span class="item-name">${item.name}</span></div>
            <div class="item-price-container"><span class="item-price"><strong>Price:</strong> ${item.price.toFixed(2)}</span></div>
            <div class="item-amount-container"><span class="item-amount">Amount: ${item.amount}</span></div>
            <div class="item-total-price-container"><span class="item-total-price">Total Price: $${item.totalPrice.toFixed(2)}</span></div>
          </div>
        `;

        orderList.appendChild(itemDiv);
      });
    })
    .catch(error => console.error("Error fetching basket items:", error));
}


function setupOrderPlacing(token) {
  const placeOrderButton = document.getElementById("placeOrderButton");

  placeOrderButton.addEventListener("click", () => {
    const address = document.getElementById("address").value.trim();
    const deliveryTime = document.getElementById("delivery-time").value;

    if (!address || !deliveryTime) {
      alert("Please provide both address and delivery time.");
      return;
    }

    getCartItems(token)
      .then(cartItems => {
        const deliveryISO = formatToISO(deliveryTime);
        const orderData = {
          deliveryTime: deliveryISO,
          address,
          items: cartItems
        };

        return fetch("https://food-delivery.int.kreosoft.space/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            console.error("Server response:", data);
            throw new Error("Failed to place order");
          });
        }

        return response.headers.get("content-type")?.includes("application/json")
          ? response.json()
          : {};
      })
      .then(orderResponse => {
        console.log("Order placed:", orderResponse);
        alert("Order placed successfully!");
        return clearCart(token);
      })
      .then(() => location.reload())
      .catch(error => {
        console.error("Order error:", error);
        alert("There was an error processing your order. Please try again.");
      });
  });
}


function getCartItems(token) {
  return fetch("https://food-delivery.int.kreosoft.space/api/basket", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    }
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch cart items");
      return response.json();
    });
}

function clearCart(token) {
  return fetch("https://food-delivery.int.kreosoft.space/api/basket", {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  }).then(response => {
    if (!response.ok) throw new Error("Failed to clear cart");
    console.log("Cart cleared");
  });
}

function formatToISO(datetimeString) {
  const localDate = new Date(datetimeString);
  const timezoneOffset = localDate.getTimezoneOffset() * 60000;
  return new Date(localDate.getTime() - timezoneOffset).toISOString().slice(0, 19);
}
