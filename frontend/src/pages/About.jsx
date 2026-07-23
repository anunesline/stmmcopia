import React from 'react';
import { Truck, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-16" data-testid="about-page">
      <div className="text-xs uppercase tracking-[0.25em] text-[#0EA5E9] font-semibold mb-3">Sobre nós</div>
      <h1 className="font-display text-4xl sm:text-5xl text-[#0B2861] leading-tight mb-6">
        MM Comércio e Distribuidora<br/>
        <span className="text-[#0EA5E9]">Limpeza · Descartáveis · Papéis</span>
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mb-12">
        Trabalhamos com as melhores
        marcas do mercado e oferecemos atendimento próximo, direto pelo WhatsApp.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: Truck, title: 'Entrega rápida', text: 'Cobertura em Pinhais, Curitiba e região metropolitana' },
          { icon: HeartHandshake, title: 'Atendimento direto', text: 'Resposta rápida pelo WhatsApp' },
          { icon: ShieldCheck, title: 'Marcas certificadas', text: 'Linha profissional e hospitalar' },
          { icon: Award, title: '20+ anos', text: 'Confiança de quem já é cliente' },
        ].map((b, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
            <b.icon className="w-6 h-6 text-[#0EA5E9] mb-3" />
            <h3 className="font-semibold text-[#0B2861]">{b.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{b.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
