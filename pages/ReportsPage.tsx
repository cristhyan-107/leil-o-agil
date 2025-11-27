import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
// FIX: Added BarChart2 to lucide-react imports
import { BarChart2, Download } from 'lucide-react';

const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-text-primary">Relatórios</h2>
      <Card>
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <BarChart2 className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Página de Relatórios em Construção</h3>
            <p className="text-text-secondary max-w-md mb-6">
                Em breve, você poderá gerar relatórios comparativos, de lucratividade e exportar dados consolidados para Excel e Power BI.
            </p>
            <Button variant="secondary" disabled>
                <Download size={16} className="mr-2" />
                Exportar CSV/Excel (em breve)
            </Button>
            <div className="mt-4 text-sm text-text-secondary bg-secondary p-3 rounded-lg">
                <p className="font-semibold">API para Power BI:</p>
                <code>/api/export/properties</code>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;