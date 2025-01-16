// Import required Node.js modules
const fs = require('fs');           // File system operations
const path = require('path');       // Path manipulation utilities
const readline = require('readline');// Command line interface
const { exec } = require('child_process'); // Execute system commands

// Create readline interface for user input/output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Create directories if they don't exist
const cardsDir = path.join(__dirname, 'cards');
const dataDir = path.join(cardsDir, 'data');

// Create directories recursively if they don't exist
if (!fs.existsSync(cardsDir)) {
    fs.mkdirSync(cardsDir);
}
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Define path to card images directory (relative to script location)
const cardDirectory = dataDir;
// Define valid tiers - add 'Token' as valid tier
const validTiers = ['0', '1', '2', '3', '4', '5', 'Token'];

// Updated filename pattern to allow for zero tier and Token
const filenamePattern = /^[a-zA-Z0-9 -]+?-(Token|[0-5])-[a-zA-Z0-9 ]+\.jpg$/i;

// Function to validate tier
function isValidTier(filename) {
    const match = filename.match(filenamePattern);
    if (!match) return false;
    const tier = match[1];
    return validTiers.includes(tier);
}

// Main async function to process all files
async function processFiles() {
    // Read all files from the card directory
    const files = fs.readdirSync(cardDirectory);
    
    // Iterate through each file
    for (const file of files) {
        // Check if file matches pattern and has valid tier
        if (!filenamePattern.test(file) || !isValidTier(file)) {
            console.log(`File "${file}" has invalid format or tier.`);
            // Construct full path to the image
            const imagePath = path.join(cardDirectory, file);
            
            // Open image with default system viewer based on OS
            if (process.platform === 'win32') {
                exec(`start "" "${imagePath}"`, (error) => {
                    if (error) {
                        console.error(`Error opening image: ${error}`);
                    }
                });
            } else if (process.platform === 'darwin') {
                exec(`open "${imagePath}"`);       // macOS
            } else {
                exec(`xdg-open "${imagePath}"`);   // Linux
            }

            // Wait for user to input new filename
            const newName = await new Promise(resolve => {
                rl.question(`Enter new name for ${file} (format: name-tier-type.jpg): `, answer => {
                    resolve(answer);
                });
            });

            // If user provided a new name different from current name
            if (newName && newName !== file) {
                // Rename the file using the new name
                fs.renameSync(
                    path.join(cardDirectory, file),
                    path.join(cardDirectory, newName)
                );
                console.log(`Renamed ${file} to ${newName}`);
            }

            // Close the image viewer (Windows only)
            // Note: On other OS, manual closing is required
            if (process.platform === 'win32') {
                exec('taskkill /IM Microsoft.Photos.exe /F');
            }
        } else {
            console.log(`File "${file}" is correctly named.`);
        }
    }
    
    // Close the readline interface when done
    rl.close();
}

// Execute the main function and catch any errors
processFiles().catch(console.error);
