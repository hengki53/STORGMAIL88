import React from 'react';
import { ShieldCheck, Heart, Send, MessageCircle, Lock, ArrowUp } from 'lucide-react';
import { AdminSettings } from '../types';

interface FooterProps {
  settings: AdminSettings;
  onOpenAdmin: () => void;
  onOpenShareModal: () => void;
  onOpenChannelsModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onOpenShareModal,
  onOpenChannelsModal,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 mt-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-wider text-white">
                STORGMAIL<span className="text-amber-400">888</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PLATFORM RESMI #1
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Pusat penampungan & jual beli akun Gmail fresh terpercaya se-Indonesia. Proses kilat otomatis, jaminan keamanan data, dan pencairan langsung ke DANA, GoPay, OVO, ShopeePay, dan Bank BCA/BRI/Mandiri.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Transaksi Aman, Amanah & Anti Ribet</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">
              Navigasi Cepat
            </h4>
            <div>
              <a href="#submission-section" className="hover:text-amber-400 transition">
                Formulir Setor Gmail
              </a>
            </div>
            <div>
              <button onClick={onOpenChannelsModal} className="hover:text-amber-400 transition text-left">
                Saluran Telegram & WA
              </button>
            </div>
            <div>
              <button onClick={onOpenShareModal} className="hover:text-amber-400 transition text-left">
                Bagikan Link Web Aplikasi
              </button>
            </div>
            <div>
              <a
                href={`https://wa.me/${settings.adminWhatsappContact.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition"
              >
                Kontak CS WhatsApp
              </a>
            </div>
          </div>

          {/* Saluran & Admin */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">
              Komunitas & Akses
            </h4>
            <div>
              <a
                href={settings.telegramChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Saluran Telegram</span>
              </a>
            </div>
            <div>
              <a
                href={settings.whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Saluran WhatsApp</span>
              </a>
            </div>
            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-amber-400/90 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Control Panel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} STORGMAIL888. Hak Cipta Dilindungi Undang-Undang.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1 text-xs"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Kembali Ke Atas</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
