const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'Images', 'Oasis Logo.png');
const outputPath = path.join(__dirname, 'Images', 'Oasis Logo.webp');

// Check if input file exists
if (!fs.existsSync(inputPath)) {
    console.error('Error: Oasis Logo.png not found in Images folder');
    process.exit(1);
}

// Convert PNG to WebP
sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outputPath)
    .then(info => {
        const inputSize = fs.statSync(inputPath).size;
        const outputSize = info.size;
        const savings = inputSize - outputSize;
        const savingsPercent = ((savings / inputSize) * 100).toFixed(1);
        
        console.log('✓ Conversion successful!');
        console.log(`  Input:  ${(inputSize / 1024).toFixed(2)} KB (PNG)`);
        console.log(`  Output: ${(outputSize / 1024).toFixed(2)} KB (WebP)`);
        console.log(`  Saved:  ${(savings / 1024).toFixed(2)} KB (${savingsPercent}%)`);
    })
    .catch(err => {
        console.error('Error converting image:', err);
        process.exit(1);
    });
