import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (type) => {
    try {
      setLoading(true);
      let result;
      
      if (type === 'LOGIN') {
        // Método correto para a API v2
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        // Método correto para a API v2
        result = await supabase.auth.signUp({
          email,
          password,
        });
      }

      const { data, error } = result;

      if (error) throw error;
      
      alert(type === 'LOGIN' ? 'Logado com sucesso!' : 'Cadastrado com sucesso!');
      
      // Se for login, redireciona para a página principal
      if (type === 'LOGIN') {
        router.push('/');
      }
    } catch (error) {
      console.error('Erro de autenticação:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Login / Cadastro</h1>
      <div className="space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-2 border rounded"
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-2 border rounded"
        />
        <div className="flex space-x-2">
          <button 
            onClick={() => handleLogin('LOGIN')}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          >
            {loading ? 'Processando...' : 'Login'}
          </button>
          <button 
            onClick={() => handleLogin('SIGNUP')}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-green-300"
          >
            {loading ? 'Processando...' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
