import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/api';

export default function Catalog() {
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const cat = params.get('category') || '';

  // 1. Busca Categorias
  useEffect(() => {
    api.get('/categories')
      .then((r) => setCategories(Array.isArray(r.data) ? r.data : []))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  // 2. Busca Produtos
  useEffect(() => {
    setLoading(true);
    const url = cat ? `/products?category=${cat}` : '/products';
    api.get(url)
      .then((r) => setProducts(Array.isArray(r.data) ? r.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [cat]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Catálogo</h1>

      {/* Menu de Categorias */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
        <Link 
          to="/produtos" 
          className={`px-4 py-2 rounded-full border transition-colors ${!cat ? 'bg-[#0B2861] text-white' : 'hover:bg-gray-100'}`}
        >
          Todos
        </Link>
        {categories.map((c) => (
          <Link
            key={c.category_id}
            to={`/produtos?category=${c.slug}`}
            className={`px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${cat === c.slug ? 'bg-[#0B2861] text-white' : 'hover:bg-gray-100'}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Grid de Produtos */}
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.product_id} product={p} />)}
        </div>
      )}
      
      {!loading && products.length === 0 && (
        <p className="text-center py-20 text-gray-500">Nenhum produto encontrado nesta categoria.</p>
      )}
    </div>
  );
}