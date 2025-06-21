const {
  fetchUserProfile,
  validateOrderInput,
  placeOrder,
  fetchOrders,
} = require("../Ordering/ordering.js");

describe("Ordering pure functions", () => {
  const dummyToken = "token123";

  test("fetchUserProfile success", async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ email: "user@example.com", phone: "12345" }),
      })
    );

    const profile = await fetchUserProfile(dummyToken, mockFetch);
    expect(profile.email).toBe("user@example.com");
    expect(mockFetch).toHaveBeenCalledWith("/api/profile", expect.any(Object));
  });

  test("fetchUserProfile throws if no token", async () => {
    await expect(fetchUserProfile(null, jest.fn())).rejects.toThrow(
      "Token not found"
    );
  });

  test("validateOrderInput throws if missing data", () => {
    expect(() => validateOrderInput("", "2023-01-01T10:00")).toThrow(
      "Please provide both address and delivery time."
    );
  });

  test("placeOrder success", async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ orderId: "abc123" }),
      })
    );

    const orderData = {
      address: "123 Main St",
      deliveryTime: "2023-01-01T10:00",
      items: [{ id: 1, quantity: 2 }],
    };

    const result = await placeOrder(dummyToken, orderData, mockFetch);
    expect(result.orderId).toBe("abc123");
    expect(mockFetch).toHaveBeenCalledWith("/api/orders", expect.any(Object));
  });

  test("fetchOrders returns orders", async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: "order1" }, { id: "order2" }]),
      })
    );

    const orders = await fetchOrders(dummyToken, mockFetch);
    expect(orders.length).toBe(2);
  });
});
