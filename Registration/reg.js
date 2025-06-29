function formatPhoneNumber(input) {
  let digits = input.value.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = "7" + digits.slice(1);
  }

  if (!digits.startsWith("7") || digits.length !== 11) {
    input.value = "";
    return;
  }

  // Format: +7 (XXX) XXX-XX-XX
  input.value = `+7 (${digits.slice(1, 4)}) ${digits.slice(
    4,
    7
  )}-${digits.slice(7, 9)}-${digits.slice(9)}`;
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = {
      fullName: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      birthDate: document.getElementById("birthdate").value,
      gender: document.getElementById("gender").value,
      phoneNumber: document.getElementById("phone").value,
      address: document.getElementById("address").value,
    };

    
    fetch("https://food-delivery.int.kreosoft.space/api/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data) => {
        
        console.log("Response data:", data);
        
        window.location.href = "../Authorization/login.html";
      })
      .catch((error) => {
        console.error("Error:", error);
        
      });
  });
});
