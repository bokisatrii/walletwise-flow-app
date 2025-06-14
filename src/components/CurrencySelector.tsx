
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency, Currency } from "@/contexts/CurrencyContext";

export const CurrencySelector = () => {
  const { displayCurrency, setDisplayCurrency } = useCurrency();

  const currencies: { value: Currency; label: string; symbol: string }[] = [
    { value: 'EUR', label: 'Euro', symbol: '€' },
    { value: 'USD', label: 'Dollar', symbol: '$' },
    { value: 'RSD', label: 'Dinar', symbol: 'RSD' }
  ];

  return (
    <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
      <SelectTrigger className="w-24">
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
