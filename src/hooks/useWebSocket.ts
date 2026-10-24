import { useState, useEffect } from 'react';

export interface AlertaWS {
  id: number;
  product_id: number;
  tipo_evento: string; // 'caida_precio' o 're_stock'
  valor_detectado: number;
  fecha_evento: string;
  producto_nombre: string;
}

export const useWebSocket = (url: string) => {
  const [alertas, setAlertas] = useState<AlertaWS[]>([]);
  const [isWsConnected, setIsWsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => setIsWsConnected(true);
    
    ws.onmessage = (event) => {
      try {
        const nuevaAlerta = JSON.parse(event.data);
        setAlertas((prev) => [nuevaAlerta, ...prev]);
      } catch (error) {
        console.error("Error parseando alerta WS:", error);
      }
    };

    ws.onclose = () => setIsWsConnected(false);

    return () => ws.close();
  }, [url]);

  const limpiarAlertas = () => setAlertas([]);

  return { alertas, isWsConnected, limpiarAlertas };
};