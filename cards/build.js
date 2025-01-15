const fs = require('fs');
const path = require('path');

// Get absolute paths and enable debug mode
const currentDir = process.cwd();
const DATA_DIR = path.join(currentDir, 'data');
const OUTPUT_FILE = path.join(currentDir, 'cards.json');

// Add debug info
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

console.log('\n=== Debug Information ===');
console.log('Node version:', process.version);
console.log('Current directory:', currentDir);
console.log('Data directory:', DATA_DIR);
console.log('Output file:', OUTPUT_FILE);
console.log('=====================\n');

function parseFileName(fileName) {
    // Remove file extension
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    const [name, tier, tag] = nameWithoutExt.split('-');
    
    return {
        fileName,
        name,
        tier,
        tag,
        imagePath: `data/${fileName}`
    };
}

function buildCardDatabase() {
    try {
        // Verify data directory exists
        if (!fs.existsSync(DATA_DIR)) {
            throw new Error(`Data directory not found at: ${DATA_DIR}`);
        }

        // Get list of files
        const files = fs.readdirSync(DATA_DIR);
        
        if (files.length === 0) {
            throw new Error('Data directory is empty!');
        }

        console.log('\nFound files:');
        files.forEach(file => console.log('  -', file));

        // Filter image files
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
        
        if (imageFiles.length === 0) {
            throw new Error('No image files found in data directory!');
        }

        // Process cards
        const cards = imageFiles.map(fileName => {
            const cardData = parseFileName(fileName);
            console.log('Processing:', fileName, '→', cardData);
            return cardData;
        });

        // Write JSON file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cards, null, 2));
        console.log(`\nSuccess! Created ${OUTPUT_FILE} with ${cards.length} cards`);

    } catch (error) {
        console.error('\nERROR:', error.message);
        console.error('\nPlease make sure:');
        console.error('1. You are in the correct directory when running this script');
        console.error('2. The "data" folder exists and contains image files');
        console.error('3. Image files are named correctly (example: CardName-1-Type.jpg)');
        process.exit(1);
    }
}

buildCardDatabase();
