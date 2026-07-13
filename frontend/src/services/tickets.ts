import { api } from "./api";
import { Ticket, PaginatedResponse, TicketStatus, TicketPriority } from "@/types";

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "titulo" | "status";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateTicketData {
  titulo: string;
  descricao: string;
  priority?: TicketPriority;
}

export interface UpdateTicketData {
  titulo?: string;
  descricao?: string;
}

export const ticketsService = {
  list: async (filters: TicketFilters = {}): Promise<PaginatedResponse<Ticket>> => {
    const response = await api.get<PaginatedResponse<Ticket>>("/tickets", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Ticket> => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  create: async (data: CreateTicketData): Promise<Ticket> => {
    const response = await api.post<Ticket>("/tickets", data);
    return response.data;
  },

  update: async (id: string, data: UpdateTicketData): Promise<Ticket> => {
    const response = await api.patch<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: TicketStatus): Promise<Ticket> => {
    const response = await api.patch<Ticket>(`/tickets/${id}/status`, { status });
    return response.data;
  },
};