const { loginUser } = require("../Authorization/login2");

global.fetch = jest.fn();

describe("Login functionality", () => {
  beforeAll(() => {
    jest.spyOn(Storage.prototype, "setItem");

    delete window.location;
    let hrefValue = "";
    window.location = {
      get href() {
        return hrefValue;
      },
      set href(url) {
        hrefValue = url;
      },
    };

    global.alert = jest.fn();
  });

  afterAll(() => {
    Storage.prototype.setItem.mockRestore();
  });

  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
    global.alert.mockClear();
    Storage.prototype.setItem.mockClear();
  });

  test("successful login stores token and sets redirect URL", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "fake-jwt-token" }),
    });

    const result = await loginUser("email@example.com", "password123");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("token")).toBe("fake-jwt-token");
    expect(localStorage.getItem("isLoggedIn")).toBe("true");
    expect(window.location.href).toBe("http://localhost/");
    expect(result.success).toBe(true);
    expect(result.redirectUrl).toBe("../index.html");
  });

  test("failed login triggers alert and returns error", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Unauthorized" }),
    });

    const result = await loginUser("email@example.com", "wrongpassword");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(global.alert).toHaveBeenCalledWith(
      "Login failed. Please try again."
    );
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test("fetch is called with correct URL and options", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "token123" }),
    });

    await loginUser("test@example.com", "pass");

    expect(fetch).toHaveBeenCalledWith(
      "https://food-delivery.int.kreosoft.space/api/account/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com", password: "pass" }),
      })
    );
  });

  test("returns success false and error on network failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await loginUser("email", "pass");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(false);
    expect(result.error.message).toBe("Network error");
    expect(global.alert).toHaveBeenCalledWith(
      "Login failed. Please try again."
    );
  });

  test("does not set localStorage on failed login", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    await loginUser("email", "pass");

    expect(localStorage.getItem("token")).toBe(null);
    expect(localStorage.getItem("isLoggedIn")).toBe(null);
  });

  test("window.location.href is not changed on failed login", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Unauthorized" }),
    });

    await loginUser("email", "pass");

    expect(window.location.href).not.toBe("../index.html");
  });

  test("localStorage keys are strings", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "abc123" }),
    });

    await loginUser("email", "pass");

    expect(typeof localStorage.getItem("token")).toBe("string");
    expect(typeof localStorage.getItem("isLoggedIn")).toBe("string");
  });

  test("loginUser returns an object with success and redirectUrl on success", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "tok" }),
    });

    const result = await loginUser("email", "pass");

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("redirectUrl", "../index.html");
  });

  test("loginUser returns an object with success false and error on failure", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Error" }),
    });

    const result = await loginUser("email", "pass");

    expect(result).toHaveProperty("success", false);
    expect(result.error).toBeDefined();
  });
});
