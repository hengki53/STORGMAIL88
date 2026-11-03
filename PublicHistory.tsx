import React, { useState } from 'react';
import { 
  History, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  ArrowUpRight, 
  TrendingUp,
  Wallet,
  Coins
} from 'lucide-react';
import { Submission } from '../types';
import { formatDateIndo, formatRupiah } from '../lib/storage';

interface PublicHistoryProps {
  submissions: Submission[];
  onSelectSubmission: (submission: Submission) => void;
}

export const PublicHistory: React.FC<PublicHistoryProps> = ({
  submissions,
  onSelectSubmission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Stats
  const approvedList = submissions.filter((s) => s.status === 'APPROVED_PAID');
  const totalPaidOut = approvedList.reduce((acc, s) => acc + s.totalPayout, 0);
  const totalAccountsHandled = submissions.reduce((acc, s) => acc + s.totalAccounts, 0);

  // Filter
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'ALL') return true;
    return sub.status === filterStatus;
  });

  const getStatusBadge = (status: Submission['status']) => {
    switch (status) {
      case 'APPROVED_PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SUKSES DIBAYAR</span>
          </span>
        );
      case 'CHECKING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>SEDANG DICEK</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>DITOLAK / INVALID</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>MENUNGGU ANTRIAN</span>
          </span>
        );
    }
  };

  // Anonymize name slightly for public feed
  const maskName = (name: string) => {
    if (name.length <= 4) return name;
    const parts = name.split(' ');
    return parts
      .map((p) => {
        if (p.length <= 2) return p;
        return p[0] + '*'.repeat(p.length - 2) + p[p.length - 1];
      })
      .join(' ');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            <History className="w-3.5 h-3.5" />
            <span>TRANSPARANSI TRANSAKSI REAL-TIME</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Riwayat Storan & Bukti Pembayaran
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Data live pengiriman dan pencairan dana para seller Gmail di STORGMAIL888.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 gap-3 sm:flex items-center">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Terbayar</div>
            <div className="text-sm sm:text-base font-extrabold text-emerald-400">
              {formatRupiah(totalPaidOut)}
            </div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Akun Ditampung</div>
            <div className="text-sm sm:text-base font-extrabold text-amber-400">
              {totalAccountsHandled.toLocaleString('id-ID')} Akun
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
        
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'Semua Storan' },
            { id: 'APPROVED_PAID', label: '✅ Berhasil Cair' },
            { id: 'CHECKING', label: '🔄 Sedang Dicek' },
            { id: 'PENDING', label: '⏳ Antrian' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                filterStatus === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari No. Resi atau Nama..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* List of submissions */}
      {filteredSubmissions.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/30 border border-slate-800/80 rounded-2xl text-slate-400">
          <History className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
          <p className="text-sm font-medium">Belum ada riwayat storan yang sesuai dengan filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubmissions.map((sub) => (
            <div
              key={sub.id}
              onClick={() => onSelectSubmission(sub)}
              className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    {sub.id}
                  </span>
                  {getStatusBadge(sub.status)}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      {maskName(sub.sellerName)}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Metode: <strong className="text-slate-200 font-semibold">{sub.paymentMethod}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium">Jumlah</div>
                    <div className="text-sm font-extrabold text-white">
                      {sub.totalAccounts} Akun
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Total Pencairan</div>
                  <div className="text-base font-extrabold text-emerald-400">
                    {formatRupiah(sub.totalPayout)}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-amber-300 font-medium">
                  <span>Lihat Detail</span>
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
