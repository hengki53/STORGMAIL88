import React, { useState } from 'react';
import { X, UserPlus, LogIn, Lock, User, Phone, Wallet, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import { UserAccount } from '../types';
import { getUsers, saveUser, setCurrentUser } from '../lib/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('register');
  
  // Register state
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('DANA');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim() || !whatsapp.trim() || !name.trim()) {
      setErrorMsg('Semua kolom bertanda bintang wajib diisi.');
      return;
    }

    const cleanUser = username.trim().toLowerCase();
    const existing = getUsers();
    if (existing.some((u) => u.username.toLowerCase() === cleanUser)) {
      setErrorMsg('Username ini sudah dipakai. Silakan gunakan username lain atau login.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newUser: UserAccount = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        username: cleanUser,
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        password: password.trim(),
        savedPaymentMethod: paymentMethod,
        savedAccountNumber: accountNumber.trim(),
        savedAccountHolder: accountHolder.trim().toUpperCase(),
        createdAt: new Date().toISOString(),
        role: 'seller',
      };

      saveUser(newUser);
      setCurrentUser(newUser);
      setLoading(false);
      onAuthSuccess(newUser);
      onClose();
    }, 400);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMsg('Masukkan username/WhatsApp dan kata sandi Anda.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const cleanIdent = loginIdentifier.trim().toLowerCase();
      const matched = users.find(
        (u) =>
          (u.username.toLowerCase() === cleanIdent || u.whatsapp === cleanIdent) &&
          u.password === loginPassword.trim()
      );

      if (!matched) {
        setLoading(false);
        setErrorMsg('Username/WhatsApp atau kata sandi tidak cocok. Silakan cek kembali.');
        return;
      }

      setCurrentUser(matched);
      setLoading(false);
      onAuthSuccess(matched);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
              tab === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Akun Baru</span>
          </button>
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
              tab === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk (Login)</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* REGISTER TAB */}
        {tab === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username Pilihan *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: juragan_gmail"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Lengkap / Panggilan *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Rian Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nomor WhatsApp Aktif *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 081234567890"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kata Sandi Akun Dasbor *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Buat password untuk login dasbor"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Optional Saved Rekening */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                Simpan E-Wallet / Rekening Pencairan (Bisa diisi nanti):
              </span>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="DANA">DANA</option>
                  <option value="GOPAY">GoPay</option>
                  <option value="OVO">OVO</option>
                  <option value="SHOPEEPAY">ShopeePay</option>
                  <option value="BCA">Bank BCA</option>
                  <option value="BRI">Bank BRI</option>
                  <option value="MANDIRI">Bank Mandiri</option>
                  <option value="SEABANK">SeaBank</option>
                </select>

                <input
                  type="text"
                  placeholder="No. Rek / HP"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <input
                type="text"
                placeholder="Atas Nama Rekening"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar & Masuk ke Dasbor</span>
            </button>
          </form>
        ) : (
          /* LOGIN TAB */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username atau No. WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Masukkan username atau no WhatsApp"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Sekarang</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
