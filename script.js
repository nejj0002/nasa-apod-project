const apiKey = 'DEMO_KEY';
const searchBtn = document.getElementById('search-btn');
const saveBtn = document.getElementById('save-btn');
const searchInput = document.getElementById('search-input');
const imageContainer = document.getElementById('current-image-container');
const favoritesList = document.getElementById('favorites-list');

// 1. Initial Load: Get today's image
window.onload = () => {
    const today = new Date().toISOString().split('T')[0];
    getSelectedItem(today);
    addSearchToHistory();
};

// 2. Search Button Click
searchBtn.addEventListener('click', () => {
    const date = searchInput.value;
    if (date) getSelectedItem(date);
});

// 3. Save Button Click
saveBtn.addEventListener('click', () => {
    const date = searchInput.value || new Date().toISOString().split('T')[0];
    saveSearch(date);
});

async function getSelectedItem(date) {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`);
        const data = await response.json();
        
        // Update UI with NASA data
        imageContainer.innerHTML = `
            <h1>${data.title}</h1>
            <p><strong>Date:</strong> ${data.date}</p>
            <img src="${data.url}" alt="${data.title}">
            <p>${data.explanation}</p>
        `;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function saveSearch(date) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(date)) {
        favorites.push(date);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        addSearchToHistory();
    }
}

function addSearchToHistory() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesList.innerHTML = '';
    favorites.forEach(date => {
        const li = document.createElement('li');
        li.textContent = date;
        li.onclick = () => getSelectedItem(date);
        favoritesList.appendChild(li);
    });
}