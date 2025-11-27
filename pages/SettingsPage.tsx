
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { SubscriptionPlan } from '../types';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-text-primary">Configurações</h2>
      
      <Card>
        <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-3 mb-4">Perfil</h3>
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-text-secondary">Nome</label>
                <p className="text-text-primary">{user?.name}</p>
            </div>
             <div>
                <label className="text-sm font-medium text-text-secondary">Email</label>
                <p className="text-text-primary">{user?.email}</p>
            </div>
             <Button variant="secondary">Editar Perfil</Button>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-3 mb-4">Assinatura</h3>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-text-primary">Seu plano atual é o <span className="font-bold text-primary">{user?.subscriptionPlan}</span>.</p>
                {user?.subscriptionPlan === SubscriptionPlan.BASIC && <p className="text-sm text-text-secondary">Limite de 5 imóveis.</p>}
                {user?.subscriptionPlan === SubscriptionPlan.PRO && <p className="text-sm text-text-secondary">Imóveis ilimitados.</p>}
            </div>
            <Button>Gerenciar Assinatura</Button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold">Básico</h4>
                <p className="text-sm text-text-secondary">5 imóveis</p>
                <p className="text-lg font-bold mt-2">R$ 29/mês</p>
            </div>
             <div className="p-4 border-2 border-primary rounded-lg relative">
                <span className="absolute top-0 -translate-y-1/2 bg-primary text-white px-2 py-0.5 text-xs font-bold rounded-full">Popular</span>
                <h4 className="font-semibold">Pro</h4>
                <p className="text-sm text-text-secondary">Imóveis ilimitados</p>
                <p className="text-lg font-bold mt-2">R$ 79/mês</p>
            </div>
             <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold">Premium</h4>
                <p className="text-sm text-text-secondary">Inclui consultoria</p>
                <p className="text-lg font-bold mt-2">R$ 199/mês</p>
            </div>
        </div>
      </Card>

    </div>
  );
};

export default SettingsPage;
