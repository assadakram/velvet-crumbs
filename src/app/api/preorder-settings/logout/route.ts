import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/preorder-settings/logout
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'velvet_admin_session',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Immediately expire
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Logout failed', details: err?.message },
      { status: 500 }
    );
  }
}
