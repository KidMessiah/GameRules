document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('card-diagrams-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set minimum width for each diagram group
    const MIN_DIAGRAM_WIDTH = 250;
    
    function calculateDiagramPositions(canvasWidth) {
        const diagramsPerRow = Math.max(1, Math.floor(canvasWidth / (MIN_DIAGRAM_WIDTH + 50)));
        const spacing = 50;
        const availableWidth = canvasWidth - (spacing * (diagramsPerRow - 1));
        const diagramWidth = Math.min(250, availableWidth / diagramsPerRow);
        
        const diagrams = [
            { text: 'Any 4 cards', cards: ['?', '?', '?', '?'] },
            { text: 'Two Tier 2 cards', cards: ['2', '2'] },
            { text: 'One Tier 1 and One Tier 3', cards: ['1', '3'] }
        ];
        
        // Calculate rows needed
        const rows = Math.ceil(diagrams.length / diagramsPerRow);
        canvas.height = rows * 150; // Adjust canvas height based on rows
        
        return diagrams.map((diagram, index) => {
            const row = Math.floor(index / diagramsPerRow);
            const col = index % diagramsPerRow;
            const x = (canvasWidth - (diagramsPerRow * diagramWidth + (diagramsPerRow - 1) * spacing)) / 2 
                     + col * (diagramWidth + spacing);
            const y = 80 + (row * 150); // 150px vertical spacing between rows
            return { x, y, width: diagramWidth, ...diagram };
        });
    }

    function drawCard(ctx, x, y, number) {
        const cardWidth = 50;
        const cardHeight = 70;
        const radius = 5;

        ctx.save();
        // Draw shadow and card in one pass
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 5;
        
        // Draw rounded rectangle card
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + cardWidth - radius, y);
        ctx.quadraticCurveTo(x + cardWidth, y, x + cardWidth, y + radius);
        ctx.lineTo(x + cardWidth, y + cardHeight - radius);
        ctx.quadraticCurveTo(x + cardWidth, y + cardHeight, x + cardWidth - radius, y + cardHeight);
        ctx.lineTo(x + radius, y + cardHeight);
        ctx.quadraticCurveTo(x, y + cardHeight, x, y + cardHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw number
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#000';
        ctx.font = '1rem Arial';
        ctx.fillText(number, x + 10, y + 20);
        ctx.restore();
    }

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const positions = calculateDiagramPositions(canvas.width);
        
        positions.forEach(pos => {
            // Get the computed highlight color based on current theme
            const computedStyle = getComputedStyle(document.documentElement);
            const highlightColor = computedStyle.getPropertyValue('--highlight-text');
            
            // Draw title with theme color
            ctx.fillStyle = highlightColor;
            ctx.font = 'bold 1rem Arial';
            ctx.textAlign = 'center';
            ctx.fillText(pos.text, pos.x + pos.width/2, pos.y - 20);
            
            // Center cards under text
            const cardWidth = 50;
            const cardSpacing = 30;
            const totalCardsWidth = (pos.cards.length * cardWidth) + ((pos.cards.length - 1) * (cardSpacing - cardWidth));
            const startX = pos.x + (pos.width - totalCardsWidth) / 2;
            
            // Draw cards from left to right instead of right to left
            pos.cards.forEach((card, i) => {
                drawCard(ctx, startX + (i * cardSpacing), pos.y, card);
            });
        });
    }

    // Initial draw
    draw();

    // Redraw on window resize
    window.addEventListener('resize', function() {
        canvas.width = canvas.offsetWidth;
        draw();
    });

    // Trigger initial resize
    window.dispatchEvent(new Event('resize'));
});
