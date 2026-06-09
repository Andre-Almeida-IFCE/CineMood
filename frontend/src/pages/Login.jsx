import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Mail, Lock, AlertTriangle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-69px)] flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      
      {/* Background Graphic Blur */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-brand-accent/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/30 mb-3 animate-pulse">
            <Film className="h-6 w-6 text-brand-primary" />
          </div>
          <h1 className="text-2xl font-bold font-title bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            Acessar o CineMood
          </h1>
          <p className="text-xs text-brand-text-secondary mt-2">
            Insira suas credenciais para continuar sua sessão
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-lg bg-red-950/35 border border-red-900/40 text-red-300 text-xs mb-6">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email Input */}
          <div>
            <label className="text-xs text-brand-text-secondary font-medium block mb-1">E-mail</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                placeholder="nome@exemplo.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-brand-text focus:outline-none focus:border-brand-primary transition-colors duration-200"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs text-brand-text-secondary font-medium block mb-1">Senha</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-brand-text focus:outline-none focus:border-brand-primary transition-colors duration-200"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-brand-primary/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 text-xs text-brand-text-secondary">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-brand-primary hover:underline font-semibold">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
