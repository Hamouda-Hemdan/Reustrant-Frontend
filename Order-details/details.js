document.addEventListener("DOMContentLoaded", function () {
  const orderId = getOrderIdFromURL(); // Extract order ID from URL

  if (orderId) {
    fetchOrderDetails(orderId);
  } else {
    console.error("Order ID not found in URL parameters.");
  }
});

function getOrderIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("orderId");
}

function fetchOrderDetails(orderId) {
  const token = localStorage.getItem("token");

  fetch(`https://food-delivery.int.kreosoft.space/api/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch order details. Status: ${response.status}`
        );
      }
      return response.json();
    })
    .then((data) => {
      populateOrderDetails(data);
    })
    .catch((error) => {
      console.error("Error fetching order details:", error);
      alert("Failed to load order details. Please try again later.");
    });
}

function populateOrderDetails(order) {
  const orderDetailsContainer = document.getElementById("order-details");

  const deliveryTime = new Date(order.deliveryTime).toLocaleString();
  const orderTime = new Date(order.orderTime).toLocaleString();

  let orderItemsHTML = "";
  order.dishes.forEach((dish) => {
    orderItemsHTML += `
      <div class="order-item">
        <img class="dish-image" src="${dish.image}" alt="${dish.name}">
        <p><strong>Name:</strong> ${dish.name}</p>
        <p><strong>Price:</strong> $${dish.price.toFixed(2)}</p>
        <p><strong>Quantity:</strong> ${dish.amount}</p>
        <p><strong>Total Price:</strong> $${dish.totalPrice.toFixed(2)}</p>
      </div>
    `;
  });

  orderDetailsContainer.innerHTML = `
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Delivery Time:</strong> ${deliveryTime}</p>
    <p><strong>Order Time:</strong> ${orderTime}</p>
    <p><strong>Status:</strong> ${order.status}</p>
    <p><strong>Price:</strong> $${order.price.toFixed(2)}</p>
    <p><strong>Address:</strong> ${order.address}</p>
    <div class="order-items">
      <h2>Ordered Dishes:</h2>
      ${orderItemsHTML}
    </div>
  `;
}
