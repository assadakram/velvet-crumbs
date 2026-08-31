import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

// Helper to check admin authorization
function isAuthorized(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return authHeader === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const snapshot = await db.collection('coupons').get();
    const coupons = snapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ coupons }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Error fetching coupons from Firestore:', error);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, coupon, code } = body;
    const db = getDb();

    if (action === 'create') {
      if (!coupon || !coupon.code) {
        return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
      }
      const codeUpper = coupon.code.toUpperCase();
      const docRef = db.collection('coupons').doc(codeUpper);
      const existing = await docRef.get();
      if (existing.exists) {
        return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
      }
      const newCouponData = { ...coupon, code: codeUpper };
      await docRef.set(newCouponData);
    } else if (action === 'update') {
      if (!coupon || !coupon.code) {
        return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
      }
      const codeUpper = coupon.code.toUpperCase();
      const docRef = db.collection('coupons').doc(codeUpper);
      const newCouponData = { ...coupon, code: codeUpper };
      await docRef.set(newCouponData, { merge: true });
    } else if (action === 'delete') {
      if (!code) {
        return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
      }
      await db.collection('coupons').doc(code.toUpperCase()).delete();
    }

    const snapshot = await db.collection('coupons').get();
    const coupons = snapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Error updating coupons in Firestore:', error);
    return NextResponse.json({ error: 'Failed to update coupons' }, { status: 500 });
  }
}
