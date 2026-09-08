import { useEffect, useState } from "react";
import { getPatients } from "../../services/admin.service";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Badge from "../../components/common/Badge";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPatients();

        setPatients(response.patients || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load patients."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const columns = [
    {
      key: "patient_id",
      label: "ID",
    },
    {
      key: "name",
      label: "Patient",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Phone",
      render: (patient) => patient.phone || "—",
    },
    {
      key: "date_of_birth",
      label: "Date of Birth",
      render: (patient) =>
        patient.date_of_birth
          ? new Date(patient.date_of_birth).toLocaleDateString()
          : "—",
    },
    {
      key: "gender",
      label: "Gender",
      render: (patient) => patient.gender || "—",
    },
    {
      key: "address",
      label: "Address",
      render: (patient) => patient.address || "—",
    },
    {
      key: "status",
      label: "Status",
      render: () => <Badge>ACTIVE</Badge>,
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="View and monitor registered patients on the CloudCare platform."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {patients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description="There are currently no patients registered in the system."
        />
      ) : (
        <DataTable
          columns={columns}
          data={patients}
          rowKey={(patient) => patient.patient_id}
          emptyMessage="No patients available."
        />
      )}
    </div>
  );
};

export default AdminPatients;