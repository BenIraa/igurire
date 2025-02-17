
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  balance: number;
  created_at: string;
}

interface UsersTableProps {
  users: User[] | undefined;
  onRefresh: () => void;
}

export const UsersTable = ({ users, onRefresh }: UsersTableProps) => {
  const { toast } = useToast();
  const [editingBalance, setEditingBalance] = useState<{
    userId: string;
    value: string;
  } | null>(null);

  const handleUpdateBalance = async (userId: string) => {
    if (!editingBalance) return;

    const newBalance = parseFloat(editingBalance.value);
    if (isNaN(newBalance)) {
      toast({
        variant: "destructive",
        title: "Invalid balance",
        description: "Please enter a valid number",
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('update_user_balance', {
        target_user_id: userId,
        new_balance: newBalance
      });

      if (error) throw error;

      toast({
        title: "Balance updated",
        description: "User balance has been updated successfully",
      });

      setEditingBalance(null);
      onRefresh();
    } catch (error) {
      console.error('Error updating balance:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user balance",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-mono text-xs">{user.id}</TableCell>
              <TableCell>{user.full_name || "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {editingBalance?.userId === user.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={editingBalance.value}
                      onChange={(e) =>
                        setEditingBalance({
                          userId: user.id,
                          value: e.target.value,
                        })
                      }
                      className="w-24"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUpdateBalance(user.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingBalance(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{user.balance.toLocaleString()} RWF</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingBalance({
                          userId: user.id,
                          value: user.balance.toString(),
                        })
                      }
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </TableCell>
              <TableCell>{format(new Date(user.created_at), "PPp")}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    View Orders
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
