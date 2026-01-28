
import React, { useState, useEffect, useCallback } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { Wallet } from './components/Wallet';
import { Referral } from './components/Referral';
import { AdminPanel } from './components/AdminPanel';
import { DatabaseService } from './services/db';
import { ViewMode, UserStats, AssetType, UserAccount, Transaction, Deposit, Withdrawal, AuthMode } from './types';

const BonusView: React.FC = () => (
  <div className="p-6 flex flex-col items-center justify-center space-y-4 text-center min-h-[70vh]">
    <div className="bg-yellow-500/10 p-8 rounded-full border border-yellow-500/20 mb-4 animate-bounce">
       <i className="fas fa-gift text-6xl text-yellow-500"></i>
    </div>
    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Hadiah & Bonus</h2>
    <p className="text-gray-400 max-w-xs text-sm">Selesaikan misi harian dan klaim hadiah emas gratis setiap hari!</p>
    <div className="grid grid-cols-1 gap-3 w-full max-w-sm mt-8">
      {['Login Harian', 'Trade Pertama', 'Verifikasi Akun'].map((task) => (
        <div key={task} className="bg-[#1e1e1e] p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
          <div className="text-left">
            <p className="text-xs font-bold text-white">{task}</p>
            <p className="text-[10px] text-yellow-500">+0.005 Gold</p>
          </div>
          <button className="bg-gray-800 text-[10px] font-bold px-4 py-2 rounded-lg opacity-50 cursor-not-allowed">KLAIM</button>
        </div>
      ))}
    </div>
  </div>
);

