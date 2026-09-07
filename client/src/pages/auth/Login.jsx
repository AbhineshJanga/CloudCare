import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/auth.service";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const getDashboardPath = (role) => {
  switch (role) {
    case "PATIENT":
      return "/patient";
    case "DOCTOR":
      return "/doctor";
    case "ADMIN":
      return "/admin";
    default:
      return "/unauthorized";
  }
};

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await loginUser(
        formData.email,
        formData.password
      );

      login(response);

      navigate(getDashboardPath(response.user.role), {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Branding Section */}
        <div className="hidden bg-blue-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div>
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl font-bold text-blue-700">
                C
              </div>

              <span className="text-2xl font-bold text-white">
                CloudCare
              </span>
            </div>

            <div className="max-w-lg">
              <h1 className="text-4xl font-bold leading-tight text-white">
                Secure healthcare management,
                <span className="block text-blue-100">
                  designed for everyone.
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-blue-100">
                Access appointments, medical records, prescriptions,
                and healthcare services through one secure platform.
              </p>
            </div>
          </div>

          <p className="text-sm text-blue-200">
            CloudCare Healthcare Management Platform
          </p>
        </div>

        {/* Login Section */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                C
              </div>

              <span className="text-2xl font-bold text-slate-800">
                CloudCare
              </span>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Sign in to access your CloudCare account.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Secure access • CloudCare
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;