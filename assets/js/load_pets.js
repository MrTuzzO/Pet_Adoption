
// Function to fetch data from the API
async function fetchPets(species, page = 1) {
    const response = await fetch(`${root_api}/api/pet/${species}/?page=${page}`);
    const data = await response.json();
    return data;
}

// selectedSpecies = 'cats';
window.onload = function () {
    selectedSpecies = document.getElementById('speciesSelect').value;
}

// Function to create pet cards
function createPetCard(pet, selectedSpecies) {
    const today = new Date(); // Current date and time
    const dateAdded = new Date(pet.date_added); // Parse ISO 8601 date string
    const timeDifference = today - dateAdded; // Difference in milliseconds
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    console.log(daysDifference);

    let badgeText = "";
    if (daysDifference === 0) {
        badgeText = "New Today";
    } else if (daysDifference <= 7) {
        badgeText = "New This Week";
    }

    return `
    <div class="col">
        <a href="${selectedSpecies}_details.html?id=${pet.id}" class="text-decoration-none">
            <div class="card">
                <img src="${pet.image_1}" class="card-img-top" alt="Pet Image" style="height: 250px; object-fit: cover;">
               
                ${badgeText ? `<span class="badge position-absolute" style="top: 220px; right: 4px; font-size: 0.9rem; background: #c19a6b9b">${badgeText}</span>` : ""}
               
                <div class="card-body">
                    <h5 class="card-title text-primary fw-bold">${pet.name}</h5>
                    <p class="card-text text-dark mb-0">
                        <span>
                             ${pet.year === 0 && pet.month === 0
            ? "Age not mentioned"
            : pet.year === 0
                ? `${pet.month} Month`
                : pet.month === 0
                    ? `${pet.year} Year`
                    : `${pet.year} Year ${pet.month} Month`}
                        </span>
                    </p>
                    <p class="card-text text-dark">
                        <i class="fas fa-map-marker-alt text-primary"></i> ${pet.location}
                    </p>
                </div>
            </div>
        </a>
    </div>`;
}

// Function to display pets on the page
function displayPets(pets) {
    const petContainer = document.getElementById('petCardsHolder');
    petContainer.innerHTML = '';

    if (pets.length === 0) {
        petContainer.innerHTML = `<p class="text-center w-100 text-muted">No pets found</p>`;
    } else {
        pets.forEach(pet => {
            petContainer.innerHTML += createPetCard(pet, selectedSpecies);
        });
    }
}


let currentPage = 1;
const petsPerPage = 18; // Number of pets per page

// Function to create pagination buttons
function createPagination(totalCount, currentPage, species) {
    const paginationContainer = document.querySelector('#pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalCount / petsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `
        <button class="btn ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'} mx-1" data-page="${i}">
            ${i}
        </button>`;
    }

    // Add event listeners to pagination buttons
    const buttons = paginationContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const page = parseInt(e.target.getAttribute('data-page'));
            loadPets(species, page);
        });
    });
}

// Function to load pets and handle pagination
async function loadPets(species = 'cats', page = 1) {
    const data = await fetchPets(species, page);
    displayPets(data.results);
    createPagination(data.count, page, species);
}

// Initialize the page
window.addEventListener('DOMContentLoaded', () => {
    const speciesSelect = document.getElementById('speciesSelect');

    // Load the default species (Cat)
    loadPets(speciesSelect.value);
    // Update pets and filters when the species is changed
    speciesSelect.addEventListener('change', () => {
        loadPets(speciesSelect.value);
        selectedSpecies = speciesSelect.value;
    });
});


// Function to fetch pets based on filters
async function fetchFilteredPets(species, filters, page = 1) {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${root_api}${species}/?page=${page}&${query}`);
    const data = await response.json();
    return data;
}

// Function to extract selected filters
function getSelectedFilters() {
    const gender = document.getElementById('genderSelect').value;
    const colorSelect = document.getElementById('colorSelect');
    const colors = Array.from(colorSelect.selectedOptions).map(option => option.value);

    const filters = {};
    if (gender) filters.gender = gender;
    if (colors.length > 0) filters.color = colors; // Handle multiple colors
    return filters;
}

// Function to handle filter form submission
async function handleFilterSubmit(e) {
    e.preventDefault();
    const species = document.getElementById('speciesSelect').value;
    const filters = getSelectedFilters();
    const data = await fetchFilteredPets(species, filters);
    displayPets(data.results);
    createPagination(data.count, 1, species); // Reset to first page after filtering
}

// Add event listener to filter form
window.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.querySelector('form');
    filterForm.addEventListener('submit', handleFilterSubmit);

    // Reset button to clear filters and reload default pets
    filterForm.addEventListener('reset', () => {
        loadPets(); // Load default pets on reset
    });
});
