import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get the orderId from the query parameters (dynamic route)
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid order id" });
  }

  try {
    // Verify token with your backend
    // Build the endpoint URL using the orderId
    const apiUrl = `http://localhost:8080/parcel/${id}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
