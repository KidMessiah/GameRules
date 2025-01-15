document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('card-container');
    container.style.width = '100%'; // Set container width to 100% for responsiveness
    container.style.maxWidth = '600px'; // Set a max-width for larger screens
    container.style.margin = '0 auto'; // Center the container
    
    function initializeCard() {
        // Clear existing content
        container.innerHTML = '';

        // Create image element for the card
        const cardImage = document.createElement('img');
        cardImage.src = 'Stepmotherclean.png'; // Update with the correct path
        cardImage.alt = 'Card Image';
        cardImage.style.width = '100%';
        cardImage.style.height = 'auto';
        cardImage.style.display = 'block';
        cardImage.style.margin = '0 auto';

        // Append the image to the container
        container.appendChild(cardImage);

        // Create overlay for hover tips
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.pointerEvents = 'none'; // Allow clicks to pass through
        container.style.position = 'relative'; // Ensure container is positioned

        // Define hover tip areas
        const hoverAreas = [
            { left: '0', top: '0', width: '100%', height: '3%', content: 'Tip 1' }, // Top frame
            { left: '0', top: '97.5%', width: '100%', height: '2.5%', content: 'Tip 1' }, // Bottom frame
            { left: '0', top: '3%', width: '4%', height: '94.34%', content: 'Tip 1' }, // Left frame
            { left: '96%', top: '3%', width: '4%', height: '94.34%', content: 'Tip 1' }, // Right frame
            { left: '6%', top: '5%', width: '8%', height: '5%', content: 'Tip 2' }, // Tier Frame
            { left: '20%', top: '12%', width: '60%', height: '6%', content: 'Tip 3'}, // Title
            { left: '8%', top: '65%', width: '55%', height: '4%', content: 'Tip 3' }, // Atkdef
            { left: '19%', top: '95%', width: '13%', height: '2%', content: 'Tip 3' }, // Family
            { left: '8%', top: '69.1%', width: '84%', height: '20%', content: 'Tip 3' }, //Effect
            { left: '86%', top: '45%', width: '14%', height: '9.7%', content: 'Tip 3' }, //Arrow right
            { left: '43%', top: '90%', width: '14%', height: '10%', content: 'Bottom Arrow' } //Arrow Down
        ];

        hoverAreas.forEach(area => {
            const tip = document.createElement('div');
            tip.style.position = 'absolute';
            tip.style.left = area.left;
            tip.style.top = area.top;
            tip.style.width = area.width;
            tip.style.height = area.height;
            tip.style.pointerEvents = 'auto'; // Enable hover events
            tip.style.border = '0px dotted red'; // Add dotted red border
            tip.setAttribute('data-tippy-content', area.content);
            overlay.appendChild(tip);
        });

        // Append overlay to the container
        container.appendChild(overlay);

        // Initialize Tippy.js with followCursor option
        tippy('[data-tippy-content]', {
            followCursor: true
        });
    }

    // Initial setup
    initializeCard();

    // Improved resize handling
    let resizeTimeout;
    const resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initializeCard, 250);
    });

    // Observe both container and its parent
    resizeObserver.observe(container);
    resizeObserver.observe(container.parentElement);
});
