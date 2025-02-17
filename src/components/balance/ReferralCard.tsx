
import { useState } from "react";
import { Copy, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ReferralCardProps {
  referralCode: string;
  referralCount: number;
}

export const ReferralCard = ({ referralCode, referralCount }: ReferralCardProps) => {
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy referral link",
      });
    } finally {
      setCopying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Refer Friends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Share your referral link with friends and earn 100 RWF for each new user who signs up!
        </div>
        
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-muted p-2 rounded text-sm overflow-x-auto">
            {referralLink}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            disabled={copying}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm">
          Total referrals: <span className="font-medium">{referralCount}</span>
        </div>
      </CardContent>
    </Card>
  );
};
