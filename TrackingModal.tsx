import React, { useState } from 'react';
import { X, Search, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { Submission } from '../types';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: Submission[];
  onFoundSubmission: (sub: Submission) => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  isOpen,
  onClose,
  submissions,
  onFoundSubmission,
}) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = query.trim().toUpperCase();
    if (!clean) {
      setError('Masukkan kode resi / nomor invoice Anda.');
      return;
    }

    const found = submissions.find(
      (s) =>
        s.id.toUpperCase() === clean ||
        s.id.toUpperCase().includes(clean) ||
        s.sellerContact.includes(clean)
    );

    if (found) {
      onFoundSubmission(found);
      onClose();
    } else {
      setError('Resi tidak ditemukan. Pastikan format penulisan benar (contoh: STM-888-9102).');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Lacak Resi Storan</h3>
            <p className="text-xs text-slate-400">
              Cek status pengecekan & pencairan akun Gmail Anda
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Kode Invoice / Nomor WhatsApp
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <FileText className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoFocus
                placeholder="Contoh: STM-888-9102"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono uppercase font-bold"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"
          >
            <span>Cek Status Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Lupa kode resi? Hubungi CS WhatsApp kami dengan memberikan nama & jam pengiriman Anda.
          </p>
        </div>
      </div>
    </div>
  );
};
