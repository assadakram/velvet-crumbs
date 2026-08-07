import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { put, list } from '@vercel/blob';

// Default settings used if the file hasn't been created yet on Vercel Blob
const DEFAULT_SETTINGS = {
  isPaused: false,
  resumeDate: null,
  resumeTime: null,
  pausedMessageEn: null,
  pausedMessageFi: null,
};

async function readSettings() {
  try {
    const { blobs } = await list({ prefix: 'preorder-settings.json' });
    const settingsBlob = blobs.find((b) => b.pathname === 'preorder-settings.json');
    if (settingsBlob) {
      const res = await fetch(settingsBlob.url, { 
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        return { ...DEFAULT_SETTINGS, ...data };
      }
    }
  } catch (err) {
    console.error('Failed to read settings from Vercel Blob:', err);
  }
  return DEFAULT_SETTINGS;
}

async function writeSettings(data: typeof DEFAULT_SETTINGS) {
  await put('preorder-settings.json', JSON.stringify(data, null, 2), {
    access: 'private', // Match your store's private config
    addRandomSuffix: false,
    allowOverwrite: true, // Allow overwriting the existing file
    contentType: 'application/json',
    cacheControlMaxAge: 0, // Disable edge caching for live settings updates
  });
}

async function verifyAuth(req: NextRequest): Promise<boolean> {
  const expectedSecret = process.env.ADMIN_SECRET;
  if (!expectedSecret) return false;

  // 1. Check header (for scripting / API consumers)
  const authHeader = req.headers.get('x-admin-secret');
  if (authHeader === expectedSecret) return true;

  // 2. Check HttpOnly cookie (for browser/admin panel)
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('velvet_admin_session')?.value;
  if (sessionToken) {
    const expectedToken = crypto
      .createHmac('sha256', expectedSecret)
      .update('velvet-session')
      .digest('hex');
    if (sessionToken === expectedToken) return true;
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
      headers: { 'Cache-Control': 'no-store, max-age=0' },
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
    };

    await writeSettings(settings);

    return NextResponse.json({ success: true, settings }, { status: 200 });
  } catch (err: any) {
    console.error('❌ Failed to save preorder settings:', err);
    return NextResponse.json(
      { error: 'Failed to save settings', details: err?.message },
      { status: 500 }
    );
  }
}
