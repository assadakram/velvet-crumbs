import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

const BLOB_FILENAME = 'coupons.json';

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
    const { blobs } = await list({ prefix: BLOB_FILENAME });
    const couponBlob = blobs.find(b => b.pathname === BLOB_FILENAME);

    if (!couponBlob) {
      return NextResponse.json({ coupons: [] });
    }

    const response = await fetch(couponBlob.url, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });
    const coupons = await response.json();
    return NextResponse.json({ coupons }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
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

    // Fetch existing coupons
    const { blobs } = await list({ prefix: BLOB_FILENAME });
    const couponBlob = blobs.find(b => b.pathname === BLOB_FILENAME);
    
    let coupons: any[] = [];
    if (couponBlob) {
      const response = await fetch(couponBlob.url, {
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      });
      coupons = await response.json();
    }

    if (action === 'create' || action === 'update') {
      const existingIndex = coupons.findIndex((c: any) => c.code.toUpperCase() === coupon.code.toUpperCase());
      if (existingIndex >= 0) {
        if (action === 'create') {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
        }
        coupons[existingIndex] = { ...coupons[existingIndex], ...coupon };
      } else {
        coupons.push({ ...coupon, code: coupon.code.toUpperCase() });
      }
    } else if (action === 'delete') {
      coupons = coupons.filter((c: any) => c.code.toUpperCase() !== code.toUpperCase());
    }

    // Save back to Blob
    await put(BLOB_FILENAME, JSON.stringify(coupons), {
      access: 'private',
      addRandomSuffix: false, // Don't append a random suffix
      allowOverwrite: true, // Required by Vercel to overwrite the existing file
      contentType: 'application/json',
      cacheControlMaxAge: 0,
    });

    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Error updating coupons:', error);
    return NextResponse.json({ error: 'Failed to update coupons' }, { status: 500 });
  }
}
