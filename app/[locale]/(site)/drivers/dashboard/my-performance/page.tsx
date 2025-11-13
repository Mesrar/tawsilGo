import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AvailableOrders() {
  // This is a mock-up. In a real application, you'd fetch this data from your backend.
  const orders = [
    { id: 1, pickup: "123 Main St", dropoff: "456 Elm St", distance: "5 miles" },
    { id: 2, pickup: "789 Oak Ave", dropoff: "101 Pine Rd", distance: "3 miles" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Orders</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order #{order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Pickup: {order.pickup}</p>
              <p>Dropoff: {order.dropoff}</p>
              <p>Distance: {order.distance}</p>
              <Button className="mt-4">Accept Order</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

