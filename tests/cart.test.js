const { fetchDataAndPopulate, increaseQuantity } = require("../Cart/cart.js");

beforeEach(() => {
  // Setup DOM container expected by cart.js
  document.body.innerHTML = `<div id="basketItems"></div>`;
  fetch.resetMocks();
  localStorage.clear();
});

describe("Cart functionality", () => {
  test("fetchDataAndPopulate renders table when basket has items", async () => {
    // Mock localStorage token retrieval
    localStorage.setItem("token", "fake-token");

    fetch.mockResponseOnce(
      JSON.stringify([
        {
          id: "1",
          name: "Apple",
          price: 1.0,
          amount: 2,
          totalPrice: 2.0,
          image: "apple.jpg",
        },
      ])
    );

    await fetchDataAndPopulate();

    const basketHTML = document.getElementById("basketItems").innerHTML;
    expect(basketHTML).toContain("Apple");
    expect(basketHTML).toContain("<table"); // Table element should be rendered
    expect(basketHTML).not.toContain("You have not ordered anything yet");

    // Check that fetch was called with proper Authorization header
    expect(fetch).toHaveBeenCalledWith(
      "https://food-delivery.int.kreosoft.space/api/basket",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer fake-token",
          Accept: "application/json",
        }),
      })
    );
  });

  test("fetchDataAndPopulate shows empty message when basket is empty", async () => {
    localStorage.setItem("token", "fake-token");
    fetch.mockResponseOnce(JSON.stringify([]));

    await fetchDataAndPopulate();

    const basketHTML = document.getElementById("basketItems").innerHTML;
    expect(basketHTML).toContain(
      'You have not ordered anything yet, add the required items from the <a href="../index.html">Menu</a>'
    );
  });

  test("fetchDataAndPopulate handles fetch failure gracefully", async () => {
    localStorage.setItem("token", "fake-token");
    fetch.mockRejectOnce(new Error("Network error"));

    // Should not throw, error is caught inside function
    await expect(fetchDataAndPopulate()).resolves.not.toThrow();

    const basketHTML = document.getElementById("basketItems").innerHTML;
    expect(basketHTML).toBe(""); // Container is cleared at start
  });

  test("increaseQuantity calls POST fetch and then refreshes basket", async () => {
    localStorage.setItem("token", "fake-token");

    // Mock POST to increase quantity
    fetch.mockResponseOnce(JSON.stringify({ success: true }));

    // Mock subsequent GET to refresh basket in fetchDataAndPopulate
    fetch.mockResponseOnce(JSON.stringify([]));

    await increaseQuantity("1");

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://food-delivery.int.kreosoft.space/api/basket/dish/1",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer fake-token",
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
        body: JSON.stringify({ increase: true }),
      })
    );

    // Second fetch is the basket refresh GET call
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "https://food-delivery.int.kreosoft.space/api/basket",
      expect.objectContaining({
        method: "GET",
      })
    );
  });

  test("increaseQuantity handles fetch failure gracefully", async () => {
    localStorage.setItem("token", "fake-token");
    fetch.mockRejectOnce(new Error("Network error"));

    await expect(increaseQuantity("1")).resolves.not.toThrow();

    // Only one fetch call attempted (POST)
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
