import React, { useState } from 'react';
import { Plus, Save, X, AlertCircle } from 'lucide-react';
import { CashClosingRecord } from '../types';
import { PAYMENT_LABELS } from '../constants';

interface ClosingFormProps {
  onSave: (record: Omit<CashClosingRecord, 'id' | 'totalRevenue' | 'finalBalance' | 'aiAnalysis'>) => void;
  onCancel: (() => void) | null;
}

export const ClosingForm: React.FC<ClosingFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    openingBalance: '',
    creditCard: '',
    debitCard: '',
    pix: '',
    cash: '',
    boleto: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: formData.date,
      openingBalance: Number(formData.openingBalance) || 0,
      creditCard: Number(formData.creditCard) || 0,
      debitCard: Number(formData.debitCard) || 0,
      pix: Number(formData.pix) || 0,
      cash: Number(formData.cash) || 0,
      boleto: Number(formData.boleto) || 0,
    });
  };

  const inputClass = "mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border outline-none transition-all";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-gray-50 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Plus className="w-6 h-6 text-indigo-600" />
            Lançar Fechamento
          </h3>
          <p className="text-xs text-gray-500 mt-1">Preencha todos os campos corretamente antes de salvar.</p>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-indigo-700 uppercase mb-1 tracking-wider">Data do Fechamento</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-700 uppercase mb-1 tracking-wider">{PAYMENT_LABELS.openingBalance}</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-400 text-sm">R$</span>
              </div>
              <input
                type="number"
                name="openingBalance"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.openingBalance}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="md:col-span-2 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mt-2">
            <div className="h-px bg-indigo-100 flex-1"></div>
            <span>Entradas do Dia</span>
            <div className="h-px bg-indigo-100 flex-1"></div>
          </div>

          {[
            { name: 'creditCard', label: PAYMENT_LABELS.creditCard },
            { name: 'debitCard', label: PAYMENT_LABELS.debitCard },
            { name: 'pix', label: PAYMENT_LABELS.pix },
            { name: 'cash', label: PAYMENT_LABELS.cash },
            { name: 'boleto', label: PAYMENT_LABELS.boleto },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-400 text-sm">R$</span>
                </div>
                <input
                  type="number"
                  name={field.name}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-800">
            Confira se os valores digitados batem com os comprovantes físicos e relatórios da maquineta antes de confirmar.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-8 py-3 border border-transparent rounded-xl shadow-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-5 h-5" />
            Salvar Fechamento
          </button>
        </div>
      </form>
    </div>
  );
};