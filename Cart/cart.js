
async function fetchDataAndPopulate() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://food-delivery.int.kreosoft.space/api/basket",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch basket data");
    }

    const data = await response.json();
    const basketItemsContainer = document.getElementById("basketItems");
    basketItemsContainer.innerHTML = "";

    if (data && data.length > 0) {
      const table = document.createElement("table");
      table.classList.add("basket-table");
      let tableHTML = `
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Amount</th>
          <th>Total Price</th>
          <th>Actions</th>
        </tr>
      `;

      data.forEach((item) => {
        tableHTML += `
        <tr class="basket-item">
          <td class="basket-item-image"><img src="${item.image}" alt="${item.name}" width="100"></td>
          <td class="basket-item-name">${item.name}</td>
          <td class="basket-item-price">${item.price}</td>
          <td class="basket-item-amount">
            <button class="quantityButton" onclick="decreaseQuantity('${item.id}')">-</button>
            ${item.amount}
            <button class="quantityButton" onclick="increaseQuantity('${item.id}')">+</button>
          </td>
          <td class="basket-item-total">${item.totalPrice}</td>
          <td class="basket-item-remove">
            <button class="removeButton" onclick="removeItem('${item.id}')">Remove</button>
          </td>
        </tr>
        `;
      });

      table.innerHTML = tableHTML;
      basketItemsContainer.appendChild(table);
    } else {
      basketItemsContainer.innerHTML =
        '<p>You have not ordered anything yet, add the required items from the <a href="../index.html">Menu</a></p>';
    }
  } catch (error) {
    console.error("Error fetching basket data:", error.message);
  }
}



async function increaseQuantity(itemId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ increase: true }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to increase item quantity");
    }

    fetchDataAndPopulate();
  } catch (error) {
    console.error("Error increasing quantity:", error.message);
  }
}

async function decreaseQuantity(itemId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to decrease item quantity");
    }

    fetchDataAndPopulate();
  } catch (error) {
    console.error("Error decreasing quantity:", error.message);
  }
}

async function removeItem(itemId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove item");
    }
    fetchDataAndPopulate();
  } catch (error) {
    console.error("Error removing item:", error.message);
  }
}


fetchDataAndPopulate();
