import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { Sun, CloudRain, Thermometer, MapPin, Smile, RefreshCw, Sliders, X, Check, Cloud } from 'lucide-react';

const WeatherControlPanel = () => {
  const {
    weather,
    mood,
    setMood,
    applySimulation,
    clearSimulation,
    simOverrideActive,
    simOverrideDetails,
    updateCityWeather
  } = useWeather();

  const [isOpen, setIsOpen] = useState(false);
  const [cityInput, setCityInput] = useState('');
  
  // Local states for simulation inputs
  const [simCondition, setSimCondition] = useState(simOverrideDetails.condition || 'Chuva');
  const [simTemp, setSimTemp] = useState(simOverrideDetails.temp || 16);
  const [simCity, setSimCity] = useState(simOverrideDetails.city || 'Gramado');

  const moodsList = [
    { name: 'Feliz', emoji: '😊', desc: 'Alegre, animado' },
    { name: 'Triste', emoji: '😢', desc: 'Melancólico, reflexivo' },
    { name: 'Ansioso', emoji: '😰', desc: 'Acelerado, quer relaxar' },
    { name: 'Entediado', emoji: '🥱', desc: 'Buscando fortes emoções' },
    { name: 'Cansado', emoji: '😴', desc: 'Sem energia, leve' },
  ];

  const weatherOptions = [
    { value: 'Chuva', label: 'Chuvoso 🌧️', desc: 'Drama, Mistério, Suspense' },
    { value: 'Ensolarado', label: 'Ensolarado ☀️', desc: 'Comédia, Aventura, Família' },
    { value: 'Frio', label: 'Frio ❄️', desc: 'Ficção Científica, Fantasia, Terror' },
    { value: 'Nublado', label: 'Nublado ☁️', desc: 'Ação, Animação, Crime' }
  ];

  const handleApplySim = (e) => {
    e.preventDefault();
    applySimulation(simCondition, simTemp, simCity);
  };

  const handleSearchCity = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      updateCityWeather(cityInput);
      setCityInput('');
    }
  };

  return (
    <div className="w-full">
      {/* Active State Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
            {weather.condition === 'Chuva' && <CloudRain className="h-5 w-5 text-blue-400" />}
            {weather.condition === 'Ensolarado' && <Sun className="h-5 w-5 text-yellow-400" />}
            {weather.condition === 'Frio' && <Thermometer className="h-5 w-5 text-teal-400" />}
            {weather.condition === 'Nublado' && <Cloud className="h-5 w-5 text-slate-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-text-secondary flex items-center gap-1 font-sans">
                <MapPin className="h-3 w-3" /> Clima em <strong className="text-brand-text">{weather.city}</strong>
              </span>
              {weather.simulated && (
                <span className="text-[10px] bg-purple-950/80 border border-purple-800 text-purple-300 font-bold px-1.5 py-0.2 rounded-full">
                  SIMULADO
                </span>
              )}
            </div>
            <p className="text-base font-bold text-brand-text">
              {weather.temp}°C — {weather.condition} <span className="text-xs font-normal text-brand-text-secondary">({weather.description})</span>
            </p>
          </div>
        </div>

        {/* Selected Mood Indicator */}
        <div className="flex items-center gap-2 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-sm">Humor:</span>
          <span className="text-sm font-bold text-brand-accent flex items-center gap-1">
            {moodsList.find(m => m.name === mood)?.emoji} {mood}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-text border border-slate-700/60 hover:border-brand-primary/50 transition-all duration-300 cursor-pointer"
          >
            <Sliders className="h-3.5 w-3.5" />
            {isOpen ? 'Fechar Controles' : 'Simular Clima & Humor'}
          </button>
        </div>
      </div>

      {/* Expanded Control Panel */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl border border-slate-800/80 bg-slate-900/90 shadow-2xl mb-8 animate-fadeIn">
          
          {/* Section 1: Mood Selector */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2 font-title">
              <Smile className="h-4 w-4 text-brand-primary" /> 1. Escolha seu Humor
            </h3>
            <div className="flex flex-col gap-2">
              {moodsList.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setMood(m.name)}
                  className={`
                    w-full flex items-center justify-between p-2.5 rounded-lg text-sm transition-all duration-300 text-left border cursor-pointer
                    ${mood === m.name
                      ? 'bg-brand-primary/20 border-brand-primary text-white font-semibold'
                      : 'bg-slate-950/40 border-slate-800/60 text-brand-text-secondary hover:border-slate-700 hover:text-white'}
                  `}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{m.emoji}</span>
                    <span>{m.name}</span>
                  </span>
                  <span className="text-[11px] text-brand-text-secondary font-normal italic">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Weather Simulator Override */}
          <form onSubmit={handleApplySim} className="flex flex-col border-t md:border-t-0 md:border-x border-slate-800/80 md:px-6 pt-4 md:pt-0">
            <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2 font-title">
              <Sliders className="h-4 w-4 text-brand-accent" /> 2. Simular Clima
            </h3>
            
            {/* Condition Select */}
            <div className="mb-3">
              <label className="text-xs text-brand-text-secondary block mb-1">Condição Climática</label>
              <select
                value={simCondition}
                onChange={(e) => setSimCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-primary"
              >
                {weatherOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Temp and City Row */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="text-xs text-brand-text-secondary block mb-1">Temp. (°C)</label>
                <input
                  type="number"
                  value={simTemp}
                  onChange={(e) => setSimTemp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="text-xs text-brand-text-secondary block mb-1">Cidade Simulada</label>
                <input
                  type="text"
                  value={simCity}
                  onChange={(e) => setSimCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Sim Buttons */}
            <div className="flex gap-2 mt-auto">
              <button
                type="submit"
                className="flex-grow flex items-center justify-center gap-1 text-xs font-bold bg-brand-primary hover:bg-brand-primary/80 text-white py-2 px-3 rounded-lg shadow-md transition-all cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" /> Aplicar
              </button>
              {simOverrideActive && (
                <button
                  type="button"
                  onClick={clearSimulation}
                  className="flex items-center justify-center p-2 rounded-lg bg-red-950/30 text-red-400 hover:bg-red-950/50 border border-red-900/30 transition-all cursor-pointer"
                  title="Limpar Simulação"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Section 3: Live Lookup */}
          <div className="flex flex-col border-t md:border-t-0 pt-4 md:pt-0">
            <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2 font-title">
              <MapPin className="h-4 w-4 text-green-400" /> 3. Buscar Cidade Real
            </h3>
            <p className="text-xs text-brand-text-secondary mb-4">
              Pesquise qualquer cidade para obter a temperatura e condição climática reais via API:
            </p>
            <form onSubmit={handleSearchCity} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Ex: Curitiba, Rio de Janeiro, London..."
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-brand-text placeholder-slate-600 focus:outline-none focus:border-brand-primary"
              />
              <button
                type="submit"
                className="w-full text-xs font-semibold py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-text border border-slate-700 transition-all cursor-pointer"
              >
                Consultar API
              </button>
            </form>

            {/* Note on Genres */}
            <div className="mt-auto pt-4 border-t border-slate-800/60">
              <p className="text-[10px] text-brand-text-secondary italic">
                <strong>Clima de hoje:</strong> {weatherOptions.find(opt => opt.value === weather.condition)?.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherControlPanel;