const USERNAMES = [
  'Nelson5030', 'Erzulie', 'SamuelPie', 'Yaxcelis24', 'Jmichel', 'WanOOo', 'Fata10', 'Lailaaa', 
  'Danri', 'Muhammad99', 'CryptoKing', 'GoldMaster', 'TraderX', 'BullRun', 'RichieRich', 
  'AlphaTrade', 'Zenith', 'Vortex_G', 'MidasTouch', 'Satoshi_N', 'BlockWhale', 'LunaMoon'
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>('TRADE');
  const [stats, setStats] = useState<UserStats>(DatabaseService.getGlobalStats());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    const initSession = async () => {
      const user = DatabaseService.getSession();
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
      setStats(DatabaseService.getGlobalStats());
      setLoading(false);
    };
    initSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      DatabaseService.saveUser(currentUser);
    }
  }, [currentUser, isLoggedIn]);

  const refreshStats = () => {
    const updatedStats = DatabaseService.getGlobalStats();
    setStats(updatedStats);
    const user = DatabaseService.getSession();
    if (user) setCurrentUser(user);
  };

  // --- BOT SYSTEM ---
  useEffect(() => {
    if (!isLoggedIn || !currentUser || currentView === 'ADMIN') return;

    const botInterval = setInterval(() => {
      const rand = Math.random();
      const currentStats = DatabaseService.getGlobalStats();
      const availableUsernames = USERNAMES.filter(name => name.toLowerCase() !== currentUser.username.toLowerCase());
      const randomUser = () => availableUsernames[Math.floor(Math.random() * availableUsernames.length)];

      let updatedStats = { ...currentStats };

      if (rand > 0.4) {
        const newTx: Transaction = {
          id: 'TX-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          user: randomUser(),
          amount: Number((Math.random() * 0.12 + 0.001).toFixed(6)),
          price: Number((Math.random() * 0.0005 + 0.0754).toFixed(8)),
          profit: Math.floor(Math.random() * 50000 + 5000),
          type: Math.random() > 0.5 ? 'SELL' : 'BUY',
          timestamp: 'Baru saja',
          asset: AssetType.GOLD
        };
        updatedStats.transactions = [newTx, ...updatedStats.transactions].slice(0, 25);
      }

      if (rand < 0.2) {
        const newDep: Deposit = {
          id: 'DEP-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          user: randomUser(),
          amount: Math.floor(Math.random() * 100) + 10,
          currency: ['USDT (TRC20)', 'TRX', 'TON', 'DOGE'][Math.floor(Math.random() * 4)],
          timestamp: 'Baru saja',
          status: 'COMPLETED'
        };
        updatedStats.deposits = [newDep, ...updatedStats.deposits].slice(0, 20);
      }

      if (rand < 0.1) {
        const newWit: Withdrawal = {
          id: 'WD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          user: randomUser(),
          amount: Math.floor(Math.random() * 50) + 10,
          currency: 'USDT (TRC20)',
          timestamp: 'Baru saja',
          status: 'COMPLETED'
        };
        updatedStats.withdrawals = [newWit, ...updatedStats.withdrawals].slice(0, 20);
      }

      if (rand > 0.85) {
        const newUserBot = { name: randomUser(), joined: 'Baru saja' };
        if (updatedStats.newUsers[0]?.name !== newUserBot.name) {
          updatedStats.newUsers = [newUserBot, ...updatedStats.newUsers].slice(0, 15);
        }
      }

      DatabaseService.updateGlobalStats(updatedStats);
      setStats(updatedStats);
    }, 4000);

    return () => clearInterval(botInterval);
  }, [isLoggedIn, currentUser, currentView]);

  const handleAuth = async (mode: AuthMode, name: string, referralCode?: string) => {
    setLoading(true);
    try {
      if (mode === 'LOGIN') {
        const user = await DatabaseService.login(name);
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
        } else {
          throw new Error("Akun tidak ditemukan!");
        }
      } else {
        const user = await DatabaseService.register(name, referralCode);
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
    } catch (error: any) {
      setLoading(false);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    DatabaseService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsSidebarOpen(false);
    setCurrentView('TRADE');
  };

  // PERBAIKAN: Fungsi updateBalance yang lebih kuat
  const updateBalance = useCallback((updater: any) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const newBalance = typeof updater === 'function' ? updater(prev.balance) : updater;
      
      return {
        ...prev,
        balance: {
          usdt: Number(newBalance.usdt ?? prev.balance.usdt),
          gold: Number(newBalance.gold ?? prev.balance.gold)
        }
      };
    });
  }, []);

  if (loading) return null;
  if (!isLoggedIn || !currentUser) return <Auth onAuth={handleAuth} />;

  const renderContent = () => {
    switch(currentView) {
      case 'ADMIN':
        return (
          <div className="flex flex-col min-h-screen">
             <header className="sticky top-0 z-30 bg-red-900/10 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-red-500/20">
              <h1 className="text-xl font-black text-red-500 uppercase tracking-tighter">Panel Master Mistake</h1>
              <button onClick={() => setCurrentView('TRADE')} className="text-gray-400 font-black text-xs uppercase tracking-widest">Tutup</button>
            </header>
            <AdminPanel stats={stats} onRefresh={refreshStats} />
          </div>
        );
      case 'TRADE':
        return <Dashboard onOpenSidebar={() => setIsSidebarOpen(true)} balance={currentUser.balance} setBalance={updateBalance} globalTransactions={stats.transactions} />;
      case 'WALLET':
        return <div className="min-h-screen"><Wallet balance={currentUser.balance} setBalance={updateBalance} username={currentUser.username} /><div className="h-20" /></div>;
      case 'REFERRAL':
        return <div className="min-h-screen"><Referral referralsList={currentUser.referrals} referralCode={currentUser.uniqueReferralCode} /><div className="h-20" /></div>;
      case 'BONUS':
        return <BonusView />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#121212] text-white font-sans overflow-x-hidden">
      {renderContent()}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} stats={stats} nickname={currentUser.username} onLogout={handleLogout} onNavigate={setCurrentView} />
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e]/90 backdrop-blur-lg border-t border-gray-800 h-20 flex items-center justify-around z-30 px-2 shadow-2xl">
        <button onClick={() => setCurrentView('WALLET')} className={`flex flex-col items-center flex-1 py-2 ${currentView === 'WALLET' ? 'text-yellow-500' : 'text-gray-500'}`}><i className="fas fa-wallet text-xl"></i><span className="text-[8px] font-black uppercase tracking-widest">Dompet</span></button>
        <button onClick={() => setCurrentView('REFERRAL')} className={`flex flex-col items-center flex-1 py-2 ${currentView === 'REFERRAL' ? 'text-yellow-500' : 'text-gray-500'}`}><i className="fas fa-users text-xl"></i><span className="text-[8px] font-black uppercase tracking-widest">Referral</span></button>
        <button onClick={() => setCurrentView('TRADE')} className={`relative flex flex-col items-center -mt-10 bg-yellow-500 text-black w-16 h-16 rounded-full border-4 border-[#121212] justify-center shadow-xl ${currentView === 'TRADE' ? 'scale-110' : ''}`}><i className="fas fa-exchange-alt text-2xl"></i></button>
        <button onClick={() => setIsSidebarOpen(true)} className="flex flex-col items-center flex-1 py-2 text-gray-500"><i className="fas fa-chart-line text-xl"></i><span className="text-[8px] font-black uppercase tracking-widest">Statistik</span></button>
        <button onClick={() => setCurrentView('BONUS')} className={`flex flex-col items-center flex-1 py-2 ${currentView === 'BONUS' ? 'text-yellow-500' : 'text-gray-500'}`}><i className="fas fa-gift text-xl"></i><span className="text-[8px] font-black uppercase tracking-widest">Bonus</span></button>
      </nav>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background: #121212; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
