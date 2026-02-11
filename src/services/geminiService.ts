import { GoogleGenAI } from "@google/genai";
import { CashClosingRecord } from "../types";
import { formatCurrency, PAYMENT_LABELS } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing for Gemini Service");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeClosingData = async (record: CashClosingRecord): Promise<string> => {
  const client = getClient();
  if (!client) return "Configuração de API Key necessária para análise IA.";

  const prompt = `
    Atue como um analista financeiro sênior. Analise o seguinte fechamento de caixa diário e forneça insights breves e úteis (máximo 3 frases) sobre o desempenho do dia. Identifique anomalias ou destaques positivos.
    
    Dados do Fechamento (${record.date}):
    - ${PAYMENT_LABELS.openingBalance}: ${formatCurrency(record.openingBalance)}
    - ${PAYMENT_LABELS.creditCard}: ${formatCurrency(record.creditCard)}
    - ${PAYMENT_LABELS.debitCard}: ${formatCurrency(record.debitCard)}
    - ${PAYMENT_LABELS.pix}: ${formatCurrency(record.pix)}
    - ${PAYMENT_LABELS.cash}: ${formatCurrency(record.cash)}
    - ${PAYMENT_LABELS.boleto}: ${formatCurrency(record.boleto)}
    ----------------
    - ${PAYMENT_LABELS.totalRevenue}: ${formatCurrency(record.totalRevenue)}
    
    Responda em tom profissional e direto em Português do Brasil.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar análise.";
  } catch (error) {
    console.error("Erro ao analisar fechamento:", error);
    return "Erro ao conectar com o serviço de inteligência.";
  }
};