// Import required Node.js modules
// 'const' declares a variable that cannot be reassigned
// 'fs' is Node's built-in file system module for working with files
const fs = require('fs');
// 'path' module helps handle file paths across different operating systems
const path = require('path');

// Get current working directory and define important paths
// 'process.cwd()' returns the current working directory
const currentDir = process.cwd();
// Define path to the data directory where images are stored
const DATA_DIR = path.join(currentDir, 'data');
// Define path for the output JSON file
const OUTPUT_FILE = path.join(currentDir, 'cards.json');

// Function declaration to parse filenames into card data
// Functions are reusable blocks of code that perform specific tasks
function parseFileName(fileName) {
    // Remove file extension from filename (e.g., .jpg, .png)
    // Regular expression /\.[^/.]+$/ matches the last dot and everything after it
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    
    // Split filename into components using '-' as separator
    // Array destructuring assigns each part to a variable
    const [name, tier, tag] = nameWithoutExt.split('-');
    
    // Return an object with card properties
    return {
        fileName,    // Original filename
        name,        // Card name
        tier,        // Card tier
        tag,         // Card tag
        imagePath: `data/${fileName}`  // Path to image file
    };
}

// Main function that builds the card database
function buildCardDatabase() {
    try {
        // Check if data directory exists
        if (!fs.existsSync(DATA_DIR)) {
            throw new Error(`Data directory not found at: ${DATA_DIR}`);
        }

        // Read all files in the data directory
        const files = fs.readdirSync(DATA_DIR);
        
        // Check if directory is empty
        if (files.length === 0) {
            throw new Error('Data directory is empty!');
        }

        // Filter for image files only using regular expression
        // Test for .jpg, .jpeg, or .png extensions (case insensitive)
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
        
        // Check if any image files were found
        if (imageFiles.length === 0) {
            throw new Error('No image files found in data directory!');
        }

        // Process each image file into card data
        // 'map' creates a new array by transforming each element
        const cards = imageFiles.map(fileName => parseFileName(fileName));

        // Write the card data to JSON file
        // JSON.stringify converts JavaScript object to JSON string
        // null, 2 parameters make the output formatted and indented
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cards, null, 2));
        console.log(`Created ${OUTPUT_FILE} with ${cards.length} cards`);

    } catch (error) {
        // Error handling: log error and exit program with error code
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Execute the main function
buildCardDatabase();
