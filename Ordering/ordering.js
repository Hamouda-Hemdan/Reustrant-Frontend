document.addEventListener("DOMContentLoaded", function() {
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const addressInput = document.getElementById("address");
    const deliveryTimeInput = document.getElementById("delivery-time");
    const placeOrderButton = document.getElementById("placeOrderButton");

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in local storage");
        return;
    }

   
    fetch("https://food-delivery.int.kreosoft.space/api/account/profile", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(userData => {
        const email = userData.email;
        const phoneNumber = userData.phoneNumber;
        emailInput.value = email;
        phoneInput.value = phoneNumber;
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
    });

    placeOrderButton.addEventListener("click", function() {
        const address = addressInput.value.trim();
        const deliveryTime = deliveryTimeInput.value;
    
        if (!address || !deliveryTime) {
            console.error("Address and delivery time are required.");
            alert("Please provide both address and delivery time.");
            return;
        }
    
        // Fetch the user's cart items
        fetch("https://food-delivery.int.kreosoft.space/api/basket", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch cart items");
            }
            return response.json();
        })
        .then(cartItems => {
            // Manually construct the ISO string
            const localDate = new Date(deliveryTime);
            const timezoneOffset = localDate.getTimezoneOffset() * 60000;
            const correctedDate = new Date(localDate.getTime() - timezoneOffset);
            const isoDeliveryTime = correctedDate.toISOString().slice(0, 19); 
    
            const orderData = {
                deliveryTime: isoDeliveryTime,
                address: address,
                items: cartItems
            };
    
            console.log("Request Payload:", orderData);
    
            // Place the order
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
            console.log("Response Status:", response.status);
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error("Server Response:", errorData);
                    throw new Error("Failed to place order");
                });
            }
            // Check if response body exists and is not empty
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                console.log("Response is not in JSON format.");
                return {}; 
            }
        })
        .then(orderResponse => {
            console.log("Order placed successfully:", orderResponse);
            alert("Order placed successfully!");
    
            // Clear the entire cart after placing the order
            return fetch("https://food-delivery.int.kreosoft.space/api/basket", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to clear the cart");
            }
            console.log("Cart cleared successfully");
            // After successfully clearing the cart, reload the page to reflect the changes
            location.reload();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("There was an error processing your order. Please try again.");
        });
    });
    
});

document.addEventListener('DOMContentLoaded', async function() {
    const orderList = document.getElementById('orderList');
    const token = localStorage.getItem("token");
    try {
        const response = await fetch("https://food-delivery.int.kreosoft.space/api/basket", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const orderData = await response.json();

        orderData.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
        
            const imgDiv = document.createElement('div');
            imgDiv.classList.add('item-image-container');
        
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.classList.add('item-image'); // Add a class for the item image
        
            imgDiv.appendChild(img);
        
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('item-details');
        
            const nameDiv = document.createElement('div');
            nameDiv.classList.add('item-name-container');
        
            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${item.name}`;
            nameSpan.classList.add('item-name'); // Add a class for the item name
        
            nameDiv.appendChild(nameSpan);
        
            const priceDiv = document.createElement('div');
            priceDiv.classList.add('item-price-container');
        
            const priceSpan = document.createElement('span');
            priceSpan.innerHTML = `<strong>Price:</strong> ${item.price.toFixed(2)}`;
            priceSpan.classList.add('item-price'); // Add a class for the item price
        
            priceDiv.appendChild(priceSpan);
        
            const amountDiv = document.createElement('div');
            amountDiv.classList.add('item-amount-container');
        
            const amountSpan = document.createElement('span');
            amountSpan.textContent = `Amount: ${item.amount}`;
            amountSpan.classList.add('item-amount'); // Add a class for the item amount
        
            amountDiv.appendChild(amountSpan);
        
            const totalPriceDiv = document.createElement('div');
            totalPriceDiv.classList.add('item-total-price-container');
        
            const totalPriceSpan = document.createElement('span');
            totalPriceSpan.textContent = `Total Price: $${item.totalPrice.toFixed(2)}`;
            totalPriceSpan.classList.add('item-total-price'); // Add a class for the total price
        
            totalPriceDiv.appendChild(totalPriceSpan);
        
            detailsDiv.appendChild(nameDiv);
            detailsDiv.appendChild(priceDiv);
            detailsDiv.appendChild(amountDiv);
            detailsDiv.appendChild(totalPriceDiv);
        
            itemDiv.appendChild(imgDiv);
            itemDiv.appendChild(detailsDiv);
        
            orderList.appendChild(itemDiv);
        });
        
        
        
    } catch (error) {
        console.error('Error fetching order data:', error);
    }
});

