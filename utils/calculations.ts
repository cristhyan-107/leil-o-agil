
import { Property, Costs } from '../types';

export const sumCosts = (costs: Costs): number => {
  return Object.values(costs).reduce((acc, cost) => acc + (cost || 0), 0);
};

export const calculateProjectedProfit = (property: Property): number => {
  const totalInvestment = property.purchaseValue + sumCosts(property.expectedCosts);
  return property.estimatedSalePrice - totalInvestment;
};

export const calculateActualProfit = (property: Property): number | null => {
  if (property.actualSalePrice === null || property.actualSalePrice === 0) {
    return null;
  }
  const totalInvestment = property.purchaseValue + sumCosts(property.executedCosts);
  return property.actualSalePrice - totalInvestment;
};

export const calculateProjectedROI = (property: Property): number => {
  const totalInvestment = property.purchaseValue + sumCosts(property.expectedCosts);
  if (totalInvestment === 0) return 0;
  const projectedProfit = calculateProjectedProfit(property);
  return (projectedProfit / totalInvestment) * 100;
};

export const calculateActualROI = (property: Property): number | null => {
  if (property.actualSalePrice === null || property.actualSalePrice === 0) {
    return null;
  }
  const totalInvestment = property.purchaseValue + sumCosts(property.executedCosts);
  if (totalInvestment === 0) return 0;
  const actualProfit = calculateActualProfit(property);
  if (actualProfit === null) return null;
  return (actualProfit / totalInvestment) * 100;
};

export const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '0.00%';
    return `${value.toFixed(2)}%`;
}
