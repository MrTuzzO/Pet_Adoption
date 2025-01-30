// Function to dynamically load the Bird post form
function BirdForm() {
    if (!localStorage.getItem("authToken")) {
        window.location.href = 'login.html';
        return;
    }

    const formHtml = `
    <form id="bird-post-form" enctype="multipart/form-data">
        <div class="mb-3 row">
            <div class="col-md-6">
                <label for="bird-name" class="form-label">Bird Name</label>
                <input type="text" class="form-control" id="bird-name" placeholder="Enter bird's name" required>
            </div>
            <div class="col-md-6">
                <label for="bird-gender" class="form-label">Bird Gender</label>
                <select class="form-select" id="bird-gender" required>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                </select>
            </div>
        </div>

        <div class="mb-3 row">
            <div class="col-md-6">
                <label for="pet-year" class="form-label">Bird Age (Years)</label>
                <input type="number" class="form-control" id="pet-year" placeholder="Years" min="0" required>
            </div>
            <div class="col-md-6">
                <label for="pet-month" class="form-label">Bird Age (Months)</label>
                <input type="number" class="form-control" id="pet-month" placeholder="Months" min="0" required>
            </div>
        </div>

        <div class="mb-3 row">
            <div class="col-md-6">
                <label for="bird-location" class="form-label">Location</label>
                <input type="text" class="form-control" id="bird-location" placeholder="Enter location" required>
            </div>
            <div class="col-md-6">
                <label for="bird-food-habit" class="form-label">Food Habit</label>
                <input type="text" class="form-control" id="bird-food-habit" placeholder="Enter food habit" required>
            </div>
        </div>

         <div class="mb-3 row">
            <div class="col-md-6">
                <label for="bird-size" class="form-label">Size</label>
                <select class="form-select" id="bird-size" required>
                    <option value="Tiny">Tiny (&lt;5kg)</option>
                        <option value="Small">Small (&lt;50g)</option>
                        <option value="Medium">Medium (50g-300g)</option>
                        <option value="Large">Large (&gt;300g)</option>
                </select>
            </div>
            <div class="col-md-6">
                <label for="bird-adoption-cost" class="form-label">Adoption Cost</label>
                <input type="number" class="form-control" id="bird-adoption-cost" placeholder="Enter adoption cost" value="0">
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-6">
                <label for="bird-diet" class="form-label">Diet</label>
                <select class="form-select" id="bird-diet" required>
                    <option value="Herbivore">Herbivore (Fruits, seeds, vegetables)</option>
                    <option value="Omnivore">Omnivore (Fruits, seeds, insects)</option>
                </select>
            </div>
            <div class="col-md-6">
                 <label for="bird-species" class="form-label">Species</label>
                <input type="text" class="form-control" id="bird-species" placeholder="Enter bird's species" required>
            </div>
        </div>

        <div class="mb-3">
            <label for="bird-description" class="form-label">Description</label>
            <textarea class="form-control" id="bird-description" rows="3" placeholder="Enter a short description"></textarea>
        </div>


        <div class="mb-3">
            <label for="bird-colors" class="form-label">Bird Colors</label>
            <select class="form-select" id="bird-colors" multiple required></select>
        </div>

        <div class="mb-3">
            <label for="bird-image-1" class="form-label">Upload Main Image</label>
            <input type="file" class="form-control" id="bird-image-1" accept="image/*" required onchange="showPreview(this, 'main-image-preview')">
            <img id="main-image-preview" class="mt-3" style="max-width: 100%; height: auto; display: none;">
        </div>

        <div id="additional-images-container" class="mb-3"></div>

        <button type="button" class="btn btn-secondary mb-3" id="add-more-images-btn">Add More Images</button>

        <button type="submit" class="btn btn-primary w-100">Submit</button>
    </form>
    `;
    document.getElementById('post-form').innerHTML = formHtml;

    loadColorOptions("bird-colors");

    // Now attach the "Add More Images" button logic
    const addMoreImagesBtn = document.getElementById('add-more-images-btn');
    const additionalImagesContainer = document.getElementById('additional-images-container');
    let imageCount = 1; // Start from 1 for additional images (main image is already present)

    addMoreImagesBtn.addEventListener('click', () => {
        if (imageCount < 4) {
            imageCount++;

            // Create a new div for the image input and preview
            const newImageDiv = document.createElement('div');
            newImageDiv.classList.add('mb-3');
            newImageDiv.innerHTML = `
                <label for="bird-image-${imageCount}" class="form-label">Upload Additional Image ${imageCount - 1}</label>
                <input type="file" class="form-control" id="bird-image-${imageCount}" accept="image/*" onchange="showPreview(this, 'image-preview-${imageCount}')">
                <img id="image-preview-${imageCount}" class="mt-3" style="max-width: 100%; height: auto; display: none;">
            `;
            additionalImagesContainer.appendChild(newImageDiv);
        }

        if (imageCount === 4) {
            addMoreImagesBtn.disabled = true; // Disable the button after 3 additional images are added
        }
    });
}


// Show image preview
function showPreview(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.style.display = 'none';
    }
}

document.getElementById("post-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const loader = document.getElementById('loader');
    loader.classList.remove('d-none'); // Show loader

    const formData = new FormData();
    formData.append("name", document.getElementById("bird-name").value);
    formData.append("year", document.getElementById("pet-year").value);
    formData.append("month", document.getElementById("pet-month").value);
    formData.append("gender", document.getElementById("bird-gender").value);
    formData.append("location", document.getElementById("bird-location").value);
    formData.append("description", document.getElementById("bird-description").value);
    formData.append("food_habit", document.getElementById("bird-food-habit").value);
    formData.append("size", document.getElementById("bird-size").value);
    formData.append("species", document.getElementById("bird-species").value);
    formData.append("diet", document.getElementById("bird-diet").value);
    formData.append("adoption_cost", document.getElementById("bird-adoption-cost").value);

    // Append selected colors
    const selectedColors = Array.from(document.getElementById("bird-colors").selectedOptions).map(option => option.value);
    selectedColors.forEach(color => formData.append("colors", color));

    // Append images if provided
    const imageFields = ["bird-image-1", "bird-image-2", "bird-image-3", "bird-image-4"];
    imageFields.forEach((field, index) => {
        const fileInput = document.getElementById(field);
        if (fileInput && fileInput.files[0]) {
            formData.append(`image_${index + 1}`, fileInput.files[0]);
        }
    });
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        showAlert("Please log in to continue.", 'danger');
        window.location.href = 'login.html';
        loader.classList.add('d-none');
        return;
    }

    try {
        const response = await fetch("https://pet-adoption-omega-seven.vercel.app/api/pet/birds/", {
            method: "POST",
            headers: {
                'Authorization': `Token ${authToken}`
            },
            body: formData
        });

        const responseBody = await response.json();

        if (response.ok) {
            showAlert("Bird posted successfully!", 'success');
            document.getElementById("bird-post-form").reset();
            setInterval(() => {
                window.location.href = `/birds_details.html?id=${responseBody.id}`;
            }, 2000);
        } else {
            const errorMessages = Object.entries(responseBody)
                .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                .join('');
            showAlert(errorMessages || "Failed to post bird.", 'danger');
        }
    } catch (error) {
        console.error("Error posting bird:", error.message);
        showAlert(`Error: ${error.message}`, 'danger');
    } finally {
        loader.classList.add('d-none');
    }
});
