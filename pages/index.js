// src/pages/index.js
import { useEffect } from 'react';
import Layout from '../components/Layout';
import TransactionForm from '../components/TransactionForm';
import FinancialSummary from '../components/FinancialSummary';
import TransactionHistory from '../components/TransactionHistory';
import useAuth from '../hooks/useAuth';
import useTransactions from '../hooks/useTransactions';

export default function Home() {
  const { user, loading: authLoading, handleLogout } = useAuth();
  const { 
    transactions,
    totals,
    filterMonth,
    filterYear,
    setFilterMonth,
    setFilterYear,
    addTransaction
  } = user ? useTransactions(user.id) : {};

  const handleAddTransaction = async (transactionData) => {
    if (!user) return { success: false };
    
    return await addTransaction({
      ...transactionData,
      user_id: user.id
    });
  };

  if (authLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  // Se não houver usuário, não renderiza o conteúdo
  if (!user) return null;

  return (
    <Layout title="Minhas Finanças" onLogout={handleLogout}>
      <TransactionForm onAddTransaction={handleAddTransaction} />
      
      <FinancialSummary 
        totals={totals}
        filterYear={filterYear}
        filterMonth={filterMonth}
        setFilterYear={setFilterYear}
        setFilterMonth={setFilterMonth}
      />
      
      <TransactionHistory transactions={transactions} />
    </Layout>
  );
}
