'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/patients', label: 'Pacientes', icon: '👥' },
  { href: '/appointments', label: 'Agenda', icon: '📅' },
  { href: '/financial', label: 'Financeiro', icon: '💰' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [clinicName, setClinicName] = useState('');
  const [userName, setUserName] = useState('');
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
      return;
    }

    Promise.resolve().then(() => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const clinic = JSON.parse(localStorage.getItem('clinic') || '{}');
      setUserName(user.name || 'Usuário');
      setClinicName(clinic.name || 'Minha Clínica');
      setAuthorized(true);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('clinic');
    router.push('/');
  };

  if (!authorized) return null;

  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col
        transform transition-transform duration-300
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>

        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-content-center shadow-lg flex items-center justify-center">
              <span className="text-white text-lg">🦷</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-wide">Denty</p>
              <p className="text-slate-400 text-xs truncate max-w-[140px]">{clinicName}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${pathname === item.href
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {pathname === item.href && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="px-3 py-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{userName}</p>
              <p className="text-slate-500 text-xs">Administrador</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all"
          >
            <span>🚪</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button onClick={() => setMenuOpen(true)} className="p-2 rounded-lg hover:bg-slate-100">
            <div className="w-5 h-0.5 bg-slate-600 mb-1.5 rounded"></div>
            <div className="w-5 h-0.5 bg-slate-600 mb-1.5 rounded"></div>
            <div className="w-5 h-0.5 bg-slate-600 rounded"></div>
          </button>
          <span className="font-bold text-slate-800">🦷 Denty</span>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}