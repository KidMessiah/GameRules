document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.canvas-container');
    const app = new PIXI.Application({
        width: container.clientWidth,
        height: container.clientHeight,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        antialias: true
    });
    container.appendChild(app.view);

    const MIN_DIAGRAM_WIDTH = 250;

    const createCard = (text) => {
        const container = new PIXI.Container();
        const card = new PIXI.Graphics();
        const shadow = new PIXI.Graphics();
        const width = 50, height = 70, radius = 5;

        shadow.beginFill(0x000000, 0.3)
              .drawRoundedRect(2, 5, width, height, radius)
              .endFill();
        shadow.filters = [new PIXI.BlurFilter(2)];
        container.addChild(shadow);

        card.lineStyle(1, 0x000000)
            .beginFill(0xFFFFFF)
            .drawRoundedRect(0, 0, width, height, radius)
            .endFill();
        container.addChild(card);

        const textSprite = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x000000
        });
        textSprite.position.set(5, 5);
        container.addChild(textSprite);

        return container;
    };

    const calculateDiagramPositions = (width) => {
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
        const totalHeight = (rows * 120) + 20;

        return {
            height: totalHeight,
            positions: diagrams.map((diagram, index) => {
                const row = Math.floor(index / diagramsPerRow);
                const col = index % diagramsPerRow;
                const x = (width - (diagramsPerRow * diagramWidth + (diagramsPerRow - 1) * spacing)) / 2 
                         + col * (diagramWidth + spacing);
                const y = 20 + (row * 120);
                return { x, y, width: diagramWidth, ...diagram };
            })
        };
    };

    const draw = () => {
        app.stage.removeChildren();
        const { positions, height } = calculateDiagramPositions(container.clientWidth);
        app.renderer.resize(container.clientWidth, height);

        const highlightColor = getComputedStyle(document.documentElement).getPropertyValue('--highlight-text').trim();

        positions.forEach(pos => {
            const title = new PIXI.Text(pos.text, {
                fontFamily: 'Arial',
                fontSize: 16,
                fontWeight: 'bold',
                fill: highlightColor
            });
            title.anchor.set(0.5, 0);
            title.position.set(pos.x + pos.width / 2, pos.y - 20);
            app.stage.addChild(title);

            const cardWidth = 50;
            const cardSpacing = 30;
            const totalCardsWidth = (pos.cards.length * cardWidth) + ((pos.cards.length - 1) * (cardSpacing - cardWidth));
            const startX = pos.x + (pos.width - totalCardsWidth) / 2;

            pos.cards.forEach((cardText, i) => {
                const card = createCard(cardText);
                card.position.set(startX + (i * cardSpacing), pos.y);
                app.stage.addChild(card);
            });
        });
    };

    const resize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        app.renderer.resize(width, height);
        draw();
    };

    window.addEventListener('resize', resize);
    resize();

    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});
