import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

export default function SocialFloat() {
  // TikTok icon (lucide doesn't include it natively) - using inline SVG
  const TikTok = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.85a8.16 8.16 0 0 0 4.77 1.52V6.93a4.85 4.85 0 0 1-1.84-.24z" />
    </svg>
  );

  const items = [
    { href: '#', icon: Instagram, label: 'Instagram', test: 'social-instagram' },
    { href: '#', icon: Facebook, label: 'Facebook', test: 'social-facebook' },
    { href: '#', icon: TikTok, label: 'TikTok', test: 'social-tiktok' },
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
