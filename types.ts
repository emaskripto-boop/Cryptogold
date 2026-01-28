
export enum AssetType {
  GOLD = 'EMAS',
  SILVER = 'PERAK',
  BRONZE = 'PERUNGGU',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'BERLIAN'
}

export interface Transaction {
  id: string;
  user: string;
  amount: number;
  price: number;
  profit?: number;
  type: 'BUY' | 'SELL' | 'TRANSFER_IN' | 'TRANSFER_OUT';
  timestamp: string;
  asset: AssetType;
}

export interface Deposit {
  id: string;
  user: string;
  amount: number;
  currency: string;
  senderAddress?: string;
  timestamp: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface Withdrawal {
  id: string;
  user: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface Referral {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PENDING';
  reward: number;
  date: string;
}

export interface UserAccount {
  username: string;
  uniqueReferralCode: string;
  balance: { usdt: number; gold: number };
  referrals: Referral[];
  history: Transaction[];
}

export interface UserStats {
  newUsers: { name: string; joined: string }[];
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  transactions: Transaction[];
}

export type AuthMode = 'LOGIN' | 'REGISTER';
export type ViewMode = 'TRADE' | 'WALLET' | 'REFERRAL' | 'STATISTICS' | 'BONUS' | 'ADMIN';
