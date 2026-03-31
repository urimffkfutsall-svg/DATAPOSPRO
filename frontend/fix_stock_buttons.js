const fs = require('fs');
const file = 'src/pages/Stock.jsx';
let content = fs.readFileSync(file, 'utf8');

// Shto butonat prane titullit h1
content = content.replace(
  '<h1 className="text-2xl font-bold text-gray-900">Menaxhimi i Stokut</h1>',
  `<h1 className="text-2xl font-bold text-gray-900">Menaxhimi i Stokut</h1>
              </div>
              <div className="flex gap-2">
                <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Exporto Stokun
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" /></svg>
                  Importo Stokun
                  <input type="file" accept=".xlsx,.xls" className="hidden" onChange={importFromExcel} />
                </label>
              </div>
              <div className="hidden">`
);

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Butonat u shtuan me sukses!');
