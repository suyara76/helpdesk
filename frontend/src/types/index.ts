export type UserRole = "ADMIN" | "AGENT" | "CLIENT";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TicketStatus = "PENDING" | "WORKING" | "RESOLVED" | "CANCELLED";

export interface Ticket {
  id: string;
  titulo: string;
  descricao: string;
  status: TicketStatus;
  usuarioId: string;
  usuario?: Pick<User, "id" | "firstName" | "lastName" | "email">;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardSummary {
  total: number;
  byStatus: {
    pending: number;
    working: number;
    resolved: number;
    cancelled: number;
  };
  last7Days: {
    created: number;
    resolved: number;
  };
  averageResolutionTimeInHours: number | null;
}