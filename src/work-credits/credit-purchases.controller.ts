// src/modules/work-credits/credit-purchases.controller.ts
import { Controller, Post, Body, Get, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { WorkCreditsService } from './work-credits.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreditType } from './enums/credit-type.enum';
import { CreateWorkCreditDto } from './dto/create-work-credit.dto';

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

@Controller('credit-purchases')
@UseGuards(JwtAuthGuard)
export class CreditPurchasesController {
  // Armazenamento temporário para simular o processo de compra
  private purchaseData: Map<string, PurchaseRequest> = new Map();

  constructor(
    private readonly workCreditsService: WorkCreditsService,
  ) {}

  @Get('packages')
  async getCreditPackages(): Promise<CreditPackage[]> {
    // Pacotes de crédito disponíveis
    return [
      { hours: 10, price: 50.00, description: 'Pacote Básico - 10 horas' },
      { hours: 25, price: 120.00, description: 'Pacote Intermediário - 25 horas' },
      { hours: 50, price: 220.00, description: 'Pacote Avançado - 50 horas' },
      { hours: 100, price: 400.00, description: 'Pacote Premium - 100 horas' },
    ];
  }

  @Post()
  async initiatePurchase(@Request() req: any, @Body() purchaseData: PurchaseRequest): Promise<PurchaseResponse> {
    const userId = req.user.id;
    const transactionId = `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('=== INITIATE PURCHASE DEBUG ===');
    console.log('Transaction ID:', transactionId);
    console.log('Purchase Data:', JSON.stringify(purchaseData, null, 2));
    
    // Armazenar os dados da compra para usar na confirmação
    this.purchaseData.set(transactionId, purchaseData);
    
    console.log('Stored purchase data for ID:', transactionId);
    console.log('Current purchase data map size:', this.purchaseData.size);
    
    // processamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: transactionId,
      status: 'completed',
      message: 'Compra realizada com sucesso!'
    };
  }

  @Post(':id/confirm')
  async confirmPayment(@Request() req: any, @Param('id') id: string): Promise<any> {
    const userId = req.user.id;
    
    console.log('=== CONFIRM PAYMENT DEBUG ===');
    console.log('Purchase ID:', id);
    console.log('User ID:', userId);
    
    // Recuperar os dados da compra armazenados
    const purchaseData = this.purchaseData.get(id);
    console.log('Purchase Data found:', !!purchaseData);
    console.log('Purchase Data:', JSON.stringify(purchaseData, null, 2));
    console.log('Available purchase IDs:', Array.from(this.purchaseData.keys()));
    
    if (!purchaseData) {
      console.log('ERROR: Purchase data not found!');
      return {
        success: false,
        message: 'Dados da compra não encontrados'
      };
    }
    
    // Usar as horas do pacote selecionado
    const hours = purchaseData.package_hours;
          console.log('Creating service credit with hours:', hours);
    
    // Criar crédito de serviço usando o DTO correto
    const creditData: CreateWorkCreditDto = {
      user_id: userId,
      type: CreditType.PURCHASED,
      hours: hours,
      description: `Créditos comprados - ${hours} horas`,
      date: new Date().toISOString(),
    };
    
    console.log('Credit data to create:', JSON.stringify(creditData, null, 2));
    
    try {
      const credit = await this.workCreditsService.create(userId, creditData);
      console.log('Service credit created:', JSON.stringify(credit, null, 2));
      
      // Limpar dados temporários após sucesso
      this.purchaseData.delete(id);
      
      return {
        success: true,
        message: 'Pagamento confirmado e créditos adicionados com sucesso!',
        credit: credit,
        hours_added: hours
      };
    } catch (error: any) {
      console.log('Error creating service credit:', error);
      return {
        success: false,
        message: error?.message || 'Erro interno ao criar crédito de serviço'
      };
    }
  }

  @Get(':id/status')
  async checkPurchaseStatus(@Param('id') id: string): Promise<PurchaseResponse> {
    return {
      id,
      status: 'completed',
      message: 'Pagamento aprovado e créditos adicionados à sua conta.'
    };
  }

  @Delete(':id')
  async cancelPurchase(@Param('id') id: string): Promise<{ message: string }> {
    return { message: 'Compra cancelada com sucesso.' };
  }

  @Get('user/:userId')
  async getUserPurchaseHistory(@Param('userId') userId: string): Promise<PurchaseResponse[]> {
    return [
      {
        id: 'purchase_1',
        status: 'completed',
        message: 'Compra realizada em 01/07/2025',
      },
      {
        id: 'purchase_2',
        status: 'completed',
        message: 'Compra realizada em 15/06/2025',
      },
    ];
  }
} 