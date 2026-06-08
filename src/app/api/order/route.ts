import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      recipient,
      name,
      phone,
      email,
      address,
      deliveryMethod,
      date,
      timeSlot,
      orderLines,
      specialRequests,
      estimatedTotal
    } = body;

    // Check if SMTP environment variables are configured
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if (!gmailUser || !gmailPass) {
      console.warn("⚠️ SMTP Warning: GMAIL_USER or GMAIL_PASS environment variables are not configured.");
      return NextResponse.json(
        { 
          status: 'success', 
          message: 'Order received. However, email notification was skipped because SMTP credentials are not configured in .env file.' 
        }, 
        { status: 200 }
      );
    }

    // Configure the nodemailer transporter using Gmail Service settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    const formattedAddress = deliveryMethod === 'delivery' ? address : 'Self-Pickup (Kunnallissairaalantie 52A, Turku)';
    const deliveryMethodLabel = deliveryMethod === 'delivery' ? 'Home Delivery' : 'Self-Pickup';

    // Construct the mail options
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Velvet Crumbs Order Builder" <${gmailUser}>`,
      to: process.env.RECEIVER_EMAIL || recipient || 'velvetcrumbs.fi@gmail.com',
      replyTo: gmailUser,
      subject: `🍪 New Pre-Order Request from ${name}`,
      html: `
        <div style="font-family: 'Georgia', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #f9ebe0; background-color: #fffdfb; color: #2d2d2d; border-radius: 16px;">
          <!-- Header -->
          <div style="text-align: center; border-bottom: 2px solid #f48b7d; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #f48b7d; font-size: 26px; margin: 0; font-weight: normal; letter-spacing: 1px;">Velvet Crumbs</h1>
            <p style="font-style: italic; color: #8c8c8c; margin: 6px 0 0 0; font-size: 13px;">Pre-Order Notification Request</p>
          </div>

          <!-- Customer details -->
          <div style="background-color: #fff9f5; border: 1px solid #fbe6d8; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h2 style="color: #6d4c41; font-size: 18px; margin-top: 0; margin-bottom: 14px; border-bottom: 1px solid #fbe6d8; padding-bottom: 6px;">Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #757575; width: 140px;">Name:</td>
                <td style="padding: 6px 0; color: #2d2d2d;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #757575;">Phone/WhatsApp:</td>
                <td style="padding: 6px 0; color: #2d2d2d;"><a href="tel:${phone}" style="color: #f48b7d; text-decoration: none;">${phone}</a></td>
              </tr>
              ${email ? `
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #757575;">Email:</td>
                <td style="padding: 6px 0; color: #2d2d2d;"><a href="mailto:${email}" style="color: #f48b7d; text-decoration: none;">${email}</a></td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #757575;">Fulfillment:</td>
                <td style="padding: 6px 0; color: #2d2d2d;">${deliveryMethodLabel}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #757575;">Date:</td>
                <td style="padding: 6px 0; color: #2d2d2d;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #757575;">Preferred Time:</td>
                <td style="padding: 6px 0; color: #2d2d2d;">${timeSlot}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #757575; vertical-align: top;">Address:</td>
                <td style="padding: 6px 0; color: #2d2d2d; line-height: 1.4;">${formattedAddress}</td>
              </tr>
            </table>
          </div>

          <!-- Order Content -->
          <div style="margin-bottom: 24px;">
            <h2 style="color: #6d4c41; font-size: 18px; margin-top: 0; margin-bottom: 14px; border-bottom: 1px solid #f9ebe0; padding-bottom: 6px;">Box Selection</h2>
            <div style="background-color: #ffffff; border: 1px solid #f9ebe0; border-radius: 12px; padding: 16px; white-space: pre-line; line-height: 1.6; font-family: monospace; font-size: 13px; color: #4e342e;">
              ${orderLines}
            </div>
          </div>

          <!-- Dietary Requests -->
          ${specialRequests ? `
          <div style="margin-bottom: 24px; background-color: #fff8e1; border: 1px solid #ffe082; border-radius: 12px; padding: 16px;">
            <h3 style="color: #f57f17; font-size: 14px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Special Requests / Dietaries</h3>
            <p style="margin: 0; font-size: 14px; line-height: 1.4; color: #5d4037;">${specialRequests}</p>
          </div>
          ` : ''}

          <!-- Total Footer -->
          <div style="text-align: right; border-top: 2px solid #f48b7d; padding-top: 16px; margin-top: 24px;">
            <span style="font-size: 14px; color: #8c8c8c; text-transform: uppercase; letter-spacing: 1px;">Estimated Total:</span>
            <div style="font-size: 28px; font-weight: bold; color: #f48b7d; margin-top: 4px;">
              ${estimatedTotal.toFixed(2).replace('.', ',')} €
            </div>
            <p style="font-size: 11px; font-style: italic; color: #8c8c8c; margin: 4px 0 0 0;">
              *Final prices are explicitly reviewed and confirmed before baking.
            </p>
          </div>
        </div>
      `
    };

    if (email && email.trim()) {
      mailOptions.bcc = email.trim();
    }

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error: any) {
    console.error("❌ SMTP Error in order submission API:", error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Internal server error while processing email notification.',
        details: error?.message || String(error)
      }, 
      { status: 500 }
    );
  }
}
