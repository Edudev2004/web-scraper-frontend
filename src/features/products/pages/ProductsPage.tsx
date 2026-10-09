import { useState, useEffect } from 'react';
import { dashboardService } from '../../dashboard/services/dashboardService';
import { productService } from '../services/productService';
import type { Product } from '../../dashboard/types';
import { motion } from 'framer-motion';
import { Database, Plus, Trash2, Crosshair, Edit2, Save, X, Hash, Activity } from 'lucide-react';

const SearchableSelect = ({ items, valueId, onChange, onCreate, onDelete, itemNameKey, itemIdKey, defaultItemName }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const selectedItem = items.find((i: any) => i[itemIdKey] === valueId);
  
  useEffect(() => {
    if (selectedItem && !isOpen) {
      setSearch(selectedItem[itemNameKey]);
    }
  }, [valueId, selectedItem, isOpen]);

  const sortedItems = [...items].sort((a, b) => {
    if (a[itemNameKey] === defaultItemName) return -1;
    if (b[itemNameKey] === defaultItemName) return 1;
    return a[itemNameKey].localeCompare(b[itemNameKey]);
  });

  const filteredItems = sortedItems.filter((i: any) => 
    i[itemNameKey].toLowerCase().includes(search.toLowerCase())
  );

  const exactMatch = items.find((i: any) => i[itemNameKey].toLowerCase() === search.toLowerCase());
  const showCreateOption = search.trim() !== '' && !exactMatch;

  return (
    <div style={{ position: 'relative' }}>
      <input 
        type="text"
        value={search}
        onChange={e => { setSearch(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsOpen(false);
            if (selectedItem) setSearch(selectedItem[itemNameKey]);
            else setSearch('');
          }, 200);
        }}
        placeholder="Buscar..."
        style={{ width: '100%', background: '#0a0a0a', border: '1px solid var(--border-color)', color: '#fff', padding: '0.8rem', fontFamily: 'monospace', outline: 'none' }}
      />
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0a0a0a', border: '1px solid var(--border-color)', borderTop: 'none', zIndex: 10, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          {showCreateOption && (
            <div 
              onMouseDown={(e) => {
                e.preventDefault();
                onCreate(search.trim());
                setIsOpen(false);
              }}
              style={{ padding: '0.8rem', cursor: 'pointer', color: 'var(--alert-green)', borderBottom: '1px solid #222', fontSize: '0.9rem' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              + CREAR "{search.trim()}"
            </div>
          )}
          {filteredItems.length === 0 && !showCreateOption ? (
            <div style={{ padding: '0.8rem', color: '#555', fontSize: '0.9rem' }}>No hay resultados</div>
          ) : (
            filteredItems.map((item: any) => (
              <div 
                key={item[itemIdKey]}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: valueId === item[itemIdKey] ? '#222' : 'transparent', fontSize: '0.9rem' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                onMouseLeave={e => e.currentTarget.style.background = valueId === item[itemIdKey] ? '#222' : 'transparent'}
              >
                <div 
                  style={{ flex: 1, cursor: 'pointer' }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(item[itemIdKey]);
                    setIsOpen(false);
                  }}
                >
                  {item[itemNameKey]}
                </div>
                {onDelete && item[itemNameKey] !== defaultItemName && (
                  <div 
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onDelete(item[itemIdKey], item[itemNameKey]);
                    }}
                    style={{ cursor: 'pointer', color: '#ff3333', padding: '0 0.5rem', display: 'flex', alignItems: 'center' }}
                    title="Eliminar permanentemente"
                  >
                    <Trash2 size={14} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    product_name: '',
    model_number: '',
    part_number: '',
    description: '',
    brand_id: 0, 
    category_id: 0 
  });

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, brs, cats] = await Promise.all([
        dashboardService.getProducts(),
        productService.getBrands(),
        productService.getCategories()
      ]);
      setProducts(prods);
      setBrands(brs);
      setCategories(cats);
      
      if (!editingId && brs.length > 0 && cats.length > 0 && formData.brand_id === 0) {
        const defBrand = brs.find((b: any) => b.brand_name === 'Sin Marca') || brs[0];
        const defCat = cats.find((c: any) => c.category_name === 'Sin Categoría') || cats[0];
        setFormData(prev => ({
          ...prev,
          brand_id: defBrand.brand_id,
          category_id: defCat.category_id
        }));
      }
    } catch (err) {
      console.error(err);
      showToast("Error al cargar datos del servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    const defBrand = brands.find(b => b.brand_name === 'Sin Marca') || brands[0];
    const defCat = categories.find(c => c.category_name === 'Sin Categoría') || categories[0];
    setFormData({ 
      product_name: '', 
      model_number: '', 
      part_number: '', 
      description: '',
      brand_id: defBrand?.brand_id || 1, 
      category_id: defCat?.category_id || 1 
    });
    setEditingId(null);
  };

  const handleEditClick = (prod: Product) => {
    setEditingId(prod.product_id);
    setFormData({
      product_name: prod.product_name,
      model_number: prod.model_number || '',
      part_number: prod.part_number || '',
      description: prod.description || '',
      brand_id: prod.brand?.brand_id || 1,
      category_id: prod.category?.category_id || 1
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name) return;
    
    try {
      if (editingId) {
        await productService.updateProduct(editingId, formData);
        showToast("Objetivo actualizado correctamente.", "success");
      } else {
        await productService.createProduct(formData);
        showToast("Objetivo añadido al escáner.", "success");
      }
      resetForm();
      const updatedProds = await dashboardService.getProducts();
      setProducts(updatedProds);
    } catch (err) {
      showToast("Error guardando el objetivo.", "error");
    }
  };

  const handleDeleteProduct = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'ELIMINAR OBJETIVO',
      message: `¿Estás seguro que deseas eliminar el objetivo '${name}'? Dejará de ser monitoreado.`,
      onConfirm: async () => {
        try {
          await productService.deleteProduct(id);
          if (editingId === id) resetForm();
          const updatedProds = await dashboardService.getProducts();
          setProducts(updatedProds);
          showToast("Objetivo eliminado correctamente.", "success");
        } catch (err) {
          showToast("Error eliminando el objetivo.", "error");
        }
      }
    });
  };

  const handleDeleteBrand = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'ELIMINAR MARCA',
      message: `¿Eliminar la marca '${name}'? Solo podrás hacerlo si no está en uso por ningún objetivo.`,
      onConfirm: async () => {
        try {
          await productService.deleteBrand(id);
          const updatedBrands = await productService.getBrands();
          setBrands(updatedBrands);
          showToast(`Marca '${name}' eliminada.`, "success");
          if (formData.brand_id === id) resetForm();
        } catch (err: any) {
          showToast("No se pudo eliminar la marca. Es probable que esté en uso.", "error");
        }
      }
    });
  };

  const handleDeleteCategory = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'ELIMINAR CATEGORÍA',
      message: `¿Eliminar la categoría '${name}'? Solo podrás hacerlo si no está en uso por ningún objetivo.`,
      onConfirm: async () => {
        try {
          await productService.deleteCategory(id);
          const updatedCats = await productService.getCategories();
          setCategories(updatedCats);
          showToast(`Categoría '${name}' eliminada.`, "success");
          if (formData.category_id === id) resetForm();
        } catch (err: any) {
          showToast("No se pudo eliminar la categoría. Es probable que esté en uso.", "error");
        }
      }
    });
  };

  const handleCreateBrand = async (name: string) => {
    try {
      const created = await productService.createBrand(name);
      const updatedBrands = await productService.getBrands();
      setBrands(updatedBrands);
      setFormData({...formData, brand_id: created.brand_id});
      showToast(`Marca '${name}' creada exitosamente.`, "success");
    } catch(err) {
      showToast("Error al crear marca.", "error");
    }
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const created = await productService.createCategory(name);
      const updatedCats = await productService.getCategories();
      setCategories(updatedCats);
      setFormData({...formData, category_id: created.category_id});
      showToast(`Categoría '${name}' creada exitosamente.`, "success");
    } catch(err) {
      showToast("Error al crear categoría.", "error");
    }
  };

  const filteredProducts = products.filter(prod => {
    const term = searchTerm.toLowerCase();
    return (
      prod.product_name.toLowerCase().includes(term) ||
      (prod.model_number && prod.model_number.toLowerCase().includes(term)) ||
      (prod.part_number && prod.part_number.toLowerCase().includes(term)) ||
      (prod.brand?.brand_name && prod.brand.brand_name.toLowerCase().includes(term))
    );
  });

  let sortedProducts = [...filteredProducts];
  if (sortConfig !== null) {
    sortedProducts.sort((a, b) => {
      let aVal: any = '';
      let bVal: any = '';
      
      switch (sortConfig.key) {
        case 'id':
          aVal = a.product_id;
          bVal = b.product_id;
          break;
        case 'name':
          aVal = a.product_name.toLowerCase();
          bVal = b.product_name.toLowerCase();
          break;
        case 'brand':
          aVal = (a.brand?.brand_name || '').toLowerCase();
          bVal = (b.brand?.brand_name || '').toLowerCase();
          break;
        case 'category':
          aVal = (a.category?.category_name || '').toLowerCase();
          bVal = (b.category?.category_name || '').toLowerCase();
          break;
        case 'model':
          aVal = (a.model_number || '').toLowerCase();
          bVal = (b.model_number || '').toLowerCase();
          break;
        case 'part':
          aVal = (a.part_number || '').toLowerCase();
          bVal = (b.part_number || '').toLowerCase();
          break;
      }
      
      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            background: toast.type === 'success' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 51, 51, 0.1)',
            border: `1px solid ${toast.type === 'success' ? 'var(--alert-green)' : '#ff3333'}`,
            color: toast.type === 'success' ? 'var(--alert-green)' : '#ff3333',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            boxShadow: `0 4px 12px ${toast.type === 'success' ? 'rgba(0,240,255,0.2)' : 'rgba(255,51,51,0.2)'}`
          }}
        >
          {toast.type === 'success' ? <Activity size={18} /> : <X size={18} />}
          <span style={{ fontFamily: 'monospace' }}>{toast.message}</span>
        </motion.div>
      )}

      {confirmModal?.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="sharp-panel" style={{ width: '400px', borderColor: 'var(--alert-red)' }}>
            <h3 style={{ color: 'var(--alert-red)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <Trash2 size={20} /> {confirmModal.title}
            </h3>
            <p style={{ margin: '0 0 2rem 0', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{confirmModal.message}</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setConfirmModal(null)} 
                className="sharp-btn" 
                style={{ flex: 1, borderColor: '#555', color: '#fff' }}
              >
                CANCELAR
              </button>
              <button 
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }} 
                className="sharp-btn danger" 
                style={{ flex: 1 }}
              >
                SÍ, ELIMINAR
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sharp-header">
        <h1><Database size={28} color="var(--accent)"/> TÉRMINOS & OBJETIVOS</h1>
      </header>

      {/* KPIs Rápidos */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="sharp-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem' }}>
          <Hash size={24} color="var(--accent)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TOTAL OBJETIVOS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{products.length}</div>
          </div>
        </div>
        <div className="sharp-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem' }}>
          <Activity size={24} color="var(--alert-green)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ESTADO DEL MOTOR</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--alert-green)' }}>ACTIVO</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem' }}>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MARCA</label>
                <SearchableSelect 
                  items={brands}
                  valueId={formData.brand_id}
                  onChange={(id: number) => setFormData({...formData, brand_id: id})}
                  onCreate={handleCreateBrand}
                  onDelete={handleDeleteBrand}
                  itemNameKey="brand_name"
                  itemIdKey="brand_id"
                  defaultItemName="Sin Marca"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>CATEGORÍA</label>
                <SearchableSelect 
                  items={categories}
                  valueId={formData.category_id}
                  onChange={(id: number) => setFormData({...formData, category_id: id})}
                  onCreate={handleCreateCategory}
                  onDelete={handleDeleteCategory}
                  itemNameKey="category_name"
                  itemIdKey="category_id"
                  defaultItemName="Sin Categoría"
                />
              </div>
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

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>DESCRIPCIÓN</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Especificaciones o notas adicionales (Opcional)"
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid var(--border-color)', color: '#fff', padding: '0.8rem', fontFamily: 'monospace', minHeight: '80px', resize: 'vertical' }}
              />
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
        <div className="table-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 1.5rem 0 1.5rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}><Database size={18} /> Directorio de Objetivos</h2>
            <input 
              type="text" 
              placeholder="Buscar objetivo, modelo o P/N..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '300px', background: '#0a0a0a', border: '1px solid var(--border-color)', color: '#fff', padding: '0.6rem 1rem', borderRadius: '4px', fontFamily: 'monospace' }}
            />
          </div>
          <table className="sharp-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} style={{cursor: 'pointer', userSelect: 'none'}}>
                  ID {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('name')} style={{cursor: 'pointer', userSelect: 'none'}}>
                  OBJETIVO / BÚSQUEDA {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('brand')} style={{cursor: 'pointer', userSelect: 'none'}}>
                  MARCA {sortConfig?.key === 'brand' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('category')} style={{cursor: 'pointer', userSelect: 'none'}}>
                  CATEGORÍA {sortConfig?.key === 'category' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('model')} style={{cursor: 'pointer', userSelect: 'none'}}>
                  MODELO {sortConfig?.key === 'model' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('part')} style={{cursor: 'pointer', userSelect: 'none'}}>
                  PART NUMBER {sortConfig?.key === 'part' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos...</td></tr>
              ) : sortedProducts.map((prod) => (
                <tr key={prod.product_id} style={{ background: editingId === prod.product_id ? 'rgba(0, 240, 255, 0.05)' : 'transparent' }}>
                  <td style={{ color: 'var(--text-secondary)' }}>#{prod.product_id}</td>
                  <td style={{ fontWeight: 'bold' }}>{prod.product_name}</td>
                  <td>{prod.brand?.brand_name || 'N/A'}</td>
                  <td>{prod.category?.category_name || 'N/A'}</td>
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
                        onClick={() => handleDeleteProduct(prod.product_id, prod.product_name)}
                        className="sharp-btn danger" 
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
