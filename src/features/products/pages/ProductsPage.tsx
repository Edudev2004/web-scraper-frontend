import { useState, useEffect } from 'react';
import { dashboardService } from '../../dashboard/services/dashboardService';
import { productService } from '../services/productService';
import type { Product } from '../../dashboard/types';
import { motion } from 'framer-motion';
import { Database, Plus, Trash2, Crosshair, Edit2, Save, X } from 'lucide-react';

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    product_name: '',
    model_number: '',
    part_number: '',
    brand_id: 1, // Fijo por ahora
    category_id: 1 // Fijo por ahora
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setFormData({ product_name: '', model_number: '', part_number: '', brand_id: 1, category_id: 1 });
    setEditingId(null);
  };

  const handleEditClick = (prod: Product) => {
    setEditingId(prod.product_id);
    setFormData({
      product_name: prod.product_name,
      model_number: prod.model_number || '',
      part_number: prod.part_number || '',
      brand_id: 1,
      category_id: 1
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name) return;
    
    try {
      if (editingId) {
        await productService.updateProduct(editingId, formData);
      } else {
        await productService.createProduct(formData);
      }
      resetForm();
      await loadProducts();
    } catch (err) {
      alert("Error guardando el objetivo.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este objetivo del escáner?")) return;
    try {
      await productService.deleteProduct(id);
      if (editingId === id) resetForm();
      await loadProducts();
    } catch (err) {
      alert("Error eliminando el objetivo.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="sharp-header">
        <h1><Database size={28} color="var(--accent)"/> TÉRMINOS & OBJETIVOS</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* FORMULARIO */}
        <div className="sharp-panel" style={{ alignSelf: 'start', borderColor: editingId ? 'var(--alert-green)' : 'var(--border-color)' }}>
          <h2 className="section-title">
            <Crosshair size={18} /> {editingId ? 'Editar Objetivo' : 'Nuevo Objetivo'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TÉRMINO DE BÚSQUEDA *</label>
              <input 
                type="text" 
                required
                value={formData.product_name}
                onChange={e => setFormData({...formData, product_name: e.target.value})}
                placeholder="Ej. Switch Cisco 9200"
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid var(--border-color)', color: '#fff', padding: '0.8rem', fontFamily: 'monospace' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MODELO</label>
                <input 
                  type="text" 
                  value={formData.model_number}
                  onChange={e => setFormData({...formData, model_number: e.target.value})}
                  placeholder="Opcional"
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid var(--border-color)', color: '#fff', padding: '0.8rem', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PART NUMBER</label>
                <input 
                  type="text" 
                  value={formData.part_number}
                  onChange={e => setFormData({...formData, part_number: e.target.value})}
                  placeholder="Opcional"
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid var(--border-color)', color: '#fff', padding: '0.8rem', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="sharp-btn" style={{ flexGrow: 1, justifyContent: 'center' }}>
                {editingId ? <Save size={16} /> : <Plus size={16} />} 
                {editingId ? ' GUARDAR CAMBIOS' : ' AÑADIR AL ESCÁNER'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="sharp-btn" style={{ padding: '0.5rem', borderColor: '#555', color: '#888' }}>
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <div className="table-container">
          <table className="sharp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>OBJETIVO / BÚSQUEDA</th>
                <th>MODELO</th>
                <th>PART NUMBER</th>
                <th>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</td></tr>
              ) : products.map((prod) => (
                <tr key={prod.product_id} style={{ background: editingId === prod.product_id ? 'rgba(0, 240, 255, 0.05)' : 'transparent' }}>
                  <td style={{ color: 'var(--text-secondary)' }}>#{prod.product_id}</td>
                  <td style={{ fontWeight: 'bold' }}>{prod.product_name}</td>
                  <td>{prod.model_number || '-'}</td>
                  <td>{prod.part_number || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleEditClick(prod)}
                        className="sharp-btn" 
                        style={{ padding: '0.4rem', borderColor: 'var(--accent)', color: 'var(--accent)', boxShadow: 'none' }}
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(prod.product_id)}
                        className="sharp-btn" 
                        style={{ padding: '0.4rem', borderColor: '#ff3333', color: '#ff3333', boxShadow: 'none' }}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
