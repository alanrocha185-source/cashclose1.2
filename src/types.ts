export type UserRole = "admin" | "sales" | null;

export interface UserSession {
  role: UserRole;
  username: string;
}

export interface CashClosingRecord {
  id: string;

  closingDate: string; // YYYY-MM-DD (vem do banco como date)

  openingBalance: number;
  creditCard: number;
  debitCard: number;
  pix: number;
  cash: number;
  boleto: number;

  totalRevenue: number;
  finalBalance: number;

  notes?: string;
  aiAnalysis?: string | null;
  createdBy?: string;
}

export type PaymentMethod =
  | "openingBalance"
  | "creditCard"
  | "debitCard"
  | "pix"
  | "cash"
  | "boleto";

export interface FilterState {
  startDate: string;
  endDate: string;
  minAmount?: number;
}
