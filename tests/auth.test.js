test("login() stores token in localStorage", async () => {
  const mockToken = "fake-token-123";
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ token: mockToken })
    })
  );

  await login("test@example.com", "password");
  expect(localStorage.setItem).toHaveBeenCalledWith("token", mockToken);
});

test("fetchCartData() sends auth header", () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => [] }));
  fetchCartData();
  expect(fetch.mock.calls[0][0].headers).toHaveProperty("Authorization");
});

test("addToCart() blocks unauthorized users", () => {
  localStorage.removeItem("token");
  addToCart("dish-123");
  expect(fetch).not.toHaveBeenCalled();
});