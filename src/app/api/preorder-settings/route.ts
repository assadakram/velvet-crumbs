import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { cookies } from 'next/headers';

// Store the settings JSON file in the project root under /data
const DATA_FILE = path.join(process.cwd(), 'data', 'preorder-settings.json');

// Default settings if file doesn't exist yet
const DEFAULT_SETTINGS = {
  isPaused: false,
  resumeDate: null,
  resumeTime: null,
  pausedMessageEn: null,
  pausedMessageFi: null,
};

async function readSettings() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // File doesn't exist yet — return defaults
    return DEFAULT_SETTINGS;
  }
}

async function writeSettings(data: typeof DEFAULT_SETTINGS) {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
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
