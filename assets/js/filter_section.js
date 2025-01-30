document.addEventListener('DOMContentLoaded', () => {
    const speciesSelect = document.getElementById('speciesSelect');
    const additionalFilters = document.getElementById('additionalFilters');
    const filterForm = document.getElementById('filterForm');

    // Define filtering options for each species
    const speciesFilters = {
        cats: `
        <div class="mb-3">
          <label for="colorSelect" class="form-label">Color</label>
          <select id="colorSelect" class="form-select" multiple>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="brown">Brown</option>
          </select>
          <small class="form-text text-muted">Hold Ctrl (Cmd on Mac) to select multiple colors</small>
        </div>
      `,
        dogs: `
        <div class="mb-3">
          <label for="breedSelect" class="form-label">Breed</label>
          <select id="breedSelect" class="form-select">
            <option value="labrador">Labrador</option>
            <option value="bulldog">Bulldog</option>
            <option value="beagle">Beagle</option>
          </select>
        </div>
      `,
        birds: `
        <div class="mb-3">
          <label for="sizeSelect" class="form-label">Size</label>
          <select id="sizeSelect" class="form-select">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      `,
    };

    // Function to update filters dynamically
    const updateFilters = () => {
        const selectedSpecies = speciesSelect.value;
        additionalFilters.innerHTML = speciesFilters[selectedSpecies] || '';
    };

    // Event listener for species selection
    speciesSelect.addEventListener('change', () => {
        updateFilters();

        // Optionally: Make an API call to load data for the selected species
        const selectedSpecies = speciesSelect.value;
        const apiUrl = `/api/pets?species=${selectedSpecies}`;
        console.log(`Fetching data from: ${apiUrl}`);
        // Fetch the API or update UI accordingly
    });

    // Event listener for form submission
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(filterForm);
        const queryParams = new URLSearchParams(formData).toString();
        const apiUrl = `/api/pets?${queryParams}`;
        console.log(`Searching with filters: ${apiUrl}`);
        // Perform API call or UI update
    });

    // Initialize filters on page load
    updateFilters();
});
