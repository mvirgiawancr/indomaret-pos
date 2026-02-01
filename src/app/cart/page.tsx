"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight,
  Package,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartItem } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
    setIsLoading(false);
  }, []);

  const updateQuantity = (productId: number, delta: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item.produk.id === productId) {
        const newQuantity = Math.max(1, item.jumlah + delta);
        return { ...item, jumlah: Math.min(newQuantity, item.produk.stok) };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (productId: number) => {
    const updatedCart = cartItems.filter((item) => item.produk.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.produk.harga * item.jumlah,
    0
  );
  const shipping = subtotal > 100000 ? 0 : 10000;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    router.push("/orders/create");
  };

  if (isLoading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <Navbar />
        <div style={{ paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Loader2 style={{ width: '40px', height: '40px', color: '#0066CC' }} className="animate-spin" />
        </div>
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
          <Link 
            href="/products" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: '#6B7280', 
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '12px'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Lanjut Belanja
          </Link>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
            Keranjang Belanja
          </h1>
        </div>
      </section>

      <section style={{ padding: '32px 0 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {cartItems.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                    {cartItems.length} item dalam keranjang
                  </p>
                  <button
                    onClick={clearCart}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#DC2626',
                      fontSize: '0.875rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                    Hapus Semua
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cartItems.map((item) => (
                    <div
                      key={item.produk.id}
                      style={{ 
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #E5E7EB',
                        display: 'flex',
                        gap: '16px'
                      }}
                    >
                      {/* Product Image */}
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        backgroundColor: '#F9FAFB',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {item.produk.gambar ? (
                          <img 
                            src={item.produk.gambar} 
                            alt={item.produk.nama} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                          />
                        ) : (
                          <Package style={{ width: '32px', height: '32px', color: '#D1D5DB' }} />
                        )}
                      </div>

                      {/* Product Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link href={`/products/${item.produk.id}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }} className="line-clamp-1">
                            {item.produk.nama}
                          </h3>
                        </Link>
                        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '8px' }}>
                          Stok tersedia: {item.produk.stok}
                        </p>
                        <p style={{ fontSize: '1rem', fontWeight: '700', color: '#0066CC' }}>
                          {formatCurrency(item.produk.harga)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <button
                          onClick={() => removeItem(item.produk.id)}
                          style={{ 
                            padding: '6px',
                            color: '#DC2626',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 style={{ width: '18px', height: '18px' }} />
                        </button>

                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          backgroundColor: '#F9FAFB',
                          borderRadius: '8px',
                          padding: '4px'
                        }}>
                          <button
                            onClick={() => updateQuantity(item.produk.id, -1)}
                            disabled={item.jumlah <= 1}
                            style={{ 
                              padding: '6px',
                              background: 'none',
                              border: 'none',
                              cursor: item.jumlah <= 1 ? 'not-allowed' : 'pointer',
                              opacity: item.jumlah <= 1 ? 0.5 : 1
                            }}
                          >
                            <Minus style={{ width: '16px', height: '16px', color: '#374151' }} />
                          </button>
                          <span style={{ width: '32px', textAlign: 'center', fontWeight: '600', color: '#111827' }}>
                            {item.jumlah}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.produk.id, 1)}
                            disabled={item.jumlah >= item.produk.stok}
                            style={{ 
                              padding: '6px',
                              background: 'none',
                              border: 'none',
                              cursor: item.jumlah >= item.produk.stok ? 'not-allowed' : 'pointer',
                              opacity: item.jumlah >= item.produk.stok ? 0.5 : 1
                            }}
                          >
                            <Plus style={{ width: '16px', height: '16px', color: '#374151' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div style={{ 
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #E5E7EB',
                  position: 'sticky',
                  top: '88px'
                }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
                    Ringkasan Pesanan
                  </h2>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: '#6B7280' }}>Subtotal ({cartItems.length} item)</span>
                      <span style={{ color: '#111827' }}>{formatCurrency(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: '#6B7280' }}>Ongkos Kirim</span>
                      <span style={{ color: shipping === 0 ? '#10B981' : '#111827' }}>
                        {shipping === 0 ? "Gratis" : formatCurrency(shipping)}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <p style={{ 
                        fontSize: '0.75rem',
                        color: '#10B981',
                        backgroundColor: '#ECFDF5',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        marginBottom: '12px'
                      }}>
                        🎉 Gratis ongkir untuk pesanan di atas Rp 100.000
                      </p>
                    )}
                    <div style={{ 
                      borderTop: '1px solid #E5E7EB',
                      paddingTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>Total</span>
                      <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0066CC' }}>
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    style={{ 
                      width: '100%',
                      padding: '14px',
                      backgroundColor: '#0066CC',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Checkout
                    <ArrowRight style={{ width: '18px', height: '18px' }} />
                  </button>

                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', textAlign: 'center', marginTop: '16px' }}>
                    Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
                  </p>
                </div>
              </div>
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
                Keranjang Kosong
              </h2>
              <p style={{ color: '#6B7280', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                Belum ada produk di keranjang Anda. Yuk mulai belanja dan temukan produk yang Anda butuhkan!
              </p>
              <Link 
                href="/products" 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: '#0066CC',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Mulai Belanja
                <ArrowRight style={{ width: '18px', height: '18px' }} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
