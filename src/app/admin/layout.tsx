"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package,
  ShoppingCart,
  Truck,
  Users,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Shield
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingCart },
  { href: "/admin/deliveries", label: "Pengiriman", icon: Truck },
  { href: "/admin/users", label: "Pengguna", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isPending && session) {
      const role = (session.user as any)?.role;
      if (role !== "admin") {
        router.push("/");
      }
    } else if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isPending) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#F9FAFB'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid #E5E7EB',
            borderTopColor: '#0066CC',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6B7280' }}>Memuat...</p>
        </div>
      </div>
    );
  }

  const role = (session?.user as any)?.role;
  if (role !== "admin") {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Mobile Header */}
      {isMobile && (
        <header style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          backgroundColor: 'white',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{ 
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Menu style={{ width: '24px', height: '24px', color: '#374151' }} />
            </button>
            <span style={{ fontWeight: '600', color: '#111827' }}>Admin Panel</span>
          </div>
          <Shield style={{ width: '24px', height: '24px', color: '#0066CC' }} />
        </header>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ 
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 45
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{ 
        position: 'fixed',
        top: 0,
        left: isMobile ? (isSidebarOpen ? 0 : '-280px') : 0,
        width: '260px',
        height: '100vh',
        backgroundColor: 'white',
        borderRight: '1px solid #E5E7EB',
        zIndex: 50,
        transition: 'left 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ 
          height: '64px',
          padding: '0 20px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ 
              width: '36px',
              height: '36px',
              backgroundColor: '#0066CC',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span style={{ fontWeight: '700', color: '#111827' }}>Admin Panel</span>
          </Link>
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <X style={{ width: '20px', height: '20px', color: '#6B7280' }} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <p style={{ 
            fontSize: '0.6875rem', 
            fontWeight: '600', 
            color: '#9CA3AF', 
            textTransform: 'uppercase',
            padding: '0 12px',
            marginBottom: '8px'
          }}>
            Menu Utama
          </p>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => isMobile && setIsSidebarOpen(false)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  textDecoration: 'none',
                  backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                  color: isActive ? '#0066CC' : '#4B5563',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.9375rem',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <link.icon style={{ width: '20px', height: '20px' }} />
                {link.label}
                {isActive && (
                  <ChevronRight style={{ width: '16px', height: '16px', marginLeft: 'auto' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div style={{ 
          padding: '16px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            <div style={{ 
              width: '40px',
              height: '40px',
              backgroundColor: '#0066CC',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              {session?.user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>
                {session?.user?.name || "Admin"}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session?.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{ 
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <LogOut style={{ width: '18px', height: '18px' }} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        marginLeft: isMobile ? 0 : '260px',
        paddingTop: isMobile ? '64px' : 0,
        minHeight: '100vh'
      }}>
        {children}
      </main>

      {/* Spin animation */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
