"use client";

import { CheckCircle, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionHref?: string;
  actionText?: string;
  closeText?: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  actionHref,
  actionText,
  closeText = "Lanjut Belanja"
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <>
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
          <div style={{ 
            width: '48px',
            height: '48px',
            backgroundColor: '#ECFDF5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <CheckCircle style={{ width: '24px', height: '24px', color: '#10B981' }} />
          </div>

          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827', 
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {title}
          </h3>

          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6B7280', 
            textAlign: 'center',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            {message}
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{ 
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {closeText}
            </button>
            {actionHref && (
              <Link
                href={actionHref}
                style={{ 
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#0066CC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {actionText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
