const fs = require('fs');
const file = 'src/pages/Stock.jsx';
let content = fs.readFileSync(file, 'utf8');

// Hiq importin e dytë te XLSX (duplikatin)
content = content.replace(
  "import * as XLSX from 'xlsx';\nimport * as XLSX from 'xlsx';",
  "import * as XLSX from 'xlsx';"
);

fs.writeFileSync(file, content, 'utf8');
console.log('✅ U rregullua!');
