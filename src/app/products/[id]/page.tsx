"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  ArrowLeft,
  Package,
  Loader2,
  CheckCircle,
  Truck,
  Shield,
  Star
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SuccessModal } from "@/components/success-modal";
import { useSession } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/utils";
import { Produk, CartItem } from "@/types/database";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Produk | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    message: "",
  });

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id, router]);

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stok) {
      setQuantity(newQty);
    }
  };

  const addToCart = () => {
    if (!session) {
      router.push(`/login?redirect=/products/${id}`);
      return;
    }
    
    if (!product) return;

    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.produk.id === product.id);
    
    if (existingItem) {
      const newTotal = existingItem.jumlah + quantity;
      if (newTotal > product.stok) {
        alert(`Stok tidak mencukupi. Maksimal ${product.stok}`);
        return;
      }
      existingItem.jumlah = newTotal;
    } else {
      cart.push({ produk: product, jumlah: quantity });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    setSuccessModal({
      isOpen: true,
      message: `${quantity}x ${product.nama} berhasil ditambahkan ke keranjang!`,
    });
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
          <Loader2 style={{ width: '40px', height: '40px', color: '#0066CC' }} className="animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  return (
    <main style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 80px' }}>
        {/* Breadcrumb / Back */}
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
          Kembali ke Produk
        </button>

        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '0'
        }}>
          {/* Image Section */}
          <div style={{ 
            backgroundColor: '#F3F4F6',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {product.gambar ? (
              <img 
                src={product.gambar} 
                alt={product.nama} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <Package style={{ width: '80px', height: '80px', color: '#D1D5DB' }} />
            )}
          </div>

          {/* Info Section */}
          <div style={{ padding: '32px 40px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              {product.nama}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', color: '#F59E0B' }}>
                <Star style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
                <Star style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
                <Star style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
                <Star style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
                <Star style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
              </div>
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>(5.0)</span>
            </div>

            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#0066CC', marginBottom: '24px' }}>
              {formatCurrency(product.harga)}
            </p>

            <div style={{ borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '24px 0', marginBottom: '24px' }}>
              <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '0' }}>
                {product.deskripsi || "Tidak ada deskripsi produk."}
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Jumlah Pembelian
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    style={{ 
                      padding: '10px',
                      background: 'none',
                      border: 'none',
                      cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                      color: quantity <= 1 ? '#D1D5DB' : '#374151'
                    }}
                  >
                    <Minus style={{ width: '18px', height: '18px' }} />
                  </button>
                  <span style={{ 
                    padding: '0 16px', 
                    fontWeight: '600', 
                    color: '#111827',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stok}
                    style={{ 
                      padding: '10px',
                      background: 'none',
                      border: 'none',
                      cursor: quantity >= product.stok ? 'not-allowed' : 'pointer',
                      color: quantity >= product.stok ? '#D1D5DB' : '#374151'
                    }}
                  >
                    <Plus style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>
                <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  Stok tersisa: {product.stok}
                </span>
              </div>
            </div>

            <button
              onClick={addToCart}
              disabled={product.stok <= 0}
              style={{ 
                width: '100%',
                padding: '16px',
                backgroundColor: product.stok > 0 ? '#0066CC' : '#E5E7EB',
                color: product.stok > 0 ? 'white' : '#9CA3AF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: product.stok > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
            >
              <ShoppingCart style={{ width: '20px', height: '20px' }} />
              {product.stok > 0 ? "Masukkan Keranjang" : "Stok Habis"}
            </button>

            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981' }} />
                <span style={{ fontSize: '0.875rem', color: '#4B5563' }}>Produk 100% Original</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Truck style={{ width: '20px', height: '20px', color: '#3B82F6' }} />
                <span style={{ fontSize: '0.875rem', color: '#4B5563' }}>Pengiriman Cepat & Aman</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Shield style={{ width: '20px', height: '20px', color: '#8B5CF6' }} />
                <span style={{ fontSize: '0.875rem', color: '#4B5563' }}>Garansi Uang Kembali</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        title="Berhasil Ditambahkan"
        message={successModal.message}
        actionHref="/cart"
        actionText="Lihat Keranjang"
      />
    </main>
  );
}
