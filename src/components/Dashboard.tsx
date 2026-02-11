import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Filter, Calendar, TrendingUp, DollarSign, CreditCard, Sparkles } from 'lucide-react';
import { CashClosingRecord } from '../types';
import { formatCurrency, PAYMENT_LABELS } from '../constants';

interface DashboardProps {
  records: CashClosingRecord[];
  onAnalyze: (record: CashClosingRecord) => void;
  analyzingId: string | null;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const Dashboard: React.FC<DashboardProps> = ({ records, onAnalyze, analyzingId }) => {
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [activePaymentFilter, setActivePaymentFilter] = useState<string>('all');

  // Filter Logic
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const recordDate = new Date(record.date);
      const start = filterStartDate ? new Date(filterStartDate) : null;
      const end = filterEndDate ? new Date(filterEndDate) : null;

      if (start && recordDate < start) return false;
      if (end && recordDate > end) return false;
      
      // Basic filtering logic for payment type visibility (handled in UI, but could filter rows here)
      // For this app, the prompt asks to "Filter by type", we will use this to toggle visibility in the table/charts
      
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records, filterStartDate, filterEndDate]);

  // Derived Statistics
  const totalPeriodRevenue = filteredRecords.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const totalPix = filteredRecords.reduce((acc, curr) => acc + curr.pix, 0);
  const totalCards = filteredRecords.reduce((acc, curr) => acc + curr.creditCard + curr.debitCard, 0);
  const totalCash = filteredRecords.reduce((acc, curr) => acc + curr.cash, 0);

  // Chart Data Preparation
  const pieData = [
    { name: 'Crédito', value: filteredRecords.reduce((acc, r) => acc + r.creditCard, 0) },
    { name: 'Débito', value: filteredRecords.reduce((acc, r) => acc + r.debitCard, 0) },
    { name: 'PIX', value: filteredRecords.reduce((acc, r) => acc + r.pix, 0) },
    { name: 'Dinheiro', value: filteredRecords.reduce((acc, r) => acc + r.cash, 0) },
    { name: 'Boleto', value: filteredRecords.reduce((acc, r) => acc + r.boleto, 0) },
  ].filter(item => item.value > 0);

  const barData = filteredRecords.slice().reverse().map(r => ({
    date: new Date(r.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    Total: r.totalRevenue,
    Pix: r.pix,
    Cartao: r.creditCard + r.debitCard,
  })).slice(-7); // Last 7 records for readability

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">De:</label>
          <input 
            type="date" 
            className="border rounded-md px-2 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Até:</label>
          <input 
            type="date" 
            className="border rounded-md px-2 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
           <select 
             className="border rounded-md px-2 py-1 text-sm bg-gray-50"
             value={activePaymentFilter}
             onChange={(e) => setActivePaymentFilter(e.target.value)}
           >
             <option value="all">Todas Colunas</option>
             <option value="creditCard">{PAYMENT_LABELS.creditCard}</option>
             <option value="debitCard">{PAYMENT_LABELS.debitCard}</option>
             <option value="pix">{PAYMENT_LABELS.pix}</option>
             <option value="cash">{PAYMENT_LABELS.cash}</option>
           </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Faturamento (Período)</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(totalPeriodRevenue)}</h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-full">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Total em PIX</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(totalPix)}</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-full">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Cartões</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(totalCards)}</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-full">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Espécie</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(totalCash)}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-full">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Evolução Diária</h4>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="Total" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Distribuição por Tipo</h4>
          <div className="h-64 w-full min-w-0">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800">Histórico de Fechamentos</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                
                {(activePaymentFilter === 'all' || activePaymentFilter === 'openingBalance') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abertura</th>
                )}
                
                {(activePaymentFilter === 'all' || activePaymentFilter === 'creditCard') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crédito</th>
                )}
                
                {(activePaymentFilter === 'all' || activePaymentFilter === 'debitCard') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Débito</th>
                )}
                
                {(activePaymentFilter === 'all' || activePaymentFilter === 'pix') && (
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIX</th>
                )}
                 
                {(activePaymentFilter === 'all' || activePaymentFilter === 'cash') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espécie</th>
                )}
                
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Nenhum registro encontrado para este período.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <React.Fragment key={record.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                        {formatCurrency(record.totalRevenue)}
                      </td>
                      
                      {(activePaymentFilter === 'all' || activePaymentFilter === 'openingBalance') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(record.openingBalance)}
                        </td>
                      )}
                      
                      {(activePaymentFilter === 'all' || activePaymentFilter === 'creditCard') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(record.creditCard)}
                        </td>
                      )}
                      
                      {(activePaymentFilter === 'all' || activePaymentFilter === 'debitCard') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(record.debitCard)}
                        </td>
                      )}

                      {(activePaymentFilter === 'all' || activePaymentFilter === 'pix') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(record.pix)}
                        </td>
                      )}

                      {(activePaymentFilter === 'all' || activePaymentFilter === 'cash') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(record.cash)}
                        </td>
                      )}

                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button 
                          onClick={() => onAnalyze(record)}
                          disabled={analyzingId === record.id}
                          className={`
                            inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm 
                            ${record.aiAnalysis 
                              ? 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200' 
                              : 'text-white bg-indigo-600 hover:bg-indigo-700'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                        >
                          {analyzingId === record.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Analisando...
                            </span>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 mr-1" />
                              {record.aiAnalysis ? 'Ver Análise' : 'Analisar IA'}
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    {record.aiAnalysis && (
                      <tr className="bg-indigo-50/50">
                        <td colSpan={8} className="px-6 py-4">
                           <div className="flex items-start gap-3">
                              <div className="p-1 bg-indigo-100 rounded-md mt-0.5">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div className="text-sm text-gray-700 italic">
                                "{record.aiAnalysis}"
                              </div>
                           </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};