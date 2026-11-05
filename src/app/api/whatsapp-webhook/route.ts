import { NextResponse } from 'next/server';

// WhatsApp Business Cloud API Webhook (Verification + Event Ingestion with Aisha AI)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify webhook token against configured verify secret
  const verifySecret = process.env.WHATSAPP_VERIFY_TOKEN || 'CAMPUS_IT_SECRET_2026';

  if (mode === 'subscribe' && token === verifySecret) {
    return new Response(challenge || 'OK', { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Check entry and event types
    const entry = payload?.entry?.[0]?.changes?.[0]?.value;
    const incomingMessages = entry?.messages;
    const incomingCalls = entry?.calls;

    let responseSummary = 'Event acknowledged';
    let aishaAutoReply: string | null = null;
    let generatedTicketRef: string | null = null;

    if (incomingMessages && incomingMessages.length > 0) {
      const msg = incomingMessages[0];
      const fromNumber = msg.from;
      const textBody = msg.text?.body || '';

      const isHumanRequested = ['human', 'agent', 'representative', 'operator'].some(k => 
        textBody.toLowerCase().includes(k)
      );

      const refNum = Math.floor(1000 + Math.random() * 9000);
      generatedTicketRef = `IT-2026-00${refNum}`;

      if (isHumanRequested) {
        aishaAutoReply = `Hello! I am Aisha from DATAPOINT Technologies Support. I have escalated your inquiry directly to an on-duty technician under ticket ${generatedTicketRef}. A team member will reach out shortly.`;
      } else {
        aishaAutoReply = `Hello! I am Aisha, your DATAPOINT Technologies AI Support Specialist. I received your request: "${textBody.slice(0, 50)}...". Ticket ${generatedTicketRef} has been initiated for you.`;
      }

      responseSummary = `Message processed from ${fromNumber}`;
    } else if (incomingCalls && incomingCalls.length > 0) {
      const call = incomingCalls[0];
      responseSummary = `Inbound WhatsApp Voice Call initiated from ${call.from} (Provider Call ID: ${call.id})`;
      aishaAutoReply = `Connecting to Aisha voice bridge...`;
    }

    return NextResponse.json({
      received: true,
      status: 'PROCESSED',
      event: incomingMessages ? 'MESSAGE' : incomingCalls ? 'CALL_INBOUND' : 'UNKNOWN',
      agent: 'Aisha (DATAPOINT AI)',
      generatedTicketRef,
      aishaAutoReply,
      summary: responseSummary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook processing failure', details: String(error) }, { status: 400 });
  }
}
