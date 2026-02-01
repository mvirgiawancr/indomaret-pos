"use client";

import { useState, useEffect } from "react";
import { 
  Truck, 
  Search, 
  Loader2,
  MapPin,
  User
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";

interface Delivery {
  id: number;
  pesananId: number;
  kurirId: string | null;
  status: string;
  tanggalDikirim: string | null;
  tanggalTerkirim: string | null;
  createdAt: string;
}

export default function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadDeliveries = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/deliveries");
        if (res.ok) {
          const data = await res.json();
          setDeliveries(data);
        }
      } catch (error) {
        console.error("Failed to load deliveries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDeliveries();
  }, []);

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diambil", label: "Diambil" },
    { value: "dalam_perjalanan", label: "Dalam Perjalanan" },
    { value: "terkirim", label: "Terkirim" },
  ];

  const filteredDeliveries = deliveries.filter(delivery => {
    return statusFilter === "all" || delivery.status === statusFilter;
  });

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
          Manajemen Pengiriman
        </h1>
        <p style={{ color: '#6B7280' }}>
          Kelola semua pengiriman
        </p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '24px' }}>
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
            minWidth: '180px'
          }}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Deliveries Table */}
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
        ) : filteredDeliveries.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    ID
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Pesanan
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Kurir
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Tanggal Kirim
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Tanggal Terima
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '500', color: '#111827' }}>
                      #{delivery.id}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#0066CC', fontWeight: '500' }}>
                      #{delivery.pesananId}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6B7280', fontSize: '0.875rem' }}>
                      {delivery.kurirId ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User style={{ width: '14px', height: '14px' }} />
                          {delivery.kurirId.slice(0, 8)}...
                        </span>
                      ) : (
                        <span style={{ color: '#9CA3AF' }}>Belum ditugaskan</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <StatusBadge status={delivery.status} />
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6B7280', fontSize: '0.875rem' }}>
                      {delivery.tanggalDikirim ? new Date(delivery.tanggalDikirim).toLocaleDateString('id-ID') : "-"}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6B7280', fontSize: '0.875rem' }}>
                      {delivery.tanggalTerkirim ? new Date(delivery.tanggalTerkirim).toLocaleDateString('id-ID') : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Truck style={{ width: '48px', height: '48px', color: '#D1D5DB', margin: '0 auto 16px' }} />
            <p style={{ color: '#6B7280' }}>
              {statusFilter !== "all" ? "Tidak ada pengiriman dengan status tersebut" : "Belum ada pengiriman"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
