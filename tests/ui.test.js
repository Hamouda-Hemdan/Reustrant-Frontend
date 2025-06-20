test("submitRating() blocks unauthenticated users", async () => {
  localStorage.removeItem("token");
  const result = await submitRating("dish-123", 5);
  expect(result).toBeUndefined();
});