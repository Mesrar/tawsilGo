import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for token in cookies for authorization.
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Call the backend endpoint to get the driver's orders.
    const response = await fetch("http://localhost:8080/driver/orders", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch driver orders");
    }

    const data = await response.json();
    console.log("data  ------>",data)
    // Respond with the orders, wrapped in an object.
    res.status(200).json({ orders: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Error fetching driver orders" });
  }
}