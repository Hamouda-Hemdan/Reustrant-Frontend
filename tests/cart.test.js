test("increaseQuantity() calls updateQuantity(true)", async () => {
  const mockUpdate = jest.fn();
  global.updateQuantity = mockUpdate;

  await increaseQuantity("dish-123");
  expect(mockUpdate).toHaveBeenCalledWith("dish-123", true);
});
