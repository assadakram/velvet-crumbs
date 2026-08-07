import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

// POST /api/preorder-settings/login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret } = body;
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate secure session token (deterministic hash of ADMIN_SECRET)
    const sessionToken = crypto
      .createHmac('sha256', expectedSecret)
      .update('velvet-session')
      .digest('hex');

    // Save as HttpOnly Secure cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'velvet_admin_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      // Session cookie (cleared when browser closes)
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Login failed', details: err?.message },
      { status: 500 }
    );
  }
}
