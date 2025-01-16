class CardManager {
    constructor() {
        this.cards = [];
        this.container = document.getElementById('cardGrid');
        this.loadCardsFromJson();
        
        // Add placeholder image data URL
        this.placeholderImage = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">
                <rect width="200" height="280" fill="#f0f0f0"/>
                <text x="50%" y="50%" fill="#666" font-family="Arial" font-size="16" text-anchor="middle">
                    Image Not Found
                </text>
            </svg>
        `);

        this.overlay = document.getElementById('overlay');
        this.setupOverlay();
    }

    async loadCardsFromJson() {
        try {
            const response = await fetch('cards.json');
            if (!response.ok) {
                throw new Error('Failed to fetch cards.json');
            }
            // Remove the last two example cards from the loaded data
            this.cards = (await response.json()).filter(card => 
                !card.name.startsWith('Example Card')
            );
            console.log('Cards loaded:', this.cards);
            this.renderCards();
            this.updateFilterOptions();
        } catch (error) {
            console.error('Failed to load cards:', error);
            this.container.innerHTML = '<p>Error loading cards: ' + error.message + '</p>';
        }
    }

    updateFilterOptions() {
        const filterSelect = document.getElementById('filterType');
        const tierSelect = document.getElementById('filterTier');
        
        // Get unique tags and tiers
        const tags = [...new Set(this.cards.map(card => card.tag))];
        const tiers = [...new Set(this.cards.map(card => card.tier))].sort();
        
        // Update tag options
        filterSelect.innerHTML = '<option value="all">All Types</option>';
        tags.forEach(tag => {
            filterSelect.innerHTML += `<option value="${tag}">${tag}</option>`;
        });
        
        // Update tier options
        tierSelect.innerHTML = '<option value="all">All Tiers</option>';
        tiers.forEach(tier => {
            tierSelect.innerHTML += `<option value="${tier}">Tier ${tier}</option>`;
        });
    }

    searchCards(searchText, filterType, filterTier) {
        return this.cards.filter(card => {
            const matchesSearch = card.name.toLowerCase().includes(searchText.toLowerCase());
            const matchesType = filterType === 'all' || card.tag === filterType;
            const matchesTier = filterTier === 'all' || card.tier === filterTier;
            return matchesSearch && matchesType && matchesTier;
        });
    }

    renderCards(filteredCards = this.cards) {
        this.container.innerHTML = '';
        
        // Group cards by tier
        const cardsByTier = filteredCards.reduce((groups, card) => {
            const tier = card.tier;
            if (!groups[tier]) {
                groups[tier] = [];
            }
            groups[tier].push(card);
            return groups;
        }, {});

        // Sort tiers numerically
        const sortedTiers = Object.keys(cardsByTier).sort((a, b) => Number(a) - Number(b));
        
        // Render each tier group
        sortedTiers.forEach(tier => {
            // Create tier header
            const tierHeader = document.createElement('div');
            tierHeader.className = 'tier-header';
            tierHeader.innerHTML = `<h2>Tier ${tier}</h2>`;
            this.container.appendChild(tierHeader);
            
            // Create card container for this tier
            const tierContainer = document.createElement('div');
            tierContainer.className = 'tier-container';
            
            // Render cards for this tier
            cardsByTier[tier].forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.dataset.name = card.name;
                cardElement.dataset.tier = card.tier;
                cardElement.dataset.tag = card.tag;
                
                const img = document.createElement('img');
                img.src = card.imagePath;
                img.alt = card.name;
                img.loading = 'lazy';
                
                // Add click handler for overlay
                cardElement.addEventListener('click', () => {
                    this.showOverlay(card.imagePath);
                });
                
                img.onerror = () => {
                    console.error(`Failed to load image: ${card.imagePath}`);
                    img.src = this.placeholderImage;
                    img.alt = 'Image not found';
                };

                cardElement.appendChild(img);
                tierContainer.appendChild(cardElement);
            });
            
            this.container.appendChild(tierContainer);
        });
    }

    setupOverlay() {
        // Close overlay when clicking anywhere on it
        this.overlay.addEventListener('click', () => {
            this.overlay.classList.remove('active');
        });
    }

    showOverlay(imagePath) {
        const img = this.overlay.querySelector('img');
        img.src = imagePath;
        this.overlay.classList.add('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cardManager = new CardManager();
    
    // Setup search handler
    document.getElementById('searchButton').addEventListener('click', () => {
        const searchText = document.getElementById('searchInput').value;
        const filterType = document.getElementById('filterType').value;
        const filterTier = document.getElementById('filterTier').value;
        const filteredCards = cardManager.searchCards(searchText, filterType, filterTier);
        cardManager.renderCards(filteredCards);
    });
});

// Add theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Function to update theme and button text
function updateTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('theme', theme);
}

// Set initial theme
const initialTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
updateTheme(initialTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
});