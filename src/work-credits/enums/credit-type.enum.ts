// src/work-credits/enums/credit-type.enum.ts

export enum CreditType {
  EARNED = 'earned', // Créditos ganhos por alguma atividade
  REDEEMED = 'redeemed', // Créditos resgatados para alguma finalidade
  ADJUSTMENT_ADD = 'adjustment_add', // Ajuste manual para adicionar créditos
  ADJUSTMENT_SUBTRACT = 'adjustment_subtract', // Ajuste manual para subtrair créditos
  EXPIRATION = 'expiration', // Créditos que expiraram
  TRANSFER_SENT = 'transfer_sent', // Créditos transferidos para outro usuário
  TRANSFER_RECEIVED = 'transfer_received', // Créditos recebidos de outro usuário
  PURCHASED = 'purchased', // Créditos comprados pelo usuário
}