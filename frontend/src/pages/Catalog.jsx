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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#0B2861]">Catálogo</h1>
        <p className="text-slate-500 mt-2">{products.length} itens disponíveis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <p>Carregando...</p>
        ) : products.length > 0 ? (
          products.map((p) => <ProductCard key={p.product_id} product={p} number={number} />)
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
}
