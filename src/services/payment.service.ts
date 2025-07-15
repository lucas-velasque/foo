import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface PixPaymentData {
  merchantName: string;
  merchantCity: string;
  postalCode: string;
  amount: number;
  transactionId: string;
  description: string;
}

export interface PixQRCode {
  qrCode: string;
  qrCodeText: string;
  transactionId: string;
  amount: number;
  expiresAt: Date;
}

@Injectable()
export class PaymentService {
  constructor(private readonly configService: ConfigService) {}

  // Gerar QR Code PIX real
  generatePixQRCode(paymentData: PixPaymentData): PixQRCode {
    const {
      merchantName,
      merchantCity,
      postalCode,
      amount,
      transactionId,
      description
    } = paymentData;

    // Dados do PIX (você deve configurar com seus dados reais)
    const pixKey = this.configService.get<string>('PIX_KEY') || 'test@example.com';
    const pixKeyType = 'EMAIL'; // ou 'CPF', 'CNPJ', 'PHONE', 'RANDOM'
    
    // Criar payload do PIX
    const pixPayload = this.createPixPayload({
      pixKey,
      pixKeyType,
      merchantName,
      merchantCity,
      postalCode,
      amount,
      transactionId,
      description
    });

    // Gerar QR Code (em produção, use uma biblioteca como qrcode)
    const qrCodeText = pixPayload;
    const qrCode = this.generateQRCodeImage(qrCodeText);

    return {
      qrCode,
      qrCodeText,
      transactionId,
      amount,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    };
  }

  // Verificar status do pagamento
  async checkPaymentStatus(transactionId: string): Promise<{
    status: 'pending' | 'paid' | 'expired' | 'cancelled';
    paidAt?: Date;
    amount?: number;
  }> {
    // Em produção, você faria uma consulta à API do seu banco
    // Por enquanto, vamos simular com base no ID da transação
    const isPaid = this.simulatePaymentCheck(transactionId);
    
    if (isPaid) {
      return {
        status: 'paid',
        paidAt: new Date(),
        amount: 10.00 // Valor padrão
      };
    }

    return {
      status: 'pending'
    };
  }

  // Processar confirmação de pagamento
  async processPaymentConfirmation(transactionId: string): Promise<{
    success: boolean;
    message: string;
    amount?: number;
  }> {
    try {
      const status = await this.checkPaymentStatus(transactionId);
      
      if (status.status === 'paid') {
        return {
          success: true,
          message: 'Pagamento confirmado com sucesso!',
          amount: status.amount
        };
      } else if (status.status === 'expired') {
        return {
          success: false,
          message: 'Pagamento expirado. Tente novamente.'
        };
      } else {
        return {
          success: false,
          message: 'Pagamento ainda pendente. Aguarde a confirmação.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao processar pagamento.'
      };
    }
  }

  private createPixPayload(data: {
    pixKey: string;
    pixKeyType: string;
    merchantName: string;
    merchantCity: string;
    postalCode: string;
    amount: number;
    transactionId: string;
    description: string;
  }): string {
    // Implementação do payload PIX seguindo o padrão EMV QR Code
    // Este é um exemplo simplificado - em produção use uma biblioteca específica
    
    const payload = [
      '000201', // Payload Format Indicator
      '010212', // Point of Initiation Method
      '2652', // Merchant Account Information
      '0014BR.GOV.BCB.PIX', // Global Unique Identifier
      '01' + data.pixKeyType.length.toString().padStart(2, '0') + data.pixKey, // Pix Key
      '52040000', // Merchant Category Code
      '5303986', // Transaction Currency
      '54' + data.amount.toFixed(2).length.toString().padStart(2, '0') + data.amount.toFixed(2), // Transaction Amount
      '5802BR', // Country Code
      '59' + data.merchantName.length.toString().padStart(2, '0') + data.merchantName, // Merchant Name
      '60' + data.merchantCity.length.toString().padStart(2, '0') + data.merchantCity, // Merchant City
      '62', // Additional Data Field Template
      '05' + data.transactionId.length.toString().padStart(2, '0') + data.transactionId, // Reference Label
      '6304' // CRC16
    ].join('');

    return payload;
  }

  private generateQRCodeImage(text: string): string {
    // Em produção, use uma biblioteca como 'qrcode' para gerar a imagem
    // Por enquanto, retornamos um placeholder
    return `data:image/png;base64,${Buffer.from('QR_CODE_PLACEHOLDER_' + text.substring(0, 10)).toString('base64')}`;
  }

  private simulatePaymentCheck(transactionId: string): boolean {
    // Simulação: pagamentos com ID terminando em números pares são considerados pagos
    const lastChar = transactionId.slice(-1);
    return !isNaN(parseInt(lastChar)) && parseInt(lastChar) % 2 === 0;
  }
} 