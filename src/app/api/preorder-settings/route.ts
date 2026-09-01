import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_SETTINGS = {
  isPaused: false,
  resumeDate: null,
  resumeTime: null,
  pausedMessageEn: null,
  pausedMessageFi: null,
  isDeliveryEnabled: true,
};

async function readSettings() {
  try {
    const db = getDb();
    const doc = await db.collection('settings').doc('preorder').get();
    if (doc.exists) {
      const data = doc.data();
      return { ...DEFAULT_SETTINGS, ...data };
    }
  } catch (err) {
    console.error('Failed to read settings from Firestore:', err);
  }
  return DEFAULT_SETTINGS;
}

async function writeSettings(data: typeof DEFAULT_SETTINGS) {
  const db = getDb();
  await db.collection('settings').doc('preorder').set(data, { merge: true });
}

async function verifyAuth(req: NextRequest): Promise<boolean> {
  const expectedSecret = process.env.ADMIN_SECRET;
  if (!expectedSecret) return false;

  // 1. Check header (for scripting / API consumers)
  const authHeader = req.headers.get('x-admin-secret') || req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (authHeader === expectedSecret) return true;

  // 2. Check HttpOnly cookie (for browser/admin panel)
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('velvet_admin_session')?.value;
    if (sessionToken) {
      const expectedToken = crypto
        .createHmac('sha256', expectedSecret)
        .update('velvet-session')
        .digest('hex');
      if (sessionToken === expectedToken) return true;
    }
  } catch {
    // Cookie store read failure fallback
  }

  return false;
}

// GET /api/preorder-settings
export async function GET(req: NextRequest) {
  try {
    const validateHeader = req.headers.get('x-admin-validate');

    // If requested by the admin panel to check authentication
    if (validateHeader === 'true') {
      const isAuthorized = await verifyAuth(req);
      if (!isAuthorized) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const settings = await readSettings();
    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to read settings', details: err?.message },
      { status: 500 }
    );
  }
}

// POST /api/preorder-settings
export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAuth(req);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const settings = {
      isPaused: Boolean(body.isPaused),
      resumeDate: body.resumeDate?.trim() || null,
      resumeTime: body.resumeTime?.trim() || null,
      pausedMessageEn: body.pausedMessageEn?.trim() || null,
      pausedMessageFi: body.pausedMessageFi?.trim() || null,
      isDeliveryEnabled: body.isDeliveryEnabled !== undefined ? Boolean(body.isDeliveryEnabled) : true,
    };

    await writeSettings(settings);

    return NextResponse.json({ success: true, settings }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (err: any) {
    console.error('❌ Failed to save preorder settings:', err);
    return NextResponse.json(
      { error: 'Failed to save settings', details: err?.message },
      { status: 500 }
    );
  }
}
