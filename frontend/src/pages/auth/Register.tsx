import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authService } from '@/services/auth';
import { useAuth } from "@/contexts/AuthContext";

const DEFAULT_ERROR = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState(DEFAULT_ERROR);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let temErro = false;

    const errors = structuredClone(DEFAULT_ERROR);

    if (!firstName) {
      errors.firstName = "First name is required.";
      temErro = true;
    }

    if (!lastName) {
      errors.lastName = "Last name is required";
      temErro = true;
    }

    if (!email) {
      errors.email = "Email is required";
      temErro = true;
    } else if (!email.includes("@") || !email.includes(".")) {
      errors.email = "Please enter a valid email";
      temErro = true;
    }

    if (!password) {
      errors.password = "Password is required";
      temErro = true;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      temErro = true;
    }

    if (temErro) {
      setError(errors);
      toast.error("Form error", {
        description: "Please check the required fields before submitting",
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
      return;
    }

    setError(DEFAULT_ERROR);

    try {
      setIsSubmitting(true);

      const { user, token} = await authService.register({
        firstName,
        lastName,
        email,
        password,
      });
      signIn(user, token);

      toast.success("Account created!", {
        description: "Your registration was successful.",
      });
      navigate("/tickets");

    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Could not create your account. Please try again.";

      toast.error("Registration failed", {
        description: Array.isArray(message) ? message[0] : message,
      });
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-slate-900 font-sans">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative bg-white">
        <div className="absolute top-8 left-8 sm:left-16 lg:left-24">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Sign Up</h1>
          <p className="text-sm text-slate-500 mb-8">
            Enter your email and password to sign up!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${error.firstName ? "border-red-500 focus:ring-red-500" : "border-slate-200"}`}
                />
                {error.firstName && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error.firstName}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all
                    ${error.lastName ? "border-red-500 focus:ring-red-500" : "border-slate-200"}`}
                />
                {error.lastName && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="info@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all
                  ${error.email ? "border-red-500 focus:ring-red-500" : "border-slate-200"}`}
              />
              {error.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all pr-11
                    ${error.password ? "border-red-500 focus:ring-red-500" : "border-slate-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm cursor-pointer transition-colors text-sm disabled:cursor-not-allowed"
            >
              Sign Up
              {isSubmitting && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-medium text-orange-600 hover:text-orange-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-slate-900 items-center justify-center relative p-12">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600 rounded-full mix-blend-screen filter blur-[128px] opacity-10"></div>

        <div className="text-center relative z-10 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-400 text-white font-bold text-2xl shadow-xl mb-6">
            HD
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">HelpDesk</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            A centralized platform for logging and tracking technical support requests
          </p>
        </div>
      </div>
    </div>
  );
}


