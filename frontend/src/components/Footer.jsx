import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#061844] text-white mt-20" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center">
              <span className="font-display text-[#0B2861] text-2xl">M</span>
            </div>
            <div>
              <div className="font-display text-lg">MM Comércio e Distribuidora</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-sky-300">Limpeza · Descartáveis · Papéis</div>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Há mais de 20 anos abastecendo empresas, condomínios e indústrias com produtos
            de limpeza, descartáveis e papéis de qualidade.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="#" aria-label="Instagram" data-testid="footer-instagram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0EA5E9] flex items-center justify-center transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Facebook" data-testid="footer-facebook" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0EA5E9] flex items-center justify-center transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-sky-300 mb-4">Navegar</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/" className="hover:text-white">Início</Link></li>
            <li><Link to="/produtos" className="hover:text-white">Produtos</Link></li>
            <li><Link to="/sobre" className="hover:text-white">Sobre</Link></li>
            <li><Link to="/contato" className="hover:text-white">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-sky-300 mb-4">Atendimento</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-2"><Phone className="w-4 h-4 text-sky-300 mt-0.5" /> (41) 3403-2999</li>
            <li className="flex gap-2"><Clock className="w-4 h-4 text-sky-300 mt-0.5" /> Seg a Sex · 8h às 18h<br/><span className="ml-6 text-xs">Sábado · 8h às 12h</span></li>
            <li className="flex gap-2"><MapPin className="w-4 h-4 text-sky-300 mt-0.5" /> Curitiba — PR</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} MM Comércio e Distribuidora · Todos os direitos reservados.
      </div>
    </footer>
  );
}
