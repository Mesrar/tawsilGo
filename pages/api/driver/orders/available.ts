import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify token with your backend
    const response = await fetch(
      "http://localhost:8080/driver/orders/available",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error(
        "Validation failed:",
        response.status,
        await response.text()
      );
      throw new Error("Failed to fetch orders");
    }

    // Assuming the backend returns a JSON array of orders like the example provided.
    const ordersData = await response.json();

    // Wrap the orders array in an object so the shape is { orders: [...] }
    res.status(200).json({ orders: ordersData });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}
