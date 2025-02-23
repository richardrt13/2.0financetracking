import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (type) => {
    try {
      const { user, error } = type === 'LOGIN'
        ? await supabase.auth.signIn({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      alert(type === 'LOGIN' ? 'Logado com sucesso!' : 'Cadastrado com sucesso!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => handleLogin('LOGIN')}>Login</button>
      <button onClick={() => handleLogin('SIGNUP')}>Cadastrar</button>
    </div>
  );
}
