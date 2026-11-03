import React, { useState, useId } from 'react';
import { 
  Inbox, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Wallet, 
  User, 
  Phone, 
  CreditCard, 
  ShieldAlert, 
  Lock,
  Sparkles,
  FileText,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdminSettings, GmailAccountItem, Submission, UserAccount } from '../types';
import { addSubmission, formatRupiah } from '../lib/storage';

interface SubmissionFormProps {
  settings: AdminSettings;
  currentUser: UserAccount | null;
  onSubmissionSuccess: (submission: Submission) => void;
  onOpenChannelsModal: () => void;
}

const PAYMENT_OPTIONS = [
  { id: 'DANA', name: 'DANA (Cair Kilat)', color: 'from-blue-500 to-cyan-500' },
  { id: 'GOPAY', name: 'GoPay (Instan)', color: 'from-emerald-500 to-teal-500' },
  { id: 'OVO', name: 'OVO Cash', color: 'from-purple-500 to-indigo-500' },
  { id: 'SHOPEEPAY', name: 'ShopeePay', color: 'from-orange-500 to-amber-500' },
  { id: 'BCA', name: 'Bank BCA', color: 'from-blue-600 to-blue-800' },
  { id: 'BRI', name: 'Bank BRI', color: 'from-blue-700 to-indigo-800' },
  { id: 'MANDIRI', name: 'Bank Mandiri', color: 'from-yellow-600 to-amber-700' },
  { id: 'BNI', name: 'Bank BNI', color: 'from-teal-600 to-cyan-700' },
  { id: 'SEABANK', name: 'SeaBank Indonesia', color: 'from-orange-500 to-red-500' },
  { id: 'JAGO', name: 'Bank Jago', color: 'from-purple-600 to-pink-600' },
  { id: 'QRIS', name: 'QRIS (Upload / Kirim via WA)', color: 'from-red-600 to-rose-700' },
];

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  settings,
  currentUser,
  onSubmissionSuccess,
  onOpenChannelsModal,
}) => {
  const [inputMode, setInputMode] = useState<'bulk' | 'manual'>('bulk');
  const [bulkText, setBulkText] = useState<string>('');
  
  // Manual mode state
  const [manualAccounts, setManualAccounts] = useState<Array<{ email: string; pass: string; rec: string }>>([
    { email: '', pass: '', rec: '' },
    { email: '', pass: '', rec: '' },
    { email: '', pass: '', rec: '' },
  ]);

  // Seller info state (prefilled from currentUser if available)
  const [sellerName, setSellerName] = useState<string>(currentUser ? currentUser.name : '');
  const [sellerContact, setSellerContact] = useState<string>(currentUser ? currentUser.whatsapp : '');
  const [paymentMethod, setPaymentMethod] = useState<string>(currentUser?.savedPaymentMethod || 'DANA');
  const [accountNumber, setAccountNumber] = useState<string>(currentUser?.savedAccountNumber || '');
  const [accountHolderName, setAccountHolderName] = useState<string>(currentUser?.savedAccountHolder || '');
  
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Parser logic for Bulk Text
  const parseAccounts = (): { validList: GmailAccountItem[]; errorLines: string[] } => {
    if (inputMode === 'manual') {
      const valid: GmailAccountItem[] = [];
      manualAccounts.forEach((acc, idx) => {
        const cleanEmail = acc.email.trim();
        const cleanPass = acc.pass.trim();
        if (cleanEmail && cleanPass && cleanEmail.toLowerCase().includes('@gmail.com')) {
          valid.push({
            id: String(idx + 1),
            email: cleanEmail,
            password: cleanPass,
            recoveryEmail: acc.rec.trim() || undefined,
            status: 'pending',
          });
        }
      });
      return { validList: valid, errorLines: [] };
    }

    const lines = bulkText.split('\n');
    const validList: GmailAccountItem[] = [];
    const errorLines: string[] = [];
    const seenEmails = new Set<string>();

    lines.forEach((rawLine, idx) => {
      const line = rawLine.trim();
      if (!line) return;

      // Supported delimiters: '|', ':', '----', ';', space
      let parts: string[] = [];
      if (line.includes('|')) {
        parts = line.split('|');
      } else if (line.includes('----')) {
        parts = line.split('----');
      } else if (line.includes(':')) {
        parts = line.split(':');
      } else if (line.includes(';')) {
        parts = line.split(';');
      } else if (line.includes('\t')) {
        parts = line.split('\t');
      } else {
        parts = line.split(/\s+/);
      }

      const email = parts[0]?.trim() || '';
      const password = parts[1]?.trim() || '';
      const recovery = parts[2]?.trim() || '';

      const isGmail = email.toLowerCase().endsWith('@gmail.com') || email.toLowerCase().includes('@gmail');
      if (email && password && isGmail) {
        if (!seenEmails.has(email.toLowerCase())) {
          seenEmails.add(email.toLowerCase());
          validList.push({
            id: String(idx + 1),
            email,
            password,
            recoveryEmail: recovery || undefined,
            status: 'pending',
          });
        }
      } else {
        errorLines.push(`Baris ${idx + 1}: "${line.length > 30 ? line.substring(0, 30) + '...' : line}" (format email / sandi belum valid)`);
      }
    });

    return { validList, errorLines };
  };

  const { validList, errorLines } = parseAccounts();
  const totalValidAccounts = validList.length;

  // Rate lookup
  const getRateForCount = (count: number) => {
    const sortedTiers = [...settings.priceTiers].sort((a, b) => b.minAccounts - a.minAccounts);
    for (const tier of sortedTiers) {
      if (count >= tier.minAccounts) {
        return tier.pricePerAccount;
      }
    }
    return settings.basePricePerAccount;
  };

  const activeRate = getRateForCount(totalValidAccounts);
  const estimatedPayout = totalValidAccounts * activeRate;

  // Manual row helpers
  const handleManualChange = (index: number, field: 'email' | 'pass' | 'rec', val: string) => {
    const updated = [...manualAccounts];
    updated[index][field] = val;
    setManualAccounts(updated);
  };

  const addManualRow = () => {
    setManualAccounts([...manualAccounts, { email: '', pass: '', rec: '' }]);
  };

  const removeManualRow = (index: number) => {
    if (manualAccounts.length <= 1) return;
    setManualAccounts(manualAccounts.filter((_, idx) => idx !== index));
  };

  const handleFillExample = () => {
    setBulkText(
      `seller_gmail_01@gmail.com|Katasandi123#\n` +
      `seller_gmail_02@gmail.com|Katasandi123#|recovery01@gmail.com\n` +
      `seller_gmail_03@gmail.com|Katasandi123#\n` +
      `seller_gmail_04@gmail.com|Katasandi123#\n` +
      `seller_gmail_05@gmail.com|Katasandi123#`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!settings.isOpen) {
      setErrorMessage('Storan saat ini sedang ditutup oleh Admin. Silakan tunggu info pembukaan di saluran kami.');
      return;
    }

    if (totalValidAccounts < settings.minSubmissionAccounts) {
      setErrorMessage(
        `Minimal setor adalah ${settings.minSubmissionAccounts} akun Gmail valid. Saat ini baru terdeteksi ${totalValidAccounts} akun.`
      );
      return;
    }

    if (!sellerName.trim()) {
      setErrorMessage('Harap masukkan nama lengkap atau nama panggilan Anda.');
      return;
    }

    if (!sellerContact.trim()) {
      setErrorMessage('Harap masukkan nomor WhatsApp aktif untuk verifikasi resi & bukti bayar.');
      return;
    }

    if (!accountNumber.trim()) {
      setErrorMessage('Harap masukkan nomor rekening atau nomor E-Wallet untuk pencairan dana.');
      return;
    }

    if (!accountHolderName.trim()) {
      setErrorMessage('Harap masukkan nama pemilik rekening / atas nama e-wallet.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Anda wajib menyetujui syarat akun fresh dan kata sandi valid.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate ID
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const invoiceId = `STM-888-${randomCode}`;

      const newSubmission: Submission = {
        id: invoiceId,
        createdAt: new Date().toISOString(),
        sellerName: sellerName.trim(),
        sellerContact: sellerContact.trim(),
        userId: currentUser?.id,
        paymentMethod,
        accountNumber: accountNumber.trim(),
        accountHolderName: accountHolderName.trim().toUpperCase(),
        accounts: validList,
        rawInput: inputMode === 'bulk' ? bulkText : validList.map(a => `${a.email}|${a.password}`).join('\n'),
        totalAccounts: totalValidAccounts,
        validAccountsCount: totalValidAccounts,
        pricePerAccount: activeRate,
        totalPayout: estimatedPayout,
        status: 'PENDING',
        adminNotes: 'Menunggu proses antrian checker otomatis dan verifikasi kata sandi admin.',
      };

      addSubmission(newSubmission);

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Clear form inputs
      if (inputMode === 'bulk') setBulkText('');
      setManualAccounts([
        { email: '', pass: '', rec: '' },
        { email: '', pass: '', rec: '' },
      ]);

      setIsSubmitting(false);
      onSubmissionSuccess(newSubmission);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Terjadi kesalahan saat memproses storan. Silakan coba kembali.');
    }
  };

  return (
    <section id="submission-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-24">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>FORMULIR PENERIMAAN RESMI</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Setor Akun Gmail <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-400">STORGMAIL888</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Masukkan list akun Gmail Anda, pilih metode penarikan dana, dan tunggu proses pengecekan cepat langsung cair ke rekening/e-wallet Anda!
        </p>
      </div>

      {/* IF CLOSED: Display prominent notification */}
      {!settings.isOpen ? (
        <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/40 p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto mb-5 shadow-lg shadow-rose-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-3">
            STORAN DITUTUP SEMENTARA
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Mohon Maaf, Kuota Storan Sedang Penuh
          </h3>

          <p className="text-slate-300 text-base leading-relaxed max-w-xl mx-auto mb-8 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            {settings.closeMessage}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenChannelsModal}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
            >
              <Send className="w-4 h-4" />
              <span>Pantau Saluran Telegram & WhatsApp</span>
            </button>
          </div>
        </div>
      ) : (
        /* IF OPEN: Display Main Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Accounts Input */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-sm">
            
            {/* Input Tab Switcher */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInputMode('bulk')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                    inputMode === 'bulk'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Paste Massal (Rekomendasi)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('manual')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                    inputMode === 'manual'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Input Satu-satu</span>
                </button>
              </div>

              {inputMode === 'bulk' && (
                <button
                  type="button"
                  onClick={handleFillExample}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-medium hidden sm:inline"
                >
                  Contoh Format
                </button>
              )}
            </div>

            {/* Bulk Mode */}
            {inputMode === 'bulk' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">
                    Paste Daftar Akun (Format: <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded">email|password</code>)
                  </span>
                  <span className="text-slate-400">1 baris = 1 akun</span>
                </div>

                <div className="relative">
                  <textarea
                    rows={11}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`Contoh penulisan:\nakunfresh1@gmail.com|SandiWajib123\nakunfresh2@gmail.com|SandiWajib123|pemulihan@gmail.com\nakunfresh3@gmail.com|SandiWajib123`}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition leading-relaxed resize-y"
                  />
                </div>

                {/* Live Count & Analysis */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {totalValidAccounts} Akun Valid
                    </span>
                    {errorLines.length > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {errorLines.length} Format Belum Sesuai
                      </span>
                    )}
                  </div>

                  <span className="text-slate-400">
                    Min. setor: <strong className="text-amber-400">{settings.minSubmissionAccounts} Akun</strong>
                  </span>
                </div>

                {/* Error preview if any */}
                {errorLines.length > 0 && (
                  <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl text-xs text-rose-300 space-y-1 max-h-24 overflow-y-auto">
                    <div className="font-bold flex items-center gap-1 text-rose-400">
                      <AlertTriangle className="w-3 h-3" />
                      Periksa baris berikut:
                    </div>
                    {errorLines.slice(0, 3).map((err, i) => (
                      <div key={i} className="font-mono text-[11px] truncate">{err}</div>
                    ))}
                    {errorLines.length > 3 && (
                      <div className="text-[11px] italic">...dan {errorLines.length - 3} baris lainnya</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Manual Mode */
              <div className="space-y-3">
                <div className="text-xs text-slate-300 font-semibold mb-2">
                  Masukkan Akun Gmail Satu Per Satu:
                </div>
                
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {manualAccounts.map((acc, index) => (
                    <div key={index} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 relative">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-bold text-amber-400">Akun #{index + 1}</span>
                        {manualAccounts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeManualRow(index)}
                            className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="email"
                          placeholder="contoh@gmail.com"
                          value={acc.email}
                          onChange={(e) => handleManualChange(index, 'email', e.target.value)}
                          className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="text"
                          placeholder="Kata Sandi / Password"
                          value={acc.pass}
                          onChange={(e) => handleManualChange(index, 'pass', e.target.value)}
                          className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Email Pemulihan (Opsional)"
                        value={acc.rec}
                        onChange={(e) => handleManualChange(index, 'rec', e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addManualRow}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
                >
                  + Tambah Baris Akun
                </button>
              </div>
            )}

            {/* Syarat Penting Reminder */}
            <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 space-y-1.5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>ATURAN & SYARAT WAJIB STORAN:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
                {settings.termsAndConditions.map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Payout Details & Submission */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-400" />
              <span>Data Pencairan & Pembayaran</span>
            </h3>

            {/* Earnings Live Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 mb-5">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                <span>Total Akun Terbaca:</span>
                <span className="font-bold text-white">{totalValidAccounts} Akun</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                <span>Harga Satuan:</span>
                <span className="font-bold text-amber-400">{formatRupiah(activeRate)} / akun</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-300">Estimasi Pencairan:</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
                  {formatRupiah(estimatedPayout)}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nama Lengkap / Seller */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Anda / Nama Panggilan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian / Seller Palembang"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* No WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor WhatsApp Aktif (Untuk Notifikasi & Bukti Bayar)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890"
                    value={sellerContact}
                    onChange={(e) => setSellerContact(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pilih Metode Pembayaran
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {PAYMENT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nomor Rekening / E-Wallet */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor Rekening / No. HP E-Wallet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890 atau 8205123456"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Atas Nama Rekening */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Pemilik Rekening (Sesuai Akun Bank / E-Wallet)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: AHMAD RIYANTO"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 uppercase font-medium"
                />
              </div>

              {/* Checkbox Wajib */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-950 border-slate-700 accent-amber-500"
                  />
                  <span>
                    Saya menyatakan akun Gmail yang disetor adalah <strong className="text-white">FRESH</strong>, kata sandi <strong className="text-white">BENAR</strong>, dan verifikasi 2 langkah <strong className="text-white">TIDAK AKTIF</strong>.
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || totalValidAccounts === 0}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengirim Storan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>KIRIM STORAN GMAIL SEKARANG</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-500">
                🔒 Data akun Anda aman & dienkripsi. Admin akan memproses verifikasi secepatnya.
              </p>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
