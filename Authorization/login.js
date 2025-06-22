// login.js

document.getElementById("loginBtn").addEventListener("click", function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = {
    email: email,
    password: password,
  };

  fetch("https://food-delivery.int.kreosoft.space/api/account/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Important! Send cookies (for HttpOnly token)
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Login failed");
      }
    })
    .then((data) => {
      // Token is now stored as HttpOnly cookie by the server.
      // Frontend does NOT store token in localStorage.

      // Optionally, you can store a simple flag in sessionStorage/localStorage if needed:
      sessionStorage.setItem("isLoggedIn", "true");

      // Redirect to home page after successful login
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    });
});
