import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Send, 
  MessageCircle, 
  Globe, 
  QrCode, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AdminSettings } from '../types';

interface ShareWebModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AdminSettings;
}

export const ShareWebModal: React.FC<ShareWebModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' 
    ? (settings.webAppUrl || window.location.href)
    : 'https://storgmail888.app';

  const shareText = `🔥 JUAL & SETOR AKUN GMAIL FRESH DAPAT CUAN INSTAN DI STORGMAIL888! 
Rate tinggi mulai Rp 3.000 - Rp 3.800/akun. Pencairan cepat via DANA, GoPay, OVO & Bank.
Yuk setor akunmu sekarang di: ${currentUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    currentUrl
  )}&color=ea4335&bgcolor=090d16`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              Link Web STORGMAIL888
            </h3>
            <p className="text-xs text-slate-400">
              Bagikan link ini ke teman, grup WA, atau medsos agar orang bisa langsung setor
            </p>
          </div>
        </div>

        {/* URL Box & Copy */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mb-5 space-y-2">
          <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Link Akses Resmi:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full bg-transparent text-xs sm:text-sm font-mono text-amber-300 font-bold focus:outline-none truncate select-all"
            />
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                copied
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* QR Code and Sharing Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mb-5">
          
          {/* QR Code */}
          <div className="flex flex-col items-center justify-center p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-900 p-1.5 border border-slate-800 mb-2 flex items-center justify-center">
              <img
                src={qrImageUrl}
                alt="QR Code STORGMAIL888"
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <QrCode className="w-3 h-3 text-amber-400" />
              <span>Scan Kamera HP</span>
            </span>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Bagikan ke WhatsApp</span>
            </a>

            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-cyan-600/20"
            >
              <Send className="w-4 h-4" />
              <span>Bagikan ke Telegram</span>
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan ke Facebook</span>
            </a>
          </div>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300/90 text-center">
          💡 Link ini dapat dibuka oleh siapa saja di HP maupun Laptop untuk menyetor akun Gmail.
        </div>
      </div>
    </div>
  );
};
