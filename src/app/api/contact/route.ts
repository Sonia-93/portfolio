const recipient = "shimirwasonia5@gmail.com";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please submit a valid message." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Please submit a valid message." }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;
  if (
    typeof name !== "string" || name.trim().length < 1 || name.length > 120 ||
    typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== "string" || message.trim().length < 1 || message.length > 5000
  ) {
    return Response.json({ error: "Please check your name, email, and message, then try again." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return Response.json({ error: "Email delivery is not configured yet. Please email me directly at shimirwasonia5@gmail.com." }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email.trim(),
        subject: `Portfolio message from ${name.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
      }),
    });

    if (!response.ok) {
      console.error("Resend rejected contact message", response.status);
      return Response.json({ error: "Your message could not be sent. Please try again or email me directly." }, { status: 502 });
    }

    return Response.json({ sent: true });
  } catch (error) {
    console.error("Contact email delivery failed", error);
    return Response.json({ error: "Your message could not be sent. Please try again or email me directly." }, { status: 502 });
  }
}
