import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/admin.service";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Badge from "../../components/common/Badge";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "PATIENT",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUsers();
      setUsers(response.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      role: user.role || "PATIENT",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingUser(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingUser) {
        const updateData = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
        };

        const response = await updateUser(
          editingUser.user_id,
          updateData
        );

        setUsers((previous) =>
          previous.map((user) =>
            user.user_id === editingUser.user_id
              ? response.user
              : user
          )
        );
      } else {
        const response = await createUser(form);

        setUsers((previous) => [
          ...previous,
          response.user,
        ]);
      }

      closeModal();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (user.role === "ADMIN") {
      setError("Admin users cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteUser(user.user_id);

      setUsers((previous) =>
        previous.filter(
          (item) => item.user_id !== user.user_id
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete user."
      );
    }
  };

  const columns = [
    {
      key: "user_id",
      label: "ID",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Phone",
      render: (user) => user.phone || "—",
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <Badge>{user.role}</Badge>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (user) =>
        user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "—",
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openEditModal(user)}
          >
            Edit
          </Button>

          {user.role !== "ADMIN" && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(user)}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Create, update, and manage CloudCare users."
        action={
          <Button onClick={openCreateModal}>
            Add User
          </Button>
        }
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="There are currently no users in the system."
        />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          rowKey={(user) => user.user_id}
          emptyMessage="No users available."
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingUser ? "Edit User" : "Create User"}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {!editingUser && (
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          )}

          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Role
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingUser
                  ? "Update User"
                  : "Create User"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;