
import React, { useState, useEffect } from 'react';
import { AppState, GeneratedLook } from './types';
import { MOCK_USER, CLIMATE_CHOICES } from './constants';
import { generateFashionLook } from './services/gemini';
import { authService } from './services/auth';
import { User } from 'firebase/auth';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('LOGIN');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [selectedClimate, setSelectedClimate] = useState('invierno');
  const [currentLook, setCurrentLook] = useState<GeneratedLook | null>(null);

  useEffect(() => {
    // Escuchar cambios de autenticación en tiempo real
    const unsubscribe = authService.onAuthUpdate((user) => {
      setCurrentUser(user);
      if (user) {
        setView('DASHBOARD');
      } else {
        setView('LOGIN');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEmailAuth = async (type: 'LOGIN' | 'REGISTER') => {
    if (!email || !password) {
      setError('Credenciales incompletas');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (type === 'LOGIN') await authService.signIn(email, password);
      else await authService.signUp(email, password);
      // El cambio de vista se maneja en el useEffect
    } catch (err: any) {
      console.error(err);
      let msg = 'Error de autenticación';
      if (err.code === 'auth/invalid-credential') msg = 'Credenciales inválidas';
      if (err.code === 'auth/email-already-in-use') msg = 'Email ya registrado';
      if (err.code === 'auth/weak-password') msg = 'Contraseña muy débil';
      setError(msg);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.signInWithGoogle();
      // El cambio de vista se maneja en el useEffect
    } catch (err: any) {
      console.error(err);
      setError('Cancelado o error en Google Auth');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setView('LOGIN');
  };

  const handleGenerate = async () => {
    setView('GENERATING');
    try {
      const vibes = ["Neo-Urbano", "Cyber-Minimalista", "Gorpcore Avanzado", "Tech-Noir"];
      const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
      const look = await generateFashionLook(randomVibe, "Actividad Urbana Diaria", selectedClimate);
      setCurrentLook(look);
      setTimeout(() => setView('LOOK_DETAILS'), 2500);
    } catch (err) {
      console.error(err);
      alert("Error generando el look. Verifica tu API Key.");
      setView('DASHBOARD');
    }
  };

  const BottomNav = () => (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100]">
      <div className="bg-background-dark/80 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center justify-between shadow-2xl ring-1 ring-white/5">
        <button onClick={() => setView('DASHBOARD')} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${view === 'DASHBOARD' ? 'bg-primary text-white shadow-glow' : 'text-white/40'}`}>
          <span className="material-icons-round">grid_view</span>
        </button>
        <button onClick={handleGenerate} className="w-14 h-14 bg-gradient-to-tr from-primary to-purple-400 rounded-full flex items-center justify-center text-white shadow-glow scale-110 -translate-y-2 border-4 border-background-dark active:scale-95 transition-transform">
          <span className="material-icons-round text-3xl">bolt</span>
        </button>
        <button onClick={() => setView('PROFILE')} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${view === 'PROFILE' ? 'bg-primary text-white shadow-glow' : 'text-white/40'}`}>
          <span className="material-icons-round">person_outline</span>
        </button>
      </div>
    </div>
  );

  const renderView = () => {
    switch (view) {
      case 'LOGIN':
      case 'REGISTER':
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background-dark relative overflow-hidden">
            {/* Branding Background */}
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-primary/20 blur-bg rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-900/10 blur-bg rounded-full"></div>
            <div className="scan-line"></div>

            <div className="w-full max-w-xs z-10 flex flex-col items-center">
              {/* Logo & Identity */}
              <div className="mb-14 text-center group">
                <div className="inline-flex w-20 h-20 bg-primary rounded-[2.5rem] items-center justify-center shadow-glow mb-6 rotate-6 group-hover:rotate-0 transition-all duration-700">
                  <span className="material-icons-round text-white text-5xl">bolt</span>
                </div>
                <h1 className="text-8xl font-black tracking-tighter italic leading-none mb-1 select-none">VYBE</h1>
                <div className="h-0.5 w-12 bg-primary mx-auto mb-2"></div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.6em]">Core Intelligence</p>
              </div>

              {/* Login Terminal */}
              <div className="w-full space-y-4">
                <button 
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full bg-white text-black py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                  <span>Access via Google ID</span>
                </button>

                <div className="flex items-center gap-4 py-2 opacity-10">
                  <div className="flex-1 h-px bg-white"></div>
                  <span className="text-[8px] font-black uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white"></div>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 material-icons-round text-white/20 text-lg">alternate_email</span>
                    <input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary focus:bg-white/[0.06] transition-all text-sm font-medium placeholder:text-white/10" 
                      placeholder="Operator Identity" 
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 material-icons-round text-white/20 text-lg">security</span>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary focus:bg-white/[0.06] transition-all text-sm font-medium placeholder:text-white/10" 
                      placeholder="Security Protocol" 
                    />
                  </div>
                </div>

                {error && (
                  <div className="py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-pulse">
                    <p className="text-red-400 text-[9px] font-bold text-center uppercase tracking-widest">{error}</p>
                  </div>
                )}

                <button 
                  onClick={() => handleEmailAuth(view === 'LOGIN' ? 'LOGIN' : 'REGISTER')}
                  disabled={loading}
                  className="w-full bg-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-glow flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>{view === 'LOGIN' ? 'Initialize session' : 'Register Operator'} <span className="material-icons-round text-xl">login</span></>
                  )}
                </button>
              </div>

              <button 
                onClick={() => setView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN')} 
                className="mt-10 text-white/20 text-[9px] font-bold uppercase tracking-[0.4em] hover:text-primary transition-colors"
              >
                {view === 'LOGIN' ? "Don't have access? Create Profile" : "Existing Operator? Sign In"}
              </button>
            </div>

            <div className="absolute bottom-8 text-[7px] font-black text-white/10 uppercase tracking-[1em]">
              VYBE Systems // Global Fashion Intelligence
            </div>
          </div>
        );

      case 'DASHBOARD':
        return (
          <div className="min-h-screen p-6 pb-40">
            <header className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/20 p-0.5 rounded-2xl shadow-glow overflow-hidden relative border border-primary/20">
                  <img src={currentUser?.photoURL || MOCK_USER.avatar} className="w-full h-full object-cover rounded-[calc(1rem-2px)]" alt="Profile" />
                </div>
                <div>
                  <h2 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-0.5">Operator</h2>
                  <h1 className="text-lg font-black italic uppercase tracking-tighter truncate max-w-[150px]">
                    {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                  </h1>
                </div>
              </div>
              <button onClick={() => setView('PROFILE')} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                <span className="material-icons-round text-xl">settings</span>
              </button>
            </header>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/20 to-purple-900/10 border border-primary/20 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-neon">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Environment Sync</h3>
                <div className="grid grid-cols-5 gap-3">
                  {CLIMATE_CHOICES.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => setSelectedClimate(c.id)} 
                      className={`h-14 rounded-2xl flex items-center justify-center transition-all ${selectedClimate === c.id ? 'bg-primary text-white shadow-glow scale-110' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    >
                      <span className="material-icons-round text-2xl">{c.icon}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-10 flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-2xl font-black italic uppercase tracking-tighter text-white">
                      {CLIMATE_CHOICES.find(c => c.id === selectedClimate)?.name}
                    </p>
                  </div>
                  <button onClick={handleGenerate} className="bg-white text-black font-black text-[9px] px-8 py-3.5 rounded-full uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95">
                    Synthesize
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-black text-xl uppercase tracking-tighter italic">Style Archive</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-[3/4] bg-white/5 rounded-[2rem] overflow-hidden relative border border-white/5 group cursor-pointer shadow-lg active:scale-95 transition-transform">
                      <img src={`https://picsum.photos/seed/vybe_mod_${i+50}/400/600`} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all duration-1000" alt="outfit" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent"></div>
                      <div className="absolute bottom-5 left-5">
                        <span className="text-[7px] font-black italic text-primary uppercase tracking-widest">Entry</span>
                        <p className="text-xs font-bold tracking-tight">VYB-LOG-{i*102}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <BottomNav />
          </div>
        );

      case 'GENERATING':
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background-dark">
            <div className="relative">
              <div className="w-24 h-24 border-2 border-primary border-t-transparent rounded-full animate-spin shadow-glow mb-12"></div>
              <span className="absolute inset-0 flex items-center justify-center material-icons-round text-primary animate-pulse">auto_awesome</span>
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse text-center leading-loose">
              Mapping Aesthetic Entropies...<br/><span className="text-white/20">Gemini 3.0 Processing</span>
            </h2>
          </div>
        );

      case 'LOOK_DETAILS':
        if (!currentLook) return null;
        return (
          <div className="min-h-screen pb-40 bg-background-dark">
            <div className="relative aspect-[3/4] w-full">
              <img src={currentLook.mainImageUrl} className="w-full h-full object-cover" alt="look" />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
              <button onClick={() => setView('DASHBOARD')} className="absolute top-10 left-6 w-12 h-12 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform">
                <span className="material-icons-round text-white">close</span>
              </button>
              <div className="absolute bottom-10 left-8 right-8">
                <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">{currentLook.vibeTag}</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-4">{currentLook.name}</h2>
                <p className="text-white/50 text-xs leading-relaxed max-w-[280px] font-medium">{currentLook.description}</p>
              </div>
            </div>
            <div className="p-8 space-y-4">
              {currentLook.items.map((item, idx) => (
                <div key={idx} className="bg-white/[0.03] border border-white/5 p-4 rounded-3xl flex items-center gap-5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                    <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <p className="text-primary text-[9px] font-black uppercase tracking-widest mb-0.5">{item.category}</p>
                    <h4 className="font-bold text-xs leading-tight">{item.name}</h4>
                    <p className="text-white/30 text-[9px] font-medium mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <BottomNav />
          </div>
        );

      case 'PROFILE':
        return (
          <div className="min-h-screen p-6 pb-40 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/10 to-transparent"></div>
            <div className="mt-16 relative">
              <div className="w-32 h-32 rounded-[2.5rem] p-1 bg-gradient-to-tr from-primary to-transparent shadow-glow mb-8 rotate-2">
                <img src={currentUser?.photoURL || MOCK_USER.avatar} className="w-full h-full object-cover rounded-[2.3rem]" alt="avatar" />
              </div>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-1">
              {currentUser?.displayName || currentUser?.email?.split('@')[0]}
            </h1>
            <p className="text-primary text-[8px] font-bold uppercase tracking-[0.3em] mb-12 italic opacity-60">Verified Identity</p>
            <div className="w-full grid grid-cols-2 gap-4 mb-10">
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 text-center">
                <p className="text-3xl font-black text-white italic">28</p>
                <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1">Generated</p>
              </div>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 text-center">
                <p className="text-3xl font-black text-white italic">12.4k</p>
                <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1">Reach</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full bg-red-500/10 border border-red-500/20 py-5 rounded-2xl font-black text-[10px] text-red-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
            >
              Terminate Session
            </button>
            <BottomNav />
          </div>
        );
    }
  };

  return (
    <div className="bg-background-dark min-h-screen text-white font-display">
      {renderView()}
    </div>
  );
};

export default App;
