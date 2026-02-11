export type UserRole = 'admin' | 'sales' | null;

export interface UserSession {
  role: UserRole;
  username: string;
}

export interface CashClosingRecord {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  openingBalance: number;
  creditCard: number;
  debitCard: number;
  pix: number;
  cash: number;
  boleto: number;
  totalRevenue: number; // Sum of credit, debit, pix, cash, boleto (excluding opening)
  finalBalance: number; // Revenue + Opening Balance
  notes?: string;
  aiAnalysis?: string;
  createdBy?: string;
}

export type PaymentMethod = 'openingBalance' | 'creditCard' | 'debitCard' | 'pix' | 'cash' | 'boleto';

export interface FilterState {
  startDate: string;
  endDate: string;
  minAmount?: number;
}