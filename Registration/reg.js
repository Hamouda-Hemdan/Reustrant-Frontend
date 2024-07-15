function formatPhoneNumber(input) {
  // Remove all non-digit characters
  let phoneNumber = input.value.replace(/\D/g, '');

  // Check if the number starts with 8 or 7
  if (phoneNumber.startsWith('8')) {
    // Replace 8 with +7
    phoneNumber = phoneNumber.replace(/^8/, '+7');
  } else if (!phoneNumber.startsWith('7')) {
    // If it doesn't start with +7 or 8, show an alert and reset the input
    alert("Number format is incorrect. Please enter a valid Russian phone number.");
    input.value = '';
    return;
  }
  
  // Apply formatting
  phoneNumber = phoneNumber.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1($2)-$3-$4-$5');

  // Update the input value
  input.value = phoneNumber;
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = {
      fullName: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      birthDate: document.getElementById('birthdate').value,
      gender: document.getElementById('gender').value,
      phoneNumber: document.getElementById('phone').value,
      address: document.getElementById('address').value
    };

    // Send POST request to the API endpoint
    fetch('https://food-delivery.int.kreosoft.space/api/account/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      // Log the response status
      console.log('Response status:', response.status);
      return response.json();
    })
    .then(data => {
      // Log the response data
      console.log('Response data:', data);
      // Handle success response here, e.g., show a success message to the user
      window.location.href = "../Authorization/login.html";
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle error here, e.g., show an error message to the user
    });
  });
});
