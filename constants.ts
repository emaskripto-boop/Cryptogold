
import { AssetType, Transaction, Deposit, Withdrawal } from './types';

export const ASSETS = [
  { type: AssetType.GOLD, icon: 'fas fa-gold-ingot', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { type: AssetType.SILVER, icon: 'fas fa-layer-group', color: 'text-gray-400', bg: 'bg-gray-400/10' },
  { type: AssetType.BRONZE, icon: 'fas fa-cube', color: 'text-orange-600', bg: 'bg-orange-600/10' },
  { type: AssetType.PLATINUM, icon: 'fas fa-gem', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { type: AssetType.DIAMOND, icon: 'fas fa-diamond', color: 'text-red-500', bg: 'bg-red-500/10' },
];

const USERNAMES = ['Nelson5030', 'Erzulie', 'SamuelPie', 'Yaxcelis24', 'Jmichel', 'WanOOo', 'Fata10', 'Lailaaa', 'Danri', 'Muhammad99'];

export const generateMockTransaction = (): Transaction => ({
  id: Math.random().toString(36).substr(2, 9),
  user: USERNAMES[Math.floor(Math.random() * USERNAMES.length)],
  amount: Number((Math.random() * 50).toFixed(8)),
  price: Number((Math.random() * 100).toFixed(2)),
  profit: Number((Math.random() * 10).toFixed(2)),
  type: Math.random() > 0.5 ? 'BUY' : 'SELL',
  timestamp: 'Just now',
  asset: AssetType.GOLD
});

export const INITIAL_STATS = {
  newUsers: [
    { name: 'Nelson5030', joined: '2 minutes ago' },
    { name: 'teman', joined: '7 minutes ago' },
    { name: 'Muhammad99', joined: '10 minutes ago' },
  ],
  deposits: [
    { id: '1', user: 'Erzulie', amount: 10.09, currency: 'USDT', timestamp: '9 minutes ago' },
    { id: '2', user: 'Fata10', amount: 50.00, currency: 'TRX', timestamp: '15 minutes ago' },
  ] as Deposit[],
  withdrawals: [
    { id: '1', user: 'Danri', amount: 25.00, currency: 'TON', timestamp: '1 hour ago' },
  ] as Withdrawal[],
  transactions: Array.from({ length: 10 }, generateMockTransaction)
};
