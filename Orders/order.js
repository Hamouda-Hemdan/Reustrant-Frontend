class OrderManager {
  constructor(token) {
    this.token = token;
    this.orderDetailsContainer = document.getElementById("order-details");
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.fetchOrdersAndUpdateUI();
    });
  }

  fetchOrdersAndUpdateUI() {
    fetch("https://food-delivery.int.kreosoft.space/api/order", {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch orders. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((orders) => {
        this.renderOrders(orders.reverse());
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        this.orderDetailsContainer.innerHTML = `<p class="error">Failed to load orders. Please try again later.</p>`;
      });
  }

  renderOrders(orders) {
    this.orderDetailsContainer.innerHTML = "";
    orders.forEach((order) => {
      const orderDiv = document.createElement("div");
      orderDiv.classList.add("order-box");
      orderDiv.innerHTML = `
        <p><strong>Order ID:</strong> <a href="../Order-details/details.html?orderId=${order.id}">${order.id}</a></p>
        <p><strong>Delivery Time:</strong> ${new Date(order.deliveryTime).toLocaleString()}</p>
        <p><strong>Order Time:</strong> ${new Date(order.orderTime).toLocaleString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Price:</strong> $${order.price.toFixed(2)}</p>
      `;

      if (order.status !== "Delivered") {
        const confirmBtn = this.createConfirmButton(order.id);
        orderDiv.appendChild(confirmBtn);
      }

      this.orderDetailsContainer.appendChild(orderDiv);
    });
  }

  createConfirmButton(orderId) {
    const button = document.createElement("button");
    button.classList.add("confirm-order-btn");
    button.textContent = "Confirm Order";
    button.addEventListener("click", () => this.confirmOrder(orderId));
    return button;
  }

  confirmOrder(orderId) {
    fetch(`https://food-delivery.int.kreosoft.space/api/order/${orderId}/status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "confirmed" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to confirm order. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Order confirmed:", data);
        this.fetchOrdersAndUpdateUI();
      })
      .catch((error) => {
        console.error("Error confirming order:", error.message);
        this.fetchOrdersAndUpdateUI();
      });
  }
}

const token = localStorage.getItem("token");
const orderManager = new OrderManager(token);
orderManager.init();
