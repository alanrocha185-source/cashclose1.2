import React, { useEffect, useState } from 'react';
import {
  Plus,
  Wallet,
  LogOut,
  Download,
  Share2,
} from 'lucide-react';

import { ClosingForm } from './components/ClosingForm';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';

import { CashClosingRecord } from './types';
import { MOCK_DATA, APP_NAME } from './constants';
import { analyzeClosingData } from './services/geminiService';

export type UserRole = 'admin' | 'staff';

const STORAGE_KEY = 'cashclose_role';

const App: React.FC = () => {
  /* ==========================
     🔐 CONTROLE DE LOGIN
  ========================== */

  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem(STORAGE_KEY) as UserRole | null;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleLogin = (selectedRole: UserRole) => {
    localStorage.setItem(STORAGE_KEY, selectedRole);
    setRole(selectedRole);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRole(null);
  };

  /* ==========================
     📦 DADOS DE FECHAMENTO
  ========================== */

  const [records, setRecords] = useState<CashClosingRecord[]>(() => {
    const saved = localStorage.getItem('cashCloseRecords');
    return saved ? JSON.parse(saved) : MOCK_DATA;
  });

  const [showForm, setShowForm] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('cashCloseRecords', JSON.stringify(records));
  }, [records]);

  /* ==========================
     📲 PWA INSTALL
  ========================== */

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () =>
      window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.finally(() => setInstallPrompt(null));
  };

  /* ==========================
     🔗 COMPARTILHAR
  ========================== */

  const handleShareClick = () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: APP_NAME,
        text: 'Acesse o sistema de fechamento de caixa',
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado!');
    }
  };

  /* ==========================
     ➕ SALVAR FECHAMENTO
  ========================== */

  const handleSaveRecord = (
    data: Omit<
      CashClosingRecord,
      'id' | 'totalRevenue' | 'finalBalance' | 'aiAnalysis'
    >
  ) => {
    const totalRevenue =
      data.creditCard +
      data.debitCard +
      data.pix +
      data.cash +
      data.boleto;

    const finalBalance = totalRevenue + data.openingBalance;

    const newRecord: CashClosingRecord = {
      ...data,
      id: crypto.randomUUID(),
      totalRevenue,
      finalBalance,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setShowForm(false);
  };

  /* ==========================
     🤖 ANÁLISE IA
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

  /* ==========================
     🧠 CONTROLE ADMIN
  ========================== */

  const isAdmin = role === 'admin';

  /* ==========================
     🖥️ RENDERIZAÇÃO
  ========================== */

  return (
    <>
      {!role ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* HEADER */}
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

          {/* MAIN */}
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

            {showForm || role === 'staff' ? (
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
