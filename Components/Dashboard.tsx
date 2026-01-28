
import React, { useState, useEffect, useMemo } from 'react';
import { AssetType, Transaction } from '../types';

interface Order {
  id: string;
  user: string;
  amount: number;
  price: number;
  profit: number;
  status: 'PENDING' | 'COMPLETED';
  timestamp: string;
  isUserOrder: boolean;
  type: 'BUY' | 'SELL';
}

interface ProfileData {
  inviter: string;
  userId: number;
  joinDate: string;
  daysActive: number;
  totalDeposit: string;
  totalWithdraw: string;
  coinsBought: string;
  coinsSold: string;
  totalBonus: string;
  refIncome: string;
  referralsCount: number;
}

interface DashboardProps {
  onOpenSidebar: () => void;
  balance: { usdt: number; gold: number };
  setBalance: (updater: any) => void;
  globalTransactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenSidebar, balance, setBalance, globalTransactions }) => {
  const [price, setPrice] = useState(0.07542962);
  const [timer, setTimer] = useState('02.45.31');
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [profileCache, setProfileCache] = useState<Record<string, ProfileData>>({});
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(p => p + (Math.random() - 0.5) * 0.000001);
      const now = new Date();
      setTimer(now.toLocaleTimeString('id-ID', { hour12: false }).replace(/:/g, '.'));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStableProfile = (username: string): ProfileData => {
    if (profileCache[username]) return profileCache[username];
    const newData: ProfileData = {
      inviter: ["Skorpion", "Admin", "Midas", "Vortex"][Math.floor(Math.random() * 4)],
      userId: Math.floor(10000 + Math.random() * 90000),
      joinDate: "23.11.2023",
      daysActive: Math.floor(30 + Math.random() * 100),
      totalDeposit: (Math.random() * 500 + 100).toFixed(2),
      totalWithdraw: (Math.random() * 400 + 50).toFixed(2),
      coinsBought: (Math.random() * 600 + 200).toFixed(2),
      coinsSold: (Math.random() * 800 + 300).toFixed(2),
      totalBonus: (Math.random() * 2).toFixed(2),
      refIncome: "0,00",
      referralsCount: Math.floor(Math.random() * 10)
    };
    setProfileCache(prev => ({ ...prev, [username]: newData }));
    return newData;
  };

  const activeProfile = useMemo(() => {
    if (!selectedUser) return null;
    return getStableProfile(selectedUser);
  }, [selectedUser]);

  const handleBuyFromMarket = (e: React.MouseEvent, tx: Transaction) => {
    e.stopPropagation();
    const cost = Number(tx.amount * tx.price);
    
    if (balance.usdt < cost) {
      showToast(`Saldo tidak cukup! Butuh $${cost.toFixed(6)}`, 'error');
      return;
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      user: 'Saya',
      amount: tx.amount,
      price: tx.price,
      profit: 0,
      status: 'COMPLETED',
      timestamp: 'Baru saja',
      isUserOrder: true,
      type: 'BUY'
    };
    
    setMyOrders(prev => [newOrder, ...prev]);
    setBalance((prev: any) => ({ 
      usdt: Number(prev.usdt) - cost, 
      gold: Number(prev.gold) + Number(tx.amount) 
    }));
    showToast(`Berhasil membeli ${tx.amount.toFixed(6)} Emas! Dipotong $${cost.toFixed(6)}`);
  };

  const handleInstantBuy = () => {
    // Kita buat jumlah pembelian instan lebih besar agar saldo terlihat berkurang (misal $1 worth of gold)
    const amountToBuy = Number((1 / price).toFixed(6)); 
    const cost = 1.0; // Beli senilai $1

    if (balance.usdt < cost) {
      showToast(`Saldo tidak cukup untuk beli instan senilai $1!`, 'error');
      return;
    }

    const newOrder: Order = {
      id: 'INST-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      user: 'Saya',
      amount: amountToBuy,
      price: price,
      profit: 0,
      status: 'COMPLETED',
      timestamp: 'Baru saja',
      isUserOrder: true,
      type: 'BUY'
    };

    setMyOrders(prev => [newOrder, ...prev]);
    setBalance((prev: any) => ({ 
      usdt: Number(prev.usdt) - cost, 
      gold: Number(prev.gold) + amountToBuy 
    }));
    showToast(`Beli Instan ${amountToBuy} Emas Berhasil! Dipotong $${cost.toFixed(2)}`);
  };

  const handleSellGold = () => {
    if (balance.gold <= 0) {
      showToast("Aset Emas Anda 0.00000.", "error");
      return;
    }
    const amountToSell = balance.gold;
    const currentPrice = price;
    const usdtGained = amountToSell * currentPrice;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      user: 'Saya',
      amount: amountToSell,
      price: currentPrice,
      profit: Number((usdtGained * 15000).toFixed(0)),
      status: 'PENDING',
      timestamp: 'Baru saja',
      isUserOrder: true,
      type: 'SELL'
    };
    setMyOrders(prev => [newOrder, ...prev]);
    setBalance((prev: any) => ({ ...prev, gold: 0, usdt: Number(prev.usdt) + usdtGained }));
    showToast(`Berhasil menjual aset emas! Status: PENDING`);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {notification && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl animate-bounce flex items-center space-x-3 border ${notification.type === 'success' ? 'bg-green-500 border-green-400 text-white' : 'bg-red-500 border-red-400 text-white'}`}>
           <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
           <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
        </div>
      )}

      <header className="sticky top-0 z-30 bg-[#121212] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-yellow-500 p-1 rounded-sm shadow-lg rotate-3"><i className="fas fa-layer-group text-black text-sm"></i></div>
          <span className="font-black text-yellow-500 tracking-tighter text-xl uppercase">Kripto Emas</span>
        </div>
        <div className="flex items-center space-x-5">
          <button className="text-gray-500 hover:text-white"><i className="fas fa-question-circle text-xl"></i></button>
          <button onClick={onOpenSidebar} className="text-gray-500 hover:text-white"><i className="fas fa-bars text-2xl"></i></button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-[#1e1e1e] rounded-[2rem] p-6 shadow-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Saldo Aset</h3>
            <span className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full font-black flex items-center border border-green-500/20">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span> ONLINE
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Saldo USDT</p>
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-xs text-black"><i className="fas fa-dollar-sign"></i></div>
                <span className="text-2xl font-black text-white">
                  ${Number(balance.usdt).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </span>
              </div>
            </div>
            <div className="space-y-2 border-l border-gray-800 pl-6">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Aset Emas</p>
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-xs text-black"><i className="fas fa-coins"></i></div>
                <span className="text-2xl font-black text-yellow-500">{Number(balance.gold).toFixed(5)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1e1e1e] p-5 rounded-3xl border border-gray-800 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><i className="fas fa-chart-line text-6xl text-yellow-500"></i></div>
            <p className="text-[10px] text-gray-500 mb-1 uppercase font-black tracking-widest">Harga Real-time</p>
            <div className="text-xl font-black text-yellow-500 tracking-tighter">{price.toFixed(8)}$</div>
            <p className="text-[9px] text-gray-600 mt-2 font-bold uppercase tracking-tighter">Server Time: {timer}</p>
          </div>
          <div className="grid grid-rows-2 gap-2">
            <button onClick={handleInstantBuy} className="bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 p-3">
              <i className="fas fa-shopping-cart"></i>
              <span>BELI $1 EMAS</span>
            </button>
            <button onClick={handleSellGold} className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 p-3">
              <i className="fas fa-hand-holding-usd"></i>
              <span>JUAL EMAS</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
           <div className="flex flex-col">
              <div className="flex space-x-3 items-center mb-1">
                 <span className="bg-yellow-500 text-black text-[10px] px-3 py-0.5 rounded-full font-black uppercase tracking-widest">Live Market</span>
                 <button onClick={() => setShowMyOrders(true)} className="text-yellow-500 text-[10px] font-black uppercase tracking-widest hover:underline">Pesanan Saya ({myOrders.length})</button>
              </div>
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Aktivitas Global</div>
           </div>
           <button onClick={() => setShowMyOrders(true)} className="bg-[#1e1e1e] px-4 py-2 rounded-xl text-[10px] font-black text-yellow-500 border border-yellow-500/20 shadow-lg">RIWAYAT SAYA</button>
        </div>

        <div className="space-y-3">
           {globalTransactions.map((tx) => (
             <div key={tx.id} className="bg-[#1e1e1e] border border-gray-800 rounded-[1.5rem] p-4 flex items-center justify-between animate-fadeIn hover:bg-[#252525] transition-colors">
                <div className="flex items-center space-x-4">
                   <div className="flex flex-col">
                      <span className="text-[9px] text-gray-600 font-black uppercase mb-1">{tx.timestamp}</span>
                      <div className="flex items-center space-x-2">
                         <i className="fas fa-coins text-yellow-500 text-xs"></i>
                         <span className="font-black text-sm text-white">{tx.amount.toFixed(6)}</span>
                      </div>
                   </div>
                   <div className="h-8 w-px bg-gray-800"></div>
                   <div className="flex flex-col">
                      <span className="text-yellow-500 font-black text-sm">${tx.price.toFixed(4)}</span>
                      <span className="text-[10px] text-green-500 font-black tracking-tighter">+Rp{(tx.profit || 0).toLocaleString()}</span>
                   </div>
                </div>
                <div className="flex items-center space-x-3">
                   <button onClick={() => setSelectedUser(tx.user)} className="bg-gray-800/50 px-3 py-1.5 rounded-full text-[10px] font-black text-gray-400 border border-gray-700 hover:text-yellow-500 transition-colors">{tx.user}</button>
                   <button onClick={(e) => handleBuyFromMarket(e, tx)} className="bg-yellow-500 text-black text-[10px] font-black px-4 py-1.5 rounded-lg border border-yellow-500 shadow-lg hover:bg-yellow-400 transition-all active:scale-90">BELI</button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {selectedUser && activeProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn" onClick={() => setSelectedUser(null)}>
          <div className="w-full max-w-md bg-[#fafafa] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh] border border-yellow-500/20" onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-12 pb-8 text-center relative bg-white">
               <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors"><i className="fas fa-times text-2xl"></i></button>
               <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-700 rounded-full flex items-center justify-center mx-auto shadow-[0_8px_20px_rgba(234,179,8,0.3)] border-4 border-white"><i className="fas fa-user text-5xl text-white"></i></div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-4 border-white rounded-full"></div>
               </div>
               <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-1">{selectedUser}</h2>
               <div className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-4">ID Pengguna: {activeProfile.userId}</div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3 bg-[#fafafa] no-scrollbar">
               {[
                 { icon: 'fa-wallet', label: 'Total setoran:', value: `${activeProfile.totalDeposit} dolar`, color: 'text-teal-600' },
                 { icon: 'fa-hand-holding-usd', label: 'Total penarikan:', value: `${activeProfile.totalWithdraw}$`, color: 'text-teal-600' },
                 { icon: 'fa-cart-plus', label: 'Jumlah koin yang dibeli:', value: `${activeProfile.coinsBought} dolar`, color: 'text-teal-600' },
                 { icon: 'fa-shopping-cart', label: 'Jumlah koin yang terjual:', value: `${activeProfile.coinsSold} dolar`, color: 'text-teal-600' },
                 { icon: 'fa-gift', label: 'Jumlah total bonus:', value: `${activeProfile.totalBonus} dolar`, color: 'text-teal-600' },
                 { icon: 'fa-paper-plane', label: 'Penghasilan Referensi:', value: `${activeProfile.refIncome} dolar`, color: 'text-teal-600' },
                 { icon: 'fa-users', label: 'Kami mengundang rujukan:', value: activeProfile.referralsCount, color: 'text-teal-600' },
               ].map((item, idx) => (
                 <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-yellow-600 transition-colors"><i className={`fas ${item.icon} text-lg`}></i></div>
                       <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight leading-tight max-w-[150px]">{item.label}</span>
                    </div>
                    <div className={`text-sm font-black ${item.color} tracking-tighter`}>{item.value}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {showMyOrders && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4" onClick={() => setShowMyOrders(false)}>
          <div className="w-full max-w-lg bg-[#121212] rounded-[2.5rem] border border-gray-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-2xl font-black text-yellow-500 tracking-tighter uppercase">Order Saya</h2>
              <button onClick={() => setShowMyOrders(false)} className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center text-white"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-5 no-scrollbar flex-1">
              {myOrders.length === 0 ? (
                <div className="text-center py-20 opacity-20"><i className="fas fa-receipt text-7xl mb-6 text-gray-400"></i><p className="font-black uppercase tracking-widest text-sm">Belum ada riwayat</p></div>
              ) : (
                myOrders.map(order => (
                  <div key={order.id} className={`bg-[#1e1e1e] p-5 rounded-3xl border ${order.type === 'BUY' ? 'border-green-500/20' : 'border-yellow-500/20'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col space-y-1">
                        <span className={`text-[9px] font-black ${order.type === 'BUY' ? 'bg-green-500' : 'bg-yellow-500'} text-black px-3 py-1 rounded-full uppercase tracking-widest w-fit`}>{order.type === 'BUY' ? 'COMPLETED' : 'PENDING'}</span>
                        <p className="text-lg font-black mt-1 text-white">{order.amount.toFixed(6)} EMAS</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-600 font-black uppercase">Harga Beli</p>
                        <p className="text-white font-black text-lg">${order.price.toFixed(4)}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-800 flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest"><span>{order.timestamp}</span><span>ID: #{order.id}</span></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
