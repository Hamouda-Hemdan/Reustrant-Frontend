const { getProfile, setupProfileFormSubmit } = require("../Profile/profile.js");

describe("Profile functions", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  beforeEach(() => {
    fetch.resetMocks && fetch.resetMocks();
    fetch.mockClear();
    localStorage.clear();

    document.body.innerHTML = `
      <input id="username" />
      <input id="birthdate" />
      <input id="gender" />
      <input id="address" />
      <span id="email"></span>
      <input id="phone" />
      <form id="profileForm"></form>
    `;

    global.fetch = jest.fn();
  });

  test("getProfile logs error if no token", () => {
    localStorage.removeItem("token");

    getProfile();

    expect(console.error).toHaveBeenCalledWith("Token not found");
    expect(fetch).not.toHaveBeenCalled();
  });

  test("getProfile fetches profile and updates DOM", async () => {
    localStorage.setItem("token", "fake-token");

    const fakeProfile = {
      fullName: "John Doe",
      birthDate: "2000-01-01T00:00:00",
      gender: "Male",
      address: "123 Street",
      email: "john@example.com",
      phoneNumber: "1234567890",
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProfile,
    });

    await getProfile();

    expect(fetch).toHaveBeenCalledWith(
      "https://food-delivery.int.kreosoft.space/api/account/profile",
      expect.objectContaining({
        method: "GET",
        headers: {
          Authorization: "Bearer fake-token",
          Accept: "application/json",
        },
      })
    );

    expect(document.getElementById("username").value).toBe(fakeProfile.fullName);
    expect(document.getElementById("birthdate").value).toBe("2000-01-01");
    expect(document.getElementById("gender").value).toBe(fakeProfile.gender);
    expect(document.getElementById("address").value).toBe(fakeProfile.address);
    expect(document.getElementById("email").textContent).toBe(fakeProfile.email);
    expect(document.getElementById("phone").value).toBe(fakeProfile.phoneNumber);
  });

  test("getProfile handles fetch failure", async () => {
    localStorage.setItem("token", "fake-token");

    fetch.mockResolvedValueOnce({
      ok: false,
    });

    await getProfile();

    expect(console.error).toHaveBeenCalledWith(
      "There was a problem with the fetch operation:",
      expect.any(Error)
    );
  });

  test("setupProfileFormSubmit logs error if no token", () => {
    localStorage.removeItem("token");

    document.body.innerHTML = `
      <form id="profileForm"></form>
    `;
    setupProfileFormSubmit();

    const form = document.getElementById("profileForm");

    const submitEvent = new Event("submit");
    form.dispatchEvent(submitEvent);

    expect(console.error).toHaveBeenCalledWith("Token not found");
    expect(fetch).not.toHaveBeenCalled();
  });
});
