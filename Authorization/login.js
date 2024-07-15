// login.js

document.getElementById("loginBtn").addEventListener("click", function() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  
  var data = {
    email: email,
    password: password
  };

  fetch("https://food-delivery.int.kreosoft.space/api/account/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      // Extract the token from the response
      return response.json();
    } else {
      throw new Error('Login failed');
    }
  })
  .then(data => {
    const token = data.token;
    // Store the token in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true'); // Update localStorage for login status
    // Redirect to index.html
    window.location.href = "../index.html";
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Login failed. Please try again.");
  });
});
