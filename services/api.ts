import { Property, User, UserRole, SubscriptionPlan, PropertyType, PropertySituation, PropertyStatus } from '../types';

// Simulação de um banco de dados de usuários. Começa com um admin.
let mockUsers: User[] = [
  { id: 'user-admin', name: 'Admin', email: 'admin@leilao.com', role: UserRole.ADMIN, subscriptionPlan: SubscriptionPlan.PRO, createdAt: new Date().toISOString() },
];

let mockProperties: Property[] = [
    {
        id: 'prop-1',
        userId: 'user-1', // Propriedade de um usuário de exemplo que será criado
        title: 'Apartamento em Copacabana',
        address: 'Av. Atlântica, 1702, Rio de Janeiro, RJ',
        type: PropertyType.APARTMENT,
        auctionNoticeNumber: '2024/001',
        auctioneer: 'Leilões & Cia',
        auctionLink: 'http://example.com/leilao1',
        auctionDate: '2024-05-10',
        situation: PropertySituation.OCCUPIED,
        purchaseValue: 250000,
        evaluationValue: 400000,
        expectedCosts: { reform: 30000, legal: 15000, itbi: 7500, deed: 2500, vacating: 10000, extra: 5000 },
        executedCosts: { reform: 35000, legal: 14000, itbi: 7500, deed: 2600, vacating: 12000, extra: 4000 },
        estimatedSalePrice: 450000,
        actualSalePrice: 480000,
        status: PropertyStatus.SOLD,
        createdAt: '2024-05-11T10:00:00Z',
    },
    {
        id: 'prop-2',
        userId: 'user-1',
        title: 'Casa no Morumbi',
        address: 'Rua dos Bobos, 0, São Paulo, SP',
        type: PropertyType.HOUSE,
        auctionNoticeNumber: '2024/002',
        auctioneer: 'Lance Certo',
        auctionLink: 'http://example.com/leilao2',
        auctionDate: '2024-06-15',
        situation: PropertySituation.UNOCCUPIED,
        purchaseValue: 600000,
        evaluationValue: 900000,
        expectedCosts: { reform: 80000, legal: 25000, itbi: 18000, deed: 4000, vacating: 0, extra: 10000 },
        executedCosts: { reform: 0, legal: 0, itbi: 0, deed: 0, vacating: 0, extra: 0 },
        estimatedSalePrice: 1100000,
        actualSalePrice: null,
        status: PropertyStatus.RENOVATION,
        createdAt: '2024-06-16T11:00:00Z',
    },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Funções de Autenticação ---
export const signUpUser = async (name: string, email: string, pass: string): Promise<User> => {
    await simulateDelay(500);
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        throw new Error('Este e-mail já está cadastrado.');
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: UserRole.USER,
        subscriptionPlan: SubscriptionPlan.BASIC, // Todo novo usuário começa no plano básico
        createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    
    // Para demonstração, vamos adicionar imóveis de exemplo ao primeiro usuário que se cadastrar.
    if(mockUsers.filter(u => u.role === UserRole.USER).length === 1) {
       const prop1 = mockProperties.find(p => p.id === 'prop-1');
       const prop2 = mockProperties.find(p => p.id === 'prop-2');
       if(prop1) prop1.userId = newUser.id;
       if(prop2) prop2.userId = newUser.id;
    }

    return newUser;
}

export const loginUser = async (email: string, pass: string): Promise<User | null> => {
    await simulateDelay(500);
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    // Em um app real, aqui haveria a verificação da senha com hash.
    if (user) {
        return user;
    }
    return null;
}
// --- Fim das Funções de Autenticação ---


export const getAllUsers = async (): Promise<User[]> => {
    await simulateDelay(500);
    return mockUsers;
}

export const getPropertiesForUser = async (userId: string): Promise<Property[]> => {
    await simulateDelay(1000);
    return mockProperties.filter(p => p.userId === userId);
};

export const getAllProperties = async (): Promise<Property[]> => {
    await simulateDelay(1000);
    return mockProperties;
};

export const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'> & { userId: string }): Promise<Property> => {
    await simulateDelay(500);
    const newProperty: Property = {
        ...propertyData,
        id: `prop-${Date.now()}`,
        createdAt: new Date().toISOString(),
    };
    mockProperties.push(newProperty);
    return newProperty;
};

export const updateProperty = async (propertyId: string, updates: Partial<Property>): Promise<Property | undefined> => {
    await simulateDelay(500);
    const propertyIndex = mockProperties.findIndex(p => p.id === propertyId);
    if (propertyIndex !== -1) {
        mockProperties[propertyIndex] = { ...mockProperties[propertyIndex], ...updates };
        return mockProperties[propertyIndex];
    }
    return undefined;
};