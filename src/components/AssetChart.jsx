import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const TYPE_COLORS = {
  stock: '#2563eb',
  bond: '#10b981',
  crypto: '#f59e0b'
};

function formatCurrency(value) {
  if (value == null || Number.isNaN(value)) return '$0';
  return `$${Number(value).toLocaleString()}`;
}

function AssetChart({ assets = [], prices = {}, variant = 'pie', height = 320 }) {
  const pieData = useMemo(() => {
    const sums = { stock: 0, bond: 0, crypto: 0 };
    assets.forEach((asset) => {
      const price = prices[asset.id] ?? asset.purchasePrice ?? 0;
      const currentValue = Number(price) * Number(asset.quantity ?? 0);
      const key = (asset.type || 'stock').toLowerCase();
      if (key in sums) sums[key] += currentValue;
    });
    return Object.entries(sums)
      .map(([type, value]) => ({ name: type.charAt(0).toUpperCase() + type.slice(1), type, value }))
      .filter((d) => d.value > 0);
  }, [assets, prices]);

  const barData = useMemo(() => {
    return assets.map((asset) => {
      const price = prices[asset.id] ?? asset.purchasePrice ?? 0;
      const currentValue = Number(price) * Number(asset.quantity ?? 0);
      const invested = Number(asset.amountInvested ?? (asset.purchasePrice ?? 0) * (asset.quantity ?? 0));
      return {
        name: asset.name,
        invested,
        current: currentValue
      };
    });
  }, [assets, prices]);

  if ((variant === 'pie' && pieData.length === 0) || (variant !== 'pie' && barData.length === 0)) {
    return <div style={{ textAlign: 'center', color: '#6b7280', padding: '8px 0' }}>No data to display</div>;
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        {variant === 'pie' ? (
          <PieChart>
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend />
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {pieData.map((entry) => (
                <Cell key={entry.type} fill={TYPE_COLORS[entry.type] || '#94a3b8'} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-10} height={40} textAnchor="end" />
            <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend />
            <Bar dataKey="invested" name="Invested" fill="#94a3b8" />
            <Bar dataKey="current" name="Current Value" fill="#22c55e" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default AssetChart;
