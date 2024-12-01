const uploadTrigger = document.getElementById('upload-trigger');
const modal = document.getElementById('upload-modal');
const closeModal = document.getElementById('close-modal');
const form = document.getElementById('upload-form');
const gridContainer = document.getElementById('grid-container');

// Fullscreen modal for media preview
const fullScreenModal = document.createElement('div');
fullScreenModal.classList.add('fullscreen-modal');
document.body.appendChild(fullScreenModal);

fullScreenModal.innerHTML = `
  <div class="fullscreen-content">
    <span class="close-fullscreen">&times;</span>
    <div id="fullscreen-media"></div>
  </div>
`;

// Close fullscreen modal
fullScreenModal.querySelector('.close-fullscreen').addEventListener('click', () => {
  fullScreenModal.style.display = 'none';
});

// Load media from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const storedMedia = JSON.parse(localStorage.getItem('mediaData')) || [];
  storedMedia.forEach((mediaData) => addMediaToGrid(mediaData));
});

// Open modal on clicking the upload trigger
uploadTrigger.addEventListener('click', () => {
  modal.style.display = 'flex';
});

// Close modal on clicking the close button
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const mediaInput = document.getElementById('media');
  const name = document.getElementById('uploader-name').value;
  const details = document.getElementById('uploader-details').value;

  if (mediaInput.files.length === 0) {
    alert('Please select a file.');
    return;
  }

  const file = mediaInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
    const mediaData = {
      src: reader.result, // Store the Base64 data
      type: mediaType,
      name: name,
      details: details,
    };

    // Add media to grid
    addMediaToGrid(mediaData);

    // Save media data to localStorage
    saveMediaToLocalStorage(mediaData);

    modal.style.display = 'none';
    form.reset();
  };

  reader.readAsDataURL(file);
});

// Add media to the grid
function addMediaToGrid(mediaData) {
  const slot = document.createElement('div');
  slot.classList.add('grid-item');
  slot.innerHTML = `
    ${
      mediaData.type === 'image'
        ? `<img src="${mediaData.src}" alt="${mediaData.name}">`
        : `<video src="${mediaData.src}" muted></video>`
    }
    <div class="action-buttons">
      <button class="action-button delete-btn">Delete</button>
    </div>
  `;

  gridContainer.appendChild(slot);

  // Handle delete action
  slot.querySelector('.delete-btn').addEventListener('click', () => {
    slot.remove();
    deleteMediaFromLocalStorage(mediaData.src);
  });

  // Handle full-screen view
  slot.addEventListener('click', (e) => {
    if (!e.target.classList.contains('action-button')) {
      const fullscreenContent = document.getElementById('fullscreen-media');
      fullscreenContent.innerHTML =
        mediaData.type === 'image'
          ? `<img src="${mediaData.src}" alt="${mediaData.name}" style="width: 100%; height: auto;">`
          : `<video src="${mediaData.src}" controls autoplay style="width: 100%; height: auto;"></video>`;
      fullScreenModal.style.display = 'flex';
    }
  });
}

// Save media data to localStorage
function saveMediaToLocalStorage(mediaData) {
  const storedMedia = JSON.parse(localStorage.getItem('mediaData')) || [];
  storedMedia.push(mediaData);
  localStorage.setItem('mediaData', JSON.stringify(storedMedia));
}

// Delete media from localStorage
function deleteMediaFromLocalStorage(src) {
  const storedMedia = JSON.parse(localStorage.getItem('mediaData')) || [];
  const updatedMedia = storedMedia.filter((media) => media.src !== src);
  localStorage.setItem('mediaData', JSON.stringify(updatedMedia));
}


// Add click functionality for each tab
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    alert(`You clicked on: ${tab.textContent.trim()}`);
  });
});

// Add click functionality for dropdown items
document.querySelectorAll('.dropdown li a').forEach(item => {
  item.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    alert(`Dropdown item clicked: ${item.textContent}`);
  });
});



const swiper = new Swiper('.services-2 .swiper', {
  loop: true,
  direction: 'horizontal', // Set the direction
  slidesPerView: 'auto', // Adjust as per layout
  spaceBetween: 40, // Space between slides
  navigation: {
    nextEl: '.js-custom-next',
    prevEl: '.js-custom-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  autoplay: {
    delay: 2500, // Autoplay delay (milliseconds)
    disableOnInteraction: false, // Keeps autoplay running after user interaction
  },
});

// Add hover event listeners to the images
const swiperImages = document.querySelectorAll('.services-2 .service-item img');

swiperImages.forEach((image) => {
  // Stop autoplay on mouse enter
  image.addEventListener('mouseenter', () => {
    swiper.autoplay.stop();
    console.log('Autoplay stopped');
  });

  // Restart autoplay on mouse leave
  image.addEventListener('mouseleave', () => {
    swiper.autoplay.start();
    console.log('Autoplay started');
  });
});

