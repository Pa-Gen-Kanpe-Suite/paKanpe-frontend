// ============================================================
// lib/api.ts - Service d'API complet pour PA GEN KANPE
// ============================================================

// ============================================================
// 1. GESTION DES ERREURS
// ============================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================
// 2. FONCTION GENERIQUE D'APPEL API
// ============================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Utiliser le proxy si configuré
const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY === 'true';
const BASE_URL = USE_PROXY ? '/api/proxy' : API_URL;

export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  // Récupérer le token JWT
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('token') 
    : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...init.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorDetail = 'Une erreur est survenue';
    let errorData: any = {};
    try {
      errorData = await response.json();
      errorDetail = errorData.detail || errorData.message || errorDetail;
    } catch {
      errorDetail = response.statusText || errorDetail;
    }

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new ApiError('Session expirée, veuillez vous reconnecter', 401, errorDetail);
    }

    if (response.status === 403) {
      throw new ApiError('Vous n\'avez pas les droits nécessaires', 403, errorDetail);
    }

    if (response.status === 404) {
      throw new ApiError('Ressource non trouvée', 404, errorDetail);
    }

    if (response.status === 409) {
      throw new ApiError('Conflit : ' + errorDetail, 409, errorDetail);
    }

    throw new ApiError(errorDetail, response.status, errorDetail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ============================================================
// 3. TYPES
// ============================================================

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: 'CLIENT' | 'AGENT' | 'CASHIER' | 'ADMIN';
  is_active: boolean;
}

export interface Ticket {
  id: number;
  code: string;
  source: 'DIGITAL' | 'PHYSICAL';
  status: 'WAITING' | 'CALLED' | 'IN_PROGRESS' | 'CLOSED' | 'ABSENT' | 'CANCELLED';
  service_id: number;
  service_name: string;
  counter_id: number | null;
  counter_name: string | null;
  visitor_name: string | null;
  position: number | null;
  estimated_wait_minutes: number | null;
  created_at: string;
  called_at: string | null;
  started_at: string | null;
  closed_at: string | null;
  comment: string | null;
}

export interface Service {
  id: number;
  code: string;
  name: string;
  average_minutes: number;
}

export interface Counter {
  id: number;
  number: number;
  name: string;
  status: 'OPEN' | 'CLOSED' | 'PAUSED';
  cashier_id: number | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Statistics {
  date: string;
  tickets_issued: number;
  waiting: number;
  in_service: number;
  completed: number;
  cancelled: number;
  absent: number;
  average_wait_minutes: number;
  average_service_minutes: number;
  active_counters: number;
}

export interface DisplayBoard {
  called: Array<{ code: string; counter_name: string; called_at: string }>;
  waiting_count: number;
  updated_at: string;
}

export interface QueuePosition {
  position: number;
  estimated_wait_minutes: number;
  status: string;
}

export interface Notification {
  id: number;
  ticket_id: number;
  type: string;
  message: string;
  is_read: boolean;
  sent_at: string;
}

// ============================================================
// 4. AUTHENTIFICATION
// ============================================================

export interface RegisterData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export const auth = {
  register: (data: RegisterData) =>
    api<{ message: string; utilisateur: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () =>
    api<User>('/auth/me', {
      method: 'GET',
    }),
};

// ============================================================
// 5. CLIENT
// ============================================================

export interface CreateTicketData {
  service_id: number;
}

export const client = {
  createTicket: (data: CreateTicketData) =>
    api<Ticket>('/client/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyTickets: () =>
    api<Ticket[]>('/client/tickets', {
      method: 'GET',
    }),

  getCurrentTicket: () =>
    api<Ticket | null>('/client/tickets/current', {
      method: 'GET',
    }),

  cancelTicket: (ticketId: number) =>
    api<Ticket>(`/client/tickets/${ticketId}/cancel`, {
      method: 'PATCH',
    }),
};

// ============================================================
// 6. AGENT
// ============================================================

export interface PhysicalTicketData {
  service_id: number;
  visitor_name: string;
  visitor_phone: string;
}

export const agent = {
  createPhysicalTicket: (data: PhysicalTicketData) =>
    api<Ticket>('/agent/tickets/physical', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  markLate: (ticketId: number) =>
    api<{ message: string }>(`/agent/tickets/${ticketId}/late`, {
      method: 'PATCH',
    }),
};

// ============================================================
// 7. CAISSIER
// ============================================================

export interface CloseTicketData {
  comment?: string;
  auto_call_next?: boolean;
}

export const cashier = {
  getCounters: () =>
    api<Counter[]>('/cashier/counters', {
      method: 'GET',
    }),

  updateCounterStatus: (counterId: number, status: string) =>
    api<Counter>(`/cashier/counters/${counterId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  callNextTicket: (counterId: number) =>
    api<Ticket>(`/cashier/counters/${counterId}/next-ticket`, {
      method: 'POST',
    }),

  startTicket: (ticketId: number) =>
    api<Ticket>(`/cashier/tickets/${ticketId}/start`, {
      method: 'PATCH',
    }),

  closeTicket: (ticketId: number, data: CloseTicketData = {}) =>
    api<Ticket>(`/cashier/tickets/${ticketId}/close`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  markNoShow: (ticketId: number) =>
    api<Ticket>(`/cashier/tickets/${ticketId}/no-show`, {
      method: 'PATCH',
    }),
};

// ============================================================
// 8. ADMINISTRATEUR
// ============================================================

export interface CreateCounterData {
  number: number;
  name: string;
}

export interface CreateServiceData {
  code: string;
  name: string;
  average_minutes: number;
}

export const admin = {
  getStatistics: () =>
    api<Statistics>('/admin/statistics/overview', {
      method: 'GET',
    }),

  getCounters: () =>
    api<Counter[]>('/admin/counters', {
      method: 'GET',
    }),

  createCounter: (data: CreateCounterData) =>
    api<Counter>('/admin/counters', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCounterStatus: (counterId: number, status: string) =>
    api<Counter>(`/admin/counters/${counterId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getServices: () =>
    api<Service[]>('/admin/services', {
      method: 'GET',
    }),

  createService: (data: CreateServiceData) =>
    api<Service>('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================
// 9. PUBLIC (Sans authentification)
// ============================================================

export const publicApi = {
  getServices: () =>
    api<Service[]>('/services', {
      method: 'GET',
    }),

  getDisplay: () =>
    api<DisplayBoard>('/display', {
      method: 'GET',
    }),

  getPosition: (ticketCode: string) =>
    api<QueuePosition>(`/queues/position/${ticketCode}`, {
      method: 'GET',
    }),
};

// ============================================================
// 10. NOTIFICATIONS
// ============================================================

export const notifications = {
  getMyNotifications: (limit: number = 20) =>
    api<Notification[]>(`/notifications?limit=${limit}`, {
      method: 'GET',
    }),

  getUnreadCount: () =>
    api<number>('/notifications/unread', {
      method: 'GET',
    }),

  markAsRead: (notificationId: number) =>
    api<{ message: string }>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    }),
};

// ============================================================
// 11. UTILITAIRES
// ============================================================

export const roleHome = (role: string): string => {
  const routes: Record<string, string> = {
    CLIENT: '/client/dashboard',
    AGENT: '/agent/dashboard',
    CASHIER: '/caissier/dashboard',
    ADMIN: '/admin/dashboard',
  };
  return routes[role] || '/';
};

// ============================================================
// 12. EXPORT PAR DÉFAUT
// ============================================================

export default {
  api,
  auth,
  client,
  agent,
  cashier,
  admin,
  publicApi,
  notifications,
  roleHome,
};