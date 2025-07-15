// Tipos para Usuários
export interface User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export enum UserRole {
  USER = 'user',
  SUPPLIER = 'supplier',
  ADMIN = 'admin',
}

// Tipos para Propriedades
export interface Property {
  id: string;
  name: string;
  location: string;
  description?: string;
  daily_work_hours_required: number;
  price?: number;
  payment_type: PaymentType;
  availability_period: AvailabilityPeriod;
  is_active: boolean;
  owner_id: string;
  owner?: User;
  created_at?: string;
  updated_at?: string;
}

// Tipos para Agendamentos
export interface Booking {
  id: string;
  guest_id: string;
  property_id: string;
  number_of_days: number;
  status: BookingStatus;
  work_hours_offered: number;
  guest?: User;
  property?: Property;
  created_at?: string;
  updated_at?: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

// Tipos para Assistência Social
export interface SocialAssistance {
  id: string;
  ong_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Tipos para Créditos de Serviço
export interface WorkCredit {
  id: string;
  user_id: string;
  type: string;
  hours: number;
  description: string;
  date: string;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export enum CreditType {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
  ADJUSTMENT_ADD = 'adjustment_add',
  ADJUSTMENT_SUBTRACT = 'adjustment_subtract',
  EXPIRATION = 'expiration',
  TRANSFER_SENT = 'transfer_sent',
  TRANSFER_RECEIVED = 'transfer_received',
  PURCHASED = 'purchased',
}

// Tipos para Tarefas
export interface Task {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Tipos para Autenticação
export interface LoginCredentials {
  login: string;
  password: string;
  role?: 'user' | 'admin' | 'supplier';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Tipos para Formulários
export interface CreateUserDto {
  name: string;
  email: string;
  cpf: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  cpf?: string;
  password?: string;
  role?: UserRole;
}

export interface CreatePropertyDto {
  name: string;
  location: string;
  description?: string;
  daily_work_hours_required?: number;
  price?: number;
  payment_type?: PaymentType;
  availability_period?: AvailabilityPeriod;
  is_active?: boolean;
  owner_id?: string;
}

export interface UpdatePropertyDto {
  name?: string;
  location?: string;
  description?: string;
  daily_work_hours_required?: number;
  price?: number;
  payment_type?: PaymentType;
  availability_period?: AvailabilityPeriod;
  is_active?: boolean;
}

export interface CreateBookingDto {
  property_id: string;
  number_of_days: number;
  work_hours_offered?: number;
  guest_id?: string;
}

export interface UpdateBookingDto {
  number_of_days?: number;
  status?: BookingStatus;
  work_hours_offered?: number;
}

export interface CreateWorkCreditDto {
  user_id: string;
  type: string;
  hours: number;
  description?: string;
  date?: string;
}

export interface UpdateWorkCreditDto {
  type?: string;
  hours?: number;
  description?: string;
  date?: string;
}

export interface CreateSocialAssistanceDto {
  ong_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  description?: string;
}

export interface UpdateSocialAssistanceDto {
  name?: string;
  description?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  status: string;
  user?: User;
  task?: Task;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserTaskDto {
  user_id: string;
  task_id: string;
  status?: string;
}

export interface UpdateUserTaskDto {
  status?: string;
}

// Enums
export enum PaymentType {
  WORK_HOURS = 'work_hours',
  MONEY = 'money',
  MIXED = 'mixed',
}

export enum AvailabilityPeriod {
  NIGHTLY = 'nightly',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Types
export interface PropertyFilters {
  location?: string;
  payment_type?: PaymentType;
  availability_period?: AvailabilityPeriod;
  min_price?: number;
  max_price?: number;
  available_dates?: string[];
  is_active?: boolean;
}

export interface BookingFilters {
  status?: BookingStatus;
  guest_id?: string;
  property_id?: string;
  number_of_days?: number;
}

// Search Types
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
} 