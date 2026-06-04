import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { buildWhatsAppUrl } from './WhatsAppWidget';
import { resolveImg } from '../lib/api';

export default function ProductCard({ product, number = '554134032999' }) {
  if (!product) return null;

  const wppUrl = buildWhatsAppUrl({ number, product: product.name });

  return (
    <div
      data-testid={`product-card-${product.product_id}`}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#0EA5E9] flex flex-col"
    >
      <div className="relative bg-slate-50 aspect-square overflow-hidden">
        <img
          src={resolveImg(product.image)}
          alt={product.name || 'Produto'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-lg text-[#0B2861] leading-tight">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3 flex-1">
          {product.description}
        </p>
        <a
          href={wppUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`quero-${product.product_id}`}
          className="mt-4"
        >
          <Button className="w-full h-10 bg-[#25D366] hover:bg-[#1ebe57] text-white gap-2 text-sm">
            Quero este produto <ArrowRight className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}
