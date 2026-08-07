import { NextResponse, NextRequest } from 'next/server';
import { put, list, del } from '@vercel/blob';

export const dynamic = 'force-dynamic';

const BLOB_FILENAME = 'coupons.json';

// Helper to check admin authoriezation
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
    // Fetch existing coupons
    const { blobs } = await list({ prefix: 'coupons' });
    blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    const couponBlob = blobs[0];

    if (!couponBlob) {
      return NextResponse.json({ coupons: [] });
    }

    // Add timestamp to bypass Vercel Edge CDN cache
    const response = await fetch(`${couponBlob.url}?t=${Date.now()}`, {
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
    const { blobs } = await list({ prefix: 'coupons' });
    blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    const couponBlob = blobs[0];
    
    let coupons: any[] = [];
    if (couponBlob) {
      // Add timestamp to bypass Vercel Edge CDN cache
      const response = await fetch(`${couponBlob.url}?t=${Date.now()}`, {
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

    // Save back to Blob with a random suffix to ensure a unique URL (bypasses CDN completely)
    await put('coupons.json', JSON.stringify(coupons), {
      access: 'private',
      addRandomSuffix: true,
      contentType: 'application/json',
      cacheControlMaxAge: 0,
    });

    // Clean up old blobs to save space
    if (blobs.length > 0) {
      const urlsToDelete = blobs.map((b) => b.url);
      await del(urlsToDelete);
    }

    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Error updating coupons:', error);
    return NextResponse.json({ error: 'Failed to update coupons' }, { status: 500 });
  }
}
