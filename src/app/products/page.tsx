"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Package,
  Loader2,
  Plus,
  Minus
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SuccessModal } from "@/components/success-modal";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Produk, CartItem } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

export default function ProductsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Produk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    message: "",
  });

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (product: Produk) => {
    if (!session) {
      router.push("/login?redirect=/products");
      return;
    }

    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.produk.id === product.id);
    
    if (existingItem) {
      existingItem.jumlah = Math.min(existingItem.jumlah + 1, product.stok);
    } else {
      cart.push({ produk: product, jumlah: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    setSuccessModal({
      isOpen: true,
      message: `${product.nama} berhasil ditambahkan ke keranjang!`,
    });
  };

  const filteredProducts = products
    .filter((product) =>
      product.nama.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "harga-asc") return a.harga - b.harga;
      if (sortBy === "harga-desc") return b.harga - a.harga;
      return a.nama.localeCompare(b.nama);
    });

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Header */}
      <section style={{ 
        paddingTop: '100px', 
        paddingBottom: '32px',
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Semua Produk
          </h1>
          <p style={{ color: '#6B7280' }}>
            Temukan produk kebutuhan sehari-hari Anda
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ 
        padding: '20px 0',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: '64px',
        zIndex: 30
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
              <Search style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#9CA3AF'
              }} />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter style={{ width: '18px', height: '18px', color: '#6B7280' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  padding: '10px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="nama">Nama A-Z</option>
                <option value="harga-asc">Harga Terendah</option>
                <option value="harga-desc">Harga Tertinggi</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ padding: '40px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <Loader2 style={{ width: '40px', height: '40px', color: '#0066CC' }} className="animate-spin" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <p style={{ color: '#6B7280', marginBottom: '24px', fontSize: '0.875rem' }}>
                Menampilkan {filteredProducts.length} produk
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                gap: '24px' 
              }}>
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    style={{ 
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      overflow: 'hidden',
                      transition: 'box-shadow 0.2s ease'
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
                          <img 
                            src={product.gambar} 
                            alt={product.nama} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <Package style={{ width: '48px', height: '48px', color: '#D1D5DB' }} />
                        )}
                      </div>
                    </Link>
                    <div style={{ padding: '16px' }}>
                      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ 
                          fontSize: '0.9375rem', 
                          fontWeight: '600', 
                          color: '#111827', 
                          marginBottom: '8px',
                          lineHeight: '1.4'
                        }} className="line-clamp-2">
                          {product.nama}
                        </h3>
                      </Link>
                      <p style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '700', 
                        color: '#0066CC',
                        marginBottom: '12px'
                      }}>
                        {formatCurrency(product.harga)}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                          Stok: {product.stok}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stok <= 0}
                          style={{ 
                            padding: '8px 12px',
                            backgroundColor: product.stok > 0 ? '#0066CC' : '#E5E7EB',
                            color: product.stok > 0 ? 'white' : '#9CA3AF',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            cursor: product.stok > 0 ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <ShoppingCart style={{ width: '14px', height: '14px' }} />
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <Package style={{ width: '64px', height: '64px', color: '#D1D5DB', margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                {searchQuery ? "Produk tidak ditemukan" : "Belum ada produk"}
              </h3>
              <p style={{ color: '#6B7280', maxWidth: '400px', margin: '0 auto' }}>
                {searchQuery 
                  ? `Tidak ada produk yang cocok dengan "${searchQuery}"`
                  : "Produk akan segera ditambahkan oleh admin"
                }
              </p>
            </div>
          )}
        </div>
      </section>

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
