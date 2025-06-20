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