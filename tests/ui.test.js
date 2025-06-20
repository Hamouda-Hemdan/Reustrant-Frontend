test("submitRating() blocks unauthenticated users", async () => {
  localStorage.removeItem("token");
  const result = await submitRating("dish-123", 5);
  expect(result).toBeUndefined();
});

test("fetchCartData() returns [] on failure", async () => {
  global.fetch = jest.fn().mockRejectedValue("API error");
  const result = await fetchCartData();
  expect(result).toEqual([]);
});