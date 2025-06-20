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
