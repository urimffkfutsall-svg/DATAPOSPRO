const fs = require('fs');
const file = 'src/pages/Stock.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Shto import xlsx
content = content.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect } from 'react';\nimport * as XLSX from 'xlsx';"
);

// 2. Shto Download dhe Upload ne lucide imports
content = content.replace(
  'Search,\nRefreshCw',
  'Search,\nRefreshCw,\nDownload,\nUpload'
);

// 3. Shto funksionet Export dhe Import
content = content.replace(
  'const handleMovement = async (e)',
  `const exportToExcel = () => {
  const exportData = products.map(p => ({
    'Emri': p.name || '',
    'Barkodi': p.barcode || '',
    'Kategoria': p.category || '',
    'Cmimi Blerjes (EUR)': p.purchase_price || 0,
    'Cmimi Shitjes (EUR)': p.sale_price || 0,
    'Stoku Aktual': p.current_stock || 0,
    'Njesia': p.unit || 'cope',
  }));
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Stoku');
  XLSX.writeFile(wb, 'stoku_' + new Date().toISOString().slice(0,10) + '.xlsx');
  toast.success('Stoku u eksportua me sukses!');
};

const importFromExcel = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      let success = 0;
      for (const row of data) {
        try {
          await api.post('/products', {
            name: row['Emri'],
            barcode: row['Barkodi'] || '',
            purchase_price: parseFloat(row['Cmimi Blerjes (EUR)']) || 0,
            sale_price: parseFloat(row['Cmimi Shitjes (EUR)']) || 0,
            initial_stock: parseFloat(row['Stoku Aktual']) || 0,
            unit: row['Njesia'] || 'cope',
          });
          success++;
        } catch(e) {}
      }
      toast.success(success + ' produkte u importuan me sukses!');
      loadData();
    } catch (err) {
      toast.error('Gabim gjate importit te skedarit Excel');
    }
  };
  reader.readAsBinaryString(file);
  e.target.value = '';
};

const handleMovement = async (e)`
);

// 4. Shto butonat ne krye te faqes prane titullit
content = content.replace(
  '<CardTitle>Menaxhimi i Stokut</CardTitle>',
  `<CardTitle>Menaxhimi i Stokut</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToExcel} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exporto Stokun
            </Button>
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                Importo Stokun
              </div>
              <input type="file" accept=".xlsx,.xls" className="hidden" onChange={importFromExcel} />
            </label>
          </div>`
);

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Stock.jsx u ndryshua me sukses!');
