import { AdminSettings, Submission, UserAccount } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'storgmail888_settings_v1',
  SUBMISSIONS: 'storgmail888_submissions_v1',
  USERS: 'storgmail888_users_v1',
  CURRENT_USER: 'storgmail888_current_user_v1',
  ADMIN_AUTH: 'storgmail888_admin_authenticated',
};

// Default current shared app url
export const DEFAULT_APP_URL = typeof window !== 'undefined' ? window.location.origin : 'https://storgmail888.app';

export const DEFAULT_SETTINGS: AdminSettings = {
  isOpen: true,
  closeMessage: 'MOHON MAAF, STORAN SEMENTARA DITUTUP KARENA KUOTA HARI INI TELAH PENUH. Pantau saluran Telegram & WhatsApp kami untuk info pembukaan kembali!',
  announcementText: 'PENGUMUMAN STORAN: Selamat datang di STORGMAIL888! Pastikan akun Gmail yang disetor fresh dan sesuai dengan kata sandi wajib.',
  urgentNotice: '⚡ PROSES KILAT: Pencairan dana DANA/OVO/GoPay/BCA rata-rata 5-15 menit setelah akun lolos verifikasi.',
  basePricePerAccount: 3000,
  minSubmissionAccounts: 3,
  priceTiers: [
    { minAccounts: 3, pricePerAccount: 3000, label: 'Reguler (3-19 Akun)' },
    { minAccounts: 20, pricePerAccount: 3200, label: 'Silver Seller (20-49 Akun)' },
    { minAccounts: 50, pricePerAccount: 3500, label: 'Gold Seller (50-99 Akun)' },
    { minAccounts: 100, pricePerAccount: 3800, label: 'VIP Sultan (100+ Akun)' },
  ],
  adminPasswordHash: 'admin888', // Default password
  webAppUrl: DEFAULT_APP_URL,
  telegramChannelUrl: 'https://t.me/storgmail888_official',
  telegramChannelName: 'STORGMAIL888 Official Channel',
  whatsappChannelUrl: 'https://whatsapp.com/channel/0029VaSTORGMAIL888',
  whatsappChannelName: 'Saluran Info & Buka Tutup STORGMAIL888',
  whatsappGroupUrl: 'https://chat.whatsapp.com/invite/storgmail888community',
  adminWhatsappContact: '6281234567890',
  discordCommunityUrl: 'https://discord.gg/storgmail888',
  termsAndConditions: [
    'Akun Gmail wajib FRESH (belum pernah disetor ke pihak lain).',
    'Kata sandi / Password WAJIB valid & tidak boleh salah ketik.',
    'Verifikasi 2 Langkah (2FA) WAJIB dalam kondisi NONAKTIF / MATI.',
    'Bila ada email pemulihan, sertakan di format: email|password|pemulihan.',
    'Akun yang terkena Verifikasi No HP / dinonaktifkan tidak akan dibayar.',
    'Pembayaran otomatis cair ke E-Wallet / Rekening bank yang dimasukkan.',
  ],
};

const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 'STM-888-9102',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    sellerName: 'Budi Santoso (Surabaya)',
    sellerContact: '0813****9021',
    paymentMethod: 'DANA',
    accountNumber: '0813****9021',
    accountHolderName: 'BUDI SANTOSO',
    totalAccounts: 25,
    validAccountsCount: 25,
    pricePerAccount: 3200,
    totalPayout: 80000,
    status: 'APPROVED_PAID',
    adminNotes: 'Akun fresh sudah lolos checker. Dana sudah ditransfer ke DANA!',
    paidAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    rawInput: 'budi_acc1@gmail.com|pass123\nbudi_acc2@gmail.com|pass123',
    accounts: [
      { id: '1', email: 'bu***1@gmail.com', password: '••••••••', status: 'valid' },
      { id: '2', email: 'bu***2@gmail.com', password: '••••••••', status: 'valid' },
    ],
  },
  {
    id: 'STM-888-8472',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    sellerName: 'Rian Pratama (Bandung)',
    sellerContact: '0857****3312',
    paymentMethod: 'GOPAY',
    accountNumber: '0857****3312',
    accountHolderName: 'RIAN PRATAMA',
    totalAccounts: 60,
    validAccountsCount: 60,
    pricePerAccount: 3500,
    totalPayout: 210000,
    status: 'APPROVED_PAID',
    adminNotes: 'Transfer via GoPay sukses. Terimakasih!',
    paidAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    rawInput: 'sample_raw_accounts',
    accounts: [],
  },
  {
    id: 'STM-888-7821',
    createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    sellerName: 'Dimas Kurniawan (Jakarta)',
    sellerContact: '0821****1190',
    paymentMethod: 'BANK BCA',
    accountNumber: '8205****90',
    accountHolderName: 'DIMAS KURNIAWAN',
    totalAccounts: 120,
    validAccountsCount: 120,
    pricePerAccount: 3800,
    totalPayout: 456000,
    status: 'APPROVED_PAID',
    adminNotes: 'Tier VIP Sultan 120 akun lancar jaya. Saldo BCA telah masuk.',
    paidAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    rawInput: 'sample_raw_accounts',
    accounts: [],
  },
  {
    id: 'STM-888-6619',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    sellerName: 'Hendra Saputra (Medan)',
    sellerContact: '0896****7721',
    paymentMethod: 'SHOPEEPAY',
    accountNumber: '0896****7721',
    accountHolderName: 'HENDRA SAPUTRA',
    totalAccounts: 15,
    validAccountsCount: 15,
    pricePerAccount: 3000,
    totalPayout: 45000,
    status: 'CHECKING',
    adminNotes: 'Sedang proses verifikasi akun di server checker...',
    rawInput: 'sample_raw_accounts',
    accounts: [],
  },
  {
    id: 'STM-888-5502',
    createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    sellerName: 'Farhan Maulana (Semarang)',
    sellerContact: '0812****8831',
    paymentMethod: 'OVO',
    accountNumber: '0812****8831',
    accountHolderName: 'FARHAN MAULANA',
    totalAccounts: 40,
    validAccountsCount: 40,
    pricePerAccount: 3200,
    totalPayout: 128000,
    status: 'PENDING',
    adminNotes: 'Menunggu giliran antrian verifikasi admin.',
    rawInput: 'sample_raw_accounts',
    accounts: [],
  },
];

const SEED_USERS: UserAccount[] = [
  {
    id: 'USR-888-01',
    username: 'sultan_seller',
    name: 'Sultan Gmail Indonesia',
    whatsapp: '081299988877',
    password: 'password123',
    savedPaymentMethod: 'DANA',
    savedAccountNumber: '081299988877',
    savedAccountHolder: 'SULTAN GMAIL',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    role: 'seller',
  },
];

// Helper dispatcher for cross-component reactive sync
export function emitStorageEvent(key: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('storgmail888_sync', { detail: { key } }));
  }
}

export function getAdminSettings(): AdminSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAdminSettings(settings: Partial<AdminSettings>): AdminSettings {
  const current = getAdminSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  emitStorageEvent(STORAGE_KEYS.SETTINGS);
  return updated;
}

export function getSubmissions(): Submission[] {
  if (typeof window === 'undefined') return SEED_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(SEED_SUBMISSIONS));
      return SEED_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_SUBMISSIONS;
  } catch {
    return SEED_SUBMISSIONS;
  }
}

export function saveSubmissions(list: Submission[]) {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
  emitStorageEvent(STORAGE_KEYS.SUBMISSIONS);
}

export function addSubmission(newSub: Submission) {
  const current = getSubmissions();
  const updated = [newSub, ...current];
  saveSubmissions(updated);
  return updated;
}

export function updateSubmissionStatus(
  id: string,
  status: Submission['status'],
  notes?: string,
  paymentProofUrl?: string
) {
  const current = getSubmissions();
  const updated = current.map((sub) => {
    if (sub.id === id) {
      return {
        ...sub,
        status,
        ...(notes !== undefined ? { adminNotes: notes } : {}),
        ...(paymentProofUrl !== undefined ? { paymentProofUrl } : {}),
        ...(status === 'APPROVED_PAID' ? { paidAt: new Date().toISOString() } : {}),
      };
    }
    return sub;
  });
  saveSubmissions(updated);
  return updated;
}

export function deleteSubmission(id: string) {
  const current = getSubmissions();
  const updated = current.filter((sub) => sub.id !== id);
  saveSubmissions(updated);
  return updated;
}

// User accounts
export function getUsers(): UserAccount[] {
  if (typeof window === 'undefined') return SEED_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

export function saveUser(user: UserAccount) {
  const current = getUsers();
  const existingIdx = current.findIndex((u) => u.username.toLowerCase() === user.username.toLowerCase());
  let updated: UserAccount[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = user;
  } else {
    updated = [user, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
  emitStorageEvent(STORAGE_KEYS.USERS);
  return user;
}

export function getCurrentUser(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
  emitStorageEvent(STORAGE_KEYS.CURRENT_USER);
}

// Format Rupiah helper
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Date formatter
export function formatDateIndo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}
