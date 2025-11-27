
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, User, Property } from '../types';
import { getAllUsers, getAllProperties } from '../services/api';
import Card from '../components/ui/Card';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.role === UserRole.ADMIN) {
        try {
          const [allUsers, allProperties] = await Promise.all([
            getAllUsers(),
            getAllProperties(),
          ]);
          setUsers(allUsers);
          setProperties(allProperties);
        } catch (error) {
          console.error("Failed to fetch admin data", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  if (user?.role !== UserRole.ADMIN) {
    return <div>Acesso negado. Esta página é apenas para administradores.</div>;
  }

  if (loading) {
    return <div>Carregando dados do administrador...</div>;
  }
  
  const getPropertyCount = (userId: string) => {
      return properties.filter(p => p.userId === userId).length;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-text-primary">Painel do Administrador</h2>
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Gerenciamento de Usuários</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-xs font-semibold uppercase text-text-secondary">Nome</th>
                <th className="py-2 px-4 text-xs font-semibold uppercase text-text-secondary">Email</th>
                <th className="py-2 px-4 text-xs font-semibold uppercase text-text-secondary">Plano</th>
                <th className="py-2 px-4 text-xs font-semibold uppercase text-text-secondary">Imóveis Cadastrados</th>
                <th className="py-2 px-4 text-xs font-semibold uppercase text-text-secondary">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-secondary">
                  <td className="py-3 px-4 text-sm text-text-primary font-medium">{u.name}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{u.email}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{u.subscriptionPlan}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{getPropertyCount(u.id)}</td>
                  <td className="py-3 px-4 text-sm">
                    <button className="text-primary hover:underline text-sm">Desativar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminPage;
