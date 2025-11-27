import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Edit, BarChart, Download, Bot } from 'lucide-react';
import { formatCurrency, formatPercentage, sumCosts, calculateProjectedProfit, calculateActualProfit, calculateProjectedROI, calculateActualROI } from '../utils/calculations';
import { PropertyStatus } from '../types';
import { generatePropertyAnalysis } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';


// FIX: Changed value prop type to React.ReactNode to correctly handle strings, numbers, and JSX elements.
const DetailItem: React.FC<{ label: string; value: React.ReactNode; isCurrency?: boolean }> = ({ label, value, isCurrency = false }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-text-secondary">{label}</dt>
        <dd className="mt-1 text-sm text-text-primary sm:mt-0 sm:col-span-2 font-semibold">
            {isCurrency ? formatCurrency(value as number) : value || '-'}
        </dd>
    </div>
);

const PropertyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getPropertyById } = useData();
    const [aiAnalysis, setAiAnalysis] = useState<string>('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const property = getPropertyById(id || '');

    if (!property) {
        return <div>Imóvel não encontrado.</div>;
    }
    
    const handleGenerateAnalysis = async () => {
        setIsAiLoading(true);
        const analysis = await generatePropertyAnalysis(property);
        setAiAnalysis(analysis);
        setIsAiLoading(false);
    };

    const expectedCostTotal = sumCosts(property.expectedCosts);
    const executedCostTotal = sumCosts(property.executedCosts);
    const projectedProfit = calculateProjectedProfit(property);
    const actualProfit = calculateActualProfit(property);
    const projectedROI = calculateProjectedROI(property);
    const actualROI = calculateActualROI(property);
    const discount = ((property.evaluationValue - property.purchaseValue) / property.evaluationValue) * 100;
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">{property.title}</h2>
                    <p className="text-text-secondary">{property.address}</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="secondary"><Download size={16} className="mr-2" /> Gerar PDF</Button>
                    <Link to={`/properties/${id}/edit`}>
                        <Button><Edit size={16} className="mr-2" /> Editar</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-3 mb-3">Informações Gerais</h3>
                    <dl className="divide-y divide-border">
                        <DetailItem label="Tipo de Imóvel" value={property.type} />
                        <DetailItem label="Status" value={property.status} />
                        <DetailItem label="Situação" value={property.situation} />
                        <DetailItem label="Leiloeiro" value={property.auctioneer} />
                        <DetailItem label="Data do Leilão" value={new Date(property.auctionDate).toLocaleDateString('pt-BR')} />
                        <DetailItem label="Edital" value={property.auctionNoticeNumber} />
                        <DetailItem label="Link do Leilão" value={<a href={property.auctionLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{property.auctionLink}</a>} />
                    </dl>
                </Card>
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-text-primary mb-3">Análise IA Gemini</h3>
                        {aiAnalysis ? (
                            <div className="prose prose-sm text-text-primary max-w-none"><ReactMarkdown>{aiAnalysis}</ReactMarkdown></div>
                        ) : (
                            <p className="text-sm text-text-secondary">Clique no botão para gerar uma análise de investimento com inteligência artificial.</p>
                        )}
                        <Button onClick={handleGenerateAnalysis} disabled={isAiLoading} className="w-full mt-4">
                            <Bot size={16} className="mr-2"/>
                            {isAiLoading ? 'Analisando...' : 'Gerar Análise'}
                        </Button>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-3 mb-3">Resumo Financeiro</h3>
                        <dl>
                           <DetailItem label="Lucro Projetado" value={formatCurrency(projectedProfit)} />
                           <DetailItem label="Lucro Real" value={property.status === PropertyStatus.SOLD ? formatCurrency(actualProfit) : 'N/A'} />
                           <DetailItem label="ROI Projetado" value={formatPercentage(projectedROI)} />
                           <DetailItem label="ROI Real" value={property.status === PropertyStatus.SOLD ? formatPercentage(actualROI) : 'N/A'} />
                        </dl>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-3 mb-3">Valores</h3>
                    <dl className="divide-y divide-border">
                        <DetailItem label="Valor de Avaliação" value={property.evaluationValue} isCurrency />
                        <DetailItem label="Valor Pago no Leilão" value={property.purchaseValue} isCurrency />
                        <DetailItem label="Desconto" value={`${discount.toFixed(2)}%`} />
                        <DetailItem label="Preço de Venda Estimado" value={property.estimatedSalePrice} isCurrency />
                        <DetailItem label="Preço de Venda Real" value={property.actualSalePrice} isCurrency />
                    </dl>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-3 mb-3">Custos</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-text-primary">Previstos</h4>
                            <dl className="text-sm">
                                {/* FIX: Cast value to number as Object.entries may infer it as 'unknown'. */}
                                {Object.entries(property.expectedCosts).map(([key, value]) => <DetailItem key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={formatCurrency(value as number)} />)}
                                <DetailItem label="Total Previsto" value={formatCurrency(expectedCostTotal)} />
                            </dl>
                        </div>
                        <div>
                             <h4 className="font-semibold text-text-primary">Executados</h4>
                            <dl className="text-sm">
                                {/* FIX: Cast value to number as Object.entries may infer it as 'unknown'. */}
                                {Object.entries(property.executedCosts).map(([key, value]) => <DetailItem key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={formatCurrency(value as number)} />)}
                                <DetailItem label="Total Executado" value={formatCurrency(executedCostTotal)} />
                            </dl>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PropertyDetailPage;