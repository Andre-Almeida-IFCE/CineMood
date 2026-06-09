import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Heart, MessageSquare, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ favoritesCount: 0, reviewsCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/reviews/stats/me');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching profile stats:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-10 w-10 border-4 border-t-brand-primary border-slate-800 rounded-full animate-spin mb-4" />
        <p className="text-brand-text-secondary text-sm">Carregando estatísticas do perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 flex flex-col gap-8">
      
      {/* Page Header */}
      <div className="border-b border-slate-850 pb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-title text-brand-text">Seu Perfil</h1>
          <p className="text-xs text-brand-text-secondary">Estatísticas e informações da conta</p>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* User Card */}
        <div className="md:col-span-1 p-6 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col items-center text-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-primary to-brand-accent" />
          
          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-4xl border-2 border-brand-primary/40 uppercase shadow-lg shadow-brand-primary/10 mt-2">
            {user?.name?.substring(0, 2)}
          </div>

          <div>
            <h2 className="text-lg font-bold font-title text-brand-text leading-tight">{user?.name}</h2>
            <div className="flex items-center justify-center gap-1 text-[10px] text-green-400 font-semibold bg-green-950/40 border border-green-900 px-2 py-0.5 rounded-full mt-2 w-max mx-auto">
              <ShieldCheck className="h-3.5 w-3.5" />
              Membro CineMood
            </div>
          </div>

          <div className="w-full border-t border-slate-800/80 pt-4 flex flex-col gap-2.5 text-left">
            <div className="flex items-center gap-2.5 text-xs text-brand-text-secondary">
              <Mail className="h-4 w-4 shrink-0 text-slate-500" />
              <span className="truncate" title={user?.email}>{user?.email}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-4 text-xs font-semibold py-2.5 rounded-lg border border-red-900/35 hover:border-red-900 bg-red-950/15 hover:bg-red-950/35 text-red-400 transition-all cursor-pointer"
          >
            Sair da Conta
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-brand-text-secondary uppercase tracking-wider text-xs px-1">
            Minhas Atividades
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Stat Item 1: Favorites */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent">
                  <Heart className="h-5 w-5 fill-brand-accent" />
                </div>
                <span className="text-xs text-brand-text-secondary font-medium">Favoritos</span>
              </div>
              <div>
                <p className="text-4xl font-bold font-title text-brand-text leading-none">{stats.favoritesCount}</p>
                <p className="text-xs text-brand-text-secondary mt-2">Filmes salvos no seu catálogo pessoal.</p>
              </div>
              <Link
                to="/favorites"
                className="text-xs font-bold text-brand-accent hover:text-brand-accent/80 transition-colors flex items-center gap-1 group/btn w-max mt-1"
              >
                Ver meus favoritos <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stat Item 2: Reviews */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-xs text-brand-text-secondary font-medium font-sans">Avaliações</span>
              </div>
              <div>
                <p className="text-4xl font-bold font-title text-brand-text leading-none">{stats.reviewsCount}</p>
                <p className="text-xs text-brand-text-secondary mt-2">Comentários e notas compartilhados com a comunidade.</p>
              </div>
              <Link
                to="/community"
                className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition-colors flex items-center gap-1 group/btn w-max mt-1"
              >
                Explorar comunidade <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* Quick recommendation teaser */}
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 flex flex-col gap-2 mt-2">
            <h4 className="text-sm font-bold text-brand-text font-title">Dica do CineMood 🎬</h4>
            <p className="text-xs text-brand-text-secondary leading-relaxed">
              Quanto mais você avalia e favorita filmes, mais o nosso sistema consegue mapear quais as melhores escolhas para cada clima da sua região. Vá até a página inicial para conferir as sugestões do clima de hoje!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;
