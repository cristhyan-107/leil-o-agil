
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, PropertyType, PropertySituation, PropertyStatus, Costs } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Card from '../ui/Card';

type PropertyFormData = Omit<Property, 'id' | 'userId' | 'createdAt'>;

interface PropertyFormProps {
    property?: Property;
    onSubmit: (data: PropertyFormData) => Promise<void>;
    isSubmitting: boolean;
}

const emptyCosts: Costs = { reform: 0, legal: 0, itbi: 0, deed: 0, vacating: 0, extra: 0 };
const emptyProperty: PropertyFormData = {
    title: '', address: '', type: PropertyType.APARTMENT,
    auctionNoticeNumber: '', auctioneer: '', auctionLink: '', auctionDate: '',
    situation: PropertySituation.UNOCCUPIED, purchaseValue: 0, evaluationValue: 0,
    expectedCosts: emptyCosts, executedCosts: emptyCosts,
    estimatedSalePrice: 0, actualSalePrice: null, status: PropertyStatus.ANALYSIS
};

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState<PropertyFormData>(property || emptyProperty);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>, costType: 'expectedCosts' | 'executedCosts', field: keyof Costs) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            [costType]: {
                ...prev[costType],
                [field]: parseFloat(value) || 0
            }
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const renderCostInputs = (costType: 'expectedCosts' | 'executedCosts') => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(emptyCosts) as Array<keyof Costs>).map(key => (
                 <Input key={`${costType}-${key}`} label={key.charAt(0).toUpperCase() + key.slice(1)} id={`${costType}-${key}`} type="number"
                    name={`${costType}.${key}`}
                    value={formData[costType][key]}
                    onChange={e => handleCostChange(e, costType, key)} />
            ))}
        </div>
    );
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <h3 className="text-lg font-semibold mb-4">Informações Gerais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Título do Imóvel" id="title" name="title" value={formData.title} onChange={handleChange} required />
                    <Input label="Endereço Completo" id="address" name="address" value={formData.address} onChange={handleChange} required />
                    <Select label="Tipo" id="type" name="type" value={formData.type} onChange={handleChange} >
                        {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                    <Select label="Situação" id="situation" name="situation" value={formData.situation} onChange={handleChange}>
                        {Object.values(PropertySituation).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                     <Select label="Status" id="status" name="status" value={formData.status} onChange={handleChange}>
                        {Object.values(PropertyStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                    <Input label="Número do Edital" id="auctionNoticeNumber" name="auctionNoticeNumber" value={formData.auctionNoticeNumber} onChange={handleChange} />
                    <Input label="Leiloeiro" id="auctioneer" name="auctioneer" value={formData.auctioneer} onChange={handleChange} />
                    <Input label="Link Oficial do Leilão" id="auctionLink" name="auctionLink" type="url" value={formData.auctionLink} onChange={handleChange} />
                    <Input label="Data do Leilão" id="auctionDate" name="auctionDate" type="date" value={formData.auctionDate} onChange={handleChange} required />
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold mb-4">Valores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input label="Valor Pago no Leilão" id="purchaseValue" name="purchaseValue" type="number" value={formData.purchaseValue} onChange={handleChange} required />
                    <Input label="Valor de Avaliação Judicial" id="evaluationValue" name="evaluationValue" type="number" value={formData.evaluationValue} onChange={handleChange} required />
                    <Input label="Preço de Venda Estimado" id="estimatedSalePrice" name="estimatedSalePrice" type="number" value={formData.estimatedSalePrice} onChange={handleChange} required />
                    <Input label="Preço de Venda Real" id="actualSalePrice" name="actualSalePrice" type="number" value={formData.actualSalePrice || ''} onChange={handleChange} />
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold mb-4">Custos Previstos</h3>
                    {renderCostInputs('expectedCosts')}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold mb-4">Custos Executados</h3>
                    {renderCostInputs('executedCosts')}
                </Card>
            </div>

            <div className="flex justify-end space-x-4">
                <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Imóvel'}</Button>
            </div>
        </form>
    );
};

export default PropertyForm;
