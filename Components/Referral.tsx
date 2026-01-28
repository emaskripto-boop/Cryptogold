
import React, { useState } from 'react';
import { Referral as ReferralType } from '../types';

interface ReferralProps {
  referralsList: ReferralType[];
  referralCode: string;
}

export const Referral: React.FC<ReferralProps> = ({ referralsList, referralCode }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Join CryptoGold Trading',
      text: `Gunakan kode referral saya ${referralCode} untuk mendapatkan bonus Emas gratis!`,
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Link pendaftaran telah disalin ke clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const totalBonus = referralsList.reduce((acc, curr) => acc + curr.reward, 0);

  return (
    <div className="p-4 space-y-6">
      <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-yellow-500/20 relative overflow-hidden">
        <div className="flex justify-between items-start">
           <div className="space-y-1">
             <h2 className="text-xl font-black text-yellow-500 uppercase tracking-tighter">Undang Teman</h2>
             <p className="text-xs text-gray-400">Dapatkan <span className="text-white font-bold">1.0 Gold Coin</span> gratis setiap teman yang bergabung!</p>
           </div>
           <i className="fas fa-gift text-4xl text-yellow-500/20"></i>
        </div>

        <div className="mt-8">
           <p className="text-[10px] text-gray-500 uppercase mb-2">Kode Referral Anda</p>
           <div className="bg-[#2a2a2a] p-4 rounded-2xl flex items-center justify-between border border-gray-700">
             <span className="text-xl font-black text-white tracking-widest">{referralCode}</span>
             <button 
                onClick={handleCopy}
                className={`${copied ? 'bg-green-500' : 'bg-yellow-500'} text-black px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all min-w-[80px]`}
             >
                {copied ? 'TERSALIN' : 'SALIN'}
             </button>
           </div>
        </div>

        <div className="mt-6 flex justify-around py-4 border-t border-gray-800">
           <div className="text-center">
             <p className="text-[10px] text-gray-500 uppercase">Teman Diajak</p>
             <p className="text-xl font-black text-white">{referralsList.length}</p>
           </div>
           <div className="h-8 w-px bg-gray-800"></div>
           <div className="text-center">
             <p className="text-[10px] text-gray-500 uppercase">Total Bonus</p>
             <p className="text-xl font-black text-yellow-500">{totalBonus.toFixed(1)}</p>
           </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase px-2">Riwayat Referral</h3>
        {referralsList.length === 0 ? (
          <div className="text-center py-10 opacity-20 italic text-sm">Belum ada rujukan</div>
        ) : (
          referralsList.map((ref) => (
            <div key={ref.id} className="bg-[#1e1e1e] p-4 rounded-2xl border border-gray-800 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ref.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-500'}`}>
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <p className="text-sm font-bold">{ref.name}</p>
                  <p className="text-[10px] text-gray-500">{ref.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-bold ${ref.status === 'ACTIVE' ? 'text-yellow-500' : 'text-gray-500'}`}>
                  +{ref.reward} GOLD
                </p>
                <p className="text-[8px] uppercase tracking-wider text-gray-600 font-bold">{ref.status === 'ACTIVE' ? 'Berhasil' : 'Menunggu'}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button 
        onClick={handleShare}
        className="w-full border-2 border-yellow-500/20 text-yellow-500 font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
      >
         <i className="fas fa-share-alt"></i>
         <span>BAGIKAN LINK PENDAFTARAN</span>
      </button>
    </div>
  );
};
