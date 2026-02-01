"use client";

import { useState, useEffect } from "react";
import { 
  Truck, 
  MapPin,
  Phone,
  Loader2,
  CheckCircle,
  Navigation,
  Package,
  ShoppingBag
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { SuccessModal } from "@/components/success-modal";
import { useSession } from "@/lib/auth-client";

interface Delivery {
  id: number;
  pesananId: number;
  status: string;
  kurirId: string | null;
  tanggalDikirim: string | null;
  tanggalTerkirim: string | null;
  createdAt: string;
  pesanan?: {
    alamatPengiriman: string;
    detailPesanan: {
        produk: {
            nama: string;
        };
        jumlah: number;
    }[];
  };
}

export default function KurirDeliveriesPage() {
  const { data: session } = useSession();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [successModal, setSuccessModal] = useState({
        isOpen: false,
        title: "",
        message: ""
  });

  const loadDeliveries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/kurir/deliveries");
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

  useEffect(() => {
    loadDeliveries();
  }, [session]);

  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diambil", label: "Diambil" },
    { value: "dalam_perjalanan", label: "Dalam Perjalanan" },
  ];

  const filteredDeliveries = deliveries.filter(d => 
    statusFilter === "all" || d.status === statusFilter
  );

  const handleUpdateStatus = async (deliveryId: number, newStatus: string) => {
    setUpdatingId(deliveryId);
    try {
      const res = await fetch(`/api/kurir/deliveries/${deliveryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSuccessModal({
            isOpen: true,
            title: "Status Diperbarui",
            message: `Status pengiriman berhasil diubah menjadi "${newStatus.replace("_", " ")}"`
        });
        loadDeliveries();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#92400E', marginBottom: '4px' }}>
          Pengiriman Saya
        </h1>
        <p style={{ color: '#B45309' }}>
          Daftar pengiriman yang perlu Anda antar
        </p>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '24px' }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ 
            padding: '10px 16px',
            border: '1px solid #FDE68A',
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

      {/* Deliveries List */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#F59E0B' }} className="animate-spin" />
        </div>
      ) : filteredDeliveries.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredDeliveries.map((delivery) => (
            <div 
              key={delivery.id}
              style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #FDE68A',
                padding: '20px'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', color: '#92400E' }}>
                      Pesanan #{delivery.pesananId}
                    </span>
                    <StatusBadge status={delivery.status} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#B45309', marginBottom: '8px' }}>
                    {new Date(delivery.createdAt).toLocaleDateString('id-ID')}
                  </p>
                  
                  {/* Address Section */}
                  {delivery.pesanan?.alamatPengiriman && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <MapPin style={{ width: '16px', height: '16px', color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                            {delivery.pesanan.alamatPengiriman}
                        </span>
                    </div>
                  )}

                   {/* Products Section */}
                   {delivery.pesanan?.detailPesanan && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <ShoppingBag style={{ width: '16px', height: '16px', color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                           {delivery.pesanan.detailPesanan.map((item, idx) => (
                               <div key={idx}>
                                   {item.jumlah}x {item.produk?.nama}
                               </div>
                           ))}
                        </div>
                      </div>
                   )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {delivery.status === "menunggu" && (
                  <button
                    onClick={() => handleUpdateStatus(delivery.id, "diambil")}
                    disabled={updatingId === delivery.id}
                    style={{ 
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: '#0066CC',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: updatingId === delivery.id ? 'not-allowed' : 'pointer',
                      opacity: updatingId === delivery.id ? 0.7 : 1
                    }}
                  >
                    {updatingId === delivery.id ? (
                      <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />
                    ) : (
                      <Truck style={{ width: '16px', height: '16px' }} />
                    )}
                    Ambil Pesanan
                  </button>
                )}
                {delivery.status === "diambil" && (
                  <button
                    onClick={() => handleUpdateStatus(delivery.id, "dalam_perjalanan")}
                    disabled={updatingId === delivery.id}
                    style={{ 
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: '#F59E0B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: updatingId === delivery.id ? 'not-allowed' : 'pointer',
                      opacity: updatingId === delivery.id ? 0.7 : 1
                    }}
                  >
                    {updatingId === delivery.id ? (
                      <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />
                    ) : (
                      <Navigation style={{ width: '16px', height: '16px' }} />
                    )}
                    Mulai Antar
                  </button>
                )}
                {delivery.status === "dalam_perjalanan" && (
                  <button
                    onClick={() => handleUpdateStatus(delivery.id, "terkirim")}
                    disabled={updatingId === delivery.id}
                    style={{ 
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: updatingId === delivery.id ? 'not-allowed' : 'pointer',
                      opacity: updatingId === delivery.id ? 0.7 : 1
                    }}
                  >
                    {updatingId === delivery.id ? (
                      <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />
                    ) : (
                      <CheckCircle style={{ width: '16px', height: '16px' }} />
                    )}
                    Selesai Antar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #FDE68A',
          textAlign: 'center', 
          padding: '60px' 
        }}>
          <Package style={{ width: '48px', height: '48px', color: '#FDE68A', margin: '0 auto 16px' }} />
          <p style={{ color: '#B45309' }}>
            {statusFilter !== "all" ? "Tidak ada pengiriman dengan status tersebut" : "Tidak ada pengiriman untuk Anda saat ini"}
          </p>
        </div>
      )}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
        closeText="Tutup"
      />
    </div>
  );
}
