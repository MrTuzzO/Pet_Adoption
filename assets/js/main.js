function includeHTML(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            setupAuthButtons();
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
}

document.addEventListener("DOMContentLoaded", () => {
    includeHTML("header", "components/header.html");
    includeHTML("footer", "components/footer.html");
    includeHTML("loader", "components/loader.html");
    // includeHTML("loader", "components/logout_modal.html");
});


// for alert
function showAlert(message, type = 'danger', duration = 10000) {
    // Create the alert div
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

    // Append the alert to the alert container
    const alertContainer = document.getElementById('alert-container');
    alertContainer.appendChild(alertDiv);

    // Automatically remove the alert after the specified duration
    setTimeout(() => {
        alertDiv.classList.remove('show'); // Start fade-out animation
        alertDiv.addEventListener('transitionend', () => alertDiv.remove()); // Remove the alert after fade-out
    }, duration);
}


function setupAuthButtons() {
    const authToken = localStorage.getItem('authToken');
    const authButtons = document.getElementById('auth-buttons');
    const userName = localStorage.getItem('username');

    if (authToken) {
        // authButtons.innerHTML = `
        //     <a class="btn btn-outline-light" href="user_profile.html">Profile</a>
        //     <button class="btn btn-outline-light" id="logout-btn">Logout</button>
        // `;
        authButtons.innerHTML = `
            <a class="btn text-white p-0" href="user_profile.html" title="Profile">
                <i class="fas fa-user-circle"></i> 
                <span>${userName || 'User'}</span> <!-- Display username or default to 'User' -->
            </a>
            <button class="btn" id="logout-btn" title="Logout">
                <i class="fas fa-sign-out-alt text-white fs-5"></i>
            </button>
        `;
        document.getElementById('logout-btn').addEventListener('click', function() {
            const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
            logoutModal.show();
        });
    } else {
        authButtons.innerHTML = `
        <a href="signup.html" class="btn btn-outline-light">Sign Up</a>
        <a href="login.html" class="btn btn-outline-light">Login</a>
        `;
    }
}


// Function to add the logout modal to the document
function addLogoutModal() {
    const modalHTML = `
        <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="logoutModalLabel">Confirm Logout</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to logout?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmLogout">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}
addLogoutModal();


document.getElementById('confirmLogout').addEventListener('click', async function() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        showAlert('You are not logged in.', 'warning');
        return;
    }

    try {
        // for adding loader
        const loader = document.getElementById('loader');
        loader.classList.remove('d-none'); // Show loader

        const response = await fetch('https://pet-adoption-omega-seven.vercel.app/api/auth/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
            },
        });

        if (response.ok) {
            // Remove the token and redirect to the login page
            localStorage.removeItem('authToken');
            localStorage.clear();
            // alert('Logout successful!');
            showAlert('Logout successful!', 'success');
            window.location.href = 'login.html';
        } else {
            const errorData = await response.json();
            console.error('Logout failed:', errorData);
            showAlert('Logout failed. Please try again.', 'warning');


            // Remove the token and redirect to the login page
            localStorage.removeItem('authToken');
            localStorage.clear();
            // alert('Logout successful!');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('An unexpected error occurred during logout:', error);
        showAlert('An unexpected error occurred. Please try again.');
    } finally {
        loader.classList.add("d-none");
    }
});