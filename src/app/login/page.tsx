"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Mail, Lock, Eye, EyeOff, Package, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setError(result.error.message || "Login gagal. Periksa email dan password Anda.");
      } else {
        // Fetch session to get user role and redirect appropriately
        const sessionRes = await fetch("/api/auth/get-session");
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role || "pengguna";
        
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "kurir") {
          router.push("/kurir");
        } else {
          router.push("/");
        }
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F9FAFB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#0066CC', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package style={{ width: '22px', height: '22px', color: 'white' }} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
              <span style={{ color: '#0066CC' }}>Indo</span>
              <span style={{ color: '#DC2626' }}>maret</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '8px', textAlign: 'center' }}>
            Masuk
          </h1>
          <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '24px' }}>
            Silakan masuk ke akun Anda
          </p>

          {error && (
            <div style={{ 
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '0.875rem',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  color: '#9CA3AF'
                }} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@email.com"
                  required
                  style={{ 
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  color: '#9CA3AF'
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password"
                  required
                  style={{ 
                    width: '100%',
                    padding: '12px 40px 12px 40px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: '18px', height: '18px', color: '#9CA3AF' }} />
                  ) : (
                    <Eye style={{ width: '18px', height: '18px', color: '#9CA3AF' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{ 
                width: '100%',
                padding: '12px',
                backgroundColor: '#0066CC',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading && <Loader2 style={{ width: '18px', height: '18px' }} className="animate-spin" />}
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#6B7280', fontSize: '0.875rem' }}>
            Belum punya akun?{" "}
            <Link href="/register" style={{ color: '#0066CC', fontWeight: '500', textDecoration: 'none' }}>
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
