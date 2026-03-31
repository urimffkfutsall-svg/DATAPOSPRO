const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Shto scripts
pkg.scripts["electron"] = "electron public/electron.js";
pkg.scripts["electron-build"] = "electron-builder build --win";

// Shto main dhe homepage
pkg.main = "public/electron.js";
pkg.homepage = "./";

// Shto build config
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
console.log('Done! package.json u perditesua.');