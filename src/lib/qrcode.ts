// src/lib/qrcode.ts
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'

/**
 * Generate sebuah token unik untuk booking
 * Token ini akan disimpan di tabel bookings.qr_code
 */
export function generateUniqueToken(): string {
  return uuidv4()
}

/**
 * Konversi token ke format Data URL (Base64) untuk ditampilkan di UI
 */
export async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 2,
      color: {
        dark: '#1e1b4b', // Indigo-950
        light: '#ffffff',
      },
      width: 512,
    })
  } catch (err) {
    console.error('Error generating QR code', err)
    throw err
  }
}

/**
 * Helper untuk men-generate token dan update database
 * (Dipanggil di webhook payment success)
 */
export async function generateBookingQR(bookingId: string): Promise<string> {
  const token = generateUniqueToken()
  // Data ini akan di-scan oleh admin
  // Format: SMASHGO_CHECKIN|{bookingId}|{token}|{timestamp}
  const checkinData = `SMASHGO_CHECKIN|${bookingId}|${token}|${Date.now()}`
  return checkinData
}

/**
 * Validasi hasil scan QR
 */
export function validateBookingQR(scanResult: string): { 
  isValid: boolean; 
  bookingId?: string; 
  token?: string; 
  message: string 
} {
  if (!scanResult.startsWith('SMASHGO_CHECKIN|')) {
    return { isValid: false, message: 'Format QR Code tidak valid atau bukan tiket SmashGo' }
  }

  const parts = scanResult.split('|')
  if (parts.length < 3) {
    return { isValid: false, message: 'Data QR Code tidak lengkap' }
  }

  return {
    isValid: true,
    bookingId: parts[1],
    token: parts[2],
    message: 'QR Code valid'
  }
}
