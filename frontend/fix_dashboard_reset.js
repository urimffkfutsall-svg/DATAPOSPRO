const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const resetFunctions = `
  const handleReset = async (type) => {
    const labels = { day: 'ditore', month: 'mujore', year: 'vjetore', all: 'te gjitha' };
    if (!window.confirm('A jeni i sigurt qe doni te fshini te dhenat ' + labels[type] + '?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/reset/' + type, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
      });
      alert('Resetimi ' + labels[type] + ' u krye me sukses!');
    } catch (err) {
      alert('Ndodhi nje gabim gjate resetimit!');
    }
  };
`;

const resetUI = `
        <div style=marginTop:'40px', padding:'20px', border:'2px solid #ff4444', borderRadius:'10px', background:'#fff5f5'>
          <h3 style=color:'#cc0000', marginBottom:'15px'>Zone e Resetimit</h3>
          <div style=display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'10px'>
            <button onClick={() => handleReset('day')} style=padding:'10px 20px', background:'#ff9900', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'>Reseto Diten</button>
            <button onClick={() => handleReset('month')} style=padding:'10px 20px', background:'#ff6600', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'>Reseto Muajin</button>
            <button onClick={() => handleReset('year')} style=padding:'10px 20px', background:'#cc3300', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'>Reseto Vitin</button>
            <button onClick={() => handleReset('all')} style=padding:'10px 20px', background:'#990000', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'>Reseto Te Gjitha</button>
          </div>
          <p style=color:'#cc0000', fontSize:'13px', margin:0>Kujdes: Resetimi fshin shitjet, transaksionet, klientet dhe raportet!</p>
        </div>
`;

// Add functions before first return (
const returnIndex = content.indexOf('  return (');
if (returnIndex !== -1) {
  content = content.slice(0, returnIndex) + resetFunctions + '\n' + content.slice(returnIndex);
}

// Add UI before last </div>
const lastDiv = content.lastIndexOf('</div>');
if (lastDiv !== -1) {
  content = content.slice(0, lastDiv) + resetUI + '\n' + content.slice(lastDiv);
}

fs.writeFileSync('src/pages/Dashboard.jsx', content, 'utf8');
console.log('Done! Reset buttons added to Dashboard.');