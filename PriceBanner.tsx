import React, { useState } from 'react';
import { Coins, Zap, Calculator, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import { AdminSettings } from '../types';
import { formatRupiah } from '../lib/storage';

interface PriceBannerProps {
  settings: AdminSettings;
  onScrollToForm: () => void;
}

export const PriceBanner: React.FC<PriceBannerProps> = ({ settings, onScrollToForm }) => {
  const [calcCount, setCalcCount] = useState<number>(20);

  // Determine price rate based on count
  const getRateForCount = (count: number) => {
    const sortedTiers = [...settings.priceTiers].sort((a, b) => b.minAccounts - a.minAccounts);
    for (const tier of sortedTiers) {
      if (count >= tier.minAccounts) {
        return tier.pricePerAccount;
      }
    }
    return settings.basePricePerAccount;
  };

  const currentRate = getRateForCount(calcCount);
  const totalEarn = calcCount * currentRate;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <Coins className="w-3.5 h-3.5" />
            <span>UPDATE RATE HARGA TERBAIK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Aturan Harga & Bonus Storan Gmail
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Makin banyak akun Gmail fresh yang kamu setor, makin tinggi harga per akun yang kamu dapatkan! Cair langsung tanpa potongan.
          </p>
        </div>
        <button
          onClick={onScrollToForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition group"
        >
          <span>Mulai Setor Sekarang</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid of Price Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {settings.priceTiers.map((tier, idx) => {
          const isHighest = idx === settings.priceTiers.length - 1;
          return (
            <div
              key={idx}
              className={`relative rounded-2xl p-5 border transition-all duration-300 ${
                isHighest
                  ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10 hover:border-amber-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isHighest && (
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-red-500 text-slate-950 shadow-md">
                  Paling Cuan
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <Award className={`w-4 h-4 ${isHighest ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tier.label}</span>
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                {formatRupiah(tier.pricePerAccount)}
                <span className="text-xs font-normal text-slate-400 ml-1">/ akun</span>
              </div>

              <div className="text-xs text-amber-400/90 font-medium mb-3">
                Minimal Setor: {tier.minAccounts} Akun Gmail
              </div>

              <div className="border-t border-slate-800/80 pt-3 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cair instan e-wallet / bank</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Calculator Box */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
              <Calculator className="w-4 h-4" />
              <span>KALKULATOR ESTIMASI PENDAPATAN ANDA</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Berapa akun Gmail yang ingin kamu setor hari ini?
            </h3>
            
            {/* Range slider & input */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="3"
                  max="500"
                  step="1"
                  value={calcCount}
                  onChange={(e) => setCalcCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 min-w-[100px] justify-center">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={calcCount}
                    onChange={(e) => setCalcCount(Math.max(1, Number(e.target.value) || 0))}
                    className="w-16 bg-transparent text-center font-bold text-white focus:outline-none text-base"
                  />
                  <span className="text-xs text-slate-400">Akun</span>
                </div>
              </div>

              {/* Quick buttons */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400">Cepat pilih:</span>
                {[5, 15, 25, 50, 100, 200].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCalcCount(preset)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      calcCount === preset
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {preset} Akun
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="w-full lg:w-80 rounded-xl bg-slate-950/80 border border-amber-500/30 p-5 flex flex-col justify-between shadow-inner">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Harga per Akun:</span>
                <span className="text-amber-400 font-bold">{formatRupiah(currentRate)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Jumlah Akun:</span>
                <span className="text-white font-semibold">{calcCount} Akun</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                <span className="text-xs text-slate-300 font-bold">Total Diterima:</span>
                <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400">
                  {formatRupiah(totalEarn)}
                </span>
              </div>
            </div>

            <button
              onClick={onScrollToForm}
              className="mt-4 w-full py-2.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Setor {calcCount} Akun Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
