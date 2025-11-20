
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReservationActionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { rejectionReason?: string; itemConditionOnReturn?: string }) => void;
  action: 'reject' | 'complete';
  itemName: string;
}

export default function ReservationActionDialog({
  open,
  onClose,
  onSubmit,
  action,
  itemName
}: ReservationActionDialogProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'reject') {
      onSubmit({ rejectionReason: reason.trim() || undefined });
    } else {
      onSubmit({ itemConditionOnReturn: reason.trim() || undefined });
    }
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {action === 'reject' ? 'Reject Reservation' : 'Mark as Returned'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Item: <strong>{itemName}</strong>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">
              {action === 'reject' ? 'Rejection Reason *' : 'Item Condition Notes (Optional)'}
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                action === 'reject' 
                  ? "Please provide a reason for rejection..." 
                  : "Note any damage or issues with the returned item..."
              }
              rows={4}
              required={action === 'reject'}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setReason("");
              onClose();
            }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant={action === 'reject' ? 'destructive' : 'default'}
              disabled={action === 'reject' && !reason.trim()}
            >
              {action === 'reject' ? 'Reject Reservation' : 'Mark as Returned'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
