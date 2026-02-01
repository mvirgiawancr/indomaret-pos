"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CreditCard, 
  Clock, 
  Loader2,
  MapPin,
  Calendar,
  Save,
  User,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { ConfirmModal } from "@/components/confirm-modal";
import { SuccessModal } from "@/components/success-modal";

interface OrderDetail {
  id: number;
  nomorPesanan: string;
  totalHarga: number;
  status: string;
  alamatPengiriman: string;
  catatan: string | null;
  createdAt: string;
  items: {
    id: number;
    jumlah: number;
    harga: number;
    namaProduk: string;
    gambarProduk: string | null;
  }[];
  pembayaran: {
    status: string;
    metodePembayaran: string;
    buktiPembayaran: string | null;
  } | null;
  pengiriman: {
    id: number;
    status: string;
    kurirId: string | null;
  } | null;
}

interface Courier {
  id: string;
  name: string;
  email: string;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  
  // Status update modal
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    newStatus: "",
    isLoading: false
  });

  // Success modal state
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Order
        const orderRes = await fetch(`/api/orders/${id}`);
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          setOrder(orderData);
          if (orderData.pengiriman?.kurirId) {
            setSelectedCourier(orderData.pengiriman.kurirId);
          }
        } else {
          router.push("/admin/orders");
          return;
        }

        // Fetch Couriers
        const couriersRes = await fetch("/api/admin/couriers");
        if (couriersRes.ok) {
          const couriersData = await couriersRes.json();
          setCouriers(couriersData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleStatusUpdate = async () => {
    if (!order) return;
    setStatusModal(prev => ({ ...prev, isLoading: true }));

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusModal.newStatus }),
      });

      if (res.ok) {
        setOrder(prev => prev ? { ...prev, status: statusModal.newStatus } : null);
        setOrder(prev => prev ? { ...prev, status: statusModal.newStatus } : null);
        setStatusModal({ isOpen: false, newStatus: "", isLoading: false });
        setSuccessModal({
          isOpen: true,
          title: "Status Diperbarui",
          message: `Status pesanan berhasil diubah menjadi "${statusModal.newStatus}"`
        });
      } else {
        alert("Gagal memperbarui status");
        setStatusModal(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setStatusModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCourierAssign = async () => {
    if (!order || !order.pengiriman) return;
    if (!selectedCourier) {
      alert("Pilih kurir terlebih dahulu");
      return;
    }

    setIsSaving(true);
    try {
      // Assuming we need a new API or reuse existing one. 
      // Since I haven't made a dedicated assignment API, I'll update the 'pengiriman' table directly?
      // Actually, I should probably create an API for this.
      // But for now, let's assume I need to create one.
      // Wait, I can update sending logic here.
      
      const res = await fetch(`/api/admin/deliveries/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          pengirimanId: order.pengiriman.id,
          kurirId: selectedCourier 
        }),
      });

      if (res.ok) {
        setSuccessModal({
          isOpen: true,
          title: "Kurir Ditugaskan",
          message: "Kurir berhasil ditugaskan untuk pengiriman ini."
        });
        // Update local state
        setOrder(prev => prev ? {
          ...prev,
          pengiriman: { ...prev.pengiriman!, kurirId: selectedCourier }
        } : null);
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menugaskan kurir");
      }
    } catch (error) {
      console.error("Error assigning courier:", error);
      alert("Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  const openStatusModal = (status: string) => {
    setStatusModal({
      isOpen: true,
      newStatus: status,
      isLoading: false
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
        <Loader2 style={{ width: '40px', height: '40px', color: '#0066CC' }} className="animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div style={{ padding: '24px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <button
        onClick={() => router.back()}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: '#6B7280',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '24px',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}
      >
        <ArrowLeft style={{ width: '18px', height: '18px' }} />
        Kembali ke Daftar Pesanan
      </button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            {order.nomorPesanan}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6B7280' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar style={{ width: '16px', height: '16px' }} />
              <span style={{ fontSize: '0.875rem' }}>
                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User style={{ width: '16px', height: '16px' }} />
              <span style={{ fontSize: '0.875rem' }}>Customer ID: {order.items[0]?.id ? 'User' : 'Guest'}</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <StatusBadge status={order.status} />
          
          {order.status === 'menunggu' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => openStatusModal("diproses")}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#0066CC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Proses Pesanan
              </button>
              <button
                onClick={() => openStatusModal("dibatalkan")}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Batalkan
              </button>
            </div>
          )}
          
          {order.status === 'diproses' && (
            <button
               onClick={() => openStatusModal("dikirim")} // Usually managed by courier assignment or manual
               style={{
                 padding: '10px 16px',
                 backgroundColor: '#059669',
                 color: 'white',
                 border: 'none',
                 borderRadius: '8px',
                 fontWeight: '600',
                 cursor: 'pointer'
               }}
             >
               Kirim Pesanan
             </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'revert', gap: '24px' }} className="lg:grid-cols-3">
        {/* Main Content - 2 Columns */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Order Items */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
              Produk Dipesan
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ 
                    width: '64px', height: '64px', backgroundColor: '#F9FAFB', 
                    borderRadius: '8px', overflow: 'hidden', flexShrink: 0 
                  }}>
                    {item.gambarProduk ? (
                      <img src={item.gambarProduk} alt={item.namaProduk} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package style={{ width: '100%', height: '100%', padding: '16px', color: '#D1D5DB' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '500', color: '#111827' }}>{item.namaProduk}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      {item.jumlah} x {formatCurrency(item.harga)}
                    </p>
                  </div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>
                    {formatCurrency(item.jumlah * item.harga)}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                <span style={{ fontWeight: '600', color: '#111827' }}>Total</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0066CC' }}>
                  {formatCurrency(order.totalHarga)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Assignment */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                Penugasan Kurir
              </h2>
              {order.pengiriman?.status && (
                <span style={{ 
                  padding: '4px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', 
                  color: '#0066CC', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' 
                }}>
                  {order.pengiriman.status.replace("_", " ")}
                </span>
              )}
            </div>

            {order.status === 'dibatalkan' ? (
              <div style={{ padding: '12px', backgroundColor: '#FEF2F2', borderRadius: '8px', color: '#DC2626', fontSize: '0.875rem' }}>
                Pesanan dibatalkan, tidak perlu penugasan kurir.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Pilih Kurir
                  </label>
                  <select
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                    style={{ 
                      width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', 
                      fontSize: '0.875rem', outline: 'none', backgroundColor: 'white'
                    }}
                  >
                    <option value="">-- Pilih Kurir --</option>
                    {couriers.map(courier => (
                      <option key={courier.id} value={courier.id}>{courier.name} ({courier.email})</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleCourierAssign}
                  disabled={isSaving || !selectedCourier}
                  style={{ 
                    padding: '10px 20px', backgroundColor: '#0066CC', color: 'white', border: 'none', 
                    borderRadius: '8px', fontWeight: '600', cursor: (isSaving || !selectedCourier) ? 'not-allowed' : 'pointer',
                    opacity: (isSaving || !selectedCourier) ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  {isSaving ? <Loader2 className="animate-spin" style={{ width: '18px', height: '18px' }} /> : <Save style={{ width: '18px', height: '18px' }} />}
                  Simpan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Customer & Address */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
              Info Pengiriman
            </h2>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <MapPin style={{ width: '20px', height: '20px', color: '#6B7280', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Alamat Tujuan</p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.5' }}>
                  {order.alamatPengiriman}
                </p>
              </div>
            </div>
            {order.catatan && (
              <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                <AlertCircle style={{ width: '20px', height: '20px', color: '#F59E0B', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Catatan</p>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{order.catatan}</p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
              Pembayaran
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <CreditCard style={{ width: '20px', height: '20px', color: '#6B7280' }} />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Metode</p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', textTransform: 'capitalize' }}>
                  {order.pembayaran?.metodePembayaran || '-'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px' }} />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Status</p>
                <span style={{ 
                  display: 'inline-block', marginTop: '4px', padding: '2px 8px', borderRadius: '4px',
                  backgroundColor: (() => {
                    const status = order.pembayaran?.status;
                    const method = order.pembayaran?.metodePembayaran;
                    if (status === 'validated' || status === 'berhasil') return '#ECFDF5';
                    if (method === 'cod' && status === 'pending') return '#EFF6FF';
                    return '#FEF2F2';
                  })(),
                  color: (() => {
                    const status = order.pembayaran?.status;
                    const method = order.pembayaran?.metodePembayaran;
                    if (status === 'validated' || status === 'berhasil') return '#10B981';
                    if (method === 'cod' && status === 'pending') return '#0066CC';
                    return '#DC2626';
                  })(),
                  fontSize: '0.75rem', fontWeight: '600'
                }}>
                  {(() => {
                    const status = order.pembayaran?.status;
                    const method = order.pembayaran?.metodePembayaran;
                    
                    if (status === 'validated' || status === 'berhasil') return 'Lunas';
                    if (method === 'cod' && status === 'pending') return 'Bayar di Tempat';
                    if (status === 'pending') return 'Menunggu Pembayaran';
                    return status || '-';
                  })()}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <ConfirmModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleStatusUpdate}
        title="Konfirmasi Perubahan"
        message={`Apakah Anda yakin ingin mengubah status pesanan menjadi "${statusModal.newStatus}"?`}
        confirmText="Ya, Ubah"
        isLoading={statusModal.isLoading}
        variant={statusModal.newStatus === 'dibatalkan' ? 'danger' : 'info'}
      />

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
