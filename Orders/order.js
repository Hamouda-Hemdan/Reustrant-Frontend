document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  function fetchOrdersAndUpdateUI() {
    fetch("https://food-delivery.int.kreosoft.space/api/order", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch orders. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const orderDetails = document.getElementById("order-details");
        orderDetails.innerHTML = ""; // Clear existing orders before appending updated ones
        data.reverse().forEach((order) => {
          const orderDiv = document.createElement("div");
          orderDiv.classList.add("order-box");
          orderDiv.innerHTML = `
            <p><strong>Order ID:</strong> <a href="../Order-details/details.html?orderId=${
              order.id
            }">${order.id}</a></p>
            <p><strong>Delivery Time:</strong> ${new Date(
              order.deliveryTime
            ).toLocaleString()}</p>
            <p><strong>Order Time:</strong> ${new Date(
              order.orderTime
            ).toLocaleString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Price:</strong> $${order.price.toFixed(2)}</p>
          `;
          if (order.status !== "Delivered") {
            const confirmOrderBtn = document.createElement("button");
            confirmOrderBtn.classList.add("confirm-order-btn");
            confirmOrderBtn.setAttribute("data-order-id", order.id);
            confirmOrderBtn.textContent = "Confirm Order";
            confirmOrderBtn.addEventListener("click", function () {
              confirmOrder(order.id, confirmOrderBtn);
            });
            orderDiv.appendChild(confirmOrderBtn);
          }
          orderDetails.appendChild(orderDiv);
        });
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        // Handle error scenario, e.g., display an error message
      });
  }

  fetchOrdersAndUpdateUI(); 

  function confirmOrder(orderId, button) {
    fetch(
      `https://food-delivery.int.kreosoft.space/api/order/${orderId}/status`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to confirm order. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Order confirmed:", data);
        window.location.reload(); 
      })
      .catch((error) => {
        console.error("Error confirming order:", error.message);
        window.location.reload(); 
       
      });
  }
});
