import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ticketsService } from "@/services/tickets";
import { TicketPriority } from "@/types";

interface CreateTicketFormData {
  titulo: string;
  descricao: string;
  priority: TicketPriority;
}

const PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

export default function CreateTicket() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    defaultValues: { priority: "MEDIUM" },
  });

  async function onSubmit(data: CreateTicketFormData) {
    try {
      setIsSubmitting(true);
      const ticket = await ticketsService.create(data);

      toast.success("Ticket created!", {
        description: "Your request has been submitted successfully.",
      });

      navigate(`/tickets/${ticket.id}`);
    } catch (error: any) {
      const isInactive = error?.response?.data?.message === "Inactive users cannot create tickets";

      toast.error("Failed to create ticket", {
        description: isInactive
          ? "Your account is inactive and cannot create new tickets."
          : "Please try again in a few moments.",
      });
      console.error("Failed to create ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/tickets"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to tickets
      </Link>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-1">New Ticket</h1>
        <p className="text-sm text-slate-500 mb-6">
          Describe your issue and our support team will take care of it.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Printer is not working"
              {...register("titulo", { required: "Title is required" })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
                errors.titulo ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.titulo && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.titulo.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Provide as much detail as possible..."
              {...register("descricao", { required: "Description is required" })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all resize-none ${
                errors.descricao ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.descricao && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.descricao.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Link to="/tickets">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-400 hover:bg-orange-600 text-white gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}