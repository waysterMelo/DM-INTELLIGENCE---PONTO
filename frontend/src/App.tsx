import React, { useState, useEffect } from 'react';
import { MapPin, Clock, LogOut, User, Users, Activity, AlertCircle, CheckCircle2, Navigation, ShieldAlert, Fingerprint, Mail, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Registration state
  const [isRegistering, setIsRegistering] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [empresaId, setEmpresaId] = useState('');
  const [empresas, setEmpresas] = useState<{id: number, nome: string}[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isRegistering) {
      fetch('/api/empresas')
        .then(res => res.json())
        .then(data => {
          setEmpresas(data);
          if (data.length > 0) setEmpresaId(data[0].id.toString());
        })
        .catch(err => console.error('Erro ao buscar empresas', err));
    }
  }, [isRegistering]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, senha, empresa_id: parseInt(empresaId) })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Cadastro realizado com sucesso! Você já pode fazer login.');
        setIsRegistering(false);
        setEmail(cpf);
        setSenha('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex w-full bg-[#050505] font-sans text-slate-300 overflow-hidden relative">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
              @keyframes float-delayed { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
              @keyframes pulse-slow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
              .animate-float { animation: float 6s ease-in-out infinite; }
              .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite 2s; }
              .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
              .glass-panel {
                background: rgba(255, 255, 255, 0.03);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.05);
              }
            `,
          }}
        />
        <div
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(29, 78, 216, 0.12), transparent 40%)`,
          }}
        />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-900/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="flex w-full h-screen z-10 relative">
          <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 xl:p-20 relative">
            <div className="flex items-center gap-4 z-20">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-blue-400/20 relative group overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="text-white font-black text-2xl tracking-tighter">DM</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-widest uppercase leading-none">Intelligence</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="flex w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Motor de ponto ativo</p>
                </div>
              </div>
            </div>

            <div className="relative w-full max-w-lg mx-auto h-[400px] flex items-center justify-center z-10">
              <div className="absolute w-[300px] h-[300px] border border-white/5 rounded-full flex items-center justify-center">
                <div className="w-[200px] h-[200px] border border-white/5 rounded-full border-dashed animate-[spin_60s_linear_infinite]" />
              </div>
              <div className="absolute top-10 -left-10 glass-panel p-5 rounded-2xl w-64 shadow-2xl z-20 animate-float">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">99.9%</span>
                </div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Confianca de geolocalizacao</p>
                <h3 className="text-2xl font-black text-white font-mono">GPS + WIFI</h3>
              </div>
              <div className="absolute bottom-10 -right-4 glass-panel p-5 rounded-2xl w-72 shadow-2xl z-30 animate-float-delayed">
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Registro seguro</h4>
                    <p className="text-[10px] text-slate-400">Validacao por raio da empresa</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Confiabilidade</span>
                    <span className="text-white font-mono">Alta</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-[92%] h-full rounded-full relative">
                      <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-[2px] animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="z-20">
              <h2 className="text-4xl font-black text-white leading-tight mb-4 tracking-tight">
                A engenharia de dados
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">aplicada ao RH.</span>
              </h2>
              <p className="text-slate-400 font-medium max-w-md leading-relaxed text-sm">
                Desenvolvido pela DM Intelligence. Controle de ponto com geolocalizacao, auditoria e visao centralizada.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-20">
            <div className="w-full max-w-md relative">
              <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                <div className="mb-8 text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0a0a0a] border border-white/5 shadow-inner mb-6 relative">
                    {isRegistering ? <User className="w-8 h-8 text-blue-500/80" /> : <Fingerprint className="w-8 h-8 text-blue-500/80" />}
                    <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_4s_linear_infinite]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                    {isRegistering ? 'Solicitar acesso' : 'Acesso autorizado'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {isRegistering ? 'Preencha os dados para criar seu acesso.' : 'Insira as credenciais para entrar no sistema.'}
                  </p>
                </div>

                {error && (
                  <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center flex items-center gap-2 justify-center animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center flex items-center gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                    {success}
                  </div>
                )}

                {isRegistering ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="Nome completo"
                        className="block w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Fingerprint className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="CPF (somente numeros)"
                        className="block w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                        maxLength={11}
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        type="password"
                        placeholder="Senha"
                        className="block w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={empresaId}
                        onChange={(e) => setEmpresaId(e.target.value)}
                        className="block w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="" disabled>Selecione a empresa</option>
                        {empresas.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full relative flex justify-center items-center gap-3 bg-white text-black font-bold py-3.5 px-4 rounded-xl mt-4 transition-all duration-300 hover:scale-[1.02] overflow-hidden group"
                    >
                      <span className="relative z-10">Cadastrar</span>
                      <ArrowRight className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="Email ou CPF"
                        className="block w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        type="password"
                        placeholder="Senha"
                        className="block w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full relative flex justify-center items-center gap-3 bg-white text-black font-bold py-3.5 px-4 rounded-xl mt-4 transition-all duration-300 hover:scale-[1.02] overflow-hidden group"
                    >
                      <span className="relative z-10">Autenticar sistema</span>
                      <ArrowRight className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </form>
                )}

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setError('');
                      setSuccess('');
                    }}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {isRegistering ? 'Ja possui acesso? Entrar' : 'Nao tem conta? Solicitar acesso'}
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Conexao encriptada (SSL/TLS 1.3)</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">© {new Date().getFullYear()} DM Intelligence. Todos os direitos reservados.</p>
              </div>

              <div className="mt-4 text-[10px] text-slate-600 text-center">
                <p>Admin: admin@techcorp.com / admin123</p>
                <p>Func: joao@techcorp.com / joao123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return user.role === 'ADMIN' ? (
    <AdminDashboard user={user} onLogout={handleLogout} />
  ) : (
    <MobileApp user={user} onLogout={handleLogout} />
  );
}

function MobileApp({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locError, setLocError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success'|'error'|'warning'} | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
    // Get location immediately
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setLocError('Permissão de localização negada ou indisponível.')
      );
    } else {
      setLocError('Geolocalização não suportada pelo navegador.');
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/pontos/usuario/${user.id}`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const registrarPonto = async (tipo: 'ENTRADA' | 'SAIDA') => {
    if (!location) {
      setMessage({ text: 'Localização não disponível. Verifique as permissões.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/pontos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: user.id,
          tipo,
          latitude: location.lat,
          longitude: location.lng
        })
      });
      
      let data;
      try {
        data = await res.json();
      } catch (e) {
        console.error('Erro ao fazer parse do JSON:', e);
        setMessage({ text: 'Erro interno do servidor.', type: 'error' });
        return;
      }
      
      if (res.ok) {
        if (data.warning) {
          setMessage({ text: data.warning, type: 'warning' });
        } else {
          setMessage({ text: `Ponto de ${tipo.toLowerCase()} registrado com sucesso!`, type: 'success' });
        }
        fetchHistory();
      } else {
        setMessage({ text: data.error || 'Erro ao registrar ponto', type: 'error' });
      }
    } catch (err) {
      console.error('Erro ao registrar ponto:', err);
      setMessage({ text: 'Erro de conexão', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center font-sans">
      {/* Mobile constraint wrapper */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="bg-[#0A0A0A] text-white p-8 rounded-b-[2rem] shadow-xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#3B5BDB] rounded-full blur-3xl opacity-20"></div>
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#3B5BDB] rounded-lg flex items-center justify-center shadow-lg shadow-[#3B5BDB]/20">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">PontoGeo</h1>
            </div>
            <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <LogOut className="w-5 h-5 text-zinc-400 hover:text-white" />
            </button>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">{user.nome.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-[#3B5BDB] text-[10px] font-bold tracking-widest uppercase mb-0.5">Colaborador</p>
              <p className="font-bold text-xl tracking-tight">{user.nome}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col gap-6 -mt-4 relative z-20">
          {/* Location Status */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex items-start gap-4">
            <div className={`p-3 rounded-xl ${location ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-800 tracking-tight">Status do GPS</h3>
              <p className="text-sm text-zinc-500 font-medium mt-0.5">
                {location ? 'Sinal capturado com precisão' : locError || 'Buscando satélites...'}
              </p>
              {location && (
                <p className="text-xs text-zinc-400 mt-2 font-mono bg-zinc-50 inline-block px-2 py-1 rounded-md border border-zinc-100">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => registrarPonto('ENTRADA')}
              disabled={loading || !location}
              className="bg-[#3B5BDB] hover:bg-[#2A45B0] disabled:opacity-50 disabled:cursor-not-allowed text-white p-6 rounded-2xl flex flex-col items-center gap-4 transition-all active:scale-95 shadow-lg shadow-[#3B5BDB]/20 group"
            >
              <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <span className="font-bold tracking-wide text-sm">BATER ENTRADA</span>
            </button>
            <button 
              onClick={() => registrarPonto('SAIDA')}
              disabled={loading || !location}
              className="bg-[#0A0A0A] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white p-6 rounded-2xl flex flex-col items-center gap-4 transition-all active:scale-95 shadow-lg shadow-black/10 group"
            >
              <div className="bg-white/10 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <LogOut className="w-6 h-6" />
              </div>
              <span className="font-bold tracking-wide text-sm">BATER SAÍDA</span>
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 border ${
              message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
              message.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-700' :
              'bg-rose-50 border-rose-100 text-rose-700'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <p className="text-sm font-bold">{message.text}</p>
            </div>
          )}

          {/* History */}
          <div className="mt-2">
            <h3 className="font-bold text-zinc-800 mb-4 tracking-tight">Últimos Registros</h3>
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-8 text-center">
                  <p className="text-sm text-zinc-500 font-medium">Nenhum registro encontrado hoje.</p>
                </div>
              ) : (
                history.map((ponto: any) => (
                  <div key={ponto.id} className="bg-white border border-zinc-100 p-4 rounded-2xl shadow-sm flex justify-between items-center hover:border-zinc-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ponto.tipo === 'ENTRADA' ? 'bg-[#3B5BDB]/10 text-[#3B5BDB]' : 'bg-zinc-100 text-zinc-600'}`}>
                        {ponto.tipo === 'ENTRADA' ? <Clock className="w-5 h-5" /> : <LogOut className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-800 text-sm">{ponto.tipo}</p>
                        <p className="text-xs font-medium text-zinc-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {ponto.status === 'VALIDO' ? 'No local' : 'Fora do raio'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-zinc-800 tracking-tight">
                        {new Date(ponto.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                        {new Date(ponto.data_hora).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ funcionariosAtivos: 0, registrosHoje: 0 });
  const [pontos, setPontos] = useState<any[]>([]);
  const [auditoria, setAuditoria] = useState<any[]>([]);

  // Filtros
  const [filtroFuncionario, setFiltroFuncionario] = useState('');
  const [filtroData, setFiltroData] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, pontosRes, auditoriaRes] = await Promise.all([
        fetch(`/api/dashboard/stats/${user.empresa_id}`),
        fetch(`/api/pontos/empresa/${user.empresa_id}`),
        fetch(`/api/auditoria/empresa/${user.empresa_id}`)
      ]);
      setStats(await statsRes.json());
      setPontos(await pontosRes.json());
      setAuditoria(await auditoriaRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const pontosFiltrados = pontos.filter(ponto => {
    const matchFuncionario = ponto.usuario_nome.toLowerCase().includes(filtroFuncionario.toLowerCase());
    const matchData = filtroData ? ponto.data_hora.startsWith(filtroData) : true;
    return matchFuncionario && matchData;
  });

  const exportToCSV = () => {
    if (pontosFiltrados.length === 0) {
      alert('Nenhum registro para exportar.');
      return;
    }

    // Headers
    const headers = ['Funcionário', 'Data/Hora', 'Tipo', 'Latitude', 'Longitude', 'Status'];
    
    // Rows
    const rows = pontosFiltrados.map(ponto => [
      `"${ponto.usuario_nome}"`,
      `"${new Date(ponto.data_hora).toLocaleString('pt-BR')}"`,
      `"${ponto.tipo}"`,
      ponto.latitude,
      ponto.longitude,
      `"${ponto.status}"`
    ]);

    // Combine
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create Blob and Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pontos_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans p-4 gap-6">
      {/* Floating Sidebar */}
      <div className="w-[280px] bg-[#0A0A0A] rounded-[2rem] flex flex-col shadow-2xl overflow-hidden shrink-0 h-[calc(100vh-32px)]">
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#3B5BDB] rounded-xl flex items-center justify-center shadow-lg shadow-[#3B5BDB]/20 shrink-0">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-white font-bold leading-tight tracking-tight">
                DM Intelligence |<br />Ponto
              </h1>
              <p className="text-[#3B5BDB] text-[9px] font-bold tracking-widest mt-1">PRO HR SYSTEM</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold mb-3 px-2">Gestão de Ponto</p>
              <nav className="space-y-1.5">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                    activeTab === 'dashboard' 
                      ? 'bg-[#3B5BDB] text-white shadow-lg shadow-[#3B5BDB]/20' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5" />
                    <span className="text-sm">QG ESTRATÉGICO</span>
                  </div>
                  {activeTab === 'dashboard' && (
                    <span className="bg-white text-[#3B5BDB] text-xs px-2 py-0.5 rounded-full font-black">
                      {stats.registrosHoje || 0}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('auditoria')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                    activeTab === 'auditoria' 
                      ? 'bg-[#3B5BDB] text-white shadow-lg shadow-[#3B5BDB]/20' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5" />
                  <span className="text-sm">AUDITORIA</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors cursor-pointer" onClick={onLogout}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3B5BDB] rounded-full flex items-center justify-center relative">
                <span className="text-white font-bold text-sm">
                  {user.nome.substring(0, 2).toUpperCase()}
                </span>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0A0A0A] rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-white tracking-tight uppercase">{user.nome.split(' ')[0]} • ADMIN</p>
                <p className="text-[10px] text-zinc-500 font-medium tracking-wider">M INTELLIGENCE</p>
              </div>
            </div>
            <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-[calc(100vh-32px)] overflow-hidden rounded-[2rem] bg-white shadow-sm border border-zinc-100">
        <header className="px-10 py-8 border-b border-zinc-100">
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
            {activeTab === 'dashboard' ? 'QG de Ponto Estratégico' : 'Logs de Auditoria'}
          </h2>
          <p className="text-sm text-zinc-500 mt-2 font-medium">
            {activeTab === 'dashboard' ? `Fila de Registros: ${stats.registrosHoje || 0} itens processados hoje.` : 'Histórico de ações e eventos de segurança do sistema.'}
          </p>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#F8F9FA]/50">
          {activeTab === 'dashboard' ? (
            <div className="max-w-7xl mx-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#3B5BDB]/10 text-[#3B5BDB] px-3 py-1 rounded-lg text-xs font-bold tracking-wide">
                      Ativos
                    </div>
                  </div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Funcionários</p>
                  <p className="text-4xl font-black text-zinc-800 tracking-tight">{stats.funcionariosAtivos}</p>
                </div>
                
                <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">
                      Hoje
                    </div>
                  </div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Registros</p>
                  <p className="text-4xl font-black text-zinc-800 tracking-tight">{stats.registrosHoje}</p>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="font-bold text-zinc-800 text-lg tracking-tight">Últimos Registros</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <input 
                      type="text" 
                      placeholder="Buscar funcionário..." 
                      value={filtroFuncionario}
                      onChange={(e) => setFiltroFuncionario(e.target.value)}
                      className="px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#3B5BDB] focus:border-[#3B5BDB] outline-none transition-all font-medium"
                    />
                    <input 
                      type="date" 
                      value={filtroData}
                      onChange={(e) => setFiltroData(e.target.value)}
                      className="px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#3B5BDB] focus:border-[#3B5BDB] outline-none transition-all text-zinc-600 font-medium"
                    />
                    <button 
                      onClick={exportToCSV}
                      className="text-sm bg-[#3B5BDB] text-white font-bold hover:bg-[#2A45B0] px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap shadow-sm shadow-[#3B5BDB]/20"
                    >
                      Exportar CSV
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-100">
                        <th className="px-8 py-5 font-bold">Funcionário</th>
                        <th className="px-8 py-5 font-bold">Data/Hora</th>
                        <th className="px-8 py-5 font-bold">Tipo</th>
                        <th className="px-8 py-5 font-bold">Localização</th>
                        <th className="px-8 py-5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {pontosFiltrados.map((ponto) => (
                        <tr key={ponto.id} className="hover:bg-zinc-50/50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="font-bold text-zinc-800">{ponto.usuario_nome}</div>
                          </td>
                          <td className="px-8 py-5 text-zinc-500 text-sm font-semibold">
                            {new Date(ponto.data_hora).toLocaleString('pt-BR')}
                          </td>
                          <td className="px-8 py-5">
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide ${
                              ponto.tipo === 'ENTRADA' ? 'bg-[#3B5BDB]/10 text-[#3B5BDB]' : 'bg-rose-500/10 text-rose-600'
                            }`}>
                              {ponto.tipo}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <a 
                              href={`https://maps.google.com/?q=${ponto.latitude},${ponto.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#3B5BDB] hover:text-[#2A45B0] flex items-center gap-2 text-sm font-bold group-hover:underline"
                            >
                              <MapPin className="w-4 h-4" />
                              Ver no mapa
                            </a>
                          </td>
                          <td className="px-8 py-5">
                            {ponto.status === 'VALIDO' ? (
                              <span className="inline-flex items-center gap-2 text-emerald-600 text-sm font-bold">
                                <CheckCircle2 className="w-4 h-4" /> Válido
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 text-rose-600 text-sm font-bold">
                                <AlertCircle className="w-4 h-4" /> Fora do raio
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {pontosFiltrados.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-8 py-16 text-center text-zinc-400 font-bold">
                            Nenhum registro encontrado com os filtros atuais.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center">
                  <h3 className="font-bold text-zinc-800 text-lg tracking-tight">Logs do Sistema</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-100">
                        <th className="px-8 py-5 font-bold">Data/Hora</th>
                        <th className="px-8 py-5 font-bold">Ação</th>
                        <th className="px-8 py-5 font-bold">Usuário</th>
                        <th className="px-8 py-5 font-bold">Detalhes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {auditoria.map((log) => (
                        <tr key={log.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-8 py-5 text-zinc-500 text-sm font-semibold whitespace-nowrap">
                            {new Date(log.data_hora).toLocaleString('pt-BR')}
                          </td>
                          <td className="px-8 py-5">
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide ${
                              log.acao.includes('FALHA') ? 'bg-rose-500/10 text-rose-600' : 'bg-zinc-100 text-zinc-600'
                            }`}>
                              {log.acao}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="font-bold text-zinc-800 text-sm">{log.usuario_nome || 'Sistema/Desconhecido'}</div>
                            <div className="text-xs text-zinc-400 mt-0.5 font-medium">{log.usuario_email || '-'}</div>
                          </td>
                          <td className="px-8 py-5 text-sm text-zinc-600 font-medium">
                            {log.detalhes}
                          </td>
                        </tr>
                      ))}
                      {auditoria.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-8 py-16 text-center text-zinc-400 font-bold">
                            Nenhum log encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

