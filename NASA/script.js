const API_KEY = "OlBKOYTgvD7M6yDlr5mSoPqu8sXVsdf8cbSzNP2V"; 
const currentImageContainer = document.getElementById("current-image-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchHistory = document.getElementById("search-history");

// Fetch and display the current image of the day
async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${currentDate}`);
        const data = await response.json();
        displayImage(data);
    } catch (error) {
        console.error("Failed to fetch the current image:", error);
    }
}

// Fetch and display the image for a specific date
async function getImageOfTheDay(date) {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`);
        const data = await response.json();
        displayImage(data);
        saveSearch(date);
        addSearchToHistory();
    } catch (error) {
        console.error("Failed to fetch the image for the date:", error);
    }
}

// Display image and description
function displayImage(data) {
    const imageDisplay = document.getElementById("image-display");
    imageDisplay.innerHTML = `
        <h3>${data.title}</h3>
        <img src="${data.url}" alt="${data.title}">
        <p>${data.explanation}</p>
    `;
}

// Save the date to local storage
function saveSearch(date) {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}

// Add search history to the UI
function addSearchToHistory() {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    searchHistory.innerHTML = "";
    searches.forEach((date) => {
        const listItem = document.createElement("li");
        listItem.textContent = date;
        listItem.addEventListener("click", () => getImageOfTheDay(date));
        searchHistory.appendChild(listItem);
    });
}

// Handle form submission
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedDate = searchInput.value;
    if (selectedDate) {
        getImageOfTheDay(selectedDate);
    }
});

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    searchInput.max = new Date().toISOString().split("T")[0];
    getCurrentImageOfTheDay();
    addSearchToHistory();
});
