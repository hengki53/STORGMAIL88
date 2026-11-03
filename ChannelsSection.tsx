import React from 'react';
import { Send, MessageCircle, Users, Headphones, ExternalLink, Sparkles, Bell } from 'lucide-react';
import { AdminSettings } from '../types';

interface ChannelsSectionProps {
  settings: AdminSettings;
}

export const ChannelsSection: React.FC<ChannelsSectionProps> = ({ settings }) => {
  return (
    <section id="saluran-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>SALURAN RESMI & PUSAT INFORMASI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Saluran STORGMAIL888 Terverifikasi
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Dapatkan notifikasi langsung saat kuota storan dibuka (OPEN), info kenaikan rate harga per akun Gmail, serta bantuan teknis dari admin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-semibold text-emerald-400">Admin Aktif & Siap Melayani</span>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Telegram Channel */}
          <div className="rounded-2xl bg-slate-950/70 border border-cyan-500/30 p-5 flex flex-col justify-between hover:border-cyan-400 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Saluran Telegram
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {settings.telegramChannelName || 'Official Channel info buka/tutup & kuota Gmail'}
              </p>
            </div>
            <a
              href={settings.telegramChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-cyan-500/20"
            >
              <span>Gabung Saluran Telegram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* WhatsApp Channel */}
          <div className="rounded-2xl bg-slate-950/70 border border-emerald-500/30 p-5 flex flex-col justify-between hover:border-emerald-400 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Saluran WhatsApp
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {settings.whatsappChannelName || 'Broadcast resmi update rate harga terupdate'}
              </p>
            </div>
            <a
              href={settings.whatsappChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20"
            >
              <span>Ikuti Saluran WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Grup Diskusi Komunitas */}
          <div className="rounded-2xl bg-slate-950/70 border border-amber-500/30 p-5 flex flex-col justify-between hover:border-amber-400 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Grup Diskusi Seller
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Komunitas ribuan penambang & seller Gmail di seluruh Indonesia
              </p>
            </div>
            <a
              href={settings.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-amber-500/20"
            >
              <span>Masuk Grup Komunitas</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Customer Service WhatsApp */}
          <div className="rounded-2xl bg-slate-950/70 border border-rose-500/30 p-5 flex flex-col justify-between hover:border-rose-400 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-105 transition-transform">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Customer Support 24/7
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Kendala akun, cek invoice khusus, atau konsultasi setor ribuan akun
              </p>
            </div>
            <a
              href={`https://wa.me/${settings.adminWhatsappContact.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20STORGMAIL888,%20saya%20mau%20tanya%20tentang%20storan%20akun%20Gmail`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-rose-500/20"
            >
              <span>Chat Admin WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
