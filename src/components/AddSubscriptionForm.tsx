
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { CurrencySelect } from "@/components/ui/currency-select";
import { useCurrency, Currency } from "@/contexts/CurrencyContext";

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
  const [renewalInterval, setRenewalInterval] = useState("Monthly");
  const [currency, setCurrency] = useState<Currency>("EUR");

  const { addSubscription, isAddingSubscription } = useSubscriptions();
  const { displayCurrency } = useCurrency();

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
      renewal_interval: renewalInterval,
      currency: currency,
    });

    // Reset form
    setName("");
    setAmount("");
    setNextPaymentDate(new Date().toISOString().split('T')[0]);
    setDescription("");
    setRenewalInterval("Monthly");
    setCurrency("EUR");
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
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="flex-1"
              />
              <CurrencySelect 
                value={currency} 
                onValueChange={setCurrency}
                className="w-24"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="renewal-frequency">Renewal Frequency *</Label>
            <Select value={renewalInterval} onValueChange={setRenewalInterval}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
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
