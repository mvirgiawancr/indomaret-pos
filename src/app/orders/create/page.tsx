"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Loader2,
  Check,
  AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useSession } from "@/lib/auth-client";
import { CartItem } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

export default function CreateOrderPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    alamat: "",
    catatan: "",
    metodePembayaran: "cod",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
    setIsLoading(false);

    // Pre-fill address from user profile
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        alamat: (session.user as any).alamat || "",
      }));
    }
  }, [session]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.produk.harga * item.jumlah,
    0
  );
  const shipping = subtotal > 100000 ? 0 : 10000;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!session?.user?.id) {
      setError("Silakan login terlebih dahulu");
      return;
    }

    if (cartItems.length === 0) {
      setError("Keranjang kosong");
      return;
    }

    if (!formData.alamat.trim()) {
      setError("Alamat pengiriman wajib diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          items: cartItems.map(item => ({
            produkId: item.produk.id,
            jumlah: item.jumlah,
            harga: item.produk.harga,
          })),
          totalHarga: total,
          alamatPengiriman: formData.alamat,
          catatan: formData.catatan,
          metodePembayaran: formData.metodePembayaran,
        }),
      });

      if (res.ok) {
        localStorage.removeItem("cart");
        setSuccess(true);
        setTimeout(() => {
          router.push("/orders");
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Gagal membuat pesanan");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
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
    router.push("/login");
    return null;
  }

  if (success) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <Navbar />
        <div style={{ paddingTop: '120px', textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ 
            width: '80px',
            height: '80px',
            backgroundColor: '#ECFDF5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Check style={{ width: '40px', height: '40px', color: '#10B981' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
            Pesanan Berhasil Dibuat!
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>
            Mengalihkan ke halaman pesanan...
          </p>
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
          <Link 
            href="/cart" 
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
            Kembali ke Keranjang
          </Link>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
            Checkout
          </h1>
        </div>
      </section>

      <section style={{ padding: '32px 0 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {cartItems.length > 0 ? (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="lg:grid-cols-3">
                {/* Form */}
                <div className="lg:col-span-2">
                  {error && (
                    <div style={{ 
                      padding: '16px',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      borderRadius: '8px',
                      color: '#DC2626',
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <AlertCircle style={{ width: '20px', height: '20px' }} />
                      {error}
                    </div>
                  )}

                  {/* Address */}
                  <div style={{ 
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    padding: '24px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#EFF6FF', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <MapPin style={{ width: '20px', height: '20px', color: '#0066CC' }} />
                      </div>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                        Alamat Pengiriman
                      </h2>
                    </div>
                    <textarea
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      placeholder="Masukkan alamat lengkap pengiriman..."
                      rows={3}
                      required
                      style={{ 
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Payment Method */}
                  <div style={{ 
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    padding: '24px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#ECFDF5', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CreditCard style={{ width: '20px', height: '20px', color: '#10B981' }} />
                      </div>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                        Metode Pembayaran
                      </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { value: "cod", label: "Cash on Delivery (COD)" },
                      ].map((method) => (
                        <label
                          key={method.value}
                          style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '16px',
                            border: formData.metodePembayaran === method.value ? '2px solid #0066CC' : '1px solid #E5E7EB',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: formData.metodePembayaran === method.value ? '#EFF6FF' : 'white'
                          }}
                        >
                          <input
                            type="radio"
                            name="metodePembayaran"
                            value={method.value}
                            checked={formData.metodePembayaran === method.value}
                            onChange={(e) => setFormData({ ...formData, metodePembayaran: e.target.value })}
                            style={{ width: '18px', height: '18px' }}
                          />
                          <span style={{ fontWeight: '500', color: '#111827' }}>{method.label}</span>
                        </label>
                      ))}
                    </div>

                  </div>

                  {/* Notes */}
                  <div style={{ 
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    padding: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#FFFBEB', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Package style={{ width: '20px', height: '20px', color: '#F59E0B' }} />
                      </div>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                        Catatan (Opsional)
                      </h2>
                    </div>
                    <textarea
                      value={formData.catatan}
                      onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                      placeholder="Tambahkan catatan untuk pesanan Anda..."
                      rows={2}
                      style={{ 
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
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

                    {/* Items */}
                    <div style={{ marginBottom: '20px' }}>
                      {cartItems.map((item) => (
                        <div 
                          key={item.produk.id}
                          style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 0',
                            borderBottom: '1px solid #F3F4F6'
                          }}
                        >
                          <div>
                            <p style={{ fontWeight: '500', color: '#111827', fontSize: '0.875rem' }} className="line-clamp-1">
                              {item.produk.nama}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                              {item.jumlah}x {formatCurrency(item.produk.harga)}
                            </p>
                          </div>
                          <p style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>
                            {formatCurrency(item.produk.harga * item.jumlah)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: '#6B7280' }}>Subtotal</span>
                        <span style={{ color: '#111827' }}>{formatCurrency(subtotal)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: '#6B7280' }}>Ongkos Kirim</span>
                        <span style={{ color: shipping === 0 ? '#10B981' : '#111827' }}>
                          {shipping === 0 ? "Gratis" : formatCurrency(shipping)}
                        </span>
                      </div>
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
                      type="submit"
                      disabled={isSubmitting}
                      style={{ 
                        width: '100%',
                        padding: '14px',
                        backgroundColor: '#0066CC',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9375rem',
                        fontWeight: '600',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {isSubmitting && <Loader2 style={{ width: '18px', height: '18px' }} className="animate-spin" />}
                      {isSubmitting ? "Memproses..." : "Buat Pesanan"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <Package style={{ width: '64px', height: '64px', color: '#D1D5DB', margin: '0 auto 24px' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                Keranjang Kosong
              </h2>
              <p style={{ color: '#6B7280', marginBottom: '24px' }}>
                Tambahkan produk ke keranjang terlebih dahulu
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
