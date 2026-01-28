import React, { useState } from 'react';
import { UserStats, Deposit, Withdrawal } from '../types';
import { DatabaseService } from '../services/db';

interface AdminPanelProps {
  stats: UserStats;
  onRefresh: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ stats, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'DEPOSITS' | 'WITHDRAWALS'>('DEPOSITS');

  const handleAction = async (id: string, type: 'DEP' | 'WD', action: 'APPROVE' | 'REJECT') => {
    const status = action === 'APPROVE' ? 'COMPLETED' : 'FAILED';
    if (type === 'DEP') {
      await DatabaseService.processDeposit(id, status);
    } else {
      await DatabaseService.processWithdrawal(id, status);
    }
    onRefresh();
    alert(`Transaksi berhasil di-${action.toLowerCase()}`);
  };

  const pendingDeposits = stats.deposits.filter(d => d.status === 'PENDING');
  const pendingWithdrawals = stats.withdrawals.filter(w => w.status === 'PENDING');

  return (
    <div className="p-4 space-y-6 animate-fadeIn pb-24">
      <div className="bg-gradient-to-r from-red-600 to-red-900 p-6 rounded-[2rem] shadow-2xl border border-red-500/30">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center">
          <i className="fas fa-user-shield mr-3"></i> Otoritas Admin
        </h2>
        <p className="text-red-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Halo Master Mistake, selamat bekerja!</p>
      </div>

      <div className="flex bg-[#1e1e1e] p-1.5 rounded-2xl border border-gray-800">
        <button 
          onClick={() => setActiveTab('DEPOSITS')}
          className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${activeTab === 'DEPOSITS' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-500'}`}
        >
          DEPOSIT ({pendingDeposits.length})
        </button>
        <button 
          onClick={() => setActiveTab('WITHDRAWALS')}
          className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${activeTab === 'WITHDRAWALS' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-500'}`}
        >
          PENARIKAN ({pendingWithdrawals.length})
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'DEPOSITS' ? (
          pendingDeposits.length === 0 ? (
            <div className="text-center py-20 opacity-30 flex flex-col items-center">
              <i className="fas fa-check-circle text-5xl mb-4"></i>
              <p className="font-black text-xs uppercase tracking-widest">Tidak ada deposit pending</p>
            </div>
          ) : (
            pendingDeposits.map(dep => (
              <div key={dep.id} className="bg-[#1e1e1e] border border-gray-800 rounded-3xl p-5 space-y-4 animate-fadeIn">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">Pending Deposit</span>
                    <h3 className="text-lg font-black mt-2 text-white">{dep.user}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{dep.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-green-500">${dep.amount.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase">{dep.currency}</p>
                  </div>
                </div>

                {/* Display Sender Address Section */}
                <div className="bg-[#2a2a2a] p-3 rounded-xl border border-gray-700">
                  <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Alamat Pengirim</p>
                  <p className="text-[10px] text-yellow-500 font-mono break-all font-bold">
                    {dep.senderAddress || 'Tidak ada alamat dilampirkan'}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-800">
                  <button onClick={() => handleAction(dep.id, 'DEP', 'APPROVE')} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-green-600/20">APPROVE</button>
                  <button onClick={() => handleAction(dep.id, 'DEP', 'REJECT')} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-600/20">REJECT</button>
                </div>
              </div>
            ))
          )
        ) : (
          pendingWithdrawals.length === 0 ? (
            <div className="text-center py-20 opacity-30 flex flex-col items-center">
              <i className="fas fa-tasks text-5xl mb-4"></i>
              <p className="font-black text-xs uppercase tracking-widest">Tidak ada penarikan pending</p>
            </div>
          ) : (
            pendingWithdrawals.map(wit => (
              <div key={wit.id} className="bg-[#1e1e1e] border border-gray-800 rounded-3xl p-5 space-y-4 animate-fadeIn">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">Pending Withdrawal</span>
                    <h3 className="text-lg font-black mt-2 text-white">{wit.user}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{wit.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-red-500">${wit.amount.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase">TRC20 USDT</p>
                  </div>
                </div>
                <div className="flex space-x-3 pt-4 border-t border-gray-800">
                  <button onClick={() => handleAction(wit.id, 'WD', 'APPROVE')} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">APPROVE</button>
                  <button onClick={() => handleAction(wit.id, 'WD', 'REJECT')} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">REJECT</button>
                </div>
              </div>
            ))
          )
        )}
      </div>
      
      {/* User Quick Stats (Admin Only) */}
      <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-gray-800 mt-10">
         <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Ringkasan Sistem</h4>
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#252525] p-4 rounded-2xl border border-gray-700 text-center">
               <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Total Users</p>
               <p className="text-xl font-black text-white">{DatabaseService.getUsers().length}</p>
            </div>
            <div className="bg-[#252525] p-4 rounded-2xl border border-gray-700 text-center">
               <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Total Transaksi</p>
               <p className="text-xl font-black text-yellow-500">{stats.transactions.length}</p>
            </div>
         </div>
      </div>
    </div>
  );
};
