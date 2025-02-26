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
