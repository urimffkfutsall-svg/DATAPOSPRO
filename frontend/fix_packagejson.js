const fs = require('fs');

let raw = fs.readFileSync('package.json', 'utf8');

// Parse to check and fix
let pkg;
try {
  pkg = JSON.parse(raw);
  console.log('JSON eshte OK!');
} catch(e) {
  console.log('Ka gabim, po riparoj...');
  // Remove trailing commas before } or ]
  raw = raw.replace(/,\s*([}\]])/g, '$1');
  try {
    pkg = JSON.parse(raw);
    console.log('U rregullua!');
  } catch(e2) {
    console.log('Gabim i rende: ' + e2.message);
    process.exit(1);
  }
}

// Add required fields
pkg.main = "public/electron.js";
pkg.homepage = "./";

// Add electron scripts
pkg.scripts["electron"] = "electron public/electron.js";
pkg.scripts["electron-build"] = "electron-builder build --win";

// Add build config for electron-builder
pkg.build = {
  "appId": "com.datapos.app",
  "productName": "DATAPOS",
  "win": {
    "target": "nsis",
    "icon": "public/favicon.ico"
  },
  "files": [
    "public/electron.js",
    "public/favicon.ico"
  ]
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');
console.log('Done! package.json u rregullua dhe u perditesua.');