import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'EUR' | 'USD' | 'RSD';

export interface ExchangeRates {
  EUR: number;
  USD: number;
  RSD: number;
}

interface CurrencyContextType {
  displayCurrency: Currency;
  setDisplayCurrency: (currency: Currency) => void;
  exchangeRates: ExchangeRates;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  formatAmount: (amount: number, currency: Currency) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('walletwise-display-currency') as Currency) || 'EUR';
  });
  
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    EUR: 1,
    USD: 1.08,
    RSD: 117
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const fetchExchangeRates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      const data = await response.json();
      
      setExchangeRates({
        EUR: 1,
        USD: data.rates.USD || 1.08,
        RSD: data.rates.RSD || 117
      });
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Keep fallback rates
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
    // Refresh rates every hour
    const interval = setInterval(fetchExchangeRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('walletwise-display-currency', displayCurrency);
  }, [displayCurrency]);

  const convertAmount = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to EUR first, then to target currency
    const amountInEur = amount / exchangeRates[fromCurrency];
    return amountInEur * exchangeRates[toCurrency];
  };

  const formatAmount = (amount: number, currency: Currency): string => {
    const formatters = {
      EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      RSD: new Intl.NumberFormat('sr-RS', { style: 'currency', currency: 'RSD' })
    };
    
    return formatters[currency].format(amount);
  };

  return (
    <CurrencyContext.Provider value={{
      displayCurrency,
      setDisplayCurrency,
      exchangeRates,
      convertAmount,
      formatAmount,
      isLoading
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
