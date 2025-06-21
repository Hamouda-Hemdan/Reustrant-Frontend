/**
 * @jest-environment jsdom
 */

const {
  formatPhoneNumber,
  setupProfileFormSubmit,
} = require("../Registration/reg.js");

describe("formatPhoneNumber", () => {
  let input;

  beforeEach(() => {
    input = document.createElement("input");
  });

  test("replaces 8 with +7 and formats correctly", () => {
    input.value = "89261234567";
    formatPhoneNumber(input);
    expect(input.value).toBe("++7(926)-123-45-67");
  });

  test("leaves +7 format unchanged but formats it", () => {
    input.value = "+79261234567";
    formatPhoneNumber(input);
    expect(input.value).toBe("+7(926)-123-45-67");
  });

  test("alerts and clears input if number does not start with 7 or 8", () => {
    window.alert = jest.fn(); // mock alert
    input.value = "1234567890";
    formatPhoneNumber(input);
    expect(window.alert).toHaveBeenCalledWith(
      "Number format is incorrect. Please enter a valid Russian phone number."
    );
    expect(input.value).toBe("");
  });
});

describe("setupProfileFormSubmit", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="profileForm">
        <input id="username" value="John Doe" />
        <input id="email" value="john@example.com" />
        <input id="password" value="password123" />
        <input id="birthdate" value="1990-01-01" />
        <input id="gender" value="Male" />
        <input id="phone" value="+79261234567" />
        <input id="address" value="123 Main St" />
      </form>
    `;
    global.fetch = jest.fn();
    global.window.location = { href: "" }; // mock location for redirect
  });

  test("submits form data and redirects on success", async () => {
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValue({ success: true }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    setupProfileFormSubmit();

    const form = document.getElementById("profileForm");
    const submitEvent = new Event("submit");
    form.dispatchEvent(submitEvent);

    // wait for promises
    await Promise.resolve();

    expect(fetch).toHaveBeenCalledWith(
      "https://food-delivery.int.kreosoft.space/api/account/register",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          fullName: "John Doe",
          email: "john@example.com",
          password: "password123",
          birthDate: "1990-01-01",
          gender: "Male",
          phoneNumber: "+79261234567",
          address: "123 Main St",
        }),
      })
    );

    expect(window.location.href).toBe("http://localhost/");
  });

  ;
});
