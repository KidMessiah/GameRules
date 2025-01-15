document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.canvas-container');
    const app = new PIXI.Application({
        width: 900,
        height: 200, // Even smaller initial height
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        antialias: true
    });
    container.appendChild(app.view);

    // Constants
    const MIN_DIAGRAM_WIDTH = 250;

    function createCard(text) {
        const container = new PIXI.Container();
        
        // Card background
        const card = new PIXI.Graphics();
        const width = 50;
        const height = 70;
        const radius = 5;

        // Draw shadow
        const shadow = new PIXI.Graphics();
        shadow.beginFill(0x000000, 0.3);
        shadow.drawRoundedRect(2, 5, width, height, radius);
        shadow.endFill();
        shadow.filters = [new PIXI.BlurFilter(2)];
        container.addChild(shadow);

        // Draw card
        card.lineStyle(1, 0x000000);
        card.beginFill(0xFFFFFF);
        card.drawRoundedRect(0, 0, width, height, radius);
        card.endFill();
        container.addChild(card);

        // Add text with new positioning
        const textSprite = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x000000
        });
        textSprite.position.set(5, 5); // Position text in top left with 5px padding
        container.addChild(textSprite);

        return container;
    }

    function calculateDiagramPositions(width) {
        const diagramsPerRow = Math.max(1, Math.floor(width / (MIN_DIAGRAM_WIDTH + 50)));
        const spacing = 50;
        const availableWidth = width - (spacing * (diagramsPerRow - 1));
        const diagramWidth = Math.min(250, availableWidth / diagramsPerRow);
        
        const diagrams = [
            { text: 'Any 4 cards', cards: ['?', '?', '?', '?'] },
            { text: 'Two Tier 2 cards', cards: ['2', '2'] },
            { text: 'One Tier 1 and One Tier 3', cards: ['1', '3'] }
        ];
        
        const rows = Math.ceil(diagrams.length / diagramsPerRow);
        const totalHeight = (rows * 120) + 20; // Reduced spacing between rows and padding
        
        return {
            height: totalHeight,
            positions: diagrams.map((diagram, index) => {
                const row = Math.floor(index / diagramsPerRow);
                const col = index % diagramsPerRow;
                const x = (width - (diagramsPerRow * diagramWidth + (diagramsPerRow - 1) * spacing)) / 2 
                         + col * (diagramWidth + spacing);
                const y = 20 + (row * 120); // Reduced top padding and row spacing
                return { x, y, width: diagramWidth, ...diagram };
            })
        };
    }

    function draw() {
        // Clear stage
        while(app.stage.children[0]) {
            app.stage.removeChild(app.stage.children[0]);
        }

        const { positions, height } = calculateDiagramPositions(app.screen.width);
        app.renderer.resize(app.screen.width, height); // Adjust canvas height

        const computedStyle = getComputedStyle(document.documentElement);
        const highlightColor = computedStyle.getPropertyValue('--highlight-text').trim();

        positions.forEach(pos => {
            // Add title
            const title = new PIXI.Text(pos.text, {
                fontFamily: 'Arial',
                fontSize: 16,
                fontWeight: 'bold',
                fill: highlightColor
            });
            title.anchor.set(0.5, 0);
            title.position.set(pos.x + pos.width/2, pos.y - 20);
            app.stage.addChild(title);

            // Add cards
            const cardWidth = 50;
            const cardSpacing = 30;
            const totalCardsWidth = (pos.cards.length * cardWidth) + 
                                  ((pos.cards.length - 1) * (cardSpacing - cardWidth));
            const startX = pos.x + (pos.width - totalCardsWidth) / 2;

            pos.cards.forEach((cardText, i) => {
                const card = createCard(cardText);
                card.position.set(startX + (i * cardSpacing), pos.y);
                app.stage.addChild(card);
            });
        });
    }

    // Handle window resizing
    function resize() {
        const parent = app.view.parentElement;
        app.renderer.resize(parent.clientWidth, app.screen.height);
        draw();
    }

    window.addEventListener('resize', resize);
    resize();

    // Handle theme changes
    const observer = new MutationObserver(() => draw());
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});
