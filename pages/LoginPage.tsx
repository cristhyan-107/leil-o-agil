import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importar o Link
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    if (!success) {
      setError('Falha no login. Verifique suas credenciais.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
            <svg width="48" height="48" viewBox="0 0 100 100" className="text-primary mx-auto">
                <path fill="currentColor" d="M50 0L93.3 25v50L50 100 6.7 75V25L50 0zm0 10L16.7 31.7v36.6L50 90l33.3-21.7V31.7L50 10zM50 20l25 15v30L50 80 25 65V35L50 20z"></path>
            </svg>
          <h2 className="mt-6 text-3xl font-bold text-text-primary">
            Leilão Ágil Analytics
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Faça login para acessar seu painel.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className='pt-4'>
              <Input
                id="password"
                label="Senha"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600 text-center pt-2">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-blue-600">
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full justify-center py-3 mt-4" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
          <div className="text-center text-sm text-text-secondary">
              Não tem uma conta?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-blue-600">
                  Cadastre-se
              </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;