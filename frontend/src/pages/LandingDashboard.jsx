import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Smartphone, Calendar, Heart, GraduationCap, Home, Download, Clock, Shield, Zap, Users } from 'lucide-react';

const LandingDashboard = () => {
  const navigate = useNavigate();
  const apps = [
    { id:'datapos', name:'DataPOS', desc:'Sistemi profesional i pikes se shitjes per menaxhimin e biznesit tuaj.', Icon:ShoppingCart, color:'#00a79d', available:true, dlUrl:'/api/setup/download/datapos' },
    { id:'phonesoftware', name:'PhoneSoftware', desc:'Menaxhimi i servisit te telefonave, riparimeve dhe inventarit.', Icon:Smartphone, color:'#6366f1', available:true, dlUrl:'/api/setup/download/phonesoftware' },
    { id:'bookpro', name:'BookPro', desc:'Sistemi i rezervimeve dhe menaxhimit te takimeve per sallone.', Icon:Calendar, color:'#f59e0b', available:false },
    { id:'healthpro', name:'HealthPro', desc:'Menaxhimi i institucioneve shendetesore dhe komuniteteve.', Icon:Heart, color:'#ef4444', available:false },
    { id:'shkolla', name:'Shkolla Ime', desc:'Platforma e menaxhimit shkollor, studenteve dhe mesuesve.', Icon:GraduationCap, color:'#8b5cf6', available:false },
    { id:'rentpro', name:'RentPro', desc:'Menaxhimi i pronave, qirase dhe kontratave.', Icon:Home, color:'#0ea5e9', available:false },
  ];
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://datapospro-backend.onrender.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-gray-50">

      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.png" alt="DataSoft" className="w-10 h-10 rounded-xl object-contain" />
            <div>
              <div className="text-lg font-bold text-gray-900">DataSoft</div>
              <div className="text-xs text-gray-400">Zgjidhje profesionale biznesi</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4 text-[#00a79d]" />
              <span className="hidden sm:inline">Platforme e sigurt</span>
            </div>
            <button onClick={() => navigate('/register')} className="px-4 py-2 bg-[#00a79d] text-white text-sm font-semibold rounded-xl hover:bg-[#008f86] transition-all">
              Regjistrohu
            </button>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-[#00a79d] to-[#007a72] text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" /> Platforma Nr.1 per bizneset
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Zgjidhjet tona softuerike</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Menaxhoni biznesin tuaj me platformat tona moderne, te sigurta dhe profesionale
          </p>
          <div className="flex justify-center gap-12">
            {[['6+','Platforma'],['100+','Biznese'],['24/7','Mbeshtetje']].map(([n,l]) => (
              <div key={l} className="text-center">
                <div className="text-3xl font-bold">{n}</div>
                <div className="text-white/70 text-sm mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Zgjidhni platformen tuaj</h2>
          <p className="text-gray-500 text-lg">Shkarkoni aplikacionin desktop ose perdorni online</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map(({ id, name, desc, Icon, color, available, dlUrl }) => (
            <div key={id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <div className="h-1.5 w-full" style={{backgroundColor: color}} />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{backgroundColor: color+'20'}}>
                    {id === 'datapos' ? (
                      <img src="/logo-icon.png" alt="DataPOS" className="w-9 h-9 object-contain" />
                    ) : (
                      <Icon className="h-7 w-7" style={{color: color}} />
                    )}
                  </div>
                  {available ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" /> Aktiv
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                      <Clock className="h-3 w-3" /> Se shpejti
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">{desc}</p>
                {available ? (
                  <a
                    href={backendUrl + '/upload/setup/download/' + id}
                    className="w-full py-2.5 px-4 rounded-xl border-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 text-white"
                    style={{backgroundColor: color}}
                    target="_blank" rel="noreferrer"
                  >
                    <Download className="h-4 w-4" /> Shkarko Ketu
                  </a>
                ) : (
                  <button disabled className="w-full py-2.5 px-4 rounded-xl bg-gray-100 text-gray-400 text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                    <Clock className="h-4 w-4" /> Se shpejti...
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border-t border-b border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {Icon:Shield, title:'Te dhena te sigurta', desc:'Enkriptim i plote i te dhenave tuaja'},
            {Icon:Zap, title:'Shpejt dhe i lehte', desc:'Teknologji moderne me performance te larte'},
            {Icon:Users, title:'Mbeshtetje 24/7', desc:'Ekip profesional gjithmone ne dispozicion'}
          ].map(({Icon:Ic, title, desc}) => (
            <div key={title} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#00a79d]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Ic className="h-6 w-6 text-[#00a79d]" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">{title}</div>
                <div className="text-sm text-gray-500">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/logo-icon.png" alt="DataSoft" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-lg font-bold">DataSoft</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 DataSoft. Te gjitha te drejtat e rezervuara.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingDashboard;