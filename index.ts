export type SubmissionStatus = 'PENDING' | 'CHECKING' | 'APPROVED_PAID' | 'REJECTED';

export interface GmailAccountItem {
  id: string;
  email: string;
  password: string;
  recoveryEmail?: string;
  notes?: string;
  status: 'pending' | 'valid' | 'invalid';
}

export interface Submission {
  id: string; // e.g. STM-888-4921
  createdAt: string;
  sellerName: string;
  sellerContact: string; // WhatsApp or Phone
  userId?: string;
  paymentMethod: string; // DANA, OVO, GOPAY, BCA, etc.
  accountNumber: string;
  accountHolderName: string;
  accounts: GmailAccountItem[];
  rawInput: string;
  totalAccounts: number;
  validAccountsCount: number;
  pricePerAccount: number;
  totalPayout: number;
  status: SubmissionStatus;
  adminNotes?: string;
  paymentProofUrl?: string;
  paidAt?: string;
}

export interface PriceTier {
  minAccounts: number;
  pricePerAccount: number;
  label: string;
}

export interface AdminSettings {
  isOpen: boolean; // Fitur open dan close
  closeMessage: string;
  announcementText: string;
  urgentNotice: string;
  basePricePerAccount: number;
  minSubmissionAccounts: number;
  priceTiers: PriceTier[];
  adminPasswordHash: string; // default hashed/stored
  webAppUrl: string;
  
  // Saluran Links
  telegramChannelUrl: string;
  telegramChannelName: string;
  whatsappChannelUrl: string;
  whatsappChannelName: string;
  whatsappGroupUrl: string;
  adminWhatsappContact: string;
  discordCommunityUrl: string;

  // Syarat & Ketentuan
  termsAndConditions: string[];
}

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  whatsapp: string;
  password: string;
  savedPaymentMethod?: string;
  savedAccountNumber?: string;
  savedAccountHolder?: string;
  createdAt: string;
  role: 'seller' | 'admin';
}
