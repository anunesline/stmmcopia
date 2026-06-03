import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/api';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [number, setNumber] = useState('554134032999');

  const cat = params.get('category') || '';
  const search = params.get('search') || '';

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(Array.isArray(r.data) ? r.data : [])).catch(() => setCategories([]));
    api.get('/settings').then((r) => setNumber(r.data.whatsapp_number)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (cat) q.set('category', cat);
    if (search) q.set('search', search);
    api.get(`/products?${q.toString()}`).then((r) => {
      setProducts(Array.isArray(r.data) ? r.data : []);
      setLoading(false);
    }).catch(() => {
      setProducts([]);
      setLoading(false);
    });
  }, [cat, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10" data-testid="catalog-page">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.25em] text-[#0EA5E9] font-semibold mb-2">Catálogo</div>
        <h1 className="font-display text-4xl lg:text-5xl text-[#0B2861]">
          {cat ? categories.find((c) => c.slug === cat)?.name || 'Produtos' : 'Todos os produtos'}
        </h1>
        <p className="text-slate-500 mt-2">{products.length} itens disponíveis · solicite pelo WhatsApp</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3">Buscar</div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                data-testid="catalog-search"
                value={search}
                onChange={(e) => {
                  const next = new URLSearchParams(params);
                  if (e.target.value) next.set('search', e.target.value); else next.delete('search');
                  setParams(next);
                }}
                placeholder="Produto..."
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3">Categorias</div>
            <ul className="space-y-1">
              <li>
                <button
                  data-testid="filter-all"
                  onClick={() => { const n = new URLSearchParams(params); n.delete('category'); setParams(n); }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-slate-100 ${!cat ? 'bg-[#0B2861] text-white hover:bg-[#0B2861]' : ''}`}
                >Todas</button>
              </li>
              {categories?.map((c) => (
                <li key={c.category_id}>
                  <button
                    data-testid={`filter-${c.slug}`}
                    onClick={() => { const n = new URLSearchParams(params); n.set('category', c.slug); setParams(n); }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-slate-100 ${cat === c.slug ? 'bg-[#0B2861] text-white hover:bg-[#0B2861]' : ''}`}
                  >{c.name}</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : !products?.length ? (
            <div className="text-center py-20 text-slate-500">Nenhum produto encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="catalog-grid">
              {products?.map((p) => <ProductCard key={p.product_id} product={p} number={number} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
