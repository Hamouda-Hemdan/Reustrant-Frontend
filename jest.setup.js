const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();
beforeAll(() => {
  // Mock DOM elements so login.js doesn't fail on import
  document.body.innerHTML = `
    <input id="email" />
    <input id="password" />
    <button id="loginBtn"></button>
  `;
});
