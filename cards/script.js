class CardManager {
    constructor() {
        this.cards = [];
        this.container = document.getElementById('cardGrid');
        this.baseUrl = 'data';
        this.loadCardsFromDirectory();
        
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

    parseFileName(fileName) {
        // Remove file extension
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
        const [name, tier, tag] = nameWithoutExt.split('-');
        
        return {
            fileName,
            name,
            tier,
            tag,
            imagePath: fileName
        };
    }

    async loadCardsFromDirectory() {
        try {
            // Get list of files from data directory
            const response = await fetch(this.baseUrl);
            const files = await response.text();
            
            // Parse HTML response to get image files
            const parser = new DOMParser();
            const doc = parser.parseFromString(files, 'text/html');
            const imageFiles = Array.from(doc.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.match(/\.(jpg|jpeg|png)$/i))
                .map(href => href.split('/').pop());

            // Parse each filename into card data
            this.cards = imageFiles.map(fileName => {
                const cardData = this.parseFileName(fileName);
                return {
                    ...cardData,
                    imagePath: `${this.baseUrl}/${fileName}`
                };
            });

            console.log('Cards loaded:', this.cards);
            this.renderCards();
            
            // Update filter options based on found tags
            this.updateFilterOptions();
        } catch (error) {
            console.error('Failed to load cards:', error);
            this.container.innerHTML = '<p>Error loading cards. Please try again later.</p>';
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
