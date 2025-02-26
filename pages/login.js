import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (type) => {
    try {
      const { user, error } = type === 'LOGIN'
        ? await supabase.auth.signIn({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      
      alert(type === 'LOGIN' ? 'Logado com sucesso!' : 'Cadastrado com sucesso!');
      router.push('/'); // Redireciona para a página principal após login
    } catch (error) {
      alert(error.message);
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login
          </button>
          <button 
            onClick={() => handleLogin('SIGNUP')}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}
