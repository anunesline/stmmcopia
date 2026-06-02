import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const nav = [
    { to: '/', label: 'Início' },
    { to: '/produtos', label: 'Produtos' },
    { to: '/sobre', label: 'Sobre' },
    { to: '/contato', label: 'Contato' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200" data-testid="site-header">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-6">
        <Link to="/" data-testid="logo-home" className="flex items-center gap-3">
          <img
            src="https://customer-assets.emergentagent.com/job_macro-supply-store/artifacts/z4sqbavk_1000115145_page-0001.jpg"
            alt="MM Comércio e Distribuidora"
            className="h-12 w-auto object-contain mix-blend-multiply"
          />
          <div className="leading-tight">
            <div className="font-display text-base sm:text-lg text-[#0B2861]">MM Comércio e Distribuidora</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Limpeza · Descartáveis · Papéis</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={`relative transition-colors hover:text-[#0EA5E9] ${pathname === n.to ? 'text-[#0B2861]' : 'text-slate-700'}`}
            >
              {n.label}
              {pathname === n.to && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#0EA5E9]" />}
            </Link>
          ))}
        </nav>

        <button
          data-testid="mobile-menu-btn"
          className="md:hidden p-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-slate-700 hover:text-[#0EA5E9]"
            >
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
