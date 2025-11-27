
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropertyForm from '../components/properties/PropertyForm';
import { useData } from '../context/DataContext';
import { Property } from '../types';

const EditPropertyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getPropertyById, updateProperty } = useData();
    const navigate = useNavigate();

    const property = getPropertyById(id || '');

    const handleSubmit = async (data: Omit<Property, 'id' | 'userId' | 'createdAt'>) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            await updateProperty(id, data);
            navigate(`/properties/${id}`);
        } catch (error) {
            console.error("Failed to update property", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!property) {
        return <div>Carregando dados do imóvel...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Editar Imóvel</h2>
            <PropertyForm property={property} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
};

export default EditPropertyPage;
