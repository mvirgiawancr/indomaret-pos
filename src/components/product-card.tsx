import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Produk } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Produk;
  onAddToCart?: (product: Produk) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden card-hover border border-border group">
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
        {product.gambar ? (
          <Image
            src={product.gambar}
            alt={product.nama}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center opacity-20">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
          </div>
        )}
        
        {/* Stock badge */}
        {product.stok <= 5 && product.stok > 0 && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Stok Terbatas
          </div>
        )}
        {product.stok === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Habis
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.nama}
          </h3>
        </Link>
        
        {product.deskripsi && (
          <p className="text-sm text-muted line-clamp-2 mb-3">
            {product.deskripsi}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(product.harga)}
            </p>
            <p className="text-xs text-muted">
              Stok: {product.stok}
            </p>
          </div>

          <button
            onClick={() => onAddToCart?.(product)}
            disabled={product.stok === 0}
            className="p-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
