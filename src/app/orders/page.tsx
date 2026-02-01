"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  ChevronRight,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  ShoppingBag
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useSession } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";

interface Order {
  id: number;
  nomorPesanan: string;
  totalHarga: number;
  status: string;
  alamatPengiriman: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session, isPending } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!session?.user?.id) return;
      
      setIsLoading(true);
      try {
        const res = await fetch(`/api/orders?userId=${session.user.id}`);
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

    if (session?.user?.id) {
      loadOrders();
    } else if (!isPending) {
      setIsLoading(false);
    }
  }, [session, isPending]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "menunggu":
        return <Clock style={{ width: '16px', height: '16px' }} />;
      case "diproses":
        return <Package style={{ width: '16px', height: '16px' }} />;
      case "dikirim":
        return <Truck style={{ width: '16px', height: '16px' }} />;
      case "selesai":
        return <CheckCircle style={{ width: '16px', height: '16px' }} />;
      case "dibatalkan":
        return <XCircle style={{ width: '16px', height: '16px' }} />;
      default:
        return <Clock style={{ width: '16px', height: '16px' }} />;
    }
  };

  if (isPending || isLoading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <Navbar />
        <div style={{ paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Loader2 style={{ width: '40px', height: '40px', color: '#0066CC' }} className="animate-spin" />
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <Navbar />
        <div style={{ paddingTop: '120px', textAlign: 'center', padding: '80px 24px' }}>
          <Package style={{ width: '64px', height: '64px', color: '#D1D5DB', margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
            Silakan Login
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>
            Anda perlu login untuk melihat pesanan Anda
          </p>
          <Link 
            href="/login" 
            style={{ 
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#0066CC',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Login Sekarang
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Navbar />
      
      {/* Header */}
      <section style={{ 
        paddingTop: '100px', 
        paddingBottom: '24px',
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Pesanan Saya
          </h1>
          <p style={{ color: '#6B7280' }}>
            Lacak dan kelola pesanan Anda
          </p>
        </div>
      </section>

      <section style={{ padding: '32px 0 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {orders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  style={{ 
                    display: 'block',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    padding: '20px',
                    textDecoration: 'none',
                    transition: 'box-shadow 0.2s ease'
                  }}
                  className="card-hover"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#0066CC' }}>
                          #{order.nomorPesanan}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
                        {order.alamatPengiriman}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '4px' }}>Total</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>
                          {formatCurrency(order.totalHarga)}
                        </p>
                      </div>
                      <ChevronRight style={{ width: '20px', height: '20px', color: '#9CA3AF' }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                backgroundColor: '#EFF6FF',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <ShoppingBag style={{ width: '40px', height: '40px', color: '#0066CC' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                Belum Ada Pesanan
              </h2>
              <p style={{ color: '#6B7280', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                Anda belum memiliki pesanan. Yuk mulai belanja dan pesan produk favorit Anda!
              </p>
              <Link 
                href="/products" 
                style={{ 
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#0066CC',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Mulai Belanja
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
