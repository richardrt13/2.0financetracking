import React from 'react';

export default function Header({ title, onLogout }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button 
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Sair
      </button>
    </div>
  );
}

// src/components/Layout/index.js
import React from 'react';
import Header from './Header';

export default function Layout({ children, title, onLogout }) {
  return (
    <div className="container mx-auto p-4">
      <Header title={title} onLogout={onLogout} />
      {children}
    </div>
  );
}

// src/components/TransactionForm/index.js
import React, { useState, useEffect } from 'react';
import { categoryOptions } from '../../utils/categoryOptions';
import { 
  generateMonthOptions, 
  generateYearOptions, 
  getCurrentMonth, 
  getCurrentYear 
} from '../../utils/dateUtils';

export default function TransactionForm({ onAddTransaction }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState(categoryOptions.income[0]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());

  // Atualizar categoria quando o tipo mudar
  useEffect(() => {
    if (categoryOptions[type] && categoryOptions[type].length > 0) {
      setCategory(categoryOptions[type][0]);
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const transaction = {
      amount: parseFloat(amount),
      description,
      type,
      category,
      month,
      year
    };

    const result = await onAddTransaction(transaction);
    
    if (result.success) {
      // Limpar apenas alguns campos, manter tipo e categoria para facilitar entradas múltiplas
      setAmount('');
      setDescription('');
    } else {
      alert('Erro ao adicionar transação. Tente novamente.');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Nova Transação</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
              <option value="investment">Investimento</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {categoryOptions[type]?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Mês</label>
            <select 
              value={month} 
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {generateMonthOptions()}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Ano</label>
            <select 
              value={year} 
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {generateYearOptions()}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Valor (R$)</label>
            <input 
              type="number" 
              placeholder="Valor" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <input 
              type="text" 
              placeholder="Descrição" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            Adicionar Transação
          </button>
        </div>
      </form>
    </div>
  );
}

// src/components/FinancialSummary/index.js
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

// src/components/TransactionHistory/index.js
import React from 'react';
import { getTransactionTypeLabel } from '../../utils/categoryOptions';

export default function TransactionHistory({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Histórico de Transações</h2>
        <p>Nenhuma transação registrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Histórico de Transações</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Data</th>
              <th className="py-2 px-4 text-left">Descrição</th>
              <th className="py-2 px-4 text-left">Categoria</th>
              <th className="py-2 px-4 text-left">Tipo</th>
              <th className="py-2 px-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((transaction) => {
              // Criar uma data para a transação (usando created_at ou os campos de mês/ano)
              const transactionDate = transaction.created_at 
                ? new Date(transaction.created_at)
                : new Date(transaction.year, transaction.month - 1, 1);
                
              // Formatar a data
              const formattedDate = `${transaction.month || transactionDate.getMonth() + 1}/${transaction.year || transactionDate.getFullYear()}`;
              
              return (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{formattedDate}</td>
                  <td className="py-3 px-4 font-medium">{transaction.description}</td>
                  <td className="py-3 px-4">{transaction.category || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800'
                        : transaction.type === 'expense' 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getTransactionTypeLabel(transaction.type)}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right ${
                    transaction.type === 'income' 
                      ? 'text-green-600'
                      : transaction.type === 'expense'
                        ? 'text-red-600'
                        : 'text-blue-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
