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
  Calendar
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

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
  } | null;
  pengiriman: {
    statusPengiriman: string;
    kurirId: string | null;
  } | null;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadOrder();
  }, [id, router]);

  if (isLoading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
          <Loader2 style={{ width: '40px', height: '40px', color: '#0066CC' }} className="animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!order) return null;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 24px 80px' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
              Detail Pesanan
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#6B7280' }}>
              <span>#{order.nomorPesanan}</span>
              <span>•</span>
              <Calendar style={{ width: '14px', height: '14px' }} />
              <span>
                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'revert', gap: '24px' }}>
          {/* Order Items */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Produk Dipesan
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #F3F4F6', paddingBottom: '16px' }}>
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    backgroundColor: '#F9FAFB', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {item.gambarProduk ? (
                      <img src={item.gambarProduk} alt={item.namaProduk} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package style={{ width: '24px', height: '24px', color: '#D1D5DB' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                      {item.namaProduk}
                    </h3>
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
                <span style={{ fontWeight: '600', color: '#111827' }}>Total Pesanan</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0066CC' }}>
                  {formatCurrency(order.totalHarga)}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Delivery Info */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Truck style={{ width: '20px', height: '20px', color: '#0066CC' }} />
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  Informasi Pengiriman
                </h2>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Alamat Pengiriman
                </p>
                <div style={{ display: 'flex', gap: '8px', color: '#6B7280', fontSize: '0.875rem' }}>
                  <MapPin style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                  <p>{order.alamatPengiriman}</p>
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Status Pengiriman
                </p>
                <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#0066CC', fontSize: '0.875rem', fontWeight: '500' }}>
                  {order.pengiriman?.statusPengiriman || 'Menunggu'}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <CreditCard style={{ width: '20px', height: '20px', color: '#0066CC' }} />
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                  Informasi Pembayaran
                </h2>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Metode Pembayaran
                </p>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  {order.pembayaran?.metodePembayaran || '-'}
                </p>

                {order.pembayaran?.metodePembayaran === 'transfer' && order.pembayaran?.status === 'pending' && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#0369A1', marginBottom: '4px' }}>
                      Rekening Transfer:
                    </p>
                    <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0C4A6E' }}>
                      BCA 1234567890
                      <br />
                      a/n PT Indomaret Online
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Status Pembayaran
                </p>
                <div style={{ 
                  display: 'inline-block', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
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
                  fontSize: '0.875rem', 
                  fontWeight: '500' 
                }}>
                  {(() => {
                    const status = order.pembayaran?.status;
                    const method = order.pembayaran?.metodePembayaran;
                    
                    if (status === 'validated' || status === 'berhasil') return 'Lunas';
                    if (method === 'cod' && status === 'pending') return 'Bayar di Tempat';
                    if (status === 'pending') return 'Menunggu Pembayaran';
                    return status || '-';
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
