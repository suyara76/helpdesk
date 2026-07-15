import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);

      const { user, token } = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      signIn(user, token);

      toast.success("Account created!", {
        description: "Your registration was successful.",
      });
      navigate("/tickets");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error?.response?.data?.message ||
          "Could not create your account. Please try again.";

        toast.error("Registration failed", {
          description: Array.isArray(message) ? message[0] : message,
        });
        console.error("Registration failed:", error);
      }
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Sign Up
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Enter your email and password to sign up!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter your first name"
                  {...register("firstName", {
                    required: "First name is required.",
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
                    errors.firstName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-200"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
                    errors.lastName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-200"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="info@gmail.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                })}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-200"
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
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
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all pr-11 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password.message}
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
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
            HelpDesk
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            A centralized platform for logging and tracking technical support
            requests
          </p>
        </div>
      </div>
    </div>
  );
}
