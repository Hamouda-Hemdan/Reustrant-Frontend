// Fetch profile information
function getProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token not found');
    return;
  }

  fetch('https://food-delivery.int.kreosoft.space/api/account/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Update form fields with fetched profile data
    document.getElementById('username').value = data.fullName;
    document.getElementById('birthdate').value = data.birthDate.split('T')[0];
    document.getElementById('gender').value = data.gender;
    document.getElementById('address').value = data.address;
    document.getElementById('email').textContent = data.email;
    document.getElementById('phone').value = data.phoneNumber;
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}



// Update profile
document.getElementById('profileForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const token = localStorage.getItem('token'); 
  if (!token) {
    console.error('Token not found');
    return;
  }

  const formData = new FormData(this);
  const profileData = {};
  formData.forEach((value, key) => {
    profileData[key] = value;
  });


  fetch('https://food-delivery.int.kreosoft.space/api/account/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  })
  .then(response => {
    console.log(response)
    return response.json();
  })
  .then(data => {
    console.log('Profile updated successfully:', data);
  
  })
  .catch(error => {
    console.error(error);
  });
});

getProfile();