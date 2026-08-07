import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

const BLOB_FILENAME = 'coupons.json';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
    }

    const { blobs } = await list({ prefix: BLOB_FILENAME });
    const couponBlob = blobs.find(b => b.pathname === BLOB_FILENAME);

    if (!couponBlob) {
      return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 404 });
    }

    const response = await fetch(couponBlob.url, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });
    const coupons = await response.json();

    const coupon = coupons.find((c: any) => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'This promo code is no longer active' }, { status: 400 });
    }

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
