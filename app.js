const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

const themeToggler = document.getElementById("theme-toggler");
const body = document.body;

// Fetch data
async function searchWikipedia(query) {
  const encodedQuery = encodeURIComponent(query);

  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodedQuery}&gsrlimit=10&prop=pageimages|info&inprop=url&pithumbsize=200&format=json&origin=*`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

// Display results
function displayResults(data) {
  searchResults.innerHTML = "";

  if (!data.query || !data.query.pages) {
    searchResults.innerHTML = "<p>No results found.</p>";
    return;
  }

  const pages = Object.values(data.query.pages);

  pages.forEach((page, index) => {
    const url = page.fullurl;
    const image = page.thumbnail
      ? page.thumbnail.source
      : "https://via.placeholder.com/120";

    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.style.animationDelay = `${index * 0.1}s`;

    resultItem.innerHTML = `
      <img src="${image}" class="result-image" />
      <div class="result-content">
        <h3 class="result-title">
          <a href="${url}" target="_blank">${page.title}</a>
        </h3>
        <a href="${url}" class="result-link" target="_blank">${url}</a>
      </div>
    `;

    searchResults.appendChild(resultItem);
  });
}

// Search event
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    searchResults.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  // Simple loading text
  searchResults.innerHTML = "<div class='spinner'>Loading...</div>";

  try {
    const data = await searchWikipedia(query);
    displayResults(data);
  } catch (error) {
    console.error(error);
    searchResults.innerHTML =
      "<p>Error fetching results. Try again later.</p>";
  }
});

// Theme toggle
themeToggler.addEventListener("click", () => {
  body.classList.toggle("dark-theme");

  themeToggler.textContent = body.classList.contains("dark-theme")
    ? "Dark"
    : "Light";
});