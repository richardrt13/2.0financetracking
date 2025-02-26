import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    income: 0,
    expense: 0,
    investment: 0,
    balance: 0
  });
  
  // Estados para filtros
  const [filterMonth, setFilterMonth] = useState(0); // 0 = todos os meses
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  // Buscar transações do usuário
  const fetchTransactions = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      setTransactions(data || []);
      calculateTotals(data || []);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova transação
  const addTransaction = async (transactionData) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData]);

      if (error) throw error;
      
      await fetchTransactions();
      return { success: true };
    } catch (err) {
      console.error('Erro ao adicionar transação:', err);
      return { success: false, error: err.message };
    }
  };

  // Calcular totais com base nos filtros
  const calculateTotals = (transactionData) => {
    // Filtra as transações de acordo com o ano e mês selecionados
    const filteredTransactions = transactionData.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      const transactionYear = transaction.year || transactionDate.getFullYear();
      const transactionMonth = transaction.month || transactionDate.getMonth() + 1;
      
      // Se filterMonth é 0, retorna todas as transações do ano selecionado
      if (filterMonth === 0) {
        return transactionYear === filterYear;
      }
      
      // Caso contrário, retorna transações do mês e ano selecionados
      return transactionYear === filterYear && transactionMonth === filterMonth;
    });
    
    // Calcula os totais
    const newTotals = filteredTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        acc.expense += transaction.amount;
      } else if (transaction.type === 'investment') {
        acc.investment += transaction.amount;
      }
      return acc;
    }, { income: 0, expense: 0, investment: 0 });
    
    // Calcula o saldo
    newTotals.balance = newTotals.income - newTotals.expense - newTotals.investment;
    
    setTotals(newTotals);
  };

  // Recalcular totais quando os filtros mudarem
  useEffect(() => {
    if (transactions.length > 0) {
      calculateTotals(transactions);
    }
  }, [filterYear, filterMonth, transactions]);

  // Buscar transações quando o userId mudar
  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  return {
    transactions,
    loading,
    error,
    totals,
    filterMonth,
    filterYear,
    setFilterMonth,
    setFilterYear,
    addTransaction,
    fetchTransactions
  };
}
