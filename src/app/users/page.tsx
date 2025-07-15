'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import UsersTable from '@/components/users/UsersTable';
import UserForm from '@/components/users/UserForm';
import { creditPurchaseService, CreditPackage } from '@/services/creditPurchaseService';
import { userService } from '@/services/userService';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';
import { User, UpdateUserDto, UserRole } from '@/types';

export default function UsersPage() {
  const { user, isAuthenticated } = useAuth();
  const isUser = user?.role === UserRole.USER;
  
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCreditPackages();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated, user]);

  const loadCreditPackages = async () => {
    try {
      const packages = await creditPurchaseService.getCreditPackages();
      setCreditPackages(packages);
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      
      if (isUser && user) {
        // Se for um usuário comum, carrega apenas seus próprios dados
        const userData = await userService.getUserById(user.id);
        setUsers([userData]);
      } else {
        // Se for admin, carrega todos os usuários
        const allUsers = await userService.getUsers();
        setUsers(allUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar dados dos usuários');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handlePurchaseClick = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
    setPurchaseStatus('idle');
    setError(null);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage || !user) return;

    setLoading(true);
    setPurchaseStatus('processing');
    setError(null);

    try {
      const purchaseData = {
        user_id: user.id,
        package_hours: selectedPackage.hours,
        payment_method: 'pix' as const,
        total_amount: selectedPackage.price
      };

      // Iniciar compra
      const purchase = await creditPurchaseService.initiatePurchase(purchaseData);
      
      // Confirmar pagamento imediatamente
      const result = await creditPurchaseService.confirmPayment(purchase.id);
      
      if (result.success) {
        setPurchaseStatus('success');
        toast.success(`Compra de ${selectedPackage.hours} horas realizada com sucesso!`);
        
        // Fechar modal após 2 segundos
        setTimeout(() => {
          setShowPurchaseModal(false);
          setSelectedPackage(null);
          setPurchaseStatus('idle');
        }, 2000);
      } else {
        setPurchaseStatus('error');
        setError(result.message);
        toast.error(result.message);
      }

    } catch (error: any) {
      setPurchaseStatus('error');
      const errorMessage = error.response?.data?.message || 'Erro ao processar compra';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowPurchaseModal(false);
    setSelectedPackage(null);
    setPurchaseStatus('idle');
    setError(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      return;
    }

    try {
      await userService.deleteUser(user.id);
      toast.success('Usuário excluído com sucesso');
      loadUsers(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const handleCreateUser = () => {
    // Implementar criação de usuário
    toast.success('Funcionalidade de criação será implementada em breve');
  };

  const handleSaveUser = async (userData: UpdateUserDto) => {
    if (!editingUser) return;

    setIsSaving(true);
    try {
      await userService.updateUser(editingUser.id, userData);
      toast.success('Usuário atualizado com sucesso');
      setIsEditModalOpen(false);
      setEditingUser(null);
      loadUsers(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Usuário</h1>
        <p className="text-gray-600">
          {isUser ? 'Seus dados pessoais e opções de crédito de serviço' : 'Gerenciamento de usuários do sistema'}
        </p>
      </div>

      {isUser && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Comprar Créditos de Serviço</h2>
            <p className="text-gray-600 mb-6">
              Adicione créditos de serviço à sua conta para fazer reservas em propriedades.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {creditPackages.map((pkg) => (
                <div key={pkg.hours} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-2">{pkg.description}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    R$ {pkg.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600 mb-4">{pkg.hours} horas de serviço</p>
                  <Button
                    onClick={() => handlePurchaseClick(pkg)}
                    className="w-full"
                    disabled={loading}
                  >
                    Comprar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <UsersTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        isLoading={loadingUsers}
        showSearch={!isUser}
        showCreateButton={!isUser}
        currentUser={user}
      />

      {/* Modal de Compra */}
      {showPurchaseModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Comprar Créditos de Serviço</h3>
            
            {purchaseStatus === 'idle' && (
              <div>
                <p className="text-gray-600 mb-4">
                  Você está comprando <strong>{selectedPackage.hours} horas</strong> por{' '}
                  <strong>R$ {selectedPackage.price.toFixed(2)}</strong>
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleConfirmPurchase} disabled={loading}>
                    {loading ? 'Processando...' : 'Confirmar Compra'}
                  </Button>
                  <Button onClick={closeModal} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {purchaseStatus === 'processing' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h4 className="font-semibold mb-2">Processando Compra</h4>
                <p className="text-gray-600">
                  Aguarde enquanto processamos sua compra...
                </p>
              </div>
            )}

            {purchaseStatus === 'success' && (
              <div className="text-center">
                <div className="text-green-600 text-4xl mb-4">✓</div>
                <h4 className="font-semibold text-green-600 mb-2">Compra Realizada!</h4>
                <p className="text-gray-600 mb-4">
                  {selectedPackage.hours} horas de crédito de serviço foram adicionadas à sua conta.
                </p>
                <Button onClick={closeModal}>
                  Fechar
                </Button>
              </div>
            )}

            {purchaseStatus === 'error' && (
              <div className="text-center">
                <div className="text-red-600 text-4xl mb-4">✗</div>
                <h4 className="font-semibold text-red-600 mb-2">Erro na Compra</h4>
                <p className="text-gray-600 mb-4">
                  {error?.toString() || 'Ocorreu um erro ao processar a compra.'}
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleConfirmPurchase} variant="outline">
                    Tentar Novamente
                  </Button>
                  <Button onClick={closeModal}>
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Edição de Usuário */}
      <UserForm
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveUser}
        isLoading={isSaving}
        isAdmin={user?.role === 'admin'}
      />
    </div>
  );
} 