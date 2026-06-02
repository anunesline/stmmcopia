import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import SocialFloat from './components/SocialFloat';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AdminLeads from './pages/AdminLeads';
import Login from './pages/Login';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-500">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_admin) return <div className="max-w-md mx-auto px-4 py-20 text-center text-slate-500">Acesso restrito.</div>;
  return children;
}

function AppRouter() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Catalog />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
          <Route path="/admin/leads" element={<RequireAuth><AdminLeads /></RequireAuth>} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppWidget />
      <SocialFloat />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
