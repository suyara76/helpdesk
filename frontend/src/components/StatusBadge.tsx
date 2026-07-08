import { cn } from "@/lib/utils";
import { TicketStatus } from "@/types";

const STATUS_STYLES: Record<TicketStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  WORKING: "bg-blue-100 text-blue-700 border-blue-200",
  RESOLVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  PENDING: "Pending",
  WORKING: "Working",
  RESOLVED: "Resolved",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}