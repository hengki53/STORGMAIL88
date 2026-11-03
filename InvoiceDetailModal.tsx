import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  FileText, 
  CreditCard, 
  User, 
  Calendar, 
  ShieldCheck,
  Send,
  Printer
} from 'lucide-react';
import { Submission } from '../types';
import { formatDateIndo, formatRupiah } from '../lib/storage';

interface InvoiceDetailModalProps {
  submission: Submission | null;
  onClose: () => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  submission,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!submission) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(submission.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (submission.status) {
      case 'APPROVED_PAID':
        return (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-extrabold text-xs sm:text-sm">SUKSES - DANA SUDAH DICAIRKAN</div>
              <div className="text-[11px] text-emerald-300/80">
                Pengecekan akun selesai dan transfer telah dikirim ke rekening tujuan.
              </div>
            </div>
          </div>
        );
      case 'CHECKING':
        return (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
            <Clock className="w-5 h-5 flex-shrink-0 animate-spin" />
            <div>
              <div className="font-extrabold text-xs sm:text-sm">SEDANG DALAM PENGECEKAN ADMIN</div>
              <div className="text-[11px] text-blue-300/80">
                Admin sedang memverifikasi kata sandi & keaktifan akun Gmail Anda.
              </div>
            </div>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-extrabold text-xs sm:text-sm">STORAN DITOLAK / INVALID</div>
              <div className="text-[11px] text-rose-300/80">
                {submission.adminNotes || 'Akun tidak memenuhi syarat (sandi salah atau 2FA aktif).'}
              </div>
            </div>
          </div>
        );
      case 'PENDING':
      default:
        return (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-extrabold text-xs sm:text-sm">MENUNGGU ANTRIAN CHECKER</div>
              <div className="text-[11px] text-amber-300/80">
                Storan Anda sudah masuk sistem dan sedang dalam antrian verifikasi.
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Invoice */}
        <div className="border-b border-slate-800 pb-5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>BUKTI RESI STORAN RESMI</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              STORGMAIL888
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <h3 className="text-2xl font-black text-white font-mono">
              {submission.id}
            </h3>
            <button
              onClick={handleCopyId}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                copied
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Resi'}</span>
            </button>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Waktu Setor: {formatDateIndo(submission.createdAt)}</span>
          </div>
        </div>

        {/* Status Callout */}
        <div className="mb-5">{getStatusBadge()}</div>

        {/* Financial Summary */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 mb-5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Jumlah Akun Gmail:</span>
            <span className="font-bold text-white">{submission.totalAccounts} Akun</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Harga Satuan:</span>
            <span className="font-bold text-amber-400">{formatRupiah(submission.pricePerAccount)} / akun</span>
          </div>
          <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
            <span className="text-xs font-bold text-slate-300">Total Pencairan:</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
              {formatRupiah(submission.totalPayout)}
            </span>
          </div>
        </div>

        {/* Rekening Info */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 mb-5 text-xs">
          <div className="font-bold text-slate-300 flex items-center gap-1.5 mb-1">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Tujuan Pencairan Dana:</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Nama Seller:</span>
            <span className="font-bold text-white">{submission.sellerName}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Metode:</span>
            <span className="font-bold text-amber-400">{submission.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>No. Rekening / E-Wallet:</span>
            <span className="font-mono text-white font-bold">{submission.accountNumber}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Atas Nama:</span>
            <span className="font-bold text-white uppercase">{submission.accountHolderName}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>No. WhatsApp:</span>
            <span className="text-slate-300">{submission.sellerContact}</span>
          </div>
        </div>

        {/* Catatan Admin */}
        {submission.adminNotes && (
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1 mb-5">
            <span className="font-bold text-amber-400 block">Catatan Admin STORGMAIL888:</span>
            <p className="text-slate-300 leading-relaxed">{submission.adminNotes}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition"
        >
          Tutup Rincian
        </button>
      </div>
    </div>
  );
};
