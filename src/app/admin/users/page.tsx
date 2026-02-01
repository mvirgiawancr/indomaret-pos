"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Shield,
  Truck,
  User,
  Loader2,
  Check,
  X
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  no_telepon: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditRole = (user: UserData) => {
    setEditingUser(user.id);
    setEditRole(user.role || "pengguna");
  };

  const handleSaveRole = async (userId: string) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole, status: "aktif" }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, role: editRole } : u
        ));
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield style={{ width: '14px', height: '14px' }} />;
      case "kurir":
        return <Truck style={{ width: '14px', height: '14px' }} />;
      default:
        return <User style={{ width: '14px', height: '14px' }} />;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "admin":
        return { backgroundColor: '#DBEAFE', color: '#1D4ED8' };
      case "kurir":
        return { backgroundColor: '#FEF3C7', color: '#D97706' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
          Manajemen Pengguna
        </h1>
        <p style={{ color: '#6B7280' }}>
          Kelola semua pengguna dan ubah role mereka
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            width: '18px',
            height: '18px',
            color: '#9CA3AF'
          }} />
          <input
            type="text"
            placeholder="Cari pengguna..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: 'white'
            }}
          />
        </div>
      </div>

      {/* Users List */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden'
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
            <Loader2 style={{ width: '32px', height: '32px', color: '#0066CC' }} className="animate-spin" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Pengguna
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Role
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Bergabung
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#EFF6FF',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <User style={{ width: '20px', height: '20px', color: '#0066CC' }} />
                        </div>
                        <div>
                          <p style={{ fontWeight: '500', color: '#111827' }}>{user.name || "Unnamed"}</p>
                          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {editingUser === user.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          style={{ 
                            padding: '6px 10px',
                            border: '2px solid #0066CC',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            backgroundColor: 'white'
                          }}
                        >
                          <option value="pengguna">Pengguna</option>
                          <option value="kurir">Kurir</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          ...getRoleBadgeStyle(user.role)
                        }}>
                          {getRoleIcon(user.role)}
                          {user.role || "pengguna"}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <StatusBadge status={user.status || "aktif"} />
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6B7280', fontSize: '0.875rem' }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : "-"}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      {editingUser === user.id ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleSaveRole(user.id)}
                            disabled={isSaving}
                            style={{ 
                              padding: '6px 12px',
                              backgroundColor: '#10B981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {isSaving ? (
                              <Loader2 style={{ width: '14px', height: '14px' }} className="animate-spin" />
                            ) : (
                              <Check style={{ width: '14px', height: '14px' }} />
                            )}
                            Simpan
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            style={{ 
                              padding: '6px 12px',
                              backgroundColor: '#F3F4F6',
                              color: '#374151',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <X style={{ width: '14px', height: '14px' }} />
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditRole(user)}
                          style={{ 
                            padding: '6px 12px',
                            backgroundColor: '#EFF6FF',
                            color: '#0066CC',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Ubah Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Users style={{ width: '48px', height: '48px', color: '#D1D5DB', margin: '0 auto 16px' }} />
            <p style={{ color: '#6B7280' }}>
              {searchQuery ? "Tidak ada pengguna yang cocok" : "Belum ada pengguna"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
