import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Settings, 
  ToggleLeft, 
  ToggleRight, 
  DollarSign, 
  Key, 
  Bell, 
  Send, 
  Inbox, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  Save, 
  TrendingUp, 
  LogOut,
  ExternalLink,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { AdminSettings, PriceTier, Submission } from '../types';
import { formatRupiah, formatDateIndo, saveAdminSettings, updateSubmissionStatus, deleteSubmission } from '../lib/storage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AdminSettings;
  submissions: Submission[];
  onUpdateSettings: (newSettings: AdminSettings) => void;
  onSelectSubmission: (sub: Submission) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  submissions,
  onUpdateSettings,
  onSelectSubmission,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  
  // Current active admin tab
  const [activeTab, setActiveTab] = useState<'status_harga' | 'storan' | 'pengumuman' | 'saluran' | 'password' | 'stats'>('status_harga');

  // Form states for settings
  const [isOpenToggle, setIsOpenToggle] = useState<boolean>(settings.isOpen);
  const [closeMsg, setCloseMsg] = useState<string>(settings.closeMessage);
  const [basePrice, setBasePrice] = useState<number>(settings.basePricePerAccount);
  const [minAccounts, setMinAccounts] = useState<number>(settings.minSubmissionAccounts);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>(settings.priceTiers);

  // Announcement state
  const [announcement, setAnnouncement] = useState<string>(settings.announcementText);
  const [urgentNotice, setUrgentNotice] = useState<string>(settings.urgentNotice);

  // Channels state
  const [telegramUrl, setTelegramUrl] = useState<string>(settings.telegramChannelUrl);
  const [telegramName, setTelegramName] = useState<string>(settings.telegramChannelName);
  const [whatsappUrl, setWhatsappUrl] = useState<string>(settings.whatsappChannelUrl);
  const [whatsappName, setWhatsappName] = useState<string>(settings.whatsappChannelName);
  const [waGroupUrl, setWaGroupUrl] = useState<string>(settings.whatsappGroupUrl);
  const [adminPhone, setAdminPhone] = useState<string>(settings.adminWhatsappContact);
  const [webUrl, setWebUrl] = useState<string>(settings.webAppUrl);

  // Change Password state
  const [currentPass, setCurrentPass] = useState<string>('');
  const [newPass, setNewPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [passMessage, setPassMessage] = useState<{ text: string; error: boolean } | null>(null);

  // Feedback notifications
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [copiedSubId, setCopiedSubId] = useState<string | null>(null);

  // Storan filter
  const [storanFilter, setStoranFilter] = useState<string>('ALL');
  const [searchInvoice, setSearchInvoice] = useState<string>('');

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (passwordInput === settings.adminPasswordHash) {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      setAuthError('Kata sandi admin salah! (Default: admin888)');
    }
  };

  // Save Settings: Open/Close & Price
  const handleSavePriceAndStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveAdminSettings({
      isOpen: isOpenToggle,
      closeMessage: closeMsg,
      basePricePerAccount: Number(basePrice),
      minSubmissionAccounts: Number(minAccounts),
      priceTiers: priceTiers,
    });
    onUpdateSettings(updated);
    triggerToast('Pengaturan status storan & harga berhasil disimpan!');
  };

  // Tier helper
  const handleTierChange = (index: number, field: 'minAccounts' | 'pricePerAccount' | 'label', val: any) => {
    const updated = [...priceTiers];
    updated[index] = { ...updated[index], [field]: val };
    setPriceTiers(updated);
  };

  const handleAddTier = () => {
    setPriceTiers([
      ...priceTiers,
      { minAccounts: 200, pricePerAccount: 4000, label: 'Super Sultan (200+ Akun)' },
    ]);
  };

  const handleRemoveTier = (index: number) => {
    if (priceTiers.length <= 1) return;
    setPriceTiers(priceTiers.filter((_, i) => i !== index));
  };

  // Save Announcements
  const handleSaveAnnouncements = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveAdminSettings({
      announcementText: announcement,
      urgentNotice: urgentNotice,
    });
    onUpdateSettings(updated);
    triggerToast('Pengumuman resmi berhasil diperbarui!');
  };

  // Save Channels & Web link
  const handleSaveChannels = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveAdminSettings({
      telegramChannelUrl: telegramUrl,
      telegramChannelName: telegramName,
      whatsappChannelUrl: whatsappUrl,
      whatsappChannelName: whatsappName,
      whatsappGroupUrl: waGroupUrl,
      adminWhatsappContact: adminPhone,
      webAppUrl: webUrl,
    });
    onUpdateSettings(updated);
    triggerToast('Saluran & Link Web aplikasi berhasil diperbarui!');
  };

  // Change Admin Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (currentPass !== settings.adminPasswordHash) {
      setPassMessage({ text: 'Kata sandi saat ini tidak cocok!', error: true });
      return;
    }

    if (newPass.length < 5) {
      setPassMessage({ text: 'Kata sandi baru minimal 5 karakter!', error: true });
      return;
    }

    if (newPass !== confirmPass) {
      setPassMessage({ text: 'Konfirmasi kata sandi baru tidak sama!', error: true });
      return;
    }

    const updated = saveAdminSettings({
      adminPasswordHash: newPass,
    });
    onUpdateSettings(updated);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setPassMessage({ text: 'Kata sandi admin berhasil diganti! Harap diingat baik-baik.', error: false });
  };

  // Copy raw accounts
  const handleCopyRawAccounts = (sub: Submission) => {
    let textToCopy = sub.rawInput;
    if (!textToCopy && sub.accounts.length > 0) {
      textToCopy = sub.accounts
        .map((a) => `${a.email}|${a.password}${a.recoveryEmail ? `|${a.recoveryEmail}` : ''}`)
        .join('\n');
    }
    navigator.clipboard.writeText(textToCopy);
    setCopiedSubId(sub.id);
    setTimeout(() => setCopiedSubId(null), 2500);
  };

  // Filter Submissions
  const filteredSubs = submissions.filter((s) => {
    const matchSearch =
      s.id.toLowerCase().includes(searchInvoice.toLowerCase()) ||
      s.sellerName.toLowerCase().includes(searchInvoice.toLowerCase()) ||
      s.sellerContact.includes(searchInvoice) ||
      s.accountNumber.includes(searchInvoice);

    if (!matchSearch) return false;
    if (storanFilter === 'ALL') return true;
    return s.status === storanFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Admin Panel STORGMAIL<span className="text-amber-400">888</span>
                </h3>
                {isAuthenticated && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ONLINE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Pusat Kontrol Buka/Tutup, Aturan Harga, Saluran, dan Storan Masuk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 transition"
                title="Kunci Panel"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Keluar Admin</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast alert */}
        {saveToast && (
          <div className="bg-emerald-600 text-slate-950 font-bold px-4 py-2 text-xs text-center flex items-center justify-center gap-1.5 shadow-md">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Content Body */}
        {!isAuthenticated ? (
          /* ADMIN LOGIN SCREEN */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center flex-1">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
              <Key className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-bold text-white mb-1">
              Verifikasi Keamanan Admin
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mb-6">
              Masukkan password admin untuk mengatur status buka/tutup, aturan harga, link saluran, dan mengelola storan akun.
            </p>

            <form onSubmit={handleAdminLogin} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                required
                placeholder="Kata Sandi Admin (Default: admin888)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center text-sm text-white focus:outline-none focus:border-amber-400 font-mono tracking-widest"
              />

              {authError && (
                <div className="text-xs text-rose-400 font-medium">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
              >
                Buka Panel Admin
              </button>

              <div className="pt-2 text-[11px] text-slate-500">
                Password default: <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded">admin888</code>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            
            {/* Sidebar navigation */}
            <div className="w-full md:w-56 bg-slate-950/70 border-r border-slate-800 p-3 space-y-1.5 overflow-x-auto md:overflow-y-auto flex md:flex-col flex-shrink-0">
              <button
                onClick={() => setActiveTab('status_harga')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition whitespace-nowrap ${
                  activeTab === 'status_harga'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ToggleRight className="w-4 h-4" />
                <span>Open/Close & Harga</span>
              </button>

              <button
                onClick={() => setActiveTab('storan')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition whitespace-nowrap ${
                  activeTab === 'storan'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4" />
                  <span>Storan Masuk</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-slate-900 text-amber-400">
                  {submissions.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('pengumuman')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition whitespace-nowrap ${
                  activeTab === 'pengumuman'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Atur Pengumuman</span>
              </button>

              <button
                onClick={() => setActiveTab('saluran')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition whitespace-nowrap ${
                  activeTab === 'saluran'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Saluran & Link Web</span>
              </button>

              <button
                onClick={() => setActiveTab('password')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition whitespace-nowrap ${
                  activeTab === 'password'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Atur Password</span>
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition whitespace-nowrap ${
                  activeTab === 'stats'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Statistik & Rekap</span>
              </button>
            </div>

            {/* Main Tab Panel */}
            <div className="flex-1 p-5 sm:p-7 overflow-y-auto max-h-[calc(92vh-70px)]">
              
              {/* TAB 1: BUKA / TUTUP & ATURAN HARGA */}
              {activeTab === 'status_harga' && (
                <form onSubmit={handleSavePriceAndStatus} className="space-y-6">
                  
                  {/* Status Storan Card */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <ToggleLeft className="w-5 h-5 text-amber-400" />
                          <span>Status Penerimaan Storan (Open / Close)</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Atur apakah formulir setor Gmail dibuka untuk publik atau ditutup sementara.
                        </p>
                      </div>

                      {/* Toggle Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsOpenToggle(true)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                            isOpenToggle
                              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>BUKA (OPEN)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsOpenToggle(false)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                            !isOpenToggle
                              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>TUTUP (CLOSED)</span>
                        </button>
                      </div>
                    </div>

                    {/* Close Message if Closed */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Pesan Saat Storan Ditutup:
                      </label>
                      <textarea
                        rows={2}
                        value={closeMsg}
                        onChange={(e) => setCloseMsg(e.target.value)}
                        placeholder="Tulis alasan kuota penuh atau kapan akan dibuka kembali..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Pricing Settings */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                      <span>Aturan Harga & Minimal Setor</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Harga Dasar per Akun (Rp):
                        </label>
                        <input
                          type="number"
                          min="500"
                          step="100"
                          value={basePrice}
                          onChange={(e) => setBasePrice(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Minimal Jumlah Setor Akun:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={minAccounts}
                          onChange={(e) => setMinAccounts(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Price Tiers */}
                    <div className="pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          Tingkatan / Tier Harga Bonus Berdasarkan Jumlah:
                        </label>
                        <button
                          type="button"
                          onClick={handleAddTier}
                          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Tier</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {priceTiers.map((tier, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <input
                              type="text"
                              value={tier.label}
                              onChange={(e) => handleTierChange(idx, 'label', e.target.value)}
                              placeholder="Nama Label"
                              className="flex-1 bg-slate-950 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs text-white"
                            />
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-slate-400">Min:</span>
                              <input
                                type="number"
                                value={tier.minAccounts}
                                onChange={(e) => handleTierChange(idx, 'minAccounts', Number(e.target.value))}
                                className="w-16 bg-slate-950 border border-slate-700 px-2 py-1.5 rounded-lg text-xs text-white text-center font-mono"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-slate-400">Rp:</span>
                              <input
                                type="number"
                                step="100"
                                value={tier.pricePerAccount}
                                onChange={(e) => handleTierChange(idx, 'pricePerAccount', Number(e.target.value))}
                                className="w-24 bg-slate-950 border border-slate-700 px-2 py-1.5 rounded-lg text-xs text-amber-400 font-mono text-center font-bold"
                              />
                            </div>
                            {priceTiers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTier(idx)}
                                className="p-1.5 text-rose-400 hover:text-rose-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>SIMPAN PENGATURAN STATUS & HARGA</span>
                  </button>
                </form>
              )}

              {/* TAB 2: INBOX STORAN MASUK */}
              {activeTab === 'storan' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                      {['ALL', 'PENDING', 'CHECKING', 'APPROVED_PAID', 'REJECTED'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setStoranFilter(st)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                            storanFilter === st
                              ? 'bg-amber-500 text-slate-950'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {st === 'ALL' ? 'Semua' : st}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Cari Invoice / Seller..."
                      value={searchInvoice}
                      onChange={(e) => setSearchInvoice(e.target.value)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  {/* Submissions List */}
                  {filteredSubs.length === 0 ? (
                    <div className="p-12 text-center bg-slate-950/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                      Tidak ada data storan yang sesuai dengan filter.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredSubs.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                                {sub.id}
                              </span>
                              <span className="text-xs text-slate-400">
                                {formatDateIndo(sub.createdAt)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyRawAccounts(sub)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                                  copiedSubId === sub.id
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                }`}
                                title="Salin semua akun untuk dicopy ke notepad / checker"
                              >
                                {copiedSubId === sub.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Tersalin!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Salin Akun (TXT)</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => {
                                  onClose();
                                  onSelectSubmission(sub);
                                }}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition flex items-center gap-1"
                              >
                                <span>Detail</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Seller & Payout info */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <div className="text-slate-400">Seller:</div>
                              <div className="font-bold text-white">{sub.sellerName}</div>
                              <div className="text-slate-400 text-[11px]">WA: {sub.sellerContact}</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Pencairan:</div>
                              <div className="font-bold text-amber-400">{sub.paymentMethod}</div>
                              <div className="font-mono text-white text-[11px]">{sub.accountNumber} (A.N {sub.accountHolderName})</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Total Nominal:</div>
                              <div className="font-extrabold text-emerald-400 text-sm">
                                {formatRupiah(sub.totalPayout)}
                              </div>
                              <div className="text-slate-400 text-[11px]">{sub.totalAccounts} Akun @ {formatRupiah(sub.pricePerAccount)}</div>
                            </div>
                          </div>

                          {/* Quick Action buttons to update status */}
                          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] text-slate-400 font-semibold mr-1">Ubah Status:</span>
                              
                              <button
                                onClick={() => {
                                  updateSubmissionStatus(sub.id, 'CHECKING', 'Admin sedang mengecek validitas login akun.');
                                  triggerToast(`Status ${sub.id} diubah ke Sedang Dicek`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                                  sub.status === 'CHECKING'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-900 hover:bg-blue-950 text-blue-400 border border-blue-900/50'
                                }`}
                              >
                                🔄 Dicek
                              </button>

                              <button
                                onClick={() => {
                                  updateSubmissionStatus(sub.id, 'APPROVED_PAID', 'Akun lolos checker & dana telah dicairkan.');
                                  triggerToast(`Status ${sub.id} diubah ke SUKSES DIBAYAR!`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                                  sub.status === 'APPROVED_PAID'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-900/50'
                                }`}
                              >
                                ✅ Sukses & Bayar
                              </button>

                              <button
                                onClick={() => {
                                  const reason = prompt('Masukkan alasan penolakan (misal: sandi salah / 2FA aktif):', 'Sebagian sandi salah dan 2FA aktif');
                                  if (reason) {
                                    updateSubmissionStatus(sub.id, 'REJECTED', reason);
                                    triggerToast(`Status ${sub.id} diubah ke Ditolak`);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                                  sub.status === 'REJECTED'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-900 hover:bg-rose-950 text-rose-400 border border-rose-900/50'
                                }`}
                              >
                                ❌ Tolak
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                if (confirm(`Yakin ingin menghapus invoice ${sub.id}?`)) {
                                  deleteSubmission(sub.id);
                                  triggerToast(`Invoice ${sub.id} berhasil dihapus.`);
                                }
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                              title="Hapus Storan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PENGUMUMAN STORAN */}
              {activeTab === 'pengumuman' && (
                <form onSubmit={handleSaveAnnouncements} className="space-y-5">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-400" />
                      <span>Atur Pesan Pengumuman Storan</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Pesan Pengumuman Utama (Muncul di Banner & Box Selamat Datang):
                      </label>
                      <textarea
                        rows={3}
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        placeholder="PENGUMUMAN STORAN selamat datang di STORGMAIL888!..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Pesan ini akan tampil di bagian atas web aplikasi dan pada ticker berjalan.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Pemberitahuan Kilat (Notice Ticker):
                      </label>
                      <input
                        type="text"
                        value={urgentNotice}
                        onChange={(e) => setUrgentNotice(e.target.value)}
                        placeholder="⚡ PROSES KILAT: Pencairan dana rata-rata 5-15 menit..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>SIMPAN PENGUMUMAN STORAN</span>
                  </button>
                </form>
              )}

              {/* TAB 4: SALURAN & LINK WEB */}
              {activeTab === 'saluran' && (
                <form onSubmit={handleSaveChannels} className="space-y-5">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Send className="w-5 h-5 text-cyan-400" />
                      <span>Saluran Resmi & Tautan Komunitas</span>
                    </h4>

                    {/* Telegram */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Nama Saluran Telegram:
                        </label>
                        <input
                          type="text"
                          value={telegramName}
                          onChange={(e) => setTelegramName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Link URL Saluran Telegram:
                        </label>
                        <input
                          type="text"
                          value={telegramUrl}
                          onChange={(e) => setTelegramUrl(e.target.value)}
                          placeholder="https://t.me/..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Nama Saluran WhatsApp:
                        </label>
                        <input
                          type="text"
                          value={whatsappName}
                          onChange={(e) => setWhatsappName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Link URL Saluran WhatsApp:
                        </label>
                        <input
                          type="text"
                          value={whatsappUrl}
                          onChange={(e) => setWhatsappUrl(e.target.value)}
                          placeholder="https://whatsapp.com/channel/..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* WA Group & CS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Link Grup Diskusi WhatsApp:
                        </label>
                        <input
                          type="text"
                          value={waGroupUrl}
                          onChange={(e) => setWaGroupUrl(e.target.value)}
                          placeholder="https://chat.whatsapp.com/..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Nomor WhatsApp Admin / CS (Contoh: 6281234567890):
                        </label>
                        <input
                          type="text"
                          value={adminPhone}
                          onChange={(e) => setAdminPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Custom Web URL for sharing */}
                    <div className="pt-3 border-t border-slate-800">
                      <label className="block text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                        <Share2 className="w-4 h-4" />
                        <span>Link Web Aplikasi Anda (Untuk Akses Publik):</span>
                      </label>
                      <input
                        type="text"
                        value={webUrl}
                        onChange={(e) => setWebUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Tautan ini yang akan disalin otomatis saat orang lain menekan tombol "Salin Link Web" atau scan QR Code.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>SIMPAN SALURAN & LINK WEB</span>
                  </button>
                </form>
              )}

              {/* TAB 5: ATUR PASSWORD ADMIN */}
              {activeTab === 'password' && (
                <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Key className="w-5 h-5 text-amber-400" />
                      <span>Atur & Ganti Password Admin Panel</span>
                    </h4>

                    {passMessage && (
                      <div
                        className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                          passMessage.error
                            ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                            : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                        }`}
                      >
                        {passMessage.error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>{passMessage.text}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password Admin Saat Ini:
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Masukkan password admin lama"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password Baru:
                      </label>
                      <input
                        type="password"
                        required
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Minimal 5 karakter"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Konfirmasi Password Baru:
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Ketik ulang password baru"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Key className="w-4 h-4" />
                    <span>PERBARUI PASSWORD ADMIN</span>
                  </button>
                </form>
              )}

              {/* TAB 6: STATS & REKAP */}
              {activeTab === 'stats' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Storan Masuk</div>
                      <div className="text-xl font-black text-white mt-1">{submissions.length}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Akun Ditampung</div>
                      <div className="text-xl font-black text-amber-400 mt-1">
                        {submissions.reduce((acc, s) => acc + s.totalAccounts, 0)}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Dana Cair</div>
                      <div className="text-xl font-black text-emerald-400 mt-1">
                        {formatRupiah(
                          submissions
                            .filter((s) => s.status === 'APPROVED_PAID')
                            .reduce((acc, s) => acc + s.totalPayout, 0)
                        )}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Storan Pending</div>
                      <div className="text-xl font-black text-yellow-400 mt-1">
                        {submissions.filter((s) => s.status === 'PENDING' || s.status === 'CHECKING').length}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-2">
                      Ringkasan Operasional STORGMAIL888
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Sistem siap beroperasi 24/7. Anda dapat menyalin data akun ke format TXT sewaktu-waktu untuk pengecekan cepat, mengubah harga saat rate pasar berubah, dan mengaktifkan / menonaktifkan storan dalam 1 klik.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
