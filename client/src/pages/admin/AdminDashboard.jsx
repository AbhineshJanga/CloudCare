import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/admin.service";

import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Loading from "../../components/common/Loading";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getDashboardStats();

                setStats(response.stats);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard statistics."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Admin Dashboard"
                description="Monitor and manage the CloudCare healthcare platform."
            />

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {stats && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Users"
                        value={stats.total_users}
                    />

                    <StatCard
                        title="Total Patients"
                        value={stats.total_patients}
                    />

                    <StatCard
                        title="Total Doctors"
                        value={stats.total_doctors}
                    />

                    <StatCard
                        title="Total Appointments"
                        value={stats.total_appointments}
                    />
                </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                    System Overview
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                    Use the administration panel to manage users, doctors,
                    patients, and appointments across the CloudCare platform.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;