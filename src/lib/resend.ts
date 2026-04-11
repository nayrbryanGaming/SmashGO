// src/lib/resend.ts
import { Resend } from 'resend'

let resend: Resend | null = null

function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined')
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export interface EmailParams {
  to: string
  subject: string
  template: 'booking_confirmed' | 'payment_failed' | 'otp_verification' | 'match_reminder' | 'booking_reminder'
  data: any
}

export async function sendEmail({ to, subject, template, data }: EmailParams) {
  try {
    let html = ''

    switch (template) {
      case 'booking_confirmed':
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #6366f1;">Booking Terkonfirmasi! 🏸</h2>
            <p>Halo, <strong>${data.userName}</strong>!</p>
            <p>Pembayaranmu untuk booking lapangan <strong>${data.courtName}</strong> telah berhasil.</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Tanggal:</strong> ${data.bookingDate}</p>
              <p><strong>Waktu:</strong> ${data.startTime}</p>
              <p><strong>Durasi:</strong> ${data.duration} Jam</p>
            </div>
            <p>Tunjukkan QR Code berikut saat datang ke lapangan untuk check-in:</p>
            <div style="text-align: center; margin: 20px 0;">
               <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.qrToken}" alt="QR Code" />
               <p style="font-family: monospace; font-weight: bold; margin-top: 10px;">${data.qrToken}</p>
            </div>
            <p style="font-size: 12px; color: #6b7280;">Jika ada pertanyaan, silakan hubungi admin di venue.</p>
          </div>
        `
        break
      case 'otp_verification':
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; text-align: center;">
            <h2 style="color: #6366f1;">Verifikasi Akun SmashGo</h2>
            <p>Kode OTP kamu adalah:</p>
            <h1 style="font-size: 40px; letter-spacing: 5px; color: #111827;">${data.otp}</h1>
            <p>Kode ini berlaku selama 10 menit. Jangan berikan kode ini kepada siapapun.</p>
          </div>
        `
        break
      case 'booking_reminder':
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #6366f1;">Pengingat Jadwal Main Besok 🏸</h2>
            <p>Halo, <strong>${data.userName}</strong>!</p>
            <p>Ini adalah pengingat untuk jadwal mainmu besok di <strong>${data.venueName}</strong> (${data.courtName}).</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Tanggal:</strong> ${data.bookingDate}</p>
              <p><strong>Waktu:</strong> ${data.startTime}</p>
            </div>
            <p>Sampai jumpa di lapangan!</p>
          </div>
        `
        break
      default:
        html = `<p>${JSON.stringify(data)}</p>`
    }

    const resendClient = getResendClient()
    const response = await resendClient.emails.send({
      from: 'SmashGo <noreply@smashgo.vercel.app>',
      to: [to],
      subject: subject,
      html: html,
    })

    return { success: true, response }
  } catch (error) {
    console.error('Error sending email', error)
    return { success: false, error }
  }
}
