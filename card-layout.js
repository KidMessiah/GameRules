document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('card-container');
    container.style.width = '300px';
    container.style.height = '420px';
    container.style.margin = '20px auto';
    container.style.position = 'relative';

    const app = new PIXI.Application({
        width: 300,
        height: 420,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
    });

    // Make the canvas background transparent
    app.view.style.background = 'transparent';

    container.appendChild(app.view);

    // Card container
    const card = new PIXI.Container();
    app.stage.addChild(card);

    // Outer border (blue)
    const outerBorder = new PIXI.Graphics();
    outerBorder.lineStyle(0);
    outerBorder.beginFill(0x2196F3);
    outerBorder.drawRoundedRect(0, 0, 300, 420, 8);
    outerBorder.endFill();
    card.addChild(outerBorder);

    // Inner border (orange)
    const innerBorder = new PIXI.Graphics();
    innerBorder.lineStyle(0);
    innerBorder.beginFill(0xFF9800);
    innerBorder.drawRoundedRect(10, 10, 280, 400, 5);
    innerBorder.endFill();
    card.addChild(innerBorder);

    // White content area
    const content = new PIXI.Graphics();
    content.lineStyle(0);
    content.beginFill(0xFFFFFF); // Keep this white always
    content.drawRect(20, 20, 260, 380);
    content.endFill();
    card.addChild(content);

    // Card number (top left)
    const costText = new PIXI.Text('2', {
        fontFamily: 'Calibri',
        fontSize: 28,
        fontWeight: 'bold',
        fill: 0x000000,
    });
    costText.position.set(30, 20);
    card.addChild(costText);

    // Make interactive areas for tooltips
    const createInteractiveArea = (x, y, width, height, tooltipContent) => {
        const area = new PIXI.Graphics();
        area.beginFill(0xFF0000, 0);  // Make it completely transparent
        area.drawRect(x, y, width, height);
        area.endFill();
        area.eventMode = 'static';
        area.cursor = 'help';

        // Create a div element for the tooltip
        const tooltipElement = document.createElement('div');
        tooltipElement.style.position = 'absolute';
        tooltipElement.style.left = x + 'px';
        tooltipElement.style.top = y + 'px';
        tooltipElement.style.width = width + 'px';
        tooltipElement.style.height = height + 'px';
        tooltipElement.style.pointerEvents = 'auto';
        tooltipElement.style.zIndex = '1000';
        container.appendChild(tooltipElement);

        // Create the tooltip with updated options
        tippy(tooltipElement, {
            content: tooltipContent,
            placement: 'right',
            arrow: true,
            animation: 'shift-away',
            followCursor: true,
            inlinePositioning: true,
            maxWidth: 300,
            theme: 'custom',
            delay: [100, 0],
        });

        return area;
    };

    // Cost tooltip
    const costArea = createInteractiveArea(25, 20, 25, 30, 
        'Card Tier: Determines the cost to play this card. See Card Play Costs section for details.');
    card.addChild(costArea);

    // Border tooltip
    const borderTooltipContent = 'This is the border of the card, the colour indicates whether it is a Linked, Trigger, Passive, Active, Normal or Token. Cards with two borders are both types.';

    // Border tooltips
    [
        [0, 0, 300, 20],      // top
        [0, 400, 300, 20],    // bottom
        [0, 20, 20, 380],     // left
        [280, 20, 20, 380]    // right
    ].forEach(([x, y, w, h]) => {
        const borderArea = createInteractiveArea(x, y, w, h, borderTooltipContent);
        card.addChildAt(borderArea, 0);
    });

    // Title tooltip
    const titleArea = createInteractiveArea(75, 25, 145, 30,
        'The name of the card.');
    card.addChild(titleArea);

    // Stats tooltip
    const statsArea = createInteractiveArea(30, 230, 200, 25,
        'This is the attack and defence of the card.');
    card.addChild(statsArea);

    // Effect tooltip
    const effectArea = createInteractiveArea(30, 253, 240, 120,
        'This is the cards effect or description. If there is a listed effect, it works as listed blow. This area determines whether your card is capable of doing anything other than attacking.');
    card.addChild(effectArea);

    // Arrows tooltip
    const arrowsArea = createInteractiveArea(250, 190, 50, 40,
        'The direction the card can move or link to.');
    const downArrowArea = createInteractiveArea(135, 375, 30, 45,
        'The direction the card can move or link to.');
    card.addChild(arrowsArea);
    card.addChild(downArrowArea);

    // Type tooltip
    const typeArea = createInteractiveArea(55, 385, 50, 15,
        'This is the cards tag. Cards within the same archetype share a tag and some cards evoke this tag to specify which cards their effect targets.');
    card.addChild(typeArea);

    // Card title
    const titleText = new PIXI.Text('Stepmother', {
        fontFamily: 'Calibri',
        fontSize: 28,
        fontWeight: 'bold',
        fill: 0x000000,
    });
    titleText.position.set(150 - titleText.width/2, 25);
    card.addChild(titleText);

    // Load and add card art - modified to maintain aspect ratio
    PIXI.Assets.load('Stepmother.png').then(texture => {
        const artSprite = new PIXI.Sprite(texture);
        const maxWidth = 240;
        const maxHeight = 160;
        
        // Calculate scale to fit within bounds while maintaining aspect ratio
        const scale = Math.min(maxWidth / texture.width, maxHeight / texture.height);
        artSprite.width = texture.width * scale;
        artSprite.height = texture.height * scale;
        
        // Center the sprite in the art area
        artSprite.position.set(
            30 + (maxWidth - artSprite.width) / 2,
            60 + (maxHeight - artSprite.height) / 2
        );
        card.addChild(artSprite);
    });

    // Stats
    const statsText = new PIXI.Text('Attack: 1    Defence: 1', {
        fontFamily: 'Calibri',
        fontSize: 20,
        fontWeight: 'bold',
        fill: 0x000000,
    });
    statsText.position.set(30, 230);
    card.addChild(statsText);

    // Arrows with tails
    const arrows = new PIXI.Graphics();
    arrows.lineStyle(4, 0x000000);
    
    // Right arrow (moved 5px right)
    arrows.moveTo(255, 210);
    arrows.lineTo(295, 210);  // Extended to touch edge
    arrows.moveTo(280, 195);
    arrows.lineTo(295, 210);
    arrows.lineTo(280, 225);
    
    // Perpendicular line at right arrow tip
    arrows.lineStyle(5, 0x000000);
    arrows.moveTo(300, 195);  // 10px above tip
    arrows.lineTo(300, 225);  // 10px below tip
    
    // Down arrow (moved 5px down)
    arrows.lineStyle(4, 0x000000);
    arrows.moveTo(150, 375);
    arrows.lineTo(150, 415);  // Extended to touch edge
    arrows.moveTo(135, 400);
    arrows.lineTo(150, 415);
    arrows.lineTo(165, 400);
    
    // Perpendicular line at down arrow tip
    arrows.lineStyle(6, 0x000000);
    arrows.moveTo(135, 420);  // 10px left of tip
    arrows.lineTo(165, 420);  // 10px right of tip

    card.addChild(arrows);

    // Combined trigger and active text
    const combinedText = new PIXI.Text('Trigger: When a Coughing Baby is destroyed by an enemy attack permanently increase this card\'s defence by 1.\nActive: You can destroy this card to play a number of Coughing Baby cards from your discard pile equal to this card\'s current defence.', {
        fontFamily: 'Calibri',
        fontSize: 14,
        fill: 0x000000,
        wordWrap: true,
        wordWrapWidth: 240
    });
    combinedText.position.set(30, 253);  // Changed from 270 to 250
    card.addChild(combinedText);

    // Card type (kept at the same position)
    const typeText = new PIXI.Text('FAMILY', {
        fontFamily: 'Calibri',
        fontSize: 16,
        fontWeight: 'bold',
        fill: 0x000000,
    });
    typeText.position.set(55, 384);
    card.addChild(typeText);
});
