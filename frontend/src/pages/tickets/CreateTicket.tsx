import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ticketsService } from "@/services/tickets";

const DEFAULT_ERRORS = { titulo: "", descricao: "" };

export default function CreateTicket() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [errors, setErrors] = useState(DEFAULT_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors = { ...DEFAULT_ERRORS };
    let hasError = false;

    if (!titulo.trim()) {
      newErrors.titulo = "Title is required";
      hasError = true;
    }

    if (!descricao.trim()) {
      newErrors.descricao = "Description is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      toast.error("Form error", {
        description: "Please check the required fields before submitting",
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
      return;
    }

    setErrors(DEFAULT_ERRORS);

    try {
      setIsSubmitting(true);
      const ticket = await ticketsService.create({ titulo, descricao });

      toast.success("Ticket created!", {
        description: "Your request has been submitted successfully.",
      });

      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      toast.error("Failed to create ticket", {
        description: "Please try again in a few moments.",
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Printer is not working"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
                errors.titulo ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.titulo && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.titulo}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Provide as much detail as possible..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all resize-none ${
                errors.descricao ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.descricao && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.descricao}
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