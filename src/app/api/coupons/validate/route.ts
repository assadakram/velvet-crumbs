import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
    }

    const db = getDb();
    const doc = await db.collection('coupons').doc(code.toUpperCase()).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 404 });
    }

    const coupon = doc.data() as any;

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'This promo code is no longer active' }, { status: 400 });
    }

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error validating coupon in Firestore:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
