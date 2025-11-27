
import React from 'react';
import { DollarSign, Percent, TrendingUp, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import { useData } from '../context/DataContext';
import { calculateActualProfit, calculateActualROI, calculateProjectedProfit, calculateProjectedROI, formatCurrency, sumCosts } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { PropertyStatus } from '../types';

const KpiCard: React.FC<{ title: string; value: string; icon: React.ElementType, change?: string, changeColor?: string }> = ({ title, value, icon: Icon, change, changeColor }) => (
  <Card>
    <div className="flex items-center">
      <div className="p-3 bg-secondary rounded-lg">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="ml-4">
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-2xl font-semibold text-text-primary">{value}</p>
      </div>
    </div>
    {change && (
        <p className={`text-xs mt-2 ${changeColor}`}>
            {change}
        </p>
    )}
  </Card>
);

const DashboardPage: React.FC = () => {
  const { properties, loading } = useData();

  if (loading) {
    return <div>Carregando dados do dashboard...</div>;
  }
  
  const soldProperties = properties.filter(p => p.status === PropertyStatus.SOLD);
  
  const totalProjectedProfit = properties.reduce((acc, p) => acc + calculateProjectedProfit(p), 0);
  const totalActualProfit = soldProperties.reduce((acc, p) => acc + (calculateActualProfit(p) || 0), 0);

  const avgProjectedROI = properties.length > 0 ? properties.reduce((acc, p) => acc + calculateProjectedROI(p), 0) / properties.length : 0;
  const avgActualROI = soldProperties.length > 0 ? soldProperties.reduce((acc, p) => acc + (calculateActualROI(p) || 0), 0) / soldProperties.length : 0;

  const totalExpectedCost = properties.reduce((acc, p) => acc + sumCosts(p.expectedCosts), 0);
  const totalExecutedCost = properties.reduce((acc, p) => acc + sumCosts(p.executedCosts), 0);

  const statusCounts = properties.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<PropertyStatus, number>);

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  const barChartData = properties.map(p => ({
      name: p.title.substring(0, 15) + '...',
      'Lucro Projetado': calculateProjectedProfit(p),
      'Lucro Real': p.status === PropertyStatus.SOLD ? calculateActualProfit(p) : 0,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Lucro Total Acumulado" value={formatCurrency(totalActualProfit)} icon={DollarSign} change={`Projetado: ${formatCurrency(totalProjectedProfit)}`} changeColor="text-gray-500" />
        <KpiCard title="ROI Médio Real" value={`${avgActualROI.toFixed(2)}%`} icon={Percent} change={`Projetado: ${avgProjectedROI.toFixed(2)}%`} changeColor="text-gray-500" />
        <KpiCard title="Custo Previsto vs Executado" value={formatCurrency(totalExecutedCost)} icon={TrendingUp} change={`Previsto: ${formatCurrency(totalExpectedCost)}`} changeColor="text-gray-500" />
        <KpiCard title="Tempo Médio de Revenda" value="120 dias" icon={Clock} change="Meta: 90 dias" changeColor="text-green-500" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Comparativo de Lucro por Imóvel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" stroke="#6E6E73" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6E6E73" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${formatCurrency(value as number).replace('R$', 'R$ ')}`} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend wrapperStyle={{fontSize: "14px"}}/>
              <Bar dataKey="Lucro Projetado" fill="#A8D5FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Lucro Real" fill="#007AFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Status dos Imóveis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

    </div>
  );
};

export default DashboardPage;
