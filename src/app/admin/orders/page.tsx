"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  Search, 
  Eye,
  Loader2,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { ConfirmModal } from "@/components/confirm-modal";

interface Order {
  id: number;
  nomorPesanan: string;
  userId: string;
  totalHarga: number;
  status: string;
  alamatPengiriman: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    orderId: 0,
    isLoading: false
  });

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelClick = (orderId: number) => {
    setCancelModal({
      isOpen: true,
      orderId,
      isLoading: false
    });
  };

  const handleConfirmCancel = async () => {
    setCancelModal(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`/api/admin/orders/${cancelModal.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "dibatalkan" }),
      });

      if (res.ok) {
        setCancelModal({ isOpen: false, orderId: 0, isLoading: false });
        loadOrders();
      } else {
        alert("Gagal membatalkan pesanan");
        setCancelModal(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Terjadi kesalahan");
      setCancelModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diproses", label: "Diproses" },
    { value: "dikirim", label: "Dikirim" },
    { value: "selesai", label: "Selesai" },
    { value: "dibatalkan", label: "Dibatalkan" },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.nomorPesanan?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
          Manajemen Pesanan
        </h1>
        <p style={{ color: '#6B7280' }}>
          Kelola semua pesanan pelanggan
        </p>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
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
            placeholder="Cari nomor pesanan..."
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ 
            padding: '10px 16px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '0.875rem',
            outline: 'none',
            backgroundColor: 'white',
            cursor: 'pointer',
            minWidth: '160px'
          }}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
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
        ) : filteredOrders.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    No. Pesanan
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Total
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Alamat
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Tanggal
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontWeight: '600', color: '#0066CC' }}>
                        #{order.nomorPesanan}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>
                        {formatCurrency(order.totalHarga)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6B7280', fontSize: '0.875rem', maxWidth: '200px' }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.alamatPengiriman}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6B7280', fontSize: '0.875rem' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID') : "-"}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <Link href={`/admin/orders/${order.id}`} style={{ textDecoration: 'none' }}>
                        <button style={{ 
                          padding: '6px 12px',
                          backgroundColor: '#EFF6FF',
                          color: '#0066CC',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Eye style={{ width: '14px', height: '14px' }} />
                          Detail
                        </button>
                      </Link>
                      
                      {/* Cancel Button */}
                      {(order.status === "menunggu" || order.status === "diproses") && (
                        <button 
                          onClick={() => handleCancelClick(order.id)}
                          style={{ 
                            padding: '6px 12px',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <XCircle style={{ width: '14px', height: '14px' }} />
                          Batalkan
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
            <ShoppingCart style={{ width: '48px', height: '48px', color: '#D1D5DB', margin: '0 auto 16px' }} />
            <p style={{ color: '#6B7280' }}>
              {searchQuery || statusFilter !== "all" ? "Tidak ada pesanan yang cocok" : "Belum ada pesanan"}
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ ...cancelModal, isOpen: false })}
        onConfirm={handleConfirmCancel}
        title="Batalkan Pesanan"
        message="Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Batalkan"
        cancelText="Kembali"
        variant="danger"
        isLoading={cancelModal.isLoading}
      />
    </div>
  );
}
