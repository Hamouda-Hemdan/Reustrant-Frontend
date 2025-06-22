async function fetchDataAndPopulate() {
  try {
    const data = await fetchBasketData();
    const container = document.getElementById("basketItems");
    container.innerHTML = "";

    if (data && data.length > 0) {
      const table = createBasketTable(data);
      container.appendChild(table);
    } else {
      showEmptyBasketMessage(container);
    }
  } catch (error) {
    console.error("Error fetching basket data:", error.message);
  }
}

async function fetchBasketData() {
  return await fetchWithToken(
    "https://food-delivery.int.kreosoft.space/api/basket"
  );
}

async function fetchWithToken(url, method = "GET", body = null) {
  const token = localStorage.getItem("token");
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) throw new Error("Request failed");

  return response.status !== 204 ? await response.json() : null;
}

function createBasketTable(data) {
  const table = document.createElement("table");
  table.classList.add("basket-table");

  const header = `
    <tr>
      <th>Image</th>
      <th>Name</th>
      <th>Price</th>
      <th>Amount</th>
      <th>Total Price</th>
      <th>Actions</th>
    </tr>`;

  const rows = data.map(createBasketRow).join("");
  table.innerHTML = header + rows;
  return table;
}

function createBasketRow(item) {
  return `
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
    </tr>`;
}

function showEmptyBasketMessage(container) {
  container.innerHTML =
    '<p>You have not ordered anything yet, add the required items from the <a href="../index.html">Menu</a></p>';
}

// Action functions
async function increaseQuantity(itemId) {
  try {
    await fetchWithToken(
      `https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}`,
      "POST",
      { increase: true }
    );
    fetchDataAndPopulate();
  } catch (error) {
    console.error("Error increasing quantity:", error.message);
  }
}

async function decreaseQuantity(itemId) {
  try {
    await fetchWithToken(
      `https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}`,
      "DELETE"
    );
    fetchDataAndPopulate();
  } catch (error) {
    console.error("Error decreasing quantity:", error.message);
  }
}

async function removeItem(itemId) {
  try {
    await fetchWithToken(
      `https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}`,
      "DELETE"
    );
    fetchDataAndPopulate();
  } catch (error) {
    console.error("Error removing item:", error.message);
  }
}

fetchDataAndPopulate();
