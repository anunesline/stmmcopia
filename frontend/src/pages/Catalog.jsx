import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/api';

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const cat = params.get('category') || '';

  useEffect(() => {
    setLoading(true);
    // Busca produtos. Se 'cat' existir, a API filtra automaticamente se configurada
    api.get(cat ? `/products?category=${cat}` : '/products')
      .then((r) => {
        setProducts(Array.isArray(r.data) ? r.data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [cat]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo</h1>
      
      {/* Teste visual: Se isso aparecer, o problema é o CSS do grid */}
      {loading && <p>Carregando...</p>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map((p) => (
          <div key={p.product_id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      
      {!loading && products.length === 0 && <p>Nenhum produto nesta categoria.</p>}
    </div>
  );
}
