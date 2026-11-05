import { NextResponse } from 'next/server';

// WhatsApp Business Cloud API Webhook (Verification + Event Ingestion)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify webhook token against campus config
  if (mode === 'subscribe' && token === (process.env.WHATSAPP_VERIFY_TOKEN || 'CAMPUS_IT_SECRET_2026')) {
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // In a real app: check HMAC-SHA256 signature in X-Hub-Signature-256 header
    // Parse message or incoming call event
    const entry = payload?.entry?.[0]?.changes?.[0]?.value;

    return NextResponse.json({
      received: true,
      status: 'PROCESSED',
      event: entry?.messages ? 'MESSAGE' : entry?.calls ? 'CALL_INBOUND' : 'UNKNOWN'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook processing failure' }, { status: 400 });
  }
}
