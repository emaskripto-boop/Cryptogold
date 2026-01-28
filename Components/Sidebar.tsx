
import React, { useState } from 'react';
import { UserStats, ViewMode } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  nickname: string;
  onLogout: () => void;
  onNavigate: (view: ViewMode) => void;
}

type StatTab = 'TRADE' | 'FINANCE' | 'USERS';

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, stats, nickname, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<StatTab>('TRADE');

  const isAdmin = nickname.toLowerCase() === 'mistake';

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 h-full w-80 bg-[#121212] text-white z-50 transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-hidden border-l border-gray-800 shadow-2xl flex flex-col`}>
        {/* Header: User Profile */}
        <div className="p-6 bg-[#1e1e1e] border-b border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-yellow-500 uppercase tracking-tighter flex items-center">
              <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-ping"></span>
              Live Feed
            </h2>
            <button onClick={onClose} className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-[#252525] rounded-2xl border border-gray-700">
            <div className={`w-12 h-12 rounded-full ${isAdmin ? 'bg-red-600' : 'bg-yellow-500'} flex items-center justify-center text-white shadow-lg`}>
              <i className={`fas ${isAdmin ? 'fa-user-shield' : 'fa-user-tie'} text-xl`}></i>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Akun Aktif</p>
              <p className="text-md font-black text-white">{nickname}</p>
              <div className="flex items-center mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-[9px] text-green-500 font-bold uppercase">{isAdmin ? 'ADMINISTRATOR' : 'Terverifikasi'}</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <button 
              onClick={() => {
                onNavigate('ADMIN');
                onClose();
              }}
              className="w-full mt-4 bg-red-600 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest animate-pulse shadow-lg shadow-red-600/30"
            >
              MENU PANEL MASTER MISTAKE
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#1e1e1e] border-b border-gray-800 p-1">
          <button onClick={() => setActiveTab('TRADE')} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${activeTab === 'TRADE' ? 'bg-yellow-500 text-black' : 'text-gray-500'}`}>TRADE</button>
          <button onClick={() => setActiveTab('FINANCE')} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${activeTab === 'FINANCE' ? 'bg-yellow-500 text-black' : 'text-gray-500'}`}>KEUANGAN</button>
          <button onClick={() => setActiveTab('USERS')} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${activeTab === 'USERS' ? 'bg-yellow-500 text-black' : 'text-gray-500'}`}>MEMBER</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {activeTab === 'TRADE' && (
            <div className="space-y-3">
              {stats.transactions.length === 0 ? (
                <p className="text-center py-10 text-[10px] text-gray-600 font-black uppercase">Belum ada aktivitas trade</p>
              ) : (
                stats.transactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-[#1e1e1e] rounded-2xl border border-gray-800 animate-fadeIn">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase">{tx.user}</span>
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${tx.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {tx.type === 'BUY' ? 'BELI' : 'JUAL'}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs font-black text-white">{tx.amount.toFixed(6)} EMAS</p>
                        <p className="text-[9px] text-yellow-500 font-bold tracking-tight">Potensi: Rp{tx.profit?.toLocaleString()}</p>
                      </div>
                      <span className="text-[8px] text-gray-600 font-bold uppercase">{tx.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'FINANCE' && (
            <div className="space-y-6">
              {/* Deposit Section */}
              <div>
                <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1 mb-2">Deposit Terbaru</h4>
                <div className="space-y-2">
                  {stats.deposits.length === 0 ? (
                    <p className="text-center py-4 text-[9px] text-gray-700 italic">Menunggu aktivitas deposit...</p>
                  ) : (
                    stats.deposits.map((dep) => (
                      <div key={dep.id} className="flex items-center justify-between p-3 bg-[#1e1e1e] rounded-xl border border-gray-800">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg ${dep.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'} flex items-center justify-center text-[10px]`}><i className="fas fa-plus"></i></div>
                          <div><p className="text-[10px] font-bold text-white">{dep.user}</p><p className={`text-[8px] uppercase font-black ${dep.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'}`}>{dep.status}</p></div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-green-500">+${dep.amount.toFixed(2)}</p>
                           <p className="text-[8px] text-gray-600 font-bold uppercase">{dep.currency.split(' ')[0]}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Withdrawal Section */}
              <div>
                <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1 mb-2">Penarikan Terbaru</h4>
                <div className="space-y-2">
                  {stats.withdrawals.length === 0 ? (
                    <p className="text-center py-4 text-[9px] text-gray-700 italic">Menunggu aktivitas penarikan...</p>
                  ) : (
                    stats.withdrawals.map((wit) => (
                      <div key={wit.id} className="flex items-center justify-between p-3 bg-[#1e1e1e] rounded-xl border border-gray-800">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg ${wit.status === 'COMPLETED' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'} flex items-center justify-center text-[10px]`}><i className="fas fa-arrow-up"></i></div>
                          <div><p className="text-[10px] font-bold text-white">{wit.user}</p><p className={`text-[8px] uppercase font-black ${wit.status === 'COMPLETED' ? 'text-green-500' : 'text-blue-500'}`}>{wit.status}</p></div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-red-500">-${wit.amount.toFixed(2)}</p>
                           <p className="text-[8px] text-gray-600 font-bold uppercase">USDT</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'USERS' && (
            <div className="space-y-3">
              <h4 className="text-[9px] font-black text-gray-600 uppercase mb-2 tracking-widest pl-1">Member Terbaru</h4>
              {stats.newUsers.map((user, idx) => (
                <div key={`${user.name}-${idx}`} className="flex items-center p-4 bg-[#1e1e1e] rounded-2xl border border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mr-4 border border-blue-500/20"><i className="fas fa-user text-xs"></i></div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-white">{user.name}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">{user.joined}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-[#1e1e1e] sticky bottom-0">
          <button onClick={onLogout} className="w-full flex items-center justify-center space-x-3 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-2xl transition-all">
            <i className="fas fa-sign-out-alt text-lg"></i>
            <span className="font-black uppercase tracking-widest text-xs">Keluar</span>
          </button>
        </div>
      </div>
    </>
  );
};
