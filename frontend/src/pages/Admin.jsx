import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Upload, X, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '../components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '../components/ui/dialog';
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
  const [catForm, setCatForm] = useState({ name: '', slug: '' });

  const load = async () => {
    const [p, c] = await Promise.all([api.get('/products'), api.get('/categories')]);
    setProducts(Array.isArray(p.data) ? p.data : []);
    setCategories(Array.isArray(c.data) ? c.data : []);
  };

  useEffect(() => { if (user?.is_admin) load(); }, [user]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-500">Carregando...</div>;

  if (!user || !user.is_admin) return null; // handled by RequireAuth

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, image: p.image, category: p.category, is_featured: !!p.is_featured });
    setOpen(true);
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await api.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((f) => ({ ...f, image: r.data.url }));
      toast.success('Imagem enviada');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.name || !form.image || !form.category) {
      toast.error('Preencha nome, foto e categoria');
      return;
    }
    try {
      if (editing) {
        await api.put(`/admin/products/${editing.product_id}`, form);
        toast.success('Produto atualizado');
      } else {
        await api.post('/admin/products', form);
        toast.success('Produto criado');
      }
      setOpen(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Erro');
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Excluir ${p.name}?`)) return;
    await api.delete(`/admin/products/${p.product_id}`);
    toast.success('Produto excluído');
    load();
  };

  const saveCategory = async () => {
    if (!catForm.name) return toast.error('Informe o nome');
    const slug = (catForm.slug || catForm.name).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    try {
      await api.post('/admin/categories', { name: catForm.name, slug });
      toast.success('Categoria criada');
      setCatForm({ name: '', slug: '' });
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Erro');
    }
  };

  const removeCategory = async (c) => {
    if (!window.confirm(`Excluir categoria ${c.name}? Os produtos não serão removidos.`)) return;
    await api.delete(`/admin/categories/${c.category_id}`);
    toast.success('Categoria excluída');
    load();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10" data-testid="admin-page">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#0EA5E9] font-semibold mb-2">Painel admin</div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#0B2861]">Olá, {user.name?.split(' ')[0]}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500 hidden sm:block">{user.email}</div>
          <Button onClick={logout} variant="outline" className="gap-2" data-testid="admin-logout"><LogOut className="w-4 h-4" /> Sair</Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="products" data-testid="tab-products">Produtos ({products.length})</TabsTrigger>
          <TabsTrigger value="categories" data-testid="tab-categories">Categorias ({categories.length})</TabsTrigger>
          <TabsTrigger value="leads" data-testid="tab-leads" onClick={(e) => { e.preventDefault(); window.location.href = '/admin/leads'; }}>Leads do chat →</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="flex justify-end mb-4">
            <Button onClick={openNew} className="bg-[#0B2861] hover:bg-[#1E3A8A] gap-2" data-testid="new-product-btn">
              <Plus className="w-4 h-4" /> Novo produto
            </Button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-slate-500 border-b bg-slate-50">
                <tr>
                  <th className="py-3 px-4">Foto</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Destaque</th>
                  <th className="text-right pr-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((p) => (
                  <tr key={p.product_id} className="border-b last:border-0 hover:bg-slate-50" data-testid={`product-row-${p.product_id}`}>
                    <td className="py-3 px-4">
                      <img src={resolveImg(p.image)} alt={p.name} className="w-12 h-12 object-cover rounded border border-slate-200" />
                    </td>
                    <td className="font-medium text-[#0B2861]">{p.name}</td>
                    <td className="text-slate-600">{categories?.find((c) => c.slug === p.category)?.name || p.category}</td>
                    <td>{p.is_featured && <span className="text-xs bg-[#0EA5E9]/10 text-[#0B2861] px-2 py-0.5 rounded">Sim</span>}</td>
                    <td className="text-right pr-4">
                      <button onClick={() => openEdit(p)} className="text-[#0B2861] hover:text-[#0EA5E9] mr-3" data-testid={`edit-${p.product_id}`}><Edit2 className="w-4 h-4 inline" /></button>
                      <button onClick={() => remove(p)} className="text-red-500 hover:text-red-700" data-testid={`del-${p.product_id}`}><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
                {!products?.length && (
                  <tr><td colSpan="5" className="py-8 text-center text-slate-400">Nenhum produto cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
            <h3 className="font-display text-lg text-[#0B2861] mb-4">Nova categoria</h3>
            <div className="flex gap-3 flex-wrap items-end">
              <div className="flex-1 min-w-[200px]">
                <Label>Nome</Label>
                <Input data-testid="new-cat-name" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="Ex: Equipamentos" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label>Slug (opcional)</Label>
                <Input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} placeholder="equipamentos" />
              </div>
              <Button onClick={saveCategory} className="bg-[#0B2861] gap-2" data-testid="save-cat-btn"><Plus className="w-4 h-4" /> Criar</Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-slate-500 border-b bg-slate-50">
                <tr><th className="py-3 px-4">Nome</th><th>Slug</th><th className="text-right pr-4">Ações</th></tr>
              </thead>
              <tbody>
                {categories?.map((c) => (
                  <tr key={c.category_id} className="border-b last:border-0" data-testid={`cat-row-${c.slug}`}>
                    <td className="py-3 px-4 font-medium text-[#0B2861]">{c.name}</td>
                    <td className="text-slate-600 font-mono text-xs">{c.slug}</td>
                    <td className="text-right pr-4">
                      <button onClick={() => removeCategory(c)} className="text-red-500 hover:text-red-700" data-testid={`del-cat-${c.slug}`}><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg" data-testid="product-dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#0B2861]">
              {editing ? 'Editar produto' : 'Novo produto'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Nome *</Label>
              <Input data-testid="form-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea rows={3} data-testid="form-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label>Categoria *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger data-testid="form-category"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Foto *</Label>
              {form.image && (
                <div className="mb-2 relative inline-block">
                  <img src={resolveImg(form.image)} alt="preview" className="w-32 h-32 object-cover rounded-lg border border-slate-200" />
                  <button onClick={() => setForm({ ...form, image: '' })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <label className="block">
                <input type="file" accept="image/*" onChange={onUpload} disabled={uploading} className="hidden" id="upload-input" data-testid="upload-input" />
                <Button asChild variant="outline" className="gap-2 cursor-pointer w-fit">
                  <label htmlFor="upload-input" className="cursor-pointer">
                    <Upload className="w-4 h-4" /> {uploading ? 'Enviando...' : (form.image ? 'Trocar foto' : 'Enviar foto do PC')}
                  </label>
                </Button>
              </label>
              <p className="text-[11px] text-slate-400 mt-1.5">JPG, PNG ou WebP · até 10MB</p>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} data-testid="form-featured" />
              <Label className="!mb-0">Destacar na home</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} className="bg-[#0B2861] hover:bg-[#1E3A8A]" data-testid="save-product-btn">
              {editing ? 'Salvar alterações' : 'Criar produto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
