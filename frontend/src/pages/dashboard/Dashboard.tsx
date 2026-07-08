import { useEffect, useState } from "react";
import { Ticket, Clock, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { dashboardService } from "@/services/dashboard";
import { DashboardSummary } from "@/types";

interface SummaryCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accentClassName: string;
}

function SummaryCard({ label, value, icon: Icon, accentClassName }: SummaryCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${accentClassName}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setIsLoading(true);
        const data = await dashboardService.getSummary();
        setSummary(data);
      } catch (error) {
        toast.error("Failed to load dashboard", {
          description: "Please try again in a few moments.",
        });
        console.error("Failed to load dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of all support tickets.</p>
      </div>

      <div>
        <h2 className="text-sm font-medium text-slate-500 mb-3">Tickets by status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            label="Pending"
            value={summary.byStatus.pending}
            icon={Clock}
            accentClassName="bg-amber-100 text-amber-700"
          />
          <SummaryCard
            label="Working"
            value={summary.byStatus.working}
            icon={Ticket}
            accentClassName="bg-blue-100 text-blue-700"
          />
          <SummaryCard
            label="Resolved"
            value={summary.byStatus.resolved}
            icon={CheckCircle2}
            accentClassName="bg-emerald-100 text-emerald-700"
          />
          <SummaryCard
            label="Cancelled"
            value={summary.byStatus.cancelled}
            icon={XCircle}
            accentClassName="bg-slate-100 text-slate-600"
          />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-slate-500 mb-3">Last 7 days</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard
            label="Tickets created"
            value={summary.last7Days.created}
            icon={TrendingUp}
            accentClassName="bg-orange-100 text-orange-600"
          />
          <SummaryCard
            label="Tickets resolved"
            value={summary.last7Days.resolved}
            icon={CheckCircle2}
            accentClassName="bg-emerald-100 text-emerald-700"
          />
          <SummaryCard
            label="Avg. resolution time"
            value={
              summary.averageResolutionTimeInHours !== null
                ? `${summary.averageResolutionTimeInHours}h`
                : "—"
            }
            icon={Clock}
            accentClassName="bg-blue-100 text-blue-700"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <p className="text-sm text-slate-500">
          Total tickets registered:{" "}
          <span className="font-semibold text-slate-900">{summary.total}</span>
        </p>
      </div>
    </div>
  );
}