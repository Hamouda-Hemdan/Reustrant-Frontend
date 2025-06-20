test("populateOrderDetails() renders correct order total", () => {
  const mockOrder = {
    id: "order-123",
    price: 45.99,
    dishes: [{ name: "Burger", price: 10, amount: 2, totalPrice: 20 }]
  };
  
  document.body.innerHTML = `<div id="order-details"></div>`;
  populateOrderDetails(mockOrder);
  
  const renderedText = document.getElementById("order-details").textContent;
  expect(renderedText).toContain("45.99"); // Check total price
});

test("Formats delivery time correctly", () => {
  const mockOrder = { deliveryTime: "2024-06-10T12:00:00Z" };
  populateOrderDetails(mockOrder);
  
  const renderedText = document.getElementById("order-details").textContent;
  expect(renderedText).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Checks for locale date format
});

test("getOrderIdFromURL() parses URL params", () => {
  delete window.location;
  window.location = { search: "?orderId=abc123" };
  expect(getOrderIdFromURL()).toBe("abc123");
});