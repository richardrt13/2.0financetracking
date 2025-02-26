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
        // Login normal
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        // Registro com autoConfirm
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              email_confirmed: true
            }
          }
        });
        
        // Se o registro foi bem-sucedido, tentamos fazer login imediatamente
        if (!result.error && result.data.user) {
          // Aguarde um momento para o banco processar
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Faça login automaticamente
          const loginResult = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (loginResult.error) {
            throw loginResult.error;
          }
          
          result = loginResult;
        }
      }

      const { data, error } = result;

      if (error) throw error;
      
      if (type === 'SIGNUP') {
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          alert('Este email já está registrado. Por favor, faça login.');
        } else if (data.user && !data.session) {
          alert('Cadastro realizado! Por favor, verifique seu email para confirmar o registro.');
        } else {
          alert('Cadastro e login realizados com sucesso!');
          router.push('/');
        }
      } else {
        alert('Login realizado com sucesso!');
        router.push('/');
      }
    } catch (error) {
      console.error('Erro de autenticação:', error);
      
      // Mensagens de erro mais amigáveis
      if (error.message.includes('Invalid login')) {
        alert('Email ou senha incorretos');
      } else if (error.message.includes('Email not confirmed')) {
        alert('Por favor, confirme seu email antes de fazer login');
      } else {
        alert(error.message);
      }
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
