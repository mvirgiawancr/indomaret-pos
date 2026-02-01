"use client";

import { Clock, Package, Truck, CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "menunggu":
        return { 
          label: "Menunggu", 
          bgColor: "#FEF3C7", 
          color: "#D97706",
          icon: Clock
        };
      case "diproses":
        return { 
          label: "Diproses", 
          bgColor: "#DBEAFE", 
          color: "#2563EB",
          icon: Package
        };
      case "dikirim":
      case "dalam_perjalanan":
        return { 
          label: status === "dikirim" ? "Dikirim" : "Dalam Perjalanan", 
          bgColor: "#E0E7FF", 
          color: "#4F46E5",
          icon: Truck
        };
      case "selesai":
      case "terkirim":
      case "berhasil":
        return { 
          label: status === "selesai" ? "Selesai" : status === "terkirim" ? "Terkirim" : "Berhasil", 
          bgColor: "#ECFDF5", 
          color: "#10B981",
          icon: CheckCircle
        };
      case "dibatalkan":
      case "gagal":
        return { 
          label: status === "dibatalkan" ? "Dibatalkan" : "Gagal", 
          bgColor: "#FEF2F2", 
          color: "#DC2626",
          icon: XCircle
        };
      case "diambil":
        return { 
          label: "Diambil", 
          bgColor: "#F0FDF4", 
          color: "#16A34A",
          icon: Package
        };
      case "pending":
        return { 
          label: "Pending", 
          bgColor: "#FFF7ED", 
          color: "#EA580C",
          icon: Clock
        };
      case "aktif":
        return { 
          label: "Aktif", 
          bgColor: "#ECFDF5", 
          color: "#10B981",
          icon: CheckCircle
        };
      case "nonaktif":
        return { 
          label: "Nonaktif", 
          bgColor: "#F3F4F6", 
          color: "#6B7280",
          icon: XCircle
        };
      default:
        return { 
          label: status, 
          bgColor: "#F3F4F6", 
          color: "#6B7280",
          icon: HelpCircle
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;
  const iconSize = size === "sm" ? '12px' : '14px';
  const padding = size === "sm" ? '3px 8px' : '4px 10px';
  const fontSize = size === "sm" ? '0.6875rem' : '0.75rem';

  return (
    <span style={{ 
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding,
      backgroundColor: config.bgColor,
      color: config.color,
      borderRadius: '20px',
      fontSize,
      fontWeight: '500',
      whiteSpace: 'nowrap'
    }}>
      <IconComponent style={{ width: iconSize, height: iconSize }} />
      {config.label}
    </span>
  );
}
