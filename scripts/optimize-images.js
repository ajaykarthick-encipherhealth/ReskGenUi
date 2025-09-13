const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const imageDir = path.join(__dirname, '../src/images');
  const publicDir = path.join(__dirname, '../public');
  
  // Function to process a directory recursively
  async function processDirectory(dir, outputDir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        const newOutputDir = path.join(outputDir, item);
        if (!fs.existsSync(newOutputDir)) {
          fs.mkdirSync(newOutputDir, { recursive: true });
        }
        await processDirectory(fullPath, newOutputDir);
      } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
        const name = path.parse(item).name;
        const outputPath = path.join(outputDir, `${name}.webp`);
        
        try {
          await sharp(fullPath)
            .webp({ quality: 85, effort: 6 })
            .toFile(outputPath);
          
          console.log(`Optimized: ${item} -> ${name}.webp`);
          
          // Also create AVIF for even better compression
          const avifPath = path.join(outputDir, `${name}.avif`);
          await sharp(fullPath)
            .avif({ quality: 80, effort: 6 })
            .toFile(avifPath);
          
          console.log(`Created AVIF: ${name}.avif`);
        } catch (error) {
          console.error(`Error processing ${item}:`, error.message);
        }
      }
    }
  }
  
  // Process src/images
  const optimizedImagesDir = path.join(publicDir, 'optimized-images');
  if (!fs.existsSync(optimizedImagesDir)) {
    fs.mkdirSync(optimizedImagesDir, { recursive: true });
  }
  
  await processDirectory(imageDir, optimizedImagesDir);
  
  // Process public images
  const publicImages = fs.readdirSync(publicDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  
  for (const image of publicImages) {
    const fullPath = path.join(publicDir, image);
    const name = path.parse(image).name;
    
    try {
      // WebP version
      await sharp(fullPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(path.join(publicDir, `${name}.webp`));
      
      // AVIF version
      await sharp(fullPath)
        .avif({ quality: 80, effort: 6 })
        .toFile(path.join(publicDir, `${name}.avif`));
      
      console.log(`Optimized public image: ${image}`);
    } catch (error) {
      console.error(`Error processing public ${image}:`, error.message);
    }
  }
  
  console.log('Image optimization complete!');
}

// Run the optimization
optimizeImages().catch(console.error);