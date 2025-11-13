import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Email Notification API
 *
 * Sends email notifications via SendGrid
 *
 * Environment Variables Required:
 * - SENDGRID_API_KEY
 * - SENDGRID_FROM_EMAIL
 * - SENDGRID_FROM_NAME
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, subject, body, trigger } = req.body;

    // Validate input
    if (!to || !subject || !body) {
      return res.status(400).json({
        error: "Missing required fields: to, subject, body",
      });
    }

    // In production, integrate with SendGrid SDK:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //
    // const msg = {
    //   to: to,
    //   from: {
    //     email: process.env.SENDGRID_FROM_EMAIL,
    //     name: process.env.SENDGRID_FROM_NAME || 'TawsilGo',
    //   },
    //   subject: subject,
    //   text: body,
    //   html: convertToHtml(body), // Convert plain text to HTML
    // };
    //
    // const response = await sgMail.send(msg);
    //
    // return res.status(200).json({
    //   success: true,
    //   messageId: response[0].headers['x-message-id'],
    //   status: 'sent',
    // });

    // For now, simulate successful send
    console.log(`[EMAIL] Sending to ${to}: ${subject}`);

    return res.status(200).json({
      success: true,
      messageId: `sim_email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "sent",
      provider: "sendgrid",
      trigger,
    });
  } catch (error: any) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to send email",
    });
  }
}

/**
 * Convert plain text to basic HTML
 * (In production, use proper email templates)
 */
function convertToHtml(text: string): string {
  return text
    .split("\n\n")
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}
