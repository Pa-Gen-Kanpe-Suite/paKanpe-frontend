export type Role = "CLIENT" | "AGENT" | "CASHIER" | "ADMIN";
export type TicketStatus =
  | "WAITING"
  | "CALLED"
  | "IN_PROGRESS"
  | "CLOSED"
  | "ABSENT"
  | "CANCELLED";

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: Role;
}

export interface Service {
  id: number;
  code: string;
  name: string;
  average_minutes: number;
}

export interface Ticket {
  id: number;
  code: string;
  source: "DIGITAL" | "PHYSICAL";
  status: TicketStatus;
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

export interface Counter {
  id: number;
  number: number;
  name: string;
  status: "CLOSED" | "OPEN" | "PAUSED";
  cashier_id: number | null;
  current_ticket: Ticket | null;
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

