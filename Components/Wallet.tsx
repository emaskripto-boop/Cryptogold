
import React, { useState } from 'react';
import { DatabaseService } from '../services/db';
import { Deposit } from '../types';

interface WalletProps {
  balance: { usdt: number; gold: number };
  setBalance: React.Dispatch<React.SetStateAction<{ usdt: number; gold: number }>>;
  username: string;
}

const DEPOSIT_ADDRESSES: Record<string, string> = {
  'USDT (TRC20)': 'THmYpKmnFoZcArAZZvgjGqmHm1SHMm1tsP',
  'TRX': 'THmYpKmnFoZcArAZZvgjGqmHm1SHMm1tsP',
  'DOGE': 'DLtA6tDZCaDyd2G8RA4cuSwaHBtX2sSawK',
  'TON': 'UQA0f8zAeI8fxtv4RRaXizsQE1o_H1yup3u5fJs24oytT6FW'
};

export const Wallet: React.FC<WalletProps> = ({ balance, setBalance, username }) => {
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'TRANSFER'>('DEPOSIT');
  const [selectedCurrency, setSelectedCurrency] = useState('USDT (TRC20)');
  const [copied, setCopied] = useState(false);
  const [wdAmount, setWdAmount] = useState('');
  const [depAmount, setDepAmount] = useState('10');
  const [senderAddress, setSenderAddress] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitDeposit = async () => {
    const amount = parseFloat(depAmount);
    if (isNaN(amount) || amount <= 0) return alert("Jumlah tidak valid");
    if (!senderAddress.trim()) return alert("Harap masukkan alamat pengirim Anda");
    
    const stats = DatabaseService.getGlobalStats();
    const newDep: Deposit = {
      id: 'DEP-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      user: username,
      amount: amount,
      currency: selectedCurrency,
      senderAddress: senderAddress.trim(),
      timestamp: 'Baru saja',
      status: 'PENDING' as const
    };
    
    DatabaseService.updateGlobalStats({ deposits: [newDep, ...stats.deposits] });
    alert("Permintaan deposit berhasil dikirim! Silakan tunggu konfirmasi admin Mistake.");
    setSenderAddress('');
  };

  const submitWithdrawal = async () => {
    const amount = parseFloat(wdAmount);
    if (isNaN(amount) || amount < 10) return alert("Minimal penarikan 10 USDT");
    if (amount > balance.usdt) return alert("Saldo USDT tidak mencukupi");

    const stats = DatabaseService.getGlobalStats();
    const newWit = {
      id: 'WD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      user: username,
      amount: amount,
      currency: 'USDT (TRC20)',
      timestamp: 'Baru saja',
      status: 'PENDING' as const
    };

    // Potong saldo sementara
    setBalance(prev => ({ ...prev, usdt: prev.usdt - amount }));
    
    DatabaseService.updateGlobalStats({ withdrawals: [newWit, ...stats.withdrawals] });
    alert("Permintaan penarikan berhasil! Status: PENDING. Admin akan segera memproses.");
    setWdAmount('');
  };

  const renderWithdraw = () => (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl">
        <h4 className="text-xs font-black text-yellow-500 uppercase mb-1">Penting</h4>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Sesuai kebijakan platform, <span className="text-white font-bold underline">Hanya Saldo USDT</span> yang dapat ditarik. Jika ingin menarik nilai Emas, silakan <span className="text-white font-bold">Jual Emas</span> Anda terlebih dahulu.
        </p>
      </div>

      <div className="bg-[#1e1e1e] p-5 rounded-2xl border border-gray-800">
        <label className="text-[10px] text-gray-500 uppercase block mb-2 font-black tracking-widest">Alamat USDT (TRC20) Tujuan</label>
        <input 
          type="text" 
          placeholder="T9x..." 
          className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 text-sm focus:outline-none focus:border-yellow-500 text-white"
        />
      </div>

      <div className="bg-[#1e1e1e] p-5 rounded-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-3">
           <label className="text-[10px] text-gray-500 uppercase font-black">Jumlah Penarikan</label>
           <span className="text-[10px] text-green-500 font-bold">Tersedia: ${balance.usdt.toFixed(2)}</span>
        </div>
        <div className="relative">
          <input 
            type="number" 
            placeholder="Min. 10 USDT" 
            value={wdAmount}
            onChange={(e) => setWdAmount(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 text-lg font-black focus:outline-none focus:border-yellow-500 text-white"
          />
          <button onClick={() => setWdAmount(balance.usdt.toString())} className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500 text-xs font-black">MAX</button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between text-[10px]">
          <span className="text-gray-500 font-bold uppercase">Biaya Jaringan</span>
          <span className="text-white">1.00 USDT</span>
        </div>
      </div>

      <button onClick={submitWithdrawal} className="w-full bg-yellow-500 text-black font-black py-5 rounded-2xl shadow-xl shadow-yellow-500/10 active:scale-95 transition-all uppercase tracking-widest text-sm">
        KONFIRMASI PENARIKAN USDT
      </button>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-[2.5rem] shadow-2xl border border-gray-800 relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] opacity-10">
          <i className="fas fa-wallet text-[120px] -rotate-12 text-yellow-500"></i>
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Saldo USDT</p>
          <div className="text-4xl font-black text-white mb-6">
            <span className="text-green-500">$</span> {balance.usdt.toLocaleString()}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800">
             <div>
               <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Dompet Emas</p>
               <p className="text-sm font-black text-yellow-500 flex items-center">
                 <i className="fas fa-coins mr-2"></i> {balance.gold.toFixed(5)}
               </p>
             </div>
             <div className="border-l border-gray-800 pl-4">
               <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Status Penarikan</p>
               <p className="text-[10px] font-black text-blue-400 uppercase">Aktif (TRC20 Only)</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex bg-[#1e1e1e] p-1.5 rounded-2xl border border-gray-800">
        {(['DEPOSIT', 'WITHDRAW', 'TRANSFER'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all duration-300 ${activeTab === tab ? 'bg-yellow-500 text-black shadow-lg scale-105' : 'text-gray-500 hover:text-white'}`}
          >
            {tab === 'DEPOSIT' ? 'DEPOSIT' : tab === 'WITHDRAW' ? 'PENARIKAN' : 'KIRIM'}
          </button>
        ))}
      </div>

      {activeTab === 'DEPOSIT' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800 text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase mb-4 tracking-widest">Saluran Deposit USDT</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.keys(DEPOSIT_ADDRESSES).map(c => (
                <button 
                  key={c} 
                  onClick={() => setSelectedCurrency(c)}
                  className={`p-3 rounded-xl border text-[10px] font-black transition-all ${selectedCurrency === c ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg' : 'bg-[#2a2a2a] border-gray-700 text-gray-400'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <p className="text-[9px] text-gray-500 font-black uppercase text-left mb-1 pl-2">Jumlah Konfirmasi Deposit ($)</p>
                <input 
                  type="number" 
                  placeholder="Jumlah ($)" 
                  value={depAmount}
                  onChange={(e) => setDepAmount(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 text-center text-sm font-black text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
              
              <div className="relative">
                <p className="text-[9px] text-gray-500 font-black uppercase text-left mb-1 pl-2">Alamat Pengirim Anda</p>
                <input 
                  type="text" 
                  placeholder="Masukkan Alamat Wallet Pengirim" 
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 text-center text-[11px] font-black text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl flex flex-col items-center shadow-xl">
            <div className="bg-gray-50 p-4 rounded-2xl mb-4">
               <i className="fas fa-qrcode text-[140px] text-black"></i>
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">Alamat {selectedCurrency}</p>
            <div 
              onClick={() => handleCopy(DEPOSIT_ADDRESSES[selectedCurrency])}
              className="w-full bg-gray-100 p-4 rounded-xl flex justify-between items-center text-black border border-gray-200 cursor-pointer mb-4"
            >
              <span className="text-[11px] font-mono font-bold truncate pr-4">{DEPOSIT_ADDRESSES[selectedCurrency]}</span>
              <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-yellow-600`}></i>
            </div>
            <button onClick={submitDeposit} className="w-full bg-black text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest active:scale-95 transition-all">SAYA SUDAH TRANSFER</button>
          </div>
        </div>
      )}

      {activeTab === 'WITHDRAW' && renderWithdraw()}

      {activeTab === 'TRANSFER' && (
        <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-gray-800 animate-fadeIn text-center py-20">
           <i className="fas fa-tools text-5xl text-gray-700 mb-4"></i>
           <p className="text-xs font-black text-gray-500 uppercase">Fitur Transfer Sedang Maintenance</p>
        </div>
      )}
    </div>
  );
};
