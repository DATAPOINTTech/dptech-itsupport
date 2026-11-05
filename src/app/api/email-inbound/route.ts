import { NextResponse } from 'next/server';

// Simulated Email Inbound Parse Gateway (e.g., SendGrid / AWS SES Inbound Webhook)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { from, subject, text, attachments } = body;

    // Check DKIM / SPF verification headers
    const dkimStatus = req.headers.get('x-dkim-status') || 'PASS';
    const spfStatus = req.headers.get('x-spf-status') || 'PASS';

    if (dkimStatus !== 'PASS' || spfStatus !== 'PASS') {
      return NextResponse.json({
        error: 'Inbound message failed institutional DKIM/SPF anti-spoofing policy.',
        status: 'REJECTED'
      }, { status: 403 });
    }

    const ticketRef = `IT-2026-00${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      action: 'TICKET_CREATED_FROM_EMAIL',
      ticketRef,
      sender: from,
      subject,
      autoReplySent: true,
      message: `Ticket ${ticketRef} opened. Inbound email verified and auto-replied.`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse inbound email' }, { status: 500 });
  }
}
