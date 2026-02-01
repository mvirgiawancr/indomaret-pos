import Link from "next/link";
import { Package, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#111827', color: 'white', padding: '64px 0 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                backgroundColor: '#0066CC', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                <span style={{ color: '#60A5FA' }}>Indo</span>
                <span style={{ color: '#F87171' }}>maret</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: '1.6' }}>
              Sistem Informasi Pemesanan dan Pengiriman Produk Online Indomaret.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '16px', color: 'white' }}>
              Link Cepat
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/products" style={{ fontSize: '0.875rem', color: '#9CA3AF', textDecoration: 'none' }}>
                Produk
              </Link>
              <Link href="/orders" style={{ fontSize: '0.875rem', color: '#9CA3AF', textDecoration: 'none' }}>
                Pesanan Saya
              </Link>
              <Link href="/cart" style={{ fontSize: '0.875rem', color: '#9CA3AF', textDecoration: 'none' }}>
                Keranjang
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '16px', color: 'white' }}>
              Kontak
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail style={{ width: '16px', height: '16px', color: '#9CA3AF' }} />
                <span style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>support@indomaret.co.id</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone style={{ width: '16px', height: '16px', color: '#9CA3AF' }} />
                <span style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>1500-178</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin style={{ width: '16px', height: '16px', color: '#9CA3AF', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>STMIK Mardira Indonesia, Bandung</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ 
          borderTop: '1px solid #374151', 
          paddingTop: '24px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
            © 2026 Indomaret Online
          </p>
        </div>
      </div>
    </footer>
  );
}
