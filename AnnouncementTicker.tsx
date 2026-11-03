import React from 'react';
import { Megaphone, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { AdminSettings } from '../types';

interface AnnouncementTickerProps {
  settings: AdminSettings;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({ settings }) => {
  return (
    <div className="w-full">
      {/* Running Marquee Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-red-950 border-b border-amber-500/20 py-2.5 overflow-hidden shadow-inner relative">
        <div className="flex items-center">
          <div className="flex-shrink-0 px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-r-lg flex items-center gap-1.5 shadow-md z-10">
            <Megaphone className="w-3.5 h-3.5 animate-bounce" />
            <span>PENGUMUMAN</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="animate-marquee flex items-center gap-12 text-xs md:text-sm text-slate-200">
              <span className="font-semibold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {settings.announcementText}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-cyan-300 font-medium">
                {settings.urgentNotice}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-400 font-medium">
                ✅ Pembayaran: DANA, OVO, GOPAY, SHOPEEPAY, BCA, BRI, MANDIRI, QRIS
              </span>
              <span className="text-slate-400">|</span>
              <span className="font-semibold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {settings.announcementText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Welcome Card on top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-red-600/10 border border-amber-500/30 p-4 sm:p-5 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                <Megaphone className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    PENGUMUMAN STORAN RESMI
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    STORGMAIL888
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {settings.announcementText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto flex-wrap">
              <div className="flex-1 sm:flex-none text-center sm:text-right px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Status Storan</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-center sm:justify-end gap-1">
                  {settings.isOpen ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sedang Menerima</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-rose-400">Tutup Sementara</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
