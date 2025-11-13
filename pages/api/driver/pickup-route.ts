import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const response = await fetch(
        "http://localhost:8080/driver/pickup-route",
        {
          headers: {
            Authorization: `Bearer ${token}`,
           "Content-Type": "application/json" 
          },
        }
      );

      console.log("response data:", response);
      const data = await response.json();
      console.log("API data:", data);

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          message: data.message || "Failed to fetch pickup route",
        });
      }

      res.status(200).json({
        success: true,
        data: data, // data is expected to be an object with "features" key
      });
    } catch (error) {
      console.error("Error fetching pickup route:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }
}
