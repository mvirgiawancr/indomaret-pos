"use client";

import { useState, useEffect } from "react";
import { 
  Truck, 
  Package,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";

interface DeliveryStats {
  pending: number;
  inProgress: number;
  completed: number;
  todayDeliveries: number;
}

export default function KurirDashboard() {
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/kurir/stats");
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
        <Loader2 style={{ width: '40px', height: '40px', color: '#F59E0B' }} className="animate-spin" />
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
      label: "Menunggu Diambil", 
      value: stats?.pending || 0, 
      icon: Clock, 
      color: "#D97706",
      bgColor: "#FEF3C7"
    },
    { 
      label: "Sedang Diantar", 
      value: stats?.inProgress || 0, 
      icon: Truck, 
      color: "#2563EB",
      bgColor: "#DBEAFE"
    },
    { 
      label: "Selesai", 
      value: stats?.completed || 0, 
      icon: CheckCircle, 
      color: "#10B981",
      bgColor: "#ECFDF5"
    },
    { 
      label: "Pengiriman Hari Ini", 
      value: stats?.todayDeliveries || 0, 
      icon: Package, 
      color: "#8B5CF6",
      bgColor: "#F3E8FF"
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#92400E', marginBottom: '4px' }}>
          Dashboard Kurir
        </h1>
        <p style={{ color: '#B45309' }}>
          Kelola pengiriman Anda dengan mudah
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        {statCards.map((stat, index) => (
          <div 
            key={index}
            style={{ 
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #FDE68A'
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
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#92400E', marginBottom: '4px' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#B45309' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #FDE68A'
      }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#92400E', marginBottom: '16px' }}>
          Aksi Cepat
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <a 
            href="/kurir/deliveries"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              backgroundColor: '#FEF3C7',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#B45309',
              fontWeight: '500'
            }}
          >
            <Truck style={{ width: '20px', height: '20px' }} />
            Lihat Pengiriman
          </a>
          <a 
            href="/kurir/history"
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
            <CheckCircle style={{ width: '20px', height: '20px' }} />
            Riwayat Pengiriman
          </a>
        </div>
      </div>
    </div>
  );
}
