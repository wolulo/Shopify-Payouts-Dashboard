import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

interface PaymentChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#22d3ee', '#f97316'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-dark p-3 rounded-lg shadow-lg border border-gray-700">
        <p className="text-text-primary">{payload[0].name}</p>
        <p className="text-accent-purple font-semibold">
          {`${payload[0].value.toFixed(1)}%`}
        </p>
      </div>
    );
  }
  return null;
};

export const PaymentChart: React.FC<PaymentChartProps> = ({ data }) => {
  return (
    <div className="bg-card-dark rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Payment Distribution</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-text-secondary">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};