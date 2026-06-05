import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Upload, X, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const EMPTY = { name: '', description: '', image: '', category: '', is_featured: false };

export default function Admin() {
  // 1. Hooks devem vir sempre no topo
  const { user, loading, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  // 2. Condicionais de renderização só depois dos hooks
  if (loading) return <div className="text-center py-20">Carregando...</div>;
  if (!user || !user.is_admin) return <div className="p-10 text-center">Acesso negado.</div>;

  const load = async () => {
    try {
      const [p, c] = await Promise.all([api.get('/products'), api.get('/categories')]);
      setProducts(Array.isArray(p.data) ? p.data : []);
      setCategories(Array.isArray(c.data) ? c.data : []);
    } catch (e) {
      toast.error("Erro ao carregar dados");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  
  const openEdit = (p) => {
    setEditing(p);
    setForm({ 
      name: p.name || '', 
      description: p.description || '', 
      image: p.image || '', 
      category: p.category || '', 
      is_featured: !!p.is_featured 
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.category || !form.image) {
      toast.error('Preencha nome, foto e categoria');
      return; 
    }
    // Adicione aqui sua lógica de POST/PUT via api.post ou api.put
    setOpen(false);
    toast.success('Salvo com sucesso!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <Button variant="outline" onClick={logout}><LogOut className="mr-2" size={16}/> Sair</Button>
      </div>
      
      <Button onClick={openNew}><Plus className="mr-2" size={16}/> Novo Produto</Button>
      
      {/* Tabela ou lista de produtos aqui */}
      <div className="mt-6">
        {products.map(p => (
          <div key={p.product_id} className="border p-4 mb-2 flex justify-between">
            {p.name}
            <Button onClick={() => openEdit(p)}><Edit2 size={16}/></Button>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Editar' : 'Novo'} Produto</DialogTitle></DialogHeader>
          {/* Inputs do formulário aqui */}
          <DialogFooter>
            <Button onClick={save}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
