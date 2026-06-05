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

  // Efeito isolado para categorias
  useEffect(() => {
    console.log("Tentando buscar categorias...");
    api.get('/categories')
      .then((r) => {
        console.log("Categorias carregadas com sucesso:", r.data);
        setCategories(Array.isArray(r.data) ? r.data : []);
      })
      .catch((err) => {
        console.error("Erro fatal ao buscar categorias:", err);
      });
  }, []);

  // Efeito isolado para produtos
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

      <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
        <Link to="/produtos" className="px-4 py-2 rounded-full border bg-gray-200">Todos</Link>
        {categories.map((c, i) => {
          const name = c.name || c.title || c;
          return (
            <Link key={i} to={`/produtos?category=${name}`} className="px-4 py-2 rounded-full border hover:bg-gray-100 whitespace-nowrap">
              {name}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => <ProductCard key={p.product_id} product={p} />)}
      </div>
      
      {!loading && products.length === 0 && <p>Nenhum produto encontrado.</p>}
    </div>
  );
}