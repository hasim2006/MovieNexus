import { NextResponse } from 'next/server';
import { generateSecureVideoToken } from '../../../lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { mediaId, profileId } = await request.json();
    if (!mediaId || !profileId) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    const token = generateSecureVideoToken(mediaId, profileId, 7200);
    return NextResponse.json({
      success: true,
      token,
      expiresIn: 7200,
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Token generation failed' }, { status: 500 });
  }
}
