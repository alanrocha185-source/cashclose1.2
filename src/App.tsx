import React, { useEffect, useState } from "react";
import { Plus, Wallet, LogOut, Download, Share2 } from "lucide-react";

import { supabase } from "./services/supabase";

import { ClosingForm } from "./components/ClosingForm";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";

import { CashClosingRecord, UserRole } from "./types";
import { APP_NAME } from "./constants";
import { analyzeClosingData } from "./services/geminiService";

const STORAGE_KEY = "cashclose_role";

const App: React.FC = () => {
  /* ==========================
     🔐 LOGIN
  ========================== */

  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem(STORAGE_KEY) as UserRole;
    if (savedRole) setRole(savedRole);
  }, []);

  const handleLogin = (selectedRole: UserRole) => {
    localStorage.setItem(STORAGE_KEY, selectedRole as string);
    setRole(selectedRole);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRole(null);
  };

  /* ==========================
     📦 DADOS DO SUPABASE
  ========================== */

  const [records, setRecords] = useState<CashClosingRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // 🔥 Buscar registros
  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from("cash_records")
      .select("*")
      .order("closing_date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar dados:", error);
      return;
    }

    if (data) {
      const formatted: CashClosingRecord[] = data.map((item: any) => ({
        id: item.id,
        closingDate: item.closing_date,

        openingBalance: item.opening_balance,
        creditCard: item.credit_card,
        debitCard: item.debit_card,
        pix: item.pix,
        cash: item.cash,
        boleto: item.boleto,

        totalRevenue: item.total_revenue,
        finalBalance: item.final_balance,

        notes: item.notes,
        aiAnalysis: item.ai_analysis,
        createdBy: item.created_by,
      }));

      setRecords(formatted);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  /* ==========================
     📲 PWA INSTALL
  ========================== */

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.finally(() => setInstallPrompt(null));
  };

  /* ==========================
     🔗 SHARE
  ========================== */

  const handleShareClick = () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: APP_NAME,
        text: "Acesse o sistema de fechamento de caixa",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copiado!");
    }
  };

  /* ==========================
     ➕ SALVAR NO SUPABASE
  ========================== */

  const handleSaveRecord = async (
    data: Omit<
      CashClosingRecord,
      "id" | "totalRevenue" | "finalBalance" | "aiAnalysis"
    >
  ) => {
    const totalRevenue =
      data.creditCard +
      data.debitCard +
      data.pix +
      data.cash +
      data.boleto;

    const finalBalance = totalRevenue + data.openingBalance;

    const { error } = await supabase.from("cash_records").insert([
      {
        closing_date: data.closingDate,
        opening_balance: data.openingBalance,
        credit_card: data.creditCard,
        debit_card: data.debitCard,
        pix: data.pix,
        cash: data.cash,
        boleto: data.boleto,

        total_revenue: totalRevenue,
        final_balance: finalBalance,
        created_by: role,
      },
    ]);

    if (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar no banco.");
      return;
    }

    await fetchRecords();
    setShowForm(false);
  };

  /* ==========================
     🤖 IA (LOCAL)
  ========================== */

  const handleAnalyze = async (record: CashClosingRecord) => {
    if (record.aiAnalysis) return;

    setAnalyzingId(record.id);

    const analysis = await analyzeClosingData(record);

    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id ? { ...r, aiAnalysis: analysis } : r
      )
    );

    setAnalyzingId(null);
  };

  const isAdmin = role === "admin";

  /* ==========================
     🖥️ RENDER
  ========================== */

  return (
    <>
      {!role ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="bg-indigo-700 text-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Wallet className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold">{APP_NAME}</h1>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handleShareClick}>
                  <Share2 className="w-5 h-5" />
                </button>

                {installPrompt && (
                  <button onClick={handleInstallClick}>
                    <Download className="w-5 h-5" />
                  </button>
                )}

                <button onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl mx-auto px-4 py-6 space-y-6">
            {isAdmin && !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Novo Fechamento
              </button>
            )}

            {showForm || role === "sales" ? (
              <ClosingForm
                onSave={handleSaveRecord}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <Dashboard
                records={records}
                onAnalyze={handleAnalyze}
                analyzingId={analyzingId}
              />
            )}
          </main>
        </div>
      )}
    </>
  );
};

export default App;
