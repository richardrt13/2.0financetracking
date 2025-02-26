import React from 'react';
import { generateMonthOptions, generateYearOptions } from '../../utils/dateUtils';

export default function FinancialSummary({ 
  totals, 
  filterYear, 
  filterMonth, 
  setFilterYear, 
  setFilterMonth 
}) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Resumo Financeiro</h2>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ano</label>
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(parseInt(e.target.value))}
            className="p-2 border rounded"
          >
            {generateYearOptions()}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Mês</label>
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(parseInt(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={0}>Todos</option>
            {generateMonthOptions()}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-medium text-green-800">Receitas</h3>
          <p className="text-2xl font-bold text-green-600">R$ {totals.income.toFixed(2)}</p>
        </div>
        
        <div className="bg-red-100 p-4 rounded">
          <h3 className="font-medium text-red-800">Despesas</h3>
          <p className="text-2xl font-bold text-red-600">R$ {totals.expense.toFixed(2)}</p>
        </div>
        
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-medium text-blue-800">Investimentos</h3>
          <p className="text-2xl font-bold text-blue-600">R$ {totals.investment.toFixed(2)}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium text-gray-800">Saldo</h3>
          <p className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {totals.balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
