"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { 
  Package, 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  LogOut,
  ClipboardList,
  LayoutDashboard,
  Home,
  Box
} from "lucide-react";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close menu when clicking outside or navigating
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const getUserRole = () => {
    if (!session?.user) return null;
    return (session.user as any).role || "pengguna";
  };

  const getDashboardLink = () => {
    const role = getUserRole();
    if (role === "admin") return "/admin";
    if (role === "kurir") return "/kurir";
    return null;
  };

  const navLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/products", label: "Produk", icon: Box },
    { href: "/orders", label: "Pesanan Saya", icon: ClipboardList },
  ];

  return (
    <>
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
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
              <span style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                <span style={{ color: '#0066CC' }}>Indo</span>
                <span style={{ color: '#DC2626' }}>maret</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ 
                      color: '#4B5563', 
                      textDecoration: 'none', 
                      fontSize: '0.9375rem',
                      fontWeight: '500'
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Desktop Actions */}
            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  href="/cart"
                  style={{ 
                    padding: '8px',
                    color: '#4B5563',
                    textDecoration: 'none'
                  }}
                >
                  <ShoppingCart style={{ width: '22px', height: '22px' }} />
                </Link>

                {isPending ? (
                  <div style={{ width: '32px', height: '32px', backgroundColor: '#E5E7EB', borderRadius: '50%' }} />
                ) : session ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getDashboardLink() && (
                      <Link
                        href={getDashboardLink()!}
                        style={{ 
                          padding: '8px 16px',
                          backgroundColor: '#F3F4F6',
                          color: '#374151',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <LayoutDashboard style={{ width: '16px', height: '16px' }} />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      style={{ 
                        padding: '8px 16px',
                        backgroundColor: '#0066CC',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link
                      href="/login"
                      style={{ 
                        padding: '8px 16px',
                        color: '#0066CC',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/register"
                      style={{ 
                        padding: '8px 16px',
                        backgroundColor: '#0066CC',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Actions */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Link href="/cart" style={{ padding: '10px', color: '#4B5563' }}>
                  <ShoppingCart style={{ width: '22px', height: '22px' }} />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{ 
                    padding: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#374151'
                  }}
                  aria-label="Menu"
                >
                  {isMobileMenuOpen ? (
                    <X style={{ width: '24px', height: '24px' }} />
                  ) : (
                    <Menu style={{ width: '24px', height: '24px' }} />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ 
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 40
            }}
          />
          
          {/* Menu Panel */}
          <div 
            style={{ 
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              zIndex: 45,
              overflowY: 'auto',
              padding: '16px'
            }}
          >
            {/* Navigation Links */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '12px', padding: '0 12px' }}>
                Menu
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 16px',
                    color: '#374151',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    borderRadius: '10px',
                    marginBottom: '4px',
                    backgroundColor: '#F9FAFB'
                  }}
                >
                  <link.icon style={{ width: '20px', height: '20px', color: '#6B7280' }} />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '12px', padding: '0 12px' }}>
                Akun
              </p>
              
              {isPending ? (
                <div style={{ padding: '16px', textAlign: 'center', color: '#6B7280' }}>
                  Loading...
                </div>
              ) : session ? (
                <>
                  {/* User Info Card */}
                  <div style={{ 
                    padding: '16px',
                    backgroundColor: '#EFF6FF',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ 
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#0066CC',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: '600', color: '#111827', fontSize: '1rem', marginBottom: '2px' }}>
                        {session.user?.name || "User"}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {session.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Dashboard Link */}
                  {getDashboardLink() && (
                    <Link
                      href={getDashboardLink()!}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 16px',
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        fontWeight: '500',
                        borderRadius: '10px',
                        marginBottom: '8px'
                      }}
                    >
                      <LayoutDashboard style={{ width: '20px', height: '20px', color: '#6B7280' }} />
                      Dashboard {getUserRole() === "admin" ? "Admin" : "Kurir"}
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{ 
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut style={{ width: '20px', height: '20px' }} />
                    Logout
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ 
                      display: 'block',
                      padding: '14px',
                      textAlign: 'center',
                      color: '#0066CC',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '600',
                      border: '2px solid #0066CC',
                      borderRadius: '10px'
                    }}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ 
                      display: 'block',
                      padding: '14px',
                      textAlign: 'center',
                      backgroundColor: '#0066CC',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '600',
                      borderRadius: '10px'
                    }}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
