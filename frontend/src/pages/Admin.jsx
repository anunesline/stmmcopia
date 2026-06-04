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
import { api, resolveImg } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const EMPTY = { name: '', description: '', image: '', category: '', is_featured: false };

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const load = async () => {
  try {
    const [p, c] = await Promise.all([api.get('/products'), api.get('/categories')]);
    console.log("Produtos recebidos:", p.data); // Verifique isso no F12 -> Console
    setProducts(Array.isArray(p.data) ? p.data : []);
    setCategories(Array.isArray(c.data) ? c.data : []);
  } catch (e) {
    console.error("Erro ao carregar:", e);
    toast.error("Erro ao carregar produtos");
  }
};

  useEffect(() => { if (user?.is_admin) load(); }, [user]);

  if (loading) return <div className="text-center py-20">Carregando...</div>;
  console.log("Usuário logado:", user);
  if (!user || !user.is_admin) return null;

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

  const onUpload = async (e) => {
    // ...
    // CORREÇÃO: Remova o "/api/" do início do caminho
    const r = await api.post('/admin/upload', fd); 
    // ...
  };

  const save = async () => {
    // ...
    if (editing) {
      // CORREÇÃO: Remova o "/api/" do início do caminho
      await api.put(`/admin/products/${editing.product_id}`, form);
      // ...
    } else {
      // CORREÇÃO: Remova o "/api/" do início do caminho
      await api.post('/admin/products', form);
      // ...
    }
  };

  const save = async () => {
    // Validação flexível: aceita a imagem que já está no form (carregada do banco ou via upload)
    if (!form.name || !form.category || !form.image) {
      toast.error('Preencha nome, foto e categoria');
      return;
    }
    try {
      if (editing) {
        await api.put(`/api/admin/products/${editing.product_id}`, form);
        toast.success('Produto atualizado');
      } else {
        await api.post('/api/admin/products', form);
        toast.success('Produto criado');
      }
      setOpen(false);
      load();
    } catch (e) {
      toast.error('Erro ao salvar produto');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#0B2861]">Painel Admin</h1>
        <Button onClick={openNew}>+ Novo Produto</Button>
      </div>

      {/* Tabela de produtos aqui... (mantive a estrutura original) */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Editar produto' : 'Novo produto'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome *</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
            <div><Label>Categoria *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({...form, category: v})}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{categories?.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
                <Label>Foto *</Label>
                {form.image && <img src={resolveImg(form.image)} alt="preview" className="w-20 h-20 mb-2 object-cover rounded" />}
                <input type="file" onChange={onUpload} disabled={uploading} />
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(v) => setForm({...form, is_featured: v})} /><Label>Destacar</Label></div>
          </div>
          <DialogFooter>
            <Button onClick={save}>{editing ? 'Salvar alterações' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
useEffect(() => {
    console.log("Estado do usuário:", user);
    console.log("Loading:", loading);
  }, [user, loading]);
