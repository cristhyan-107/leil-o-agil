
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Property, PropertyStatus } from '../types';
import { formatCurrency, calculateProjectedROI } from '../utils/calculations';

const PropertyRow: React.FC<{ property: Property }> = ({ property }) => {
  const getStatusClass = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.SOLD: return 'bg-green-100 text-green-800';
      case PropertyStatus.FOR_SALE: return 'bg-blue-100 text-blue-800';
      case PropertyStatus.RENOVATION: return 'bg-yellow-100 text-yellow-800';
      case PropertyStatus.ANALYSIS: return 'bg-gray-100 text-gray-800';
      default: return 'bg-indigo-100 text-indigo-800';
    }
  };
  return (
    <tr className="border-b border-border hover:bg-secondary">
      <td className="py-3 px-4 text-sm text-text-primary font-medium">
        <Link to={`/properties/${property.id}`} className="hover:text-primary">{property.title}</Link>
      </td>
      <td className="py-3 px-4 text-sm text-text-secondary">{property.type}</td>
      <td className="py-3 px-4 text-sm text-text-secondary">{formatCurrency(property.purchaseValue)}</td>
      <td className="py-3 px-4 text-sm font-semibold text-green-600">{formatCurrency(calculateProjectedROI(property))}%</td>
      <td className="py-3 px-4 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(property.status)}`}>
          {property.status}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-text-secondary">{new Date(property.auctionDate).toLocaleDateString('pt-BR')}</td>
    </tr>
  );
};

const PropertiesPage: React.FC = () => {
  const { properties, loading } = useData();
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const statusMatch = statusFilter === 'all' || p.status === statusFilter;
      const dateMatch = dateFilter === '' || new Date(p.auctionDate) >= new Date(dateFilter);
      return statusMatch && dateMatch;
    });
  }, [properties, statusFilter, dateFilter]);

  if (loading) return <div>Carregando imóveis...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-text-primary">Meus Imóveis</h2>
        <Link to="/properties/new">
          <Button>
            <Plus size={16} className="mr-2" />
            Adicionar Imóvel
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex items-center space-x-4 mb-4 p-4 bg-secondary rounded-lg">
          <Filter size={20} className="text-text-secondary" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | 'all')}
            className="bg-white border border-border rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="all">Todos os Status</option>
            {Object.values(PropertyStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-white border border-border rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="border-b border-border bg-gray-50">
                <tr>
                <th className="py-2 px-4 text-xs font-semibold uppercase text-text-secondary">Título</th>
                <th className="py-2 px-4 text-xs font-semibold uppercase text-text-secondary">Tipo</th>
                <th className="py-2 px-4 text-xs font-semibold uppercase text-text-secondary">Valor Pago</th>
                <th className="py-2 px-4 text-xs font-semibold uppercase text-text-secondary">ROI Proj.</th>
                <th className="py-2 px-4 text-xs font-semibold uppercase text-text-secondary">Status</th>
                <th className="py-2 px-4 text-xs font-semibold uppercase text-text-secondary">Data do Leilão</th>
                </tr>
            </thead>
            <tbody>
                {filteredProperties.map(p => <PropertyRow key={p.id} property={p} />)}
            </tbody>
            </table>
        </div>
        {filteredProperties.length === 0 && <p className="text-center py-8 text-text-secondary">Nenhum imóvel encontrado.</p>}
      </Card>
    </div>
  );
};

export default PropertiesPage;
