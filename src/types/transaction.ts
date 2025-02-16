
export interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  type: string;
  status: string;
  payment_method: string;
  description: string | null;
}
