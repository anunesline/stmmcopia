
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
  
  useEffect(() => {
  console.log("Estado do usuário:", user);
  console.log("Loading:", loading);
}, [user, loading]);

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
    // Validação flexível: aceita a imagem que já está no form (carregada do banco ou via upload)
    if (!form.name || !form.category || !form.image) {
      toast.error('Preencha nome, foto e categoria');
     return (
  <div className="p-10">
    <h1 className="text-4xl text-black">TESTE DE CARGA</h1>
    <p>Se você está vendo isso, o React funcionou!</p>
  </div>
);
