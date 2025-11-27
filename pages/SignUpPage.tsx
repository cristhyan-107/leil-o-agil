import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    setLoading(true);
    const result = await signUp(name, email, password);
    if (!result.success) {
      setError(result.message);
    } else {
      navigate('/'); // Redireciona para o dashboard após o sucesso
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
            Crie sua Conta
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Comece a gerenciar seus investimentos em leilões.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
             <div>
              <Input
                id="name"
                label="Nome Completo"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu Nome"
              />
            </div>
            <div className='pt-4'>
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600 text-center pt-2">{error}</p>}

          <div>
            <Button type="submit" className="w-full justify-center py-3 mt-4" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </div>
           <div className="text-center text-sm text-text-secondary">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-blue-600">
                  Faça login
              </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;