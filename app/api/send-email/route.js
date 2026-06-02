import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const body = await req.json();

  try {
    const data = await resend.emails.send({
      from: "Order System <onboarding@resend.dev>",
      to: body.email,
      subject: "Order Confirmation 🎉",
      html: `
        <h2>Order Placed Successfully 🎉</h2>
        <p>Hello <b>${body.name}</b>,</p>
        <p>Your order has been received successfully.</p>
        <p><b>Service:</b> ${body.service}</p>
        <p>We will contact you soon.</p>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.log(error);
    return Response.json({ success: false, error });
  }
}