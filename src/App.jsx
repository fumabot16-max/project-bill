import React from 'react';
import { LayoutDashboard, Receipt, RefreshCcw, AlertTriangle } from 'lucide-react';

const Card = ({ title, amount, currency = "USD", color = "blue" }) => (
  <div className={`p-4 rounded-xl border border-gray-100 bg-white shadow-sm`}>
    <div className="text-sm text-gray-500 mb-1">{title}</div>
    <div className="text-2xl font-bold flex items-baseline">
      <span className="text-gray-900">{amount}</span>
      <span className="ml-1 text-xs text-gray-400 font-normal">{currency}</span>
    </div>
  </div>
);

export default function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const fetchData = () => {
      fetch('./usage.json')
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error("Data fetch error:", err));
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getModelAmount = (name) => {
    if (!data || !data.models) return 0;
    const val = data.models[name.toLowerCase()];
    return isNaN(parseFloat(val)) ? 0 : parseFloat(val);
  };

  const totalToday = getModelAmount("openai") + 
                     getModelAmount("claude") + 
                     getModelAmount("gemini") + 
                     getModelAmount("kimi") + 
                     getModelAmount("deepseek");

  const now = new Date();
  const hoursPassed = now.getHours() + (now.getMinutes() / 60);
  const dailyForecast = hoursPassed > 0 ? (totalToday / hoursPassed) * 24 : totalToday;
  const monthlyForecast = (dailyForecast * 30).toFixed(2);

  const modelConfigs = [
    { name: "OpenAI", color: "from-emerald-400 to-teal-600", icon: "✨" },
    { name: "Claude", color: "from-orange-400 to-red-500", icon: "🧠" },
    { name: "Gemini", color: "from-blue-400 to-indigo-600", icon: "💎" },
    { name: "Kimi", color: "from-purple-400 to-pink-600", icon: "🌙" },
    { name: "DeepSeek", color: "from-cyan-400 to-blue-500", icon: "🐳" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Receipt className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">AI Bill</h1>
          </div>
          <p className="text-slate-400 font-medium">Intelligence Usage Intelligence</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="group flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-sm transition-all active:scale-95">
          <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-slate-300">Sync Data</span>
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-900/20">
            <div className="relative z-10">
              <div className="text-blue-100/80 font-semibold mb-2 flex items-center gap-2">
                <LayoutDashboard size={18} /> TODAY'S TOTAL SPENDING
              </div>
              <div className="text-6xl font-black text-white tracking-tighter flex items-baseline gap-2">
                ${totalToday.toFixed(3)}
                <span className="text-xl font-medium text-blue-200/60 uppercase tracking-widest">USD</span>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-blue-50 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE SYNC ACTIVE
                </div>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="text-slate-400 font-semibold mb-1 text-sm tracking-wider uppercase">Monthly Forecast</div>
              <div className="text-4xl font-bold text-white tracking-tight">${monthlyForecast}</div>
            </div>
            <div className="mt-8">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-500 uppercase">Budget Pacing</span>
                <span className="text-blue-400">{Math.min(100, (monthlyForecast / 50) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(59,130,246,0.5)]" 
                  style={{ width: `${Math.min(100, (monthlyForecast / 50) * 100)}%` }}>
                </div>
              </div>
              <p className="mt-4 text-[11px] text-slate-500 leading-relaxed font-medium">
                * Based on current usage trajectory for February 2026.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {modelConfigs.map((model) => (
            <div key={model.name} className="group p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-500/50 transition-all hover:bg-slate-800/50">
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{model.icon}</span>
                <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${model.color} shadow-[0_0_8px_currentColor]`}></div>
              </div>
              <div className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{model.name}</div>
              <div className="text-2xl font-black text-white tracking-tight flex items-baseline gap-1">
                {model.name === "DeepSeek" ? getModelAmount(model.name).toFixed(4) : getModelAmount(model.name).toFixed(2)}
                <span className="text-[10px] text-slate-600 font-bold">USD</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="max-w-6xl mx-auto mt-20 pb-10 text-center">
        <p className="text-slate-600 text-xs font-bold tracking-widest uppercase">
          Powered by OpenClaw Infrastructure • Chloe 2026
        </p>
      </footer>
    </div>
  );
}
