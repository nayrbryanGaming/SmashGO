// src/lib/fcm.ts
import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  } catch (error) {
    console.error('Firebase admin initialization error', error)
  }
}

export const messaging = admin.messaging()

/**
 * Kirim notifikasi push ke satu token
 */
export async function sendPushNotification(token: string, payload: {
  title: string
  body: string
  data?: Record<string, string>
}) {
  try {
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
      token: token,
      android: {
        notification: {
          icon: 'stock_ticker_update',
          color: '#6366f1',
        },
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            sound: 'default',
          },
        },
      },
    }

    const response = await messaging.send(message)
    return { success: true, response }
  } catch (error) {
    console.error('Error sending push notification', error)
    return { success: false, error }
  }
}

/**
 * Notifikasi khusus saat lawan matchmaking ditemukan
 */
export async function sendMatchFoundNotification(token: string, payload: {
  matchId: string
  opponentName: string
  opponentElo: number
  message: string
}) {
  return sendPushNotification(token, {
    title: 'Lawan Ditemukan!',
    body: `${payload.message} (Lawan: ${payload.opponentName}, ELO: ${payload.opponentElo})`,
    data: {
      type: 'match_found',
      matchId: payload.matchId,
      click_action: `/match/${payload.matchId}`,
    }
  })
}
