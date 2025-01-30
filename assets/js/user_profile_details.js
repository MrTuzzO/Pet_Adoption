// Fetch user profile data and populate the card
document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://pet-adoption-omega-seven.vercel.app/api/auth/profile/"; // Update the URL as per your backend setup
    const authToken = localStorage.getItem("authToken"); // Assuming authToken is stored in localStorage

    if (!authToken) {
        window.location.href = "login.html";
        return;
    }

    // Fetch profile data
    fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${authToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch profile data");
            }
            return response.json();
        })
        .then((data) => {
            populateProfileCard(data);
            localStorage.setItem("username", data.username);
        })
        .catch((error) => {
            console.error("Error fetching profile data:", error);
        });
});

// Function to populate the profile card
function populateProfileCard(data) {
    document.getElementById("full_name").textContent = data.first_name +" "+ data.last_name || "N/A";
    document.getElementById("username").textContent = data.username || "N/A";
    document.getElementById("email").textContent = data.email || "N/A";
    document.getElementById("birthday").textContent = data.birthday || "N/A";
    document.getElementById("address").textContent = data.address || "N/A";
    document.getElementById("mobile").textContent = data.mobile || "N/A";
    document.getElementById("joined").textContent = data.date_joined || "N/A";
}
