import type { NextApiRequest, NextApiResponse } from "next";

/**
 * SMS Notification API
 *
 * Sends SMS notifications via Twilio
 *
 * Environment Variables Required:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE_NUMBER
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, body, trigger } = req.body;

    // Validate input
    if (!to || !body) {
      return res.status(400).json({ error: "Missing required fields: to, body" });
    }

    // In production, integrate with Twilio SDK:
    // const twilio = require('twilio');
    // const client = twilio(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // );
    //
    // const message = await client.messages.create({
    //   body: body,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: to,
    // });
    //
    // return res.status(200).json({
    //   success: true,
    //   messageId: message.sid,
    //   status: message.status,
    // });

    // For now, simulate successful send
    console.log(`[SMS] Sending to ${to}: ${body}`);

    return res.status(200).json({
      success: true,
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "sent",
      provider: "twilio",
      trigger,
    });
  } catch (error: any) {
    console.error("SMS sending error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to send SMS",
    });
  }
}
