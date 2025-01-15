// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Select the container where the canvas will be placed
    const container = document.querySelector('.canvas-container');
    
    // Create a new PIXI application with specified properties
    const app = new PIXI.Application({
        width: container.clientWidth,
        height: container.clientHeight,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        antialias: true
    });
    
    // Append the PIXI canvas to the container
    container.appendChild(app.view);

    // Define the images to be loaded with their respective positions
    const images = [
        { src: '4cards.png', x: 0, label: 'Any four cards' },
        { src: '13cards.png', x: container.clientWidth / 3, label: 'One Tier 3 card and one Tier 1 card' },
        { src: '22cards.png', x: (container.clientWidth / 3) * 2, label: 'Two Tier 2 cards' }
    ];

    // Function to determine text color based on theme
    const getThemeColor = () => {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--highlight-text').trim();
    };

    // Function to load images and add them to the PIXI stage
    const loadImages = () => {
        images.forEach(image => {
            const container = new PIXI.Container();
            const texture = PIXI.Texture.from(image.src);
            
            // Create text with dynamic color
            const text = new PIXI.Text(image.label, {
                fontFamily: 'Calibri',
                fontSize: 24,
                fill: getThemeColor(),
                fontWeight: 'bold',
                align: 'center'
            });
            text.anchor.set(0.5, 1); // Center horizontally and align bottom
            
            // When the texture is loaded, create a sprite and add it to the container
            texture.baseTexture.on('loaded', () => {
                const sprite = new PIXI.Sprite(texture);
                sprite.originalWidth = sprite.width;
                sprite.originalHeight = sprite.height;
                
                container.addChild(text);
                container.addChild(sprite);
                app.stage.addChild(container);
                resize();
            });
            
            // Log an error if the texture fails to load
            texture.baseTexture.on('error', () => {
                console.error(`Failed to load image: ${image.src}`);
            });
        });
    };

    // Function to resize the canvas and redraw the images
    const resize = () => {
        const textColor = getThemeColor();
        const width = container.clientWidth;
        const textMargin = 30; // Space for text above cards
        
        const minSpacing = 20;
        const totalSpacing = (images.length - 1) * minSpacing;
        const availableWidth = width - totalSpacing;
        const maxCardWidth = availableWidth / images.length;

        let uniformScale = Infinity;
        let maxTextHeight = 0;

        // First pass: calculate scales and text height
        app.stage.children.forEach((container) => {
            const sprite = container.children[1];
            const text = container.children[0];
            
            const scaleW = maxCardWidth / sprite.originalWidth;
            const cardHeight = container.clientHeight || 150; // Default card height
            const scaleH = cardHeight / sprite.originalHeight;
            const scale = Math.min(scaleW, scaleH, 1); // Add maximum scale of 1 to prevent oversizing
            uniformScale = Math.min(uniformScale, scale);
            
            // Update text style to measure height
            text.style.fontSize = Math.max(sprite.originalWidth * uniformScale * 0.15, 12);
            text.style.wordWrap = true;
            text.style.wordWrapWidth = sprite.originalWidth * uniformScale;
            maxTextHeight = Math.max(maxTextHeight, text.height);
        });

        // Calculate total height needed
        const baseCardHeight = 150; // Default card height
        const totalHeight = baseCardHeight + maxTextHeight + textMargin;
        
        // Update canvas dimensions
        app.renderer.resize(width, totalHeight);
        app.view.style.width = `${width}px`;
        app.view.style.height = `${totalHeight}px`;
        container.style.height = `${totalHeight}px`;

        // Second pass: position elements
        app.stage.children.forEach((container, index) => {
            const sprite = container.children[1];
            const text = container.children[0];
            
            sprite.width = sprite.originalWidth * uniformScale;
            sprite.height = sprite.originalHeight * uniformScale;

            // Calculate x position with equal spacing
            const totalCardsWidth = app.stage.children.length * sprite.width;
            const totalSpacing = width - totalCardsWidth;
            const spacing = totalSpacing / (app.stage.children.length + 1);
            
            // Position container
            container.position.x = spacing * (index + 1) + (sprite.width * index);
            container.position.y = totalHeight - sprite.height - textMargin/2;

            // Position and style text
            text.position.x = sprite.width / 2;
            text.position.y = -5;
            text.style.fill = textColor;
        });
    };

    // Load images and add an event listener to handle window resize events
    loadImages();
    window.addEventListener('resize', resize);
    resize();

    // Observe changes to the document's attributes and redraw the images if necessary
    const observer = new MutationObserver(resize);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});
