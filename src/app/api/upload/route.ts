import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName, chunkSize, totalChunks, currentChunk } = body;

    const isLastChunk = currentChunk === totalChunks - 1;

    return NextResponse.json({
      success: true,
      chunkIndex: currentChunk,
      totalChunks,
      isCompleted: isLastChunk,
      hlsManifestUrl: isLastChunk
        ? 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
        : undefined,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Chunked upload error' }, { status: 400 });
  }
}
