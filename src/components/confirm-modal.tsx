"use client";

import { AlertTriangle, X, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isLoading = false,
  variant = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: "#FEF2F2",
      iconColor: "#DC2626",
      buttonBg: "#DC2626",
      buttonHoverBg: "#B91C1C",
    },
    warning: {
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
      buttonBg: "#D97706",
      buttonHoverBg: "#B45309",
    },
    info: {
      iconBg: "#EFF6FF",
      iconColor: "#0066CC",
      buttonBg: "#0066CC",
      buttonHoverBg: "#0052A3",
    },
  };

  const styles = variantStyles[variant];

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        {/* Modal */}
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{ 
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Icon */}
          <div style={{ 
            width: '48px',
            height: '48px',
            backgroundColor: styles.iconBg,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <AlertTriangle style={{ width: '24px', height: '24px', color: styles.iconColor }} />
          </div>

          {/* Title */}
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827', 
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {title}
          </h3>

          {/* Message */}
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6B7280', 
            textAlign: 'center',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            {message}
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              disabled={isLoading}
              style={{ 
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              style={{ 
                flex: 1,
                padding: '10px 16px',
                backgroundColor: styles.buttonBg,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading && <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
