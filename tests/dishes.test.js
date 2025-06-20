// Mock API response
const mockDishes = {
  dishes: [
    { id: 1, name: "Pizza", price: 10, vegetarian: false, rating: 4.5 }
  ],
  pagination: { current: 1, count: 1 }
};

test("fetchDishes() returns valid dish data structure", async () => {
  // Mock fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockDishes) })
  );

  const result = await fetchDishes(1);
  expect(result.dishes).toBeInstanceOf(Array);
  expect(result.dishes[0]).toHaveProperty("name");
  expect(result.dishes[0]).toHaveProperty("price");
});

test("applyFilters() sets vegetarian query param", () => {
  document.getElementById("vegetarianSwitch").checked = true;
  applyFilters();
  expect(params.get("vegetarian")).toBe("true");
});

