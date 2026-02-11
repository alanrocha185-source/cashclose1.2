export const APP_NAME = "CashClose Pro";

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const PAYMENT_LABELS: Record<string, string> = {
  openingBalance: 'Abertura de Caixa',
  creditCard: 'Cartão de Crédito',
  debitCard: 'Cartão de Débito',
  pix: 'PIX',
  cash: 'Espécie (Dinheiro)',
  boleto: 'Boleto',
  totalRevenue: 'Faturamento Total',
  finalBalance: 'Saldo Final (Com Abertura)'
};

export const MOCK_DATA = [
  {
    id: '1',
    date: '2023-10-25',
    openingBalance: 150.00,
    creditCard: 1200.50,
    debitCard: 450.00,
    pix: 890.00,
    cash: 320.00,
    boleto: 0.00,
    totalRevenue: 2860.50,
    finalBalance: 3010.50,
  },
  {
    id: '2',
    date: '2023-10-26',
    openingBalance: 150.00,
    creditCard: 980.00,
    debitCard: 560.00,
    pix: 1200.00,
    cash: 410.00,
    boleto: 150.00,
    totalRevenue: 3300.00,
    finalBalance: 3450.00,
  }
];