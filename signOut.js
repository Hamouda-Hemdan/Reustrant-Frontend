// Check if the user is logged in
var isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

// Function to update navigation links based on login status
function updateNavigation(isLoggedIn) {
  var ordersLink = document.getElementById("ordersLink");
  var cartLink = document.getElementById("cartLink");
  var signInLink = document.getElementById("signInLink");
  var signOutLink = document.getElementById("signOutLink");
  var profile = document.getElementById("Profile");

  if (isLoggedIn) {
    ordersLink.style.display = "block";
    cartLink.style.display = "block";
    signInLink.style.display = "none";
    signOutLink.style.display = "block";
    profile.style.display = "blcok";
  } else {
    ordersLink.style.display = "none";
    cartLink.style.display = "none";
    signInLink.style.display = "block";
    signOutLink.style.display = "none";
    profile.style.display = "none";
  }
}

// Function to sign out using the API
function signOut() {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");

  // Construct the fetch request with the token
  fetch("https://food-delivery.int.kreosoft.space/api/account/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Clear the token and login status from localStorage
        localStorage.removeItem("token");
        localStorage.setItem("isLoggedIn", "false");
        // Redirect to the sign-in page
        window.location.href = "Authorization/login.html";
      } else {
        console.error("Logout failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

updateNavigation(isLoggedIn);
