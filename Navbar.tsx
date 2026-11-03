import React from 'react';
import { 
  ShieldCheck, 
  Share2, 
  Send, 
  Lock, 
  User as UserIcon, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  LogOut
} from 'lucide-react';
import { AdminSettings, UserAccount } from '../types';

interface NavbarProps {
  settings: AdminSettings;
  currentUser: UserAccount | null;
  onOpenShareModal: () => void;
  onOpenAuthModal: () => void;
  onOpenUserDashboard: () => void;
  onOpenAdminModal: () => void;
  onOpenTrackingModal: () => void;
  onOpenChannelsModal: () => void;
  onLogoutUser: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currentUser,
  onOpenShareModal,
  onOpenAuthModal,
  onOpenUserDashboard,
  onOpenAdminModal,
  onOpenTrackingModal,
  onOpenChannelsModal,
  onLogoutUser,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-red-600 to-rose-700 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden relative">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 to-red-400 text-xl tracking-tighter">
                888
              </span>
              <div className="absolute -bottom-1 w-6 h-1 bg-red-500 rounded-full blur-[1px]"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-wider text-white">
                STORGMAIL<span className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]">888</span>
              </span>
              {/* Status Open/Close badge */}
              {settings.isOpen ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  OPEN
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  CLOSED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Pusat Penampungan & Jual Beli Akun Gmail Terpercaya #1
            </p>
          </div>
        </div>

        {/* Center / Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Lacak Resi Button */}
          <button
            onClick={onOpenTrackingModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition shadow-sm"
            title="Lacak status pencairan storan dengan nomor invoice"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Cek Resi</span>
          </button>

          {/* Saluran Button */}
          <button
            onClick={onOpenChannelsModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/50 rounded-xl transition"
            title="Buka Saluran Telegram & WhatsApp"
          >
            <Send className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Saluran Resmi</span>
          </button>

          {/* Bagikan Link Web */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/50 rounded-xl transition group"
            title="Dapatkan link web untuk dibagikan ke orang lain"
          >
            <Share2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline">Link Web</span>
          </button>

          {/* User Account / Buat Akun */}
          {currentUser ? (
            <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-700 p-1 rounded-xl">
              <button
                onClick={onOpenUserDashboard}
                className="flex items-center gap-2 px-2.5 py-1 text-xs sm:text-sm font-medium text-slate-200 hover:text-amber-300 transition"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-[10px] font-black text-slate-950">
                  {currentUser.username.substring(0, 2).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">{currentUser.username}</span>
              </button>
              <button
                onClick={onLogoutUser}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md shadow-amber-500/20 transition hover:shadow-amber-500/30"
            >
              <UserIcon className="w-4 h-4" />
              <span>Buat Akun / Masuk</span>
            </button>
          )}

          {/* Admin Panel Access Button */}
          <button
            onClick={onOpenAdminModal}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-slate-400 hover:text-amber-300 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
            title="Akses Admin Panel (Khusus Pemilik Web)"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400/80" />
            <span className="hidden xl:inline">Admin</span>
          </button>

        </div>
      </div>
    </header>
  );
};
