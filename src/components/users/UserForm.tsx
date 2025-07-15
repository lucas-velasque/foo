import React, { useState, useEffect } from 'react';
import { User, UserRole, UpdateUserDto } from '@/types';
import Button from '@/components/common/Button';
import { X } from 'lucide-react';

const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.USER:
      return 'Usuário';
    case UserRole.SUPPLIER:
      return 'Fornecedor';
    case UserRole.ADMIN:
      return 'Administrador';
    default:
      return 'Usuário';
  }
};

interface UserFormProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UpdateUserDto) => Promise<void>;
  isLoading?: boolean;
  isAdmin?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  isAdmin = false,
}) => {
  const [formData, setFormData] = useState<UpdateUserDto>({
    name: '',
    email: '',
    cpf: '',
    role: UserRole.USER,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        role: user.role,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Editar Usuário</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Perfil
            </label>
            {isAdmin ? (
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              >
                <option value={UserRole.USER}>Usuário</option>
                <option value={UserRole.SUPPLIER}>Fornecedor</option>
                <option value={UserRole.ADMIN}>Administrador</option>
              </select>
            ) : (
              <>
                <input
                  type="text"
                  value={getRoleDisplayName(formData.role || UserRole.USER)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  disabled={true}
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  O perfil não pode ser alterado
                </p>
              </>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm; 