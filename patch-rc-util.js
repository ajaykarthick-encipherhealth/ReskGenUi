const fs = require('fs');
const path = require('path');

// Patch script to fix rc-util ESM import issues
function patchRcUtil() {
  const rcUtilPath = path.join(__dirname, 'node_modules', 'rc-util', 'es', 'Dom');
  const dynamicCSSPath = path.join(rcUtilPath, 'dynamicCSS.js');
  
  if (fs.existsSync(dynamicCSSPath)) {
    let content = fs.readFileSync(dynamicCSSPath, 'utf8');
    
    // Fix the import statement
    content = content.replace(
      'import canUseDom from "./canUseDom";',
      'import canUseDom from "./canUseDom.js";'
    );
    
    content = content.replace(
      'import contains from "./contains";',
      'import contains from "./contains.js";'
    );
    
    fs.writeFileSync(dynamicCSSPath, content);
    console.log('Patched rc-util dynamicCSS.js');
  } else {
    console.log('dynamicCSS.js not found');
  }
}

patchRcUtil();