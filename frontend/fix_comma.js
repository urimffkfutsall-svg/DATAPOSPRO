const fs = require('fs');
let raw = fs.readFileSync('package.json', 'utf8');

// Fix missing comma between electron:build:all and electron
raw = raw.replace(
  '"electron:build:all": "yarn build && electron-builder --win --mac --linux"\n    "electron"',
  '"electron:build:all": "yarn build && electron-builder --win --mac --linux",\n    "electron"'
);

// Also fix missing comma before electron-build if needed
raw = raw.replace(
  '"electron": "electron public/electron.js"\n    "electron-build"',
  '"electron": "electron public/electron.js",\n    "electron-build"'
);

// Verify it parses
try {
  JSON.parse(raw);
  fs.writeFileSync('package.json', raw, 'utf8');
  console.log('U rregullua me sukses!');
} catch(e) {
  console.log('Ende ka gabim: ' + e.message);
}