
export enum PropertyType {
  APARTMENT = 'Apartamento',
  HOUSE = 'Casa',
  COMMERCIAL = 'Sala Comercial',
  LAND = 'Terreno',
}

export enum PropertySituation {
  OCCUPIED = 'Ocupado',
  UNOCCUPIED = 'Desocupado',
}

export enum PropertyStatus {
  ANALYSIS = 'Em análise',
  RENOVATION = 'Em reforma',
  VACATING = 'Ocupação / desocupação',
  FOR_SALE = 'À venda',
  SOLD = 'Vendido',
}

export interface Costs {
  reform: number;
  legal: number;
  itbi: number;
  deed: number;
  vacating: number;
  extra: number;
}

export interface Property {
  id: string;
  userId: string;
  title: string;
  address: string;
  type: PropertyType;
  auctionNoticeNumber: string;
  auctioneer: string;
  auctionLink: string;
  auctionDate: string;
  situation: PropertySituation;
  
  purchaseValue: number;
  evaluationValue: number;

  expectedCosts: Costs;
  executedCosts: Costs;

  estimatedSalePrice: number;
  actualSalePrice: number | null;
  
  status: PropertyStatus;
  createdAt: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum SubscriptionPlan {
  BASIC = 'Básico',
  PRO = 'Pro',
  PREMIUM = 'Premium',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subscriptionPlan: SubscriptionPlan;
  createdAt: string;
}
