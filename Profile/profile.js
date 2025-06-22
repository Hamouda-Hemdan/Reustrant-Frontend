// --- Utility Functions ---
function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token not found");
  }
  return token;
}

function handleFetchErrors(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

// --- Fetch & Populate Profile ---
function getProfile() {
  const token = getToken();
  if (!token) return;

  fetch("https://food-delivery.int.kreosoft.space/api/account/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
    .then(handleFetchErrors)
    .then(populateProfileForm)
    .catch((error) =>
      console.error("Failed to fetch profile information:", error)
    );
}

function populateProfileForm(data) {
  setValue("username", data.fullName);
  setValue("birthdate", data.birthDate.split("T")[0]);
  setValue("gender", data.gender);
  setValue("address", data.address);
  setValue("phone", data.phoneNumber);
  setText("email", data.email);
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// --- Handle Form Submit (Update Profile) ---
function handleProfileFormSubmit(event) {
  event.preventDefault();

  const token = getToken();
  if (!token) return;

  const formData = new FormData(event.target);
  const profileData = Object.fromEntries(formData.entries());

  fetch("https://food-delivery.int.kreosoft.space/api/account/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  })
    .then(handleFetchErrors)
    .then((data) => {
      console.log("Profile updated successfully:", data);
      alert("Profile updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    });
}

// --- Attach Submit Handler ---
document
  .getElementById("profileForm")
  .addEventListener("submit", handleProfileFormSubmit);

// --- Initial Load ---
getProfile();
