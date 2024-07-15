
async function fetchDataAndPopulate() {
  try {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');
    
    // Fetch data from the API
    const response = await fetch("https://food-delivery.int.kreosoft.space/api/basket", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    // Check if response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch basket data');
    }
    
    // Parse response as JSON
    const data = await response.json();
    
    // Reference to the container element
    const basketItemsContainer = document.getElementById('basketItems');
    
    // Clear previous content of basketItemsContainer
    basketItemsContainer.innerHTML = '';

    // Check if data is available
    if (data && data.length > 0) {
      // Create HTML elements for each item in the data
      const table = document.createElement('table');
      table.classList.add('basket-table');
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
      data.forEach(item => {
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
            <button class="removeButton" onclick="removeItem('${item.id}', true)">Remove</button>
          </td>
        </tr>
        `;
      });
      table.innerHTML = tableHTML;
      basketItemsContainer.appendChild(table);
    } else {
      // Display a message if no data is available
      basketItemsContainer.innerHTML = '<p>You have not ordered anything yet, add the required items from the <a href="../index.html">Menu</a></p>';
    }
  } catch (error) {
    console.error('Error fetching basket data:', error.message);
  }
}

// Call the function to fetch data and populate HTML
fetchDataAndPopulate();
async function increaseQuantity(itemId) {
  try {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');
    
    // Construct the API endpoint
    const endpoint = `https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}`;

    // Make request to increase item quantity in cart using POST method
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ increase: true }) // Send data as JSON indicating increase quantity
    });

    // Check if response is successful
    if (!response.ok) {
      throw new Error('Failed to increase item quantity in cart');
    }

    // If increase is successful, refresh the cart display
    fetchDataAndPopulate();
  } catch (error) {
    console.error('Error increasing quantity:', error.message);
  }
}

async function decreaseQuantity(itemId) {
  try {
    await updateQuantity(itemId, true); // Call the updateQuantity function with increase parameter set to false
  } catch (error) {
    console.error('Error decreasing quantity:', error.message);
  }
}

async function updateQuantity(itemId, increase) {
  try {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');
    
    // Construct the API endpoint
    let endpoint = `https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}?increase=${increase}`;

    // Make request to update item quantity in cart
    const response = await fetch(endpoint, {
      method: "DELETE", // Use DELETE method for both increase and decrease, as per the API
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    // Check if response is successful
    if (!response.ok) {
      throw new Error('Failed to update item quantity in cart');
    }

    // If update is successful, refresh the cart display
    fetchDataAndPopulate();
  } catch (error) {
    console.error('Error updating quantity:', error.message);
  }
}

async function removeItem(itemId, removeFromCartCompletely) {
  try {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');
    
    // Construct the API endpoint based on removeFromCartCompletely parameter
    let endpoint = `https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}?increase=${!removeFromCartCompletely}`;

    // Make DELETE request to remove item from cart
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    // Check if response is successful
    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }

    // If removal is successful, refresh the cart display
    fetchDataAndPopulate();
  } catch (error) {
    console.error('Error removing item from cart:', error.message);
  }
}