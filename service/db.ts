import { UserAccount, Transaction, UserStats, Deposit, Withdrawal } from '../types';

const DB_KEY = 'cryptogold_db_v1';
const SESSION_KEY = 'cryptogold_session_v1';
const STATS_KEY = 'cryptogold_stats_v1';

export const DatabaseService = {
  delay: (ms: number) => new Promise(res => setTimeout(res, ms)),

  getUsers: (): UserAccount[] => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  },

  getGlobalStats: (): UserStats => {
    const data = localStorage.getItem(STATS_KEY);
    if (data) return JSON.parse(data);
    
    return {
      newUsers: [
        { name: 'Nelson5030', joined: '2 minutes ago' },
        { name: 'TraderX', joined: '7 minutes ago' },
      ],
      deposits: [],
      withdrawals: [],
      transactions: []
    };
  },

  updateGlobalStats: (newStats: Partial<UserStats>) => {
    const current = DatabaseService.getGlobalStats();
    const updated = { ...current, ...newStats };
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
    return updated;
  },

  saveUser: async (user: UserAccount) => {
    const users = DatabaseService.getUsers();
    const index = users.findIndex(u => u.username.toLowerCase() === user.username.toLowerCase());
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  },

  // Admin: Approve atau Reject Deposit
  processDeposit: async (depositId: string, status: 'COMPLETED' | 'FAILED'): Promise<void> => {
    const stats = DatabaseService.getGlobalStats();
    const deposits = [...stats.deposits];
    const index = deposits.findIndex(d => d.id === depositId);
    
    if (index > -1 && deposits[index].status === 'PENDING') {
      const dep = deposits[index];
      dep.status = status;
      
      if (status === 'COMPLETED') {
        const users = DatabaseService.getUsers();
        const userIndex = users.findIndex(u => u.username === dep.user);
        if (userIndex > -1) {
          users[userIndex].balance.usdt += dep.amount;
          localStorage.setItem(DB_KEY, JSON.stringify(users));
        }
      }
      
      DatabaseService.updateGlobalStats({ deposits });
    }
  },

  // Admin: Approve atau Reject Withdrawal
  processWithdrawal: async (withdrawalId: string, status: 'COMPLETED' | 'FAILED'): Promise<void> => {
    const stats = DatabaseService.getGlobalStats();
    const withdrawals = [...stats.withdrawals];
    const index = withdrawals.findIndex(w => w.id === withdrawalId);
    
    if (index > -1 && withdrawals[index].status === 'PENDING') {
      const wit = withdrawals[index];
      wit.status = status;
      
      if (status === 'FAILED') {
        const users = DatabaseService.getUsers();
        const userIndex = users.findIndex(u => u.username === wit.user);
        if (userIndex > -1) {
          users[userIndex].balance.usdt += wit.amount;
          localStorage.setItem(DB_KEY, JSON.stringify(users));
        }
      }
      
      DatabaseService.updateGlobalStats({ withdrawals });
    }
  },

  login: async (username: string): Promise<UserAccount | null> => {
    await DatabaseService.delay(300);
    const users = DatabaseService.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (user) {
      localStorage.setItem(SESSION_KEY, user.username);
      return user;
    }
    return null;
  },

  register: async (username: string, referralCode?: string): Promise<UserAccount> => {
    await DatabaseService.delay(500);
    const users = DatabaseService.getUsers();
    const cleanUsername = username.trim();
    const cleanRefCode = referralCode?.trim().toUpperCase();
    
    // PENGECEKAN USERNAME GANDA (Case-Insensitive)
    if (users.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      throw new Error("Username sudah digunakan! Silakan gunakan nama lain.");
    }

    const myNewReferralCode = `GOLD-${Math.floor(1000 + Math.random() * 9000)}`;
    let initialGold = 0;
    
    if (cleanRefCode) {
      const inviter = users.find(u => u.uniqueReferralCode.toUpperCase() === cleanRefCode);
      if (inviter) {
        initialGold = 0.05;
        inviter.balance.gold += 1.0;
        inviter.referrals.push({
          id: 'REF-' + Math.random().toString(36).substr(2, 5),
          name: cleanUsername,
          status: 'ACTIVE',
          reward: 1.0,
          date: new Date().toLocaleDateString('id-ID')
        });
        const inviterIndex = users.findIndex(u => u.username === inviter.username);
        users[inviterIndex] = inviter;
      }
    }

    const newUser: UserAccount = {
      username: cleanUsername,
      uniqueReferralCode: myNewReferralCode,
      balance: { usdt: 0, gold: initialGold },
      referrals: [],
      history: []
    };

    users.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, cleanUsername);

    const stats = DatabaseService.getGlobalStats();
    const isAlreadyInStats = stats.newUsers.some(u => u.name.toLowerCase() === cleanUsername.toLowerCase());
    
    if (!isAlreadyInStats) {
      const updatedStats = {
        ...stats,
        newUsers: [{ name: cleanUsername, joined: 'Baru saja' }, ...stats.newUsers].slice(0, 15)
      };
      DatabaseService.updateGlobalStats(updatedStats);
    }

    return newUser;
  },

  getSession: (): UserAccount | null => {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    return DatabaseService.getUsers().find(u => u.username === session) || null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};
  
