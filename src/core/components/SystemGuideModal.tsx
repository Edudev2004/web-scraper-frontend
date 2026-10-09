import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Target, 
  ShieldCheck, 
  DollarSign, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Tag, 
  Cpu, 
  Zap 
} from 'lucide-react';

interface SystemGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemGuideModal: React.FC<SystemGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'condition' | 'currency' | 'workflow'>('search');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="sharp-panel"
          style={{
            width: '100%',
            maxWidth: '850px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            border: '1px solid var(--accent)',
            boxShadow: '0 0 35px rgba(0, 240, 255, 0.2)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER DEL MODAL */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #222',
            background: 'linear-gradient(90deg, #0a0a0a 0%, #111 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BookOpen size={22} color="var(--accent)" />
              <div>
                <h2 style={{ fontSize: '1.1rem', margin: 0, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff' }}>
                  Guía del Sistema & Recomendaciones
                </h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Aprende a configurar búsquedas precisas, filtrar calidad y entender precios
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                padding: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
            >
              <X size={20} />
            </button>
          </div>

          {/* NAVEGACIÓN POR PESTAÑAS */}
          <div style={{
            display: 'flex',
            background: '#080808',
            borderBottom: '1px solid #1f1f1f',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => setActiveTab('search')}
              style={{
                flex: 1,
                padding: '0.85rem 1rem',
                background: activeTab === 'search' ? '#141414' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'search' ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === 'search' ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Target size={16} /> 1. Objetivos & Búsqueda
            </button>
            <button
              onClick={() => setActiveTab('condition')}
              style={{
                flex: 1,
                padding: '0.85rem 1rem',
                background: activeTab === 'condition' ? '#141414' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'condition' ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === 'condition' ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <ShieldCheck size={16} /> 2. Solo Productos Nuevos
            </button>
            <button
              onClick={() => setActiveTab('currency')}
              style={{
                flex: 1,
                padding: '0.85rem 1rem',
                background: activeTab === 'currency' ? '#141414' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'currency' ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === 'currency' ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <DollarSign size={16} /> 3. Divisas & Tipo de Cambio
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              style={{
                flex: 1,
                padding: '0.85rem 1rem',
                background: activeTab === 'workflow' ? '#141414' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'workflow' ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === 'workflow' ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <ExternalLink size={16} /> 4. Ofertas Directas
            </button>
          </div>

          {/* CONTENIDO SCROLLEABLE */}
          <div style={{
            padding: '1.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            color: '#ccc'
          }}>

            {/* TAB 1: BÚSQUEDA Y CAMPOS */}
            {activeTab === 'search' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff' }}>
                  <Tag size={18} color="var(--accent)" />
                  <h3 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    ¿Cómo llenar los campos para una búsqueda perfecta?
                  </h3>
                </div>

                <p style={{ margin: 0 }}>
                  Para evitar falsos positivos o que el bot traiga cables, adaptadores o modelos incorrectos, cada campo tiene un rol específico:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {/* Card Término */}
                  <div style={{ background: '#111', border: '1px solid #282828', padding: '1rem', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                      <Tag size={15} /> 1. Término / Nombre
                    </div>
                    <div style={{ color: '#bbb', fontSize: '0.8rem', marginBottom: '0.6rem' }}>
                      El tipo de equipo y descripción visual.
                    </div>
                    <div style={{ background: '#0a0a0a', padding: '0.5rem', borderRadius: '3px', fontSize: '0.75rem', borderLeft: '3px solid var(--accent)' }}>
                      <strong>¿Qué poner aquí?</strong><br/>
                      • Tipo de equipo (<em>Switch, Router, Gabinete</em>)<br/>
                      • <strong>Color</strong> (<em>Blanco, Negro</em>)<br/>
                      • Unidades de Rack <strong>RU</strong> (<em>1U, 2U, 42U</em>)<br/>
                      <em>Ejemplo:</em> Switch 48 Puertos PoE+ 1U
                    </div>
                  </div>

                  {/* Card Modelo */}
                  <div style={{ background: '#111', border: '1px solid #282828', padding: '1rem', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                      <Layers size={15} /> 2. Modelo (Serie)
                    </div>
                    <div style={{ color: '#bbb', fontSize: '0.8rem', marginBottom: '0.6rem' }}>
                      La familia o serie general del producto.
                    </div>
                    <div style={{ background: '#0a0a0a', padding: '0.5rem', borderRadius: '3px', fontSize: '0.75rem', borderLeft: '3px solid #888' }}>
                      <strong>Función en el escáner:</strong><br/>
                      El bot exige que la publicación de la tienda contenga esta serie para ser válida.<br/>
                      <em>Ejemplo Cisco:</em> <code>C9200-48P</code><br/>
                      <em>Ejemplo MikroTik:</em> <code>RB750Gr3</code>
                    </div>
                  </div>

                  {/* Card Part Number */}
                  <div style={{ background: '#111', border: '1px solid #282828', padding: '1rem', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--alert-green)', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                      <Cpu size={15} /> 3. Part Number (P/N)
                    </div>
                    <div style={{ color: '#bbb', fontSize: '0.8rem', marginBottom: '0.6rem' }}>
                      Código de catálogo oficial / SKU único del fabricante.
                    </div>
                    <div style={{ background: '#0a0a0a', padding: '0.5rem', borderRadius: '3px', fontSize: '0.75rem', borderLeft: '3px solid var(--alert-green)' }}>
                      <strong>Identifica la versión exacta de hardware:</strong><br/>
                      • <strong>Aplica a cualquier tipo de equipo</strong>: En laptops define el procesador/RAM/disco; en servidores define la controladora/fuentes; en switches define puertos/PoE/uplinks.<br/>
                      • <em>Ejemplos:</em> <code>C9200L-48P-4X-E</code> (Switch Cisco), <code>RB750Gr3</code> (Router MikroTik), <code>21DD001WLM</code> (Laptop Lenovo).<br/>
                      • <u>Regla de oro</u>: Escribe solo el código alfanumérico tal como viene en la ficha técnica (sin agregar adjetivos en español).
                    </div>
                  </div>
                </div>

                {/* CUADRO DE RECOMENDACIÓN CLAVE */}
                <div style={{ background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.25)', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                    <Zap size={16} /> Resumen: ¿Dónde va cada especificación?
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                    <li><strong>Atributos Físicos (Color, RU, Medidas):</strong> Van en el <strong>Término de Búsqueda</strong> (ej. <em>"Gabinete de Pared 9U Negro"</em>, <em>"Access Point Blanco Wi-Fi 6"</em>).</li>
                    <li><strong>Familia o Serie:</strong> Va en el <strong>Modelo</strong> (ej. <em>"C9200"</em>, <em>"ThinkPad E14"</em>, <em>"PowerEdge R750"</em>).</li>
                    <li><strong>Especificaciones Técnicas Exactas:</strong> Las determina el <strong>Part Number (P/N)</strong> de fábrica. No tienes que escribir a mano "con PoE", "con i7" o "con 48 puertos" en el P/N, porque el código del fabricante ya representa toda esa configuración exacta.</li>
                    <li><strong>¿Y si no hay P/N?</strong> En accesorios genéricos, gabinetes o cables sin código oficial de catálogo, deja el campo <em>Part Number</em> vacío; el bot buscará con el Término y Modelo.</li>
                  </ul>
                </div>
              </>
            )}

            {/* TAB 2: PRODUCTOS NUEVOS */}
            {activeTab === 'condition' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff' }}>
                  <ShieldCheck size={18} color="var(--alert-green)" />
                  <h3 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Filtro de Condición: Estrictamente Productos Nuevos
                  </h3>
                </div>

                <p style={{ margin: 0 }}>
                  Para proyectos y cotizaciones serias, no se deben presentar precios de equipos usados o reacondicionados. El scraper implementa un doble escudo de validación:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', background: '#111', padding: '0.85rem', borderRadius: '4px', border: '1px solid #222' }}>
                    <CheckCircle2 size={20} color="var(--alert-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#fff' }}>1. Filtro Nativo en Tiendas:</strong><br/>
                      Tanto en Mercado Libre como en Amazon se inyectan los parámetros oficiales de condición <code>Nuevo / New</code> en cada solicitud de búsqueda.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', background: '#111', padding: '0.85rem', borderRadius: '4px', border: '1px solid #222' }}>
                    <CheckCircle2 size={20} color="var(--alert-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#fff' }}>2. Descarte por Inteligencia Textual:</strong><br/>
                      Aunque un vendedor marque una publicación como nueva, si en el título o descripción se detectan palabras como <em>"reacondicionado", "renewed", "refurbished", "de uso", "segunda mano", "open box"</em>, el bot la descarta inmediatamente.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', background: '#111', padding: '0.85rem', borderRadius: '4px', border: '1px solid #222' }}>
                    <CheckCircle2 size={20} color="var(--alert-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#fff' }}>3. Descarte de Repuestos Aislados:</strong><br/>
                      Si estás buscando un switch o router, el bot descarta automáticamente cables de consola, fuentes de poder sueltas, brackets de montaje o ventiladores de repuesto que suelen costar una fracción del precio real del equipo.
                    </div>
                  </div>
                </div>

                <div style={{ background: '#141414', borderLeft: '3px solid var(--alert-green)', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#bbb' }}>
                  💡 <strong>¿Qué pasa si no hay stock nuevo en la tienda?</strong><br/>
                  El scraper devolverá 0 ofertas para ese proveedor en lugar de traer un producto incorrecto o un precio falso. De esta manera, tus decisiones se basan en datos 100% confiables.
                </div>
              </>
            )}

            {/* TAB 3: DIVISAS Y TIPO DE CAMBIO */}
            {activeTab === 'currency' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff' }}>
                  <DollarSign size={18} color="var(--alert-green)" />
                  <h3 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Control de Divisas y Tipo de Cambio Editable
                  </h3>
                </div>

                <p style={{ margin: 0 }}>
                  Diferentes proveedores publican en monedas distintas: Mercado Libre Perú suele publicar en Soles (PEN) y a veces en Dólares (USD), mientras que Amazon lo hace en Dólares (USD).
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: '#111', padding: '1rem', borderRadius: '4px', border: '1px solid #222' }}>
                    <div style={{ color: '#ffb74d', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                      🪙 Precio Original
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                      Se conserva tal como fue publicado en la tienda con su símbolo oficial (<code>S/</code> o <code>US$</code>), garantizando transparencia total.
                    </div>
                  </div>

                  <div style={{ background: '#111', padding: '1rem', borderRadius: '4px', border: '1px solid #222' }}>
                    <div style={{ color: 'var(--alert-green)', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                      💵 Tipo de Cambio Dinámico
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                      En la barra superior de ofertas verás <code>$ 1 USD = [ 3.75 ] PEN</code>. Puedes hacer clic y editar ese valor según la tasa del día; todas las ofertas en Soles se recalcularán a USD al instante.
                    </div>
                  </div>

                  <div style={{ background: '#111', padding: '1rem', borderRadius: '4px', border: '1px solid #222' }}>
                    <div style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                      👁️ Modos de Vista
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                      Usa los botones <strong>AMBOS</strong>, <strong>EN USD ($)</strong> u <strong>ORIGINAL</strong> para comparar cotizaciones en la moneda que más te convenga para tu informe.
                    </div>
                  </div>
                </div>

                <div style={{ background: '#141414', borderLeft: '3px solid var(--accent)', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#bbb' }}>
                  ⚙️ <strong>Persistencia local:</strong> La tasa de cambio que ingreses se guarda automáticamente en tu navegador para que no tengas que escribirla cada vez que entres al sistema.
                </div>
              </>
            )}

            {/* TAB 4: OFERTAS DIRECTAS */}
            {activeTab === 'workflow' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff' }}>
                  <ExternalLink size={18} color="var(--accent)" />
                  <h3 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Navegación Directa: Botón "VER OFERTA"
                  </h3>
                </div>

                <p style={{ margin: 0 }}>
                  Anteriormente, al hacer clic en un enlace podías ser redirigido a una página de resultados genérica con docenas de artículos donde no sabías cuál era el precio capturado.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ background: '#111', padding: '0.85rem', borderRadius: '4px', border: '1px solid #222' }}>
                    <strong style={{ color: '#fff' }}>🛒 Enlaces directos al producto:</strong>
                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.3rem' }}>
                      El botón <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>VER OFERTA</span> te lleva directamente a la ficha del producto específico (con su código ASIN en Amazon o publicación MPE en Mercado Libre), donde verificarás exactamente el precio registrado.
                    </div>
                  </div>

                  <div style={{ background: '#111', padding: '0.85rem', borderRadius: '4px', border: '1px solid #222' }}>
                    <strong style={{ color: '#fff' }}>⚡ Ejecución manual con "Ejecutar Scraper":</strong>
                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.3rem' }}>
                      En el Monitor Central puedes presionar el botón <strong>Ejecutar Scraper</strong> en cualquier momento. El motor consultará en paralelo todos los proveedores activos y actualizará la lista de oportunidades automáticamente en segundos.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                  <button 
                    onClick={onClose}
                    className="sharp-btn"
                    style={{ padding: '0.6rem 2rem' }}
                  >
                    ENTENDIDO, VOLVER AL SISTEMA
                  </button>
                </div>
              </>
            )}

          </div>

          {/* FOOTER DEL MODAL */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.75rem',
            borderTop: '1px solid #1f1f1f',
            background: '#090909',
            fontSize: '0.75rem',
            color: '#777'
          }}>
            <div>
              💡 <em>Tip: Puedes abrir esta guía en cualquier momento desde el botón superior de ayuda.</em>
            </div>
            <button
              onClick={onClose}
              className="sharp-btn"
              style={{ padding: '0.35rem 1rem', fontSize: '0.75rem' }}
            >
              CERRAR
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
