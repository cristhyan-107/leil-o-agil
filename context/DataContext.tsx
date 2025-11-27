
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Property } from '../types';
import { getPropertiesForUser, addProperty as apiAddProperty, updateProperty as apiUpdateProperty } from '../services/api';
import { useAuth } from './AuthContext';

interface DataContextType {
  properties: Property[];
  loading: boolean;
  addProperty: (property: Omit<Property, 'id' | 'userId' | 'createdAt'>) => Promise<Property | undefined>;
  updateProperty: (propertyId: string, updates: Partial<Property>) => Promise<Property | undefined>;
  getPropertyById: (id: string) => Property | undefined;
  refetchProperties: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProperties = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const userProperties = await getPropertiesForUser(user.id);
        setProperties(userProperties);
      } catch (error) {
        console.error("Failed to fetch properties", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    } else {
      setProperties([]);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);
  
  const refetchProperties = useCallback(() => {
     fetchProperties();
  }, [fetchProperties]);

  const addProperty = async (propertyData: Omit<Property, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return undefined;
    
    const newProperty = await apiAddProperty({ ...propertyData, userId: user.id });
    setProperties(prev => [...prev, newProperty]);
    return newProperty;
  };

  const updateProperty = async (propertyId: string, updates: Partial<Property>) => {
    if(!user) return undefined;

    const updatedProperty = await apiUpdateProperty(propertyId, updates);
    if(updatedProperty) {
      setProperties(prev => prev.map(p => p.id === propertyId ? updatedProperty : p));
    }
    return updatedProperty;
  };
  
  const getPropertyById = (id: string): Property | undefined => {
    return properties.find(p => p.id === id);
  };

  return (
    <DataContext.Provider value={{ properties, loading, addProperty, updateProperty, getPropertyById, refetchProperties }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
