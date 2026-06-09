import React, { useEffect, useState } from 'react';
import { Plus, Edit2, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const EMPTY = {
  name: '',
  description: '',
  price: '',
  image: '',
  is_featured: false,
  is_active: true
};

export default function Admin() {
  const { user, loading, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);

  // ================= LOAD =================
  const load = async () => {
    try {
      const res = await api.get('/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.log(e);
      toast.error("Erro ao carregar produtos");
    }
  };

  useEffect(() => {
    if (user?.is_admin) load();
  }, [user]);

  // ================= UPLOAD =================
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return res.data.url;
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      let imageUrl = form.image;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const payload = {
        ...form,
        image: imageUrl
      };

      const id = editing?.id;

      if (editing && !id) {
        toast.error("Produto sem ID válido");
        return;
      }

      if (editing) {
        await api.put(`/products/${id}`, payload);
        toast.success("Produto atualizado");
      } else {
        await api.post('/products', payload);
        toast.success("Produto criado");
      }

      setOpen(false);
      setForm(EMPTY);
      setEditing(null);
      setPreview('');
      setFile(null);
      load();

    } catch (e) {
      console.log(e);
      toast.error("Erro ao salvar produto");
    }
  };

  // ================= TOGGLE ATIVO =================
  const handleToggleActive = async (p) => {
    try {
      await api.put(`/products/${p.id}`, {
        ...p,
        is_active: !(p.is_active ?? true)
      });

      toast.success(
        p.is_active ? "Produto desativado" : "Produto ativado"
      );

      load();
    } catch (e) {
      console.log(e);
      toast.error("Erro ao atualizar status");
    }
  };

  // ================= NEW =================
  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setPreview('');
    setFile(null);
    setOpen(true);
  };

  // ================= EDIT =================
  const openEdit = (p) => {
    setEditing(p);

    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      image: p.image || '',
      is_featured: p.is_featured || false,
      is_active: p.is_active ?? true
    });

    setPreview(p.image || '');
    setFile(null);
    setOpen(true);
  };

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // ================= GUARDS =================
  if (loading) return <div>Carregando...</div>;
  if (!user || !user.is_admin) return <div>Acesso negado.</div>;

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>

        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2" size={16} />
          Sair
        </Button>
      </div>

      {/* NOVO */}
      <Button onClick={openNew}>
        <Plus className="mr-2" size={16} />
        Novo Produto
      </Button>

      {/* LISTA */}
      <div className="mt-6">
        {products.map((p) => (
          <div
            key={p.id}
            className={`border p-4 mb-2 flex justify-between items-center ${
              p.is_active === false ? 'opacity-40' : ''
            }`}
          >
            <div>
              <div className="font-bold">{p.name}</div>
              <div className="text-sm text-gray-500">
                {p.is_active === false ? 'INATIVO' : 'ATIVO'}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => openEdit(p)}>
                <Edit2 size={16} />
              </Button>

              <Button variant="ghost" onClick={() => handleToggleActive(p)}>
                {p.is_active === false ? "Ativar" : "Desativar"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>

          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">

            <input
              className="w-full border p-2"
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full border p-2"
              placeholder="Descrição"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input
              className="w-full border p-2"
              placeholder="Preço"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <input
              type="file"
              accept="image/*"
              className="w-full border p-2"
              onChange={handleImageChange}
            />

            {preview && (
              <img
                src={preview}
                className="w-full h-40 object-cover rounded border"
              />
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  setForm({ ...form, is_featured: e.target.checked })
                }
              />
              Destaque
            </label>

          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleSave}>
              {editing ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  );
}