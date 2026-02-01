"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Truck, 
  Shield, 
  Clock,
  ArrowRight,
  Package,
  ShoppingCart,
  Loader2
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Produk } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const [featuredProducts, setFeaturedProducts] = useState<Produk[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if logged in
  useEffect(() => {
    if (!isSessionLoading && session) {
      const role = (session.user as any).role;
      if (role === "admin") {
        router.replace("/admin");
      } else if (role === "kurir") {
        router.replace("/kurir");
      } else {
        router.replace("/products");
      }
    }
  }, [session, isSessionLoading, router]);

  // Only load products if not logged in (to save resources/flicker)
  useEffect(() => {
    if (session) return; // Skip if logged in
    
    const loadFeaturedProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products?featured=true&limit=4");
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFeaturedProducts();
  }, [session]);

  const features = [
    {
      icon: ShoppingBag,
      title: "Produk Lengkap",
      description: "Ribuan produk kebutuhan sehari-hari",
    },
    {
      icon: Truck,
      title: "Pengiriman Cepat",
      description: "Kurir profesional siap mengantar",
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      description: "Transaksi aman dan terjamin",
    },
    {
      icon: Clock,
      title: "Layanan 24/7",
      description: "Selalu siap melayani Anda",
    },
  ];

  // Show loader while checking session to prevent flash of content
  if (isSessionLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <Loader2 style={{ width: '40px', height: '40px', color: '#0066CC' }} className="animate-spin" />
      </div>
    );
  }

  // If session exists (redirecting...), or specific check, we can return null or loader
  if (session) return null;

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section - Clean & Simple */}
      <section style={{ 
        backgroundColor: '#0066CC', 
        paddingTop: '120px', 
        paddingBottom: '80px' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            color: 'white', 
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Belanja Online Indomaret
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'rgba(255,255,255,0.9)', 
            maxWidth: '600px', 
            margin: '0 auto 32px',
            lineHeight: '1.6'
          }}>
            Belanja kebutuhan sehari-hari dengan mudah dan cepat. 
            Pengiriman langsung ke rumah Anda.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/products" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: 'white', 
                color: '#0066CC', 
                padding: '12px 24px', 
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'opacity 0.15s'
              }}
            >
              Mulai Belanja
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </Link>
            <Link 
              href="/register" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: 'transparent', 
                color: 'white', 
                padding: '12px 24px', 
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.5)'
              }}
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Kenapa Belanja di Indomaret Online?
            </h2>
            <p style={{ color: '#6B7280', maxWidth: '500px', margin: '0 auto' }}>
              Pengalaman belanja online terbaik untuk Anda
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px' 
          }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                style={{ 
                  backgroundColor: 'white', 
                  padding: '24px', 
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: '#EFF6FF', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <feature.icon style={{ width: '24px', height: '24px', color: '#0066CC' }} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                Produk Populer
              </h2>
              <p style={{ color: '#6B7280' }}>Produk terlaris pilihan pelanggan</p>
            </div>
            <Link 
              href="/products" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px',
                color: '#0066CC', 
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Lihat Semua
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <Loader2 style={{ width: '32px', height: '32px', color: '#0066CC' }} className="animate-spin" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '24px' 
            }}>
              {featuredProducts.map((product) => (
                <div 
                  key={product.id}
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden'
                  }}
                  className="card-hover"
                >
                  <Link href={`/products/${product.id}`}>
                    <div style={{ 
                      aspectRatio: '1', 
                      backgroundColor: '#F9FAFB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {product.gambar ? (
                        <img src={product.gambar} alt={product.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Package style={{ width: '48px', height: '48px', color: '#D1D5DB' }} />
                      )}
                    </div>
                  </Link>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                      {product.nama}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '700', color: '#0066CC' }}>
                        {formatCurrency(product.harga)}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                        Stok: {product.stok}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '64px 24px',
              backgroundColor: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid #E5E7EB'
            }}>
              <Package style={{ width: '48px', height: '48px', color: '#D1D5DB', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                Produk Segera Hadir
              </h3>
              <p style={{ color: '#6B7280', marginBottom: '24px' }}>
                Produk akan segera ditambahkan oleh admin
              </p>
              <Link href="/products" className="btn btn-primary">
                <ShoppingCart style={{ width: '18px', height: '18px' }} />
                Lihat Katalog
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ 
            backgroundColor: '#0066CC', 
            borderRadius: '16px',
            padding: '48px 32px',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '12px' }}>
              Siap Mulai Belanja?
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
              Daftar sekarang dan nikmati kemudahan berbelanja online
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                href="/register" 
                style={{ 
                  backgroundColor: 'white', 
                  color: '#0066CC', 
                  padding: '12px 24px', 
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Daftar Gratis
              </Link>
              <Link 
                href="/products" 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.15)', 
                  color: 'white', 
                  padding: '12px 24px', 
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                Lihat Produk
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
