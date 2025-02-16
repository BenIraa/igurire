
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  quantity: number;
  amount: number;
  status: string;
  api_order_id: string | null;
  service: {
    name: string;
    category: string;
  };
}

interface OrdersTableProps {
  orders: Order[] | undefined;
  isLoading: boolean;
  getStatusColor: (status: string) => string;
}

export const OrdersTable = ({ orders, isLoading, getStatusColor }: OrdersTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No orders found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                {order.id}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {order.service.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.service.category}
                  </div>
                </div>
              </TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>${order.amount}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(order.status)} capitalize`}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(order.created_at), "PPp")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
