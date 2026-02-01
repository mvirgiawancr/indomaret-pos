import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        menunggu_pembayaran: "bg-yellow-100 text-yellow-800",
        sudah_dibayar: "bg-blue-100 text-blue-800",
        diproses: "bg-purple-100 text-purple-800",
        dalam_pengiriman: "bg-orange-100 text-orange-800",
        selesai: "bg-green-100 text-green-800",
        dibatalkan: "bg-red-100 text-red-800",
        pending: "bg-yellow-100 text-yellow-800",
        validated: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        menunggu: "bg-gray-100 text-gray-800",
        diterima: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
}

export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        menunggu_pembayaran: "Menunggu Pembayaran",
        sudah_dibayar: "Sudah Dibayar",
        diproses: "Diproses",
        dalam_pengiriman: "Dalam Pengiriman",
        selesai: "Selesai",
        dibatalkan: "Dibatalkan",
        pending: "Pending",
        validated: "Tervalidasi",
        rejected: "Ditolak",
        menunggu: "Menunggu",
        diterima: "Diterima",
    };
    return labels[status] || status;
}
