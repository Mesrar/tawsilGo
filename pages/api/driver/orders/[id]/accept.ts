import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get the order id from the query parameters
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid order id" });
  }

  try {
    // Build the endpoint URL for accepting the order
    const apiUrl = `http://localhost:8080/driver/orders/${id}/accept`;
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Accept order failed:", response.status, await response.text());
      throw new Error("Failed to accept order");
    }

    const data = await response.json();

    // Return the accepted order's info (or confirmation) wrapped in an object
    res.status(200).json({ order: data });
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ error: "Error accepting order" });
  }
}