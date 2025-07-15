import api from './api';
import { WorkCredit, CreateWorkCreditDto } from '@/types';

export interface CreditPackage {
  hours: number;
  price: number;
  description: string;
}

export interface PurchaseRequest {
  user_id: string;
  package_hours: number;
  payment_method: 'pix' | 'credit_card' | 'bank_transfer';
  total_amount: number;
}

export interface PurchaseResponse {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  message: string;
}

export const creditPurchaseService = {
  // Obter pacotes de crédito disponíveis
  async getCreditPackages(): Promise<CreditPackage[]> {
    const { data } = await api.get<CreditPackage[]>('/credit-purchases/packages');
    return data;
  },

  // Iniciar processo de compra (simulado)
  async initiatePurchase(purchaseData: PurchaseRequest): Promise<PurchaseResponse> {
    const { data } = await api.post<PurchaseResponse>('/credit-purchases', purchaseData);
    return data;
  },

  // Confirmar pagamento (simulado)
  async confirmPayment(purchaseId: string): Promise<{
    success: boolean;
    message: string;
    credit?: WorkCredit;
    hours_added?: number;
  }> {
    const { data } = await api.post(`/credit-purchases/${purchaseId}/confirm`);
    return data;
  },

  // Verificar status da compra
  async checkPurchaseStatus(purchaseId: string): Promise<PurchaseResponse> {
    const { data } = await api.get<PurchaseResponse>(`/credit-purchases/${purchaseId}/status`);
    return data;
  },

  // Cancelar compra
  async cancelPurchase(purchaseId: string): Promise<void> {
    await api.delete(`/credit-purchases/${purchaseId}`);
  },

  // Obter histórico de compras do usuário
  async getUserPurchaseHistory(userId: string): Promise<PurchaseResponse[]> {
    const { data } = await api.get<PurchaseResponse[]>(`/credit-purchases/user/${userId}`);
    return data;
  },

  // Verificar status periodicamente
  async pollPaymentStatus(purchaseId: string, onStatusChange: (status: PurchaseResponse) => void): Promise<void> {
    const checkStatus = async () => {
      try {
        const status = await this.checkPurchaseStatus(purchaseId);
        onStatusChange(status);
        
        if (status.status === 'pending') {
          // Continuar verificando a cada 5 segundos
          setTimeout(checkStatus, 5000);
        }
      } catch (error) {
        console.error('Erro ao verificar status do pagamento:', error);
      }
    };
    
    checkStatus();
  },

  // Simular compra (para desenvolvimento)
  async simulatePurchase(userId: string, hours: number, amount: number): Promise<WorkCredit> {
    // Simula uma compra bem-sucedida criando um crédito diretamente
    const creditData: CreateWorkCreditDto = {
      user_id: userId,
      type: 'purchased',
      hours: hours,
      description: `Créditos comprados - ${hours} horas`,
      date: new Date().toISOString(),
    };
    
    const { data } = await api.post<WorkCredit>('/work-credits', creditData);
    return data;
  },
}; 