const fs = require('fs');
const path = require('path');

// Copy built files to root directory for GitHub Pages
function copyDistToRoot() {
    const distPath = './dist';
    const rootPath = './';
    
    if (!fs.existsSync(distPath)) {
        console.log('❌ dist folder not found. Run npm run build first.');
        return;
    }
    
    console.log('📁 Copying built files to root directory...');
    
    // Copy all files from dist to root
    const files = fs.readdirSync(distPath);
    
    files.forEach(file => {
        const srcPath = path.join(distPath, file);
        const destPath = path.join(rootPath, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            // Copy directory
            if (fs.existsSync(destPath)) {
                fs.rmSync(destPath, { recursive: true, force: true });
            }
            fs.cpSync(srcPath, destPath, { recursive: true });
            console.log(`📂 Copied directory: ${file}`);
        } else {
            // Copy file
            fs.copyFileSync(srcPath, destPath);
            console.log(`📄 Copied file: ${file}`);
        }
    });
    
    console.log('✅ Files copied successfully!');
    console.log('🚀 Your site should now work at: https://ahhdamnarchitect.github.io/regulation-compliance-sustainability/');
}

copyDistToRoot();
