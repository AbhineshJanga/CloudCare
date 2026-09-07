import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = {
  PATIENT: [
    { label: "Dashboard", path: "/patient" },
    { label: "My Profile", path: "/patient/profile" },
    { label: "Appointments", path: "/patient/appointments" },
    { label: "Medical Records", path: "/patient/medical-records" },
    { label: "Prescriptions", path: "/patient/prescriptions" },
  ],

  DOCTOR: [
    { label: "Dashboard", path: "/doctor" },
    { label: "My Profile", path: "/doctor/profile" },
    { label: "Appointments", path: "/doctor/appointments" },
    { label: "My Patients", path: "/doctor/patients" },
    { label: "Medical Records", path: "/doctor/medical-records" },
    { label: "Prescriptions", path: "/doctor/prescriptions" },
  ],

  ADMIN: [
    { label: "Dashboard", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Doctors", path: "/admin/doctors" },
    { label: "Patients", path: "/admin/patients" },
    { label: "Appointments", path: "/admin/appointments" },
  ],
};

const Sidebar = ({ isOpen = true, onClose }) => {
  const { user } = useAuth();

  const items = navigation[user?.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-200
          lg:static lg:z-auto lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar heading */}
        <div className="border-b border-slate-100 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {user?.role || "Portal"}
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            Navigation
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/${user?.role?.toLowerCase()}`}
              onClick={onClose}
              className={({ isActive }) =>
                `
                  block rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-colors
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-lg bg-slate-50 px-3 py-3">
            <p className="truncate text-sm font-medium text-slate-700">
              {user?.name || "CloudCare User"}
            </p>

            <p className="mt-0.5 truncate text-xs text-slate-400">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;