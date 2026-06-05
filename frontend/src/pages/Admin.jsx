import React, { useEffect, useState } from 'react';
import { Plus, Edit2, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const EMPTY = { name: '', description: '', image: '', category: '', is_featured: false };

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    try {
      const response = await api.get('/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      toast.error("Erro ao carregar produtos");
    }
  };

  useEffect(() => {
    if (user?.is_admin) load();
  }, [user]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm(p);
    setOpen(true);
  };

  if (loading) return <div>Carregando...</div>;
  if (!user || !user.is_admin) return <div>Acesso negado.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <Button variant="outline" onClick={logout}><LogOut className="mr-2" size={16}/> Sair</Button>
      </div>
      
      <Button onClick={openNew}><Plus className="mr-2" size={16}/> Novo Produto</Button>
      
      <div className="mt-6">
        {products.map(p => (
          <div key={p.product_id} className="border p-4 mb-2 flex justify-between items-center">
            {p.name}
            <Button variant="ghost" onClick={() => openEdit(p)}><Edit2 size={16}/></Button>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Formulário em construção...</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
