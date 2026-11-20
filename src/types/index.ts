export type UserRole = 'admin' | 'customer';
export type ServiceStatus = 'active' | 'inactive';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid';
export type TransactionStatus = 'paid' | 'failed';

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  isBlocked: boolean;
  phone?: string;
  createdAt: string;
}

export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number; // minutes
  image: string;
  status: ServiceStatus;
  createdAt: string;
}

export interface Appointment {
  _id: string;
  serviceId: string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
  paymentStatus: PaymentStatus;
  status: AppointmentStatus;
  createdAt: string;
  service?: Service;
  customer?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
    phone?: string;
  };
}

export interface Transaction {
  _id: string;
  appointmentId: string;
  customerId: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: TransactionStatus;
  createdAt: string;
  serviceName?: string;
  customerName?: string;
  customerEmail?: string;
  appointmentDate?: string;
}

export interface CustomerStats {
  totalRequests: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  paidAppointments: number;
  recentAppointments: Appointment[];
}

export interface AdminStats {
  totalRegisteredCustomers: number;
  totalActiveServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  totalSuccessfulPayments: number;
  totalRevenue: number;
  recentAppointments: Appointment[];
  recentTransactions: Transaction[];
}
