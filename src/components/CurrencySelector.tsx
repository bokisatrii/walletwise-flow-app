
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency, Currency } from "@/contexts/CurrencyContext";

interface CurrencySelectorProps {
  value?: Currency;
  onValueChange?: (currency: Currency) => void;
  className?: string;
}

export const CurrencySelector = ({ value, onValueChange, className }: CurrencySelectorProps) => {
  const { displayCurrency, setDisplayCurrency } = useCurrency();
  
  const currentValue = value !== undefined ? value : displayCurrency;
  const handleChange = onValueChange || setDisplayCurrency;

  const currencies: { value: Currency; label: string; symbol: string }[] = [
    { value: 'EUR', label: 'Euro', symbol: '€' },
    { value: 'USD', label: 'Dollar', symbol: '$' },
    { value: 'RSD', label: 'Dinar', symbol: 'RSD' }
  ];

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className={className || "w-24"}>
        <SelectValue />
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
