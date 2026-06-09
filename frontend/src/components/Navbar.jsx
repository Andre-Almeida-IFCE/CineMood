import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, User, LogOut, Heart, MessageSquare, Home, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 font-medium text-sm
    ${isActive(path) 
      ? 'text-white bg-brand-primary/20 border-b-2 border-brand-primary' 
      : 'text-brand-text-secondary hover:text-white hover:bg-slate-800/50'}
  `;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Film className="h-7 w-7 text-brand-primary group-hover:text-brand-accent transition-colors duration-300 animate-pulse" />
          <span className="text-xl font-bold font-title tracking-wider bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent group-hover:scale-[1.02] transition-transform duration-300">
            CineMood
          </span>
        </Link>

        {/* Desktop Navigation */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass('/')}>
              <Home className="h-4 w-4" /> Início
            </Link>
            <Link to="/community" className={linkClass('/community')}>
              <MessageSquare className="h-4 w-4" /> Comunidade
            </Link>
            <Link to="/favorites" className={linkClass('/favorites')}>
              <Heart className="h-4 w-4" /> Favoritos
            </Link>
            <Link to="/profile" className={linkClass('/profile')}>
              <User className="h-4 w-4" /> Perfil
            </Link>
          </div>
        )}

        {/* User Info / Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-brand-text-secondary">Olá,</p>
                <p className="text-sm font-semibold text-brand-text">{user.name}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center justify-center p-2 rounded-full bg-slate-800 hover:bg-red-950/40 text-brand-text-secondary hover:text-red-400 border border-slate-700/50 hover:border-red-900/50 transition-all duration-300"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-brand-text-secondary hover:text-white transition-colors duration-300 px-3 py-1.5"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/80 px-4 py-2 rounded-full shadow-lg shadow-brand-primary/20 transition-all duration-300 hover:scale-105"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-4">
          {!isAuthenticated && !isActive('/login') && !isActive('/register') && (
            <Link
              to="/login"
              className="text-xs font-semibold text-white bg-brand-primary px-3 py-1.5 rounded-full"
            >
              Entrar
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-brand-text hover:text-brand-primary transition-colors duration-200"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800 animate-fadeIn">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2 pb-3">
              <Link 
                to="/" 
                onClick={() => setMobileOpen(false)} 
                className={`${isActive('/') ? 'text-brand-primary bg-slate-800/40' : 'text-brand-text-secondary'} flex items-center gap-3 p-3 rounded-lg`}
              >
                <Home className="h-5 w-5" /> Início
              </Link>
              <Link 
                to="/community" 
                onClick={() => setMobileOpen(false)} 
                className={`${isActive('/community') ? 'text-brand-primary bg-slate-800/40' : 'text-brand-text-secondary'} flex items-center gap-3 p-3 rounded-lg`}
              >
                <MessageSquare className="h-5 w-5" /> Comunidade
              </Link>
              <Link 
                to="/favorites" 
                onClick={() => setMobileOpen(false)} 
                className={`${isActive('/favorites') ? 'text-brand-primary bg-slate-800/40' : 'text-brand-text-secondary'} flex items-center gap-3 p-3 rounded-lg`}
              >
                <Heart className="h-5 w-5" /> Favoritos
              </Link>
              <Link 
                to="/profile" 
                onClick={() => setMobileOpen(false)} 
                className={`${isActive('/profile') ? 'text-brand-primary bg-slate-800/40' : 'text-brand-text-secondary'} flex items-center gap-3 p-3 rounded-lg`}
              >
                <User className="h-5 w-5" /> Perfil
              </Link>
              <div className="border-t border-slate-800 my-2 pt-3 flex items-center justify-between px-3">
                <div>
                  <p className="text-xs text-brand-text-secondary">Usuário</p>
                  <p className="text-sm font-semibold text-brand-text">{user.name}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 text-sm text-red-400 bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-900/40"
                >
                  <LogOut className="h-4 w-4" /> Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pb-3 px-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center text-sm font-medium text-brand-text-secondary bg-slate-800 py-2.5 rounded-lg"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center text-sm font-medium text-white bg-brand-primary py-2.5 rounded-lg"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
