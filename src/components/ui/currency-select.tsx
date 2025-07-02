import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Currency } from "@/contexts/CurrencyContext";

interface CurrencySelectProps {
  value: Currency;
  onValueChange: (value: Currency) => void;
  className?: string;
  placeholder?: string;
}

export const CurrencySelect = ({ value, onValueChange, className, placeholder }: CurrencySelectProps) => {
  const currencies: { value: Currency; label: string; symbol: string }[] = [
    { value: 'EUR', label: 'Euro', symbol: '€' },
    { value: 'USD', label: 'Dollar', symbol: '$' },
    { value: 'RSD', label: 'Dinar', symbol: 'RSD' }
  ];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.value} value={currency.value}>
            {currency.symbol}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};