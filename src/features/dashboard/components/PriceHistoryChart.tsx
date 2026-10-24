import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

interface DataPoint {
  fecha: string;
  precio: number;
}

interface Props {
  data: DataPoint[];
}

export const PriceHistoryChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="sharp-panel" style={{ height: '400px', marginBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-title" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>
        <Activity size={18} /> Análisis de Tendencia de Precios (USD)
      </div>
      
      <div style={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis 
              dataKey="fecha" 
              stroke="#555" 
              tick={{ fill: '#888', fontSize: 12 }} 
              tickMargin={10}
            />
            <YAxis 
              stroke="#555" 
              tick={{ fill: '#888', fontSize: 12 }} 
              tickFormatter={(value) => `$${value}`}
              domain={['auto', 'auto']}
              tickMargin={10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10, 10, 10, 0.95)', 
                borderColor: 'var(--accent)', 
                borderRadius: '4px',
                color: '#fff' 
              }}
              itemStyle={{ color: 'var(--alert-green)', fontWeight: 'bold' }}
              labelStyle={{ color: '#888', marginBottom: '5px' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Precio']}
            />
            <Line 
              type="monotone" 
              dataKey="precio" 
              stroke="var(--accent)" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#0a0a0a', stroke: 'var(--accent)', strokeWidth: 2 }} 
              activeDot={{ r: 6, fill: 'var(--accent)', stroke: '#fff' }} 
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};