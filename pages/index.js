import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('income');

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', supabase.auth.user()?.id);

    if (error) console.error(error);
    else setTransactions(data);
  };

  const addTransaction = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ user_id: supabase.auth.user()?.id, amount, description, type }]);

    if (error) console.error(error);
    else {
      setAmount('');
      setDescription('');
      fetchTransactions();
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <h1>Minhas Transações</h1>
      <input type="number" placeholder="Valor" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Receita</option>
        <option value="expense">Despesa</option>
      </select>
      <button onClick={addTransaction}>Adicionar</button>

      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.type === 'income' ? '+' : '-'} {transaction.amount} - {transaction.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
