"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Loader2,
  ImageIcon,
  X
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ConfirmModal } from "@/components/confirm-modal";

interface Product {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  deskripsi: string | null;
  gambar: string | null;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nama: "",
    harga: "",
    stok: "",
    deskripsi: "",
    gambar: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null,
  });

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

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: newProduct.nama,
          harga: parseInt(newProduct.harga),
          stok: parseInt(newProduct.stok) || 0,
          deskripsi: newProduct.deskripsi || null,
          gambar: newProduct.gambar || null,
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({ nama: "", harga: "", stok: "", deskripsi: "", gambar: "" });
        loadProducts();
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirm.product) return;
    const id = deleteConfirm.product.id;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadProducts();
        setDeleteConfirm({ isOpen: false, product: null });
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(product => 
    product.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
            Manajemen Produk
          </h1>
          <p style={{ color: '#6B7280' }}>
            Kelola produk toko Anda
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#0066CC',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          Tambah Produk
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
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
              outline: 'none',
              backgroundColor: 'white'
            }}
          />
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
          <Loader2 style={{ width: '32px', height: '32px', color: '#0066CC' }} className="animate-spin" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                height: '300px',
                backgroundColor: '#F9FAFB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {product.gambar ? (
                  <img 
                    src={product.gambar} 
                    alt={product.nama} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon style={{ width: '48px', height: '48px', color: '#D1D5DB' }} />
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  {product.nama}
                </h3>
                <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0066CC', marginBottom: '8px' }}>
                  {formatCurrency(product.harga)}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    backgroundColor: product.stok > 0 ? '#ECFDF5' : '#FEF2F2',
                    color: product.stok > 0 ? '#10B981' : '#DC2626',
                    borderRadius: '4px'
                  }}>
                    Stok: {product.stok}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setDeleteConfirm({ isOpen: true, product })}
                      style={{ 
                        padding: '6px',
                        backgroundColor: '#FEF2F2',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px', color: '#DC2626' }} />
                    </button>
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
          border: '1px solid #E5E7EB',
          textAlign: 'center', 
          padding: '60px' 
        }}>
          <Package style={{ width: '48px', height: '48px', color: '#D1D5DB', margin: '0 auto 16px' }} />
          <p style={{ color: '#6B7280', marginBottom: '16px' }}>
            {searchQuery ? "Tidak ada produk yang cocok" : "Belum ada produk"}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#0066CC',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Tambah Produk Pertama
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <>
          <div 
            onClick={() => setShowAddModal(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }}
          />
          <div style={{ 
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            zIndex: 51
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                Tambah Produk Baru
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X style={{ width: '20px', height: '20px', color: '#6B7280' }} />
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Nama Produk *
                </label>
                <input
                  type="text"
                  value={newProduct.nama}
                  onChange={(e) => setNewProduct({ ...newProduct, nama: e.target.value })}
                  required
                  placeholder="Masukkan nama produk"
                  style={{ 
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.harga}
                    onChange={(e) => setNewProduct({ ...newProduct, harga: e.target.value })}
                    required
                    placeholder="0"
                    style={{ 
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Stok
                  </label>
                  <input
                    type="number"
                    value={newProduct.stok}
                    onChange={(e) => setNewProduct({ ...newProduct, stok: e.target.value })}
                    placeholder="0"
                    style={{ 
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  URL Gambar
                </label>
                <input
                  type="url"
                  value={newProduct.gambar}
                  onChange={(e) => setNewProduct({ ...newProduct, gambar: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  style={{ 
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>
                  Masukkan URL gambar produk (contoh: dari Google, Unsplash, dll)
                </p>
                {newProduct.gambar && (
                  <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                    <img 
                      src={newProduct.gambar} 
                      alt="Preview" 
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Deskripsi
                </label>
                <textarea
                  value={newProduct.deskripsi}
                  onChange={(e) => setNewProduct({ ...newProduct, deskripsi: e.target.value })}
                  rows={3}
                  placeholder="Deskripsi produk (opsional)"
                  style={{ 
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ 
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ 
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#0066CC',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmitting && <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, product: null })}
        onConfirm={handleDeleteProduct}
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus produk "${deleteConfirm.product?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        isLoading={deletingId !== null}
      />
    </div>
  );
}
