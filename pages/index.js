import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('income');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Usar getSession em vez de user()
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          router.push('/login');
          return;
        }
        
        setUser(data.session.user);
        fetchTransactions(data.session.user.id);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user);
          fetchTransactions(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push('/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const fetchTransactions = async (userId) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (error) console.error(error);
    else setTransactions(data || []);
  };

  const addTransaction = async () => {
    if (!amount || !description) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ 
        user_id: user.id, 
        amount: parseFloat(amount), 
        description, 
        type 
      }]);

    if (error) console.error(error);
    else {
      setAmount('');
      setDescription('');
      fetchTransactions(user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  // Se não houver usuário, não renderiza o conteúdo
  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Transações</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="number" 
            placeholder="Valor" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className="p-2 border rounded"
          />
          <input 
            type="text" 
            placeholder="Descrição" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="p-2 border rounded"
          />
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
          <button 
            onClick={addTransaction}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Histórico</h2>
        {transactions.length === 0 ? (
          <p>Nenhuma transação registrada.</p>
        ) : (
          <ul className="divide-y">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium">{transaction.description}</span>
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
