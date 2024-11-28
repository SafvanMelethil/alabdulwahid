const fileInput = document.getElementById('fileInput');
const addButton = document.getElementById('addButton');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close');

// Open IndexedDB
const request = indexedDB.open('MediaGallery', 1);

let db;

request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains('media')) {
        db.createObjectStore('media', { keyPath: 'id', autoIncrement: true });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadGallery();
};

request.onerror = (event) => {
    console.error('IndexedDB error:', event.target.error);
};

// Add file to IndexedDB and gallery
addButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file!');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const transaction = db.transaction('media', 'readwrite');
        const store = transaction.objectStore('media');
        const data = {
            type: file.type,
            content: e.target.result,
        };
        store.add(data);

        transaction.oncomplete = () => {
            console.log('File added to IndexedDB');
            displayItem(file.type, e.target.result);
        };
    };

    reader.onerror = (error) => {
        console.error('File reading error:', error);
        alert('Failed to read the file!');
    };

    reader.readAsDataURL(file);
});

// Load gallery from IndexedDB
function loadGallery() {
    const transaction = db.transaction('media', 'readonly');
    const store = transaction.objectStore('media');
    const request = store.getAll();

    request.onsuccess = () => {
        const items = request.result;
        console.log('Loaded items:', items);
        items.forEach((item) => displayItem(item.type, item.content));
    };

    request.onerror = (error) => {
        console.error('Failed to load items:', error);
    };
}

// Display an item in the gallery
function displayItem(type, data) {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    let media;
    if (type.startsWith('image')) {
        media = `<img src="${data}" alt="Image">`;
    } else if (type.startsWith('video')) {
        media = `<video src="${data}" controls></video>`;
    } else {
        console.error('Unsupported file type:', type);
        return;
    }

    item.innerHTML = `
        ${media}
        <button class="delete-btn">&times;</button>
    `;

    item.querySelector('img, video').addEventListener('click', () => {
        modal.style.display = 'flex';
        modalContent.innerHTML = media;
    });

    item.querySelector('.delete-btn').addEventListener('click', () => {
        item.remove();
        deleteFromDB(data);
    });

    gallery.appendChild(item);
}

// Delete item from IndexedDB
function deleteFromDB(content) {
    const transaction = db.transaction('media', 'readwrite');
    const store = transaction.objectStore('media');

    const request = store.getAll();

    request.onsuccess = () => {
        const items = request.result;
        const itemToDelete = items.find((item) => item.content === content);
        if (itemToDelete) {
            store.delete(itemToDelete.id);
            console.log('Item deleted from IndexedDB');
        }
    };

    request.onerror = (error) => {
        console.error('Error deleting item:', error);
    };
}

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalContent.innerHTML = '';
});
