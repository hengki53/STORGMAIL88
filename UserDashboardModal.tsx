import React, { useState } from 'react';
import { 
  X, 
  User, 
  Wallet, 
  History, 
  Award, 
  Save, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Coins
} from 'lucide-react';
import { Submission, UserAccount } from '../types';
import { formatRupiah, formatDateIndo, saveUser } from '../lib/storage';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  submissions: Submission[];
  onSelectSubmission: (submission: Submission) => void;
  onUpdateUser: (user: UserAccount) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  submissions,
  onSelectSubmission,
  onUpdateUser,
}) => {
  if (!isOpen || !user) return null;

  // Filter user's submissions
  const userSubs = submissions.filter(
    (s) =>
      s.userId === user.id ||
      s.sellerContact.replace(/[^0-9]/g, '') === user.whatsapp.replace(/[^0-9]/g, '')
  );

  const totalEarned = userSubs
    .filter((s) => s.status === 'APPROVED_PAID')
    .reduce((acc, s) => acc + s.totalPayout, 0);

  const totalAccounts = userSubs.reduce((acc, s) => acc + s.totalAccounts, 0);

  // Edit saved payment settings
  const [savedMethod, setSavedMethod] = useState(user.savedPaymentMethod || 'DANA');
  const [savedAccountNum, setSavedAccountNum] = useState(user.savedAccountNumber || '');
  const [savedHolder, setSavedHolder] = useState(user.savedAccountHolder || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSavePaymentInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserAccount = {
      ...user,
      savedPaymentMethod: savedMethod,
      savedAccountNumber: savedAccountNum.trim(),
      savedAccountHolder: savedHolder.trim().toUpperCase(),
    };
    saveUser(updated);
    onUpdateUser(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Determine badge
  const getSellerTier = () => {
    if (totalAccounts >= 200) return { label: 'VIP SULTAN SELLER', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (totalAccounts >= 50) return { label: 'GOLD SELLER', color: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30' };
    if (totalAccounts >= 20) return { label: 'SILVER SELLER', color: 'text-slate-300 bg-slate-500/10 border-slate-500/30' };
    return { label: 'BRONZE SELLER', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
  };

  const tier = getSellerTier();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20">
            {user.username.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${tier.color}`}>
                {tier.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Username: <span className="text-amber-400 font-mono font-bold">@{user.username}</span> | WA: {user.whatsapp}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Pendapatan Cair</div>
            <div className="text-lg sm:text-xl font-black text-emerald-400 mt-1">
              {formatRupiah(totalEarned)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Akun Disetor</div>
            <div className="text-lg sm:text-xl font-black text-amber-400 mt-1">
              {totalAccounts} Akun
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Transaksi</div>
            <div className="text-lg sm:text-xl font-black text-cyan-400 mt-1">
              {userSubs.length} Invoice
            </div>
          </div>
        </div>

        {/* Saved Payout Details */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            <span>Rekening / E-Wallet Default (Otomatis Terisi saat Setor)</span>
          </h4>

          <form onSubmit={handleSavePaymentInfo} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={savedMethod}
                onChange={(e) => setSavedMethod(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="DANA">DANA</option>
                <option value="GOPAY">GoPay</option>
                <option value="OVO">OVO</option>
                <option value="SHOPEEPAY">ShopeePay</option>
                <option value="BCA">Bank BCA</option>
                <option value="BRI">Bank BRI</option>
                <option value="MANDIRI">Bank Mandiri</option>
                <option value="SEABANK">SeaBank</option>
                <option value="QRIS">QRIS</option>
              </select>

              <input
                type="text"
                placeholder="Nomor Rekening / No E-Wallet"
                value={savedAccountNum}
                onChange={(e) => setSavedAccountNum(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />

              <input
                type="text"
                placeholder="Atas Nama Pemilik Rekening"
                value={savedHolder}
                onChange={(e) => setSavedHolder(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white uppercase"
              />
            </div>

            <div className="flex items-center justify-between">
              {saveSuccess ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Rekening berhasil diperbarui!
                </span>
              ) : (
                <span></span>
              )}
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition ml-auto"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Rekening</span>
              </button>
            </div>
          </form>
        </div>

        {/* User's Submission History */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>Riwayat Storan Akun Anda ({userSubs.length})</span>
          </h4>

          {userSubs.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
              Anda belum memiliki riwayat storan akun. Ayo setor akun Gmail pertamamu sekarang!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {userSubs.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => {
                    onClose();
                    onSelectSubmission(sub);
                  }}
                  className="p-3 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{sub.id}</span>
                      <span className="text-[11px] text-slate-400">{formatDateIndo(sub.createdAt)}</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      {sub.totalAccounts} Akun | Rekening: {sub.paymentMethod} ({sub.accountNumber})
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-400">
                      {formatRupiah(sub.totalPayout)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-400">
                      {sub.status === 'APPROVED_PAID' ? 'Cair Selesai' : sub.status} →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
