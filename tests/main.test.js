/**
 * @jest-environment jsdom
 */

describe("DOM-dependent tests for main.js", () => {
  beforeAll(() => {
    // Setup minimal DOM needed for main.js
    document.body.innerHTML = `
      <button id="filter">Filter</button>
      <select id="sort">
        <option value="asc" selected>Ascending</option>
        <option value="desc">Descending</option>
      </select>
    `;

    // Require the main.js AFTER DOM setup
    require("../main.js");
  });

  test("filter button should exist", () => {
    const filterBtn = document.getElementById("filter");
    expect(filterBtn).not.toBeNull();
  });

  test("sort select should default to 'asc'", () => {
    const sortSelect = document.getElementById("sort");
    expect(sortSelect.value).toBe("asc");
  });
});
