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

test("generateInteractiveStarRating() creates 10 stars with 3 pre-selected", () => {
  const html = generateInteractiveStarRating(3, "dish-123");
  const stars = new DOMParser().parseFromString(html, "text/html")
    .querySelectorAll(".fa-star");
  
  expect(stars.length).toBe(10);
  expect([...stars].filter(s => s.classList.contains("checked")).length).toBe(3);
});

test("handlePagination() updates currentPage", () => {
  currentPage = 1;
  sessionStorage.clear();
  handlePagination(2);
  
  expect(currentPage).toBe(2);
  expect(sessionStorage.getItem("currentPage")).toBe("2");
});