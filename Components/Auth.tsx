
import React, { useState } from 'react';
import { AuthMode } from '../types';

interface AuthProps {
  onAuth: (mode: AuthMode, username: string, referralCode?: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [refCode, setRefCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!username || !password) {
      setErrorMessage("Harap isi semua kolom!");
      return;
    }
    
    try {
      await onAuth(mode, username, refCode);
    } catch (err: any) {
      // Jika terjadi error dari parent (App.tsx), pesan akan muncul di sini
      setErrorMessage(err.message || "Terjadi kesalahan!");
    }
  };

  return (
    <div className="min-h-screen bg-[#e8ecf4] flex flex-col items-center pt-20 px-6">
      <div className="flex items-center space-x-2 mb-12">
        <div className="bg-yellow-500 rounded-sm p-1 shadow-lg transform rotate-12">
           <i className="fas fa-layer-group text-black"></i>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Crypto Gold</h1>
      </div>

      <div className="w-full max-sm:max-w-xs max-w-sm">
        <div className="flex bg-[#333333] rounded-t-xl overflow-hidden mb-0 relative h-14">
          <button 
            onClick={() => { setMode('LOGIN'); setErrorMessage(null); }}
            className={`flex-1 flex items-center justify-center space-x-2 transition-all duration-300 z-10 ${mode === 'LOGIN' ? 'text-white' : 'text-gray-400'}`}
          >
            <i className="fas fa-sign-in-alt"></i>
            <span className="font-bold">Login</span>
          </button>
          <button 
            onClick={() => { setMode('REGISTER'); setErrorMessage(null); }}
            className={`flex-1 flex items-center justify-center space-x-2 transition-all duration-300 z-10 ${mode === 'REGISTER' ? 'text-white' : 'text-gray-400'}`}
          >
            <i className="fas fa-user-plus"></i>
            <span className="font-bold">Register</span>
          </button>
          <div className={`absolute top-0 h-full w-1/2 bg-blue-500 transition-transform duration-300 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)] ${mode === 'REGISTER' ? 'translate-x-full' : 'translate-x-0'}`} />
        </div>

        <div className="bg-[#333333] p-6 rounded-b-xl space-y-4 shadow-2xl">
          {/* NOTIFIKASI ERROR */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-center space-x-3 animate-fadeIn">
              <i className="fas fa-exclamation-circle text-red-500"></i>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-tight">{errorMessage}</span>
            </div>
          )}

          <div className="relative">
            <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
            <input 
              type="text" 
              placeholder="Username / Nickname" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#2a2a2a] text-white py-4 pl-12 pr-4 rounded-lg focus:outline-none border-b-2 border-transparent focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#2a2a2a] text-white py-4 pl-12 pr-4 rounded-lg focus:outline-none border-b-2 border-transparent focus:border-blue-500"
            />
          </div>

          {mode === 'REGISTER' && (
            <div className="relative animate-fadeIn">
              <i className="fas fa-users absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input 
                type="text" 
                placeholder="Kode Referral (Opsional)" 
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white py-4 pl-12 pr-4 rounded-lg focus:outline-none border-b-2 border-transparent focus:border-blue-500"
              />
            </div>
          )}

          <button 
            onClick={handleSubmit}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 rounded-lg shadow-xl transform active:scale-[0.98] transition-all uppercase tracking-widest mt-6"
          >
            {mode === 'LOGIN' ? 'MASUK SEKARANG' : 'BUAT AKUN BARU'}
          </button>
        </div>
      </div>

      <div className="mt-auto py-8 flex flex-col items-center space-y-2 opacity-50">
         <span className="text-xs text-gray-500 italic uppercase tracking-widest font-bold">Secure Trading Platform</span>
      </div>
    </div>
  );
};
