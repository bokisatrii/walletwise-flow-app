
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubscriptions } from "@/hooks/useSubscriptions";

interface AddSubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddSubscriptionForm = ({ open, onOpenChange }: AddSubscriptionFormProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [nextPaymentDate, setNextPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState("");

  const { addSubscription, isAddingSubscription } = useSubscriptions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !amount || !nextPaymentDate) {
      return;
    }

    addSubscription({
      name: name.trim(),
      amount: parseFloat(amount),
      next_payment_date: nextPaymentDate,
      description: description.trim() || null,
    });

    // Reset form
    setName("");
    setAmount("");
    setNextPaymentDate(new Date().toISOString().split('T')[0]);
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Netflix, Spotify"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="next-payment">Next Payment Date *</Label>
            <Input
              id="next-payment"
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1"
              disabled={isAddingSubscription}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isAddingSubscription}
            >
              {isAddingSubscription ? "Adding..." : "Add Subscription"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
