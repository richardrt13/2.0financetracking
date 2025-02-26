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
