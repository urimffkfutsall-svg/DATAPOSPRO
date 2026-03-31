const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

// Fshi cdo gje pas rreshtit te fundit te return() qe eshte e gabuar
// Gjej bllokun e resetimit te gabuar dhe zëvendësoje me JSX korrekt

const badPattern = /\{?\/\* Reset Buttons \*\/\}?[\s\S]*?<\/div>\s*\n\s*<\/div>/;

const goodReset = `{/* Reset Buttons */}
        <div style=marginTop:'40px', padding:'20px', border:'2px solid #ff4444', borderRadius:'10px', background:'#fff5f5'>
          <h3 style=color:'#cc0000', marginBottom:'15px'>⚠️ Zona e Resetimit</h3>
          <div style=display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'10px'>
            <button onClick={() => handleReset('day')}
              style=padding:'10px 20px', background:'#ff9900', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'>
              🔄 Reseto Ditën
            </button>
            <button onClick={() => handleReset('month')}
              style=padding:'10px 20px', background:'#ff6600', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'>
              🔄 Reseto Muajin
            </button>
            <button onClick={() => handleReset('year')}
              style=padding:'10px 20px', background:'#cc3300', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'>
              🔄 Reseto Vitin
            </button>
            <button onClick={() => handleReset('all')}
              style=padding:'10px 20px', background:'#990000', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'>
              ❌ Reseto Të Gjitha
            </button>
          </div>
          <p style=color:'#cc0000', fontSize:'13px', margin:0>
            ⚠️ Kujdes: Resetimi fshin shitjet, transaksionet, klientët dhe raportet!
          </p>
        </div>`;

if (badPattern.test(content)) {
  content = content.replace(badPattern, goodReset + '\n        </div>');
  console.log('U gjet dhe u rregullua blloku i gabuar!');
} else {
  // Shto para lastDiv
  const lastDiv = content.lastIndexOf('</div>');
  content = content.slice(0, lastDiv) + goodReset + '\n        ' + content.slice(lastDiv);
  console.log('U shtua blloku i ri!');
}

fs.writeFileSync('src/pages/Dashboard.jsx', content, 'utf8');
console.log('Done! Dashboard.jsx u rregullua.');