const fs = require('fs');
const file = 'src/pages/Stock.jsx';
let content = fs.readFileSync(file, 'utf8');

// Hiq duplikatin e XLSX
const xlsxImport = "import * as XLSX from 'xlsx';";
const firstIndex = content.indexOf(xlsxImport);
const secondIndex = content.indexOf(xlsxImport, firstIndex + 1);
if (secondIndex !== -1) {
  content = content.slice(0, secondIndex) + content.slice(secondIndex + xlsxImport.length + 1);
}

// Hiq duplikatin e exportToExcel
const exportFn = "const exportToExcel = () => {";
const firstExport = content.indexOf(exportFn);
const secondExport = content.indexOf(exportFn, firstExport + 1);
if (secondExport !== -1) {
  // Gjej fundin e bllokut te dyte (deri te importFromExcel)
  const importFn = "const importFromExcel = (e) => {";
  const importIndex = content.indexOf(importFn, secondExport);
  content = content.slice(0, secondExport) + content.slice(importIndex);
}

// Hiq duplikatin e importFromExcel
const importFn = "const importFromExcel = (e) => {";
const firstImport = content.indexOf(importFn);
const secondImport = content.indexOf(importFn, firstImport + 1);
if (secondImport !== -1) {
  const handleMovement = "const handleMovement = async (e)";
  const handleIndex = content.indexOf(handleMovement, secondImport);
  content = content.slice(0, secondImport) + content.slice(handleIndex);
}

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Duplikat u hoqën me sukses!');