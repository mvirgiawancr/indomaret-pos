"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Truck,
  TrendingUp,
  DollarSign,
  Loader2,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalDeliveries: number;
  pendingOrders: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setError("Gagal memuat statistik");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 style={{ width: '40px', height: '40px', color: '#0066CC' }} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '8px',
          color: '#DC2626'
        }}>
          <AlertCircle style={{ width: '20px', height: '20px' }} />
          {error}
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Total Produk", 
      value: stats?.totalProducts || 0, 
      icon: Package, 
      color: "#0066CC",
      bgColor: "#EFF6FF",
      href: "/admin/products"
    },
    { 
      label: "Total Pesanan", 
      value: stats?.totalOrders || 0, 
      icon: ShoppingCart, 
      color: "#10B981",
      bgColor: "#ECFDF5",
      href: "/admin/orders"
    },
    { 
      label: "Total Pengguna", 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: "#8B5CF6",
      bgColor: "#F3E8FF",
      href: "/admin/users"
    },
    { 
      label: "Pengiriman", 
      value: stats?.totalDeliveries || 0, 
      icon: Truck, 
      color: "#F59E0B",
      bgColor: "#FFFBEB",
      href: "/admin/deliveries"
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
          Dashboard Admin
        </h1>
        <p style={{ color: '#6B7280' }}>
          Selamat datang kembali! Berikut ringkasan toko Anda.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        {statCards.map((stat, index) => (
          <a 
            key={index}
            href={stat.href}
            style={{ 
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #E5E7EB',
              textDecoration: 'none',
              transition: 'box-shadow 0.2s ease'
            }}
          >
            <div style={{ 
              width: '48px',
              height: '48px',
              backgroundColor: stat.bgColor,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <stat.icon style={{ width: '24px', height: '24px', color: stat.color }} />
            </div>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              {stat.label}
            </p>
          </a>
        ))}
      </div>

      {/* Revenue Card */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #E5E7EB',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ 
            width: '48px',
            height: '48px',
            backgroundColor: '#ECFDF5',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarSign style={{ width: '24px', height: '24px', color: '#10B981' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Total Pendapatan (Pesanan Selesai)</p>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>
              {formatCurrency(Number(stats?.revenue) || 0)}
            </p>
          </div>
        </div>
        {(stats?.pendingOrders || 0) > 0 && (
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#FEF3C7',
            borderRadius: '8px'
          }}>
            <ShoppingCart style={{ width: '18px', height: '18px', color: '#D97706' }} />
            <span style={{ fontSize: '0.875rem', color: '#92400E' }}>
              {stats?.pendingOrders} pesanan menunggu konfirmasi
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #E5E7EB'
      }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
          Aksi Cepat
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <a 
            href="/admin/products"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              backgroundColor: '#EFF6FF',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#0066CC',
              fontWeight: '500'
            }}
          >
            <Package style={{ width: '20px', height: '20px' }} />
            Kelola Produk
          </a>
          <a 
            href="/admin/orders"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              backgroundColor: '#ECFDF5',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#10B981',
              fontWeight: '500'
            }}
          >
            <ShoppingCart style={{ width: '20px', height: '20px' }} />
            Lihat Pesanan
          </a>
          <a 
            href="/admin/users"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              backgroundColor: '#F3E8FF',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#8B5CF6',
              fontWeight: '500'
            }}
          >
            <Users style={{ width: '20px', height: '20px' }} />
            Kelola Pengguna
          </a>
        </div>
      </div>
    </div>
  );
}
