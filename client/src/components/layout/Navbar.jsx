import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
            C
          </div>

          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900">
              CloudCare
            </h1>

            <p className="hidden text-xs text-slate-400 sm:block">
              Healthcare Management Platform
            </p>
          </div>
        </div>

        {/* User section */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user.name}
              </p>

              <p className="text-xs text-slate-500">
                {user.role}
              </p>
            </div>
          )}

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="px-3 py-2"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;