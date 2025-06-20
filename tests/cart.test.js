test("increaseQuantity() calls updateQuantity(true)", async () => {
  const mockUpdate = jest.fn();
  global.updateQuantity = mockUpdate;

  await increaseQuantity("dish-123");
  expect(mockUpdate).toHaveBeenCalledWith("dish-123", true);
});

test("removeItem() calls DELETE API endpoint", async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  await removeItem("dish-123", true);
  
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("api/basket/dish/dish-123"),
    expect.objectContaining({ method: "DELETE" })
  );
});

test("decreaseQuantity() delegates with false", async () => {
  const spy = jest.spyOn(global, "updateQuantity");
  await decreaseQuantity("dish-123");
  expect(spy).toHaveBeenCalledWith("dish-123", false);
});