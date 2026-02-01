"use client";

import { useState, useEffect } from "react";
import { 
  Package,
  Loader2,
  CheckCircle,
  MapPin,
  Calendar
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { useSession } from "@/lib/auth-client";

interface Delivery {
  id: number;
  pesananId: number;
  status: string;
  tanggalDikirim: string | null;
  tanggalTerkirim: string | null;
  createdAt: string;
}

export default function KurirHistoryPage() {
  const { data: session } = useSession();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/kurir/history");
        if (res.ok) {
          const data = await res.json();
          setDeliveries(data);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [session]);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#92400E', marginBottom: '4px' }}>
          Riwayat Pengiriman
        </h1>
        <p style={{ color: '#B45309' }}>
          Daftar pengiriman yang sudah selesai
        </p>
      </div>

      {/* History List */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#F59E0B' }} className="animate-spin" />
        </div>
      ) : deliveries.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {deliveries.map((delivery) => (
            <div 
              key={delivery.id}
              style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #FDE68A',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#92400E' }}>
                      Pesanan #{delivery.pesananId}
                    </span>
                    <StatusBadge status={delivery.status} size="sm" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem', color: '#B45309' }}>
                    {delivery.tanggalDikirim && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar style={{ width: '12px', height: '12px' }} />
                        Dikirim: {new Date(delivery.tanggalDikirim).toLocaleDateString('id-ID')}
                      </span>
                    )}
                    {delivery.tanggalTerkirim && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle style={{ width: '12px', height: '12px', color: '#10B981' }} />
                        Selesai: {new Date(delivery.tanggalTerkirim).toLocaleDateString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>
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
            Belum ada riwayat pengiriman
          </p>
        </div>
      )}
    </div>
  );
}
