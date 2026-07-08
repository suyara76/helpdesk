import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { ticketsService } from "@/services/tickets";
import { useAuth } from "@/contexts/AuthContext";
import { Ticket, TicketStatus } from "@/types";

const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  PENDING: ["WORKING", "CANCELLED"],
  WORKING: ["RESOLVED", "CANCELLED"],
  RESOLVED: [],
  CANCELLED: [],
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  PENDING: "Pending",
  WORKING: "Working",
  RESOLVED: "Resolved",
  CANCELLED: "Cancelled",
};

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const canManageStatus = user?.role === "ADMIN" || user?.role === "AGENT";
  const isOwner = ticket?.usuarioId === user?.id;
  const canEdit = isOwner || canManageStatus;

  const fetchTicket = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await ticketsService.getById(id);
      setTicket(data);
      setTitulo(data.titulo);
      setDescricao(data.descricao);
    } catch (error) {
      toast.error("Failed to load ticket", {
        description: "The ticket may not exist or you may not have access to it.",
      });
      navigate("/tickets");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  async function handleSave() {
    if (!id) return;

    if (!titulo.trim() || !descricao.trim()) {
      toast.error("Form error", {
        description: "Title and description cannot be empty",
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
      return;
    }

    try {
      setIsSaving(true);
      const updated = await ticketsService.update(id, { titulo, descricao });
      setTicket(updated);
      setIsEditing(false);
      toast.success("Ticket updated successfully");
    } catch (error) {
      toast.error("Failed to update ticket");
      console.error("Failed to update ticket:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(status: TicketStatus) {
    if (!id) return;

    try {
      setIsChangingStatus(true);
      const updated = await ticketsService.updateStatus(id, status);
      setTicket(updated);
      toast.success(`Status updated to ${STATUS_LABELS[status]}`);
    } catch (error) {
      toast.error("Failed to update status", {
        description: "This status transition may not be allowed.",
      });
      console.error("Failed to update status:", error);
    } finally {
      setIsChangingStatus(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm text-slate-500">
        Loading ticket...
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  const nextStatuses = ALLOWED_TRANSITIONS[ticket.status];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/tickets"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to tickets
      </Link>

      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full text-xl font-bold text-slate-900 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            ) : (
              <h1 className="text-xl font-bold text-slate-900">{ticket.titulo}</h1>
            )}
            <p className="text-xs text-slate-400 mt-2">
              Opened by {ticket.usuario?.firstName} {ticket.usuario?.lastName} on{" "}
              {new Date(ticket.createdAt).toLocaleDateString("en-US")}
            </p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <div>
          <h2 className="text-sm font-medium text-slate-700 mb-2">Description</h2>
          {isEditing ? (
            <textarea
              rows={5}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          ) : (
            <p className="text-sm text-slate-600 whitespace-pre-wrap">
              {ticket.descricao}
            </p>
          )}
        </div>

        {canEdit && (
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setTitulo(ticket.titulo);
                    setDescricao(ticket.descricao);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-orange-400 hover:bg-orange-600 text-white gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </>
            ) : (
              <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                Edit ticket
              </Button>
            )}
          </div>
        )}
      </div>

      {canManageStatus && nextStatuses.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-sm font-medium text-slate-700 mb-3">Update status</h2>
          <div className="flex flex-wrap gap-3">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                type="button"
                variant="outline"
                disabled={isChangingStatus}
                onClick={() => handleStatusChange(status)}
              >
                Move to {STATUS_LABELS[status]}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}