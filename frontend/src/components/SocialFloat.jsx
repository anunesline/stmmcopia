import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

export default function SocialFloat() {
  const items = [
    { href: 'https://www.instagram.com/mmdistribuidoradelimpeza', icon: Instagram, label: 'Instagram', test: 'social-instagram' },
    { href: 'https://www.facebook.com/redemmdistribuidoras', icon: Facebook, label: 'Facebook', test: 'social-facebook' },
  ];

  return (
    <div className="hidden md:flex fixed left-4 bottom-24 z-40 flex-col gap-2" data-testid="social-float">
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={it.label}
          data-testid={it.test}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#0B2861] hover:bg-[#0B2861] hover:text-white hover:border-[#0B2861] shadow-lg flex items-center justify-center transition-all hover:scale-110"
        >
          <it.icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}
