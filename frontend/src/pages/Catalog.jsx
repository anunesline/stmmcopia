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

  // =========================
  // CATEGORIAS
  // =========================
  useEffect(() => {
    api.get('/categories')
      .then((r) => {
        setCategories(Array.isArray(r.data) ? r.data : []);
      })
      .catch((err) => {
        console.error("Erro ao buscar categorias:", err);
      });
  }, []);

  // =========================
  // PRODUTOS
  // =========================
  useEffect(() => {
    setLoading(true);

    const url = cat
      ? `/products?category=${cat}`
      : '/products';

    api.get(url)
      .then((r) => {
        setProducts(Array.isArray(r.data) ? r.data : []);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [cat]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Catálogo</h1>

      {/* ========================= */}
      {/* CATEGORIAS */}
      {/* ========================= */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
        
        <Link
          to="/produtos"
          className={`px-4 py-2 rounded-full border ${
            !cat ? 'bg-[#0B2861] text-white' : 'hover:bg-gray-100'
          }`}
        >
          Todos
        </Link>

        {categories.map((c) => {
          const id = c.category_id || c.id || c._id;
          const name = c.name;
          const slug = c.slug || c.name;

          return (
            <Link
              key={id}
              to={`/produtos?category=${slug}`}
              className={`px-4 py-2 rounded-full border whitespace-nowrap ${
                cat === slug
                  ? 'bg-[#0B2861] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {name}
            </Link>
          );
        })}
      </div>

      {/* ========================= */}
      {/* PRODUTOS */}
      {/* ========================= */}
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const id = p.product_id || p.id || p._id;

            return (
              <ProductCard
                key={id}
                product={p}
              />
            );
          })}
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="text-center py-20 text-gray-500">
          Nenhum produto encontrado nesta categoria.
        </p>
      )}
    </div>
  );
}