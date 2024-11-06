// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {  // Ensure this matches your server address
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    })
    .then(data => {
        if (data.success) {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            loadContent();
        } else {
            alert('Invalid credentials');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Logout function
function logout() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    location.reload();
}

// Load all content (images, announcements, events) on login
function loadContent() {
    loadImages();
    loadAnnouncements();
    loadEvents();
}

// Load slideshow images
function loadImages() {
    fetch('http://localhost:3000/get-images')
        .then(response => response.json())
        .then(images => {
            updateImageGallery(images);
        });
}

// Display images in the gallery with a delete button
function updateImageGallery(images) {
    const imageGallery = document.getElementById('imageGallery');
    imageGallery.innerHTML = '';

    images.forEach(image => {
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('image-item');

        const img = document.createElement('img');
        img.src = `/image/${image}`;
        img.alt = 'Slideshow Image';
        
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-btn');
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => removeImage(image);

        imageDiv.appendChild(img);
        imageDiv.appendChild(removeBtn);
        imageGallery.appendChild(imageDiv);
    });
}

// Upload a new slideshow image, restricted to a maximum of 4 images
function uploadImage() {
    const fileInput = document.getElementById('uploadImage');
    if (fileInput.files.length === 0) return;

    fetch('http://localhost:3000/get-images')
        .then(response => response.json())
        .then(images => {
            if (images.length < 4) {
                const formData = new FormData();
                formData.append('image', fileInput.files[0]);

                fetch('http://localhost:3000/upload-image', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        loadImages();
                        fileInput.value = ''; // Clear the file input
                    } else {
                        alert('Failed to upload image');
                    }
                });
            } else {
                alert('Maximum of 4 images allowed.');
            }
        });
}

// Remove an image from the slideshow
function removeImage(imageName) {
    fetch(`http://localhost:3000/remove-image?name=${imageName}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) loadImages();
            else alert('Failed to remove image');
        });
}

// Load existing announcements
function loadAnnouncements() {
    fetch('http://localhost:3000/get-announcements')
        .then(response => response.json())
        .then(data => {
            document.getElementById('announcement1').value = data.announcements[0] || '';
            document.getElementById('announcement2').value = data.announcements[1] || '';
            document.getElementById('announcement3').value = data.announcements[2] || '';
        });
}

// Save updated announcements to the server
function saveAnnouncements() {
    const announcements = [
        document.getElementById('announcement1').value,
        document.getElementById('announcement2').value,
        document.getElementById('announcement3').value,
    ];

    fetch('http://localhost:3000/update-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcements })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) alert('Announcements saved');
        else alert('Failed to save announcements');
    });
}

// Load latest events
function loadEvents() {
    fetch('http://localhost:3000/get-events')
        .then(response => response.json())
        .then(data => {
            document.getElementById('latestEvents').value = data.latestEvents || '';
        });
}

// Save updated events to the server
function saveEvents() {
    const latestEvents = document.getElementById('latestEvents').value;

    fetch('http://localhost:3000/update-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latestEvents })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) alert('Events saved');
        else alert('Failed to save events');
    });
}

// Event listeners
document.getElementById('uploadImage').addEventListener('change', uploadImage);
document.getElementById('saveAnnouncements').addEventListener('click', saveAnnouncements);
document.getElementById('saveEvents').addEventListener('click', saveEvents);

document.addEventListener('DOMContentLoaded', () => {
    loadContent(); // Load all content when the page is ready
});
