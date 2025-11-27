
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/properties/PropertyForm';
import { useData } from '../context/DataContext';
import { Property } from '../types';

const AddPropertyPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addProperty } = useData();
    const navigate = useNavigate();

    const handleSubmit = async (data: Omit<Property, 'id' | 'userId' | 'createdAt'>) => {
        setIsSubmitting(true);
        try {
            await addProperty(data);
            navigate('/properties');
        } catch (error) {
            console.error("Failed to add property", error);
            // Here you would show an error message to the user
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Adicionar Novo Imóvel</h2>
            <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
};

export default AddPropertyPage;
