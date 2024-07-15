// Get the dish ID from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const dishId = urlParams.get('id');

let url1 = `https://food-delivery.int.kreosoft.space/api/dish/${dishId}`;

console.log(url1);

// Fetch dish details using the dish ID
fetch(url1)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(dish => {
    // Handle the fetched dish details
    console.log('Fetched dish details:', dish);
    
    // Display the fetched dish details on the page
    document.getElementById('image').src = dish.image;
    document.getElementById('dishName').textContent = dish.name;
    document.getElementById('description').textContent = dish.description;
    document.getElementById('price').textContent = `Price: ${dish.price} ₽/dish`;
    document.getElementById('category').textContent = dish.category;
    document.getElementById('vegetarian').textContent = dish.vegetarian ? "Vegetarian" : "Non-Vegetarian";

  })
  .catch(error => {
    console.error('Error fetching dish details:', error);
  });
