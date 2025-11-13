"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Euro,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencyBalance {
  currency: "EUR" | "MAD";
  amount: number;
  symbol: string;
  flag: string;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
  trend: "up" | "down" | "stable";
  change24h: number;
}

interface MultiCurrencyDashboardProps {
  eurBalance?: number;
  madBalance?: number;
  className?: string;
}

export function MultiCurrencyDashboard({
  eurBalance = 0,
  madBalance = 0,
  className,
}: MultiCurrencyDashboardProps) {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    from: "EUR",
    to: "MAD",
    rate: 10.85, // Default rate EUR to MAD (approximate)
    lastUpdated: new Date().toISOString(),
    trend: "stable",
    change24h: 0.12,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate fetching exchange rate (replace with actual API call)
  const fetchExchangeRate = async () => {
    setIsRefreshing(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, fetch from real API like:
    // const response = await fetch('/api/exchange-rates?from=EUR&to=MAD');
    // const data = await response.json();

    setExchangeRate({
      from: "EUR",
      to: "MAD",
      rate: 10.85 + (Math.random() - 0.5) * 0.2, // Simulated fluctuation
      lastUpdated: new Date().toISOString(),
      trend: Math.random() > 0.5 ? "up" : "down",
      change24h: (Math.random() - 0.5) * 0.5,
    });

    setIsRefreshing(false);
  };

  useEffect(() => {
    // Fetch exchange rate on mount and every 5 minutes
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const balances: CurrencyBalance[] = [
    {
      currency: "EUR",
      amount: eurBalance,
      symbol: "€",
      flag: "🇪🇺",
    },
    {
      currency: "MAD",
      amount: madBalance,
      symbol: "د.م.",
      flag: "🇲🇦",
    },
  ];

  // Calculate equivalent values
  const eurToMad = eurBalance * exchangeRate.rate;
  const madToEur = madBalance / exchangeRate.rate;
  const totalInEur = eurBalance + madToEur;
  const totalInMad = madBalance + eurToMad;

  const formatCurrency = (amount: number, currency: "EUR" | "MAD") => {
    const balance = balances.find((b) => b.currency === currency);
    return `${balance?.symbol}${amount.toFixed(2)}`;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-primary" />
            <CardTitle>Multi-Currency Balance</CardTitle>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchExchangeRate}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-3 w-3 mr-1", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
        <CardDescription>Track earnings in EUR and MAD</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Exchange Rate Display */}
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Exchange Rate</span>
            <Badge
              variant={exchangeRate.trend === "up" ? "default" : "secondary"}
              className="text-xs"
            >
              {exchangeRate.trend === "up" ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {exchangeRate.change24h > 0 ? "+" : ""}
              {exchangeRate.change24h.toFixed(2)}%
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              1 EUR = {exchangeRate.rate.toFixed(2)} MAD
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Updated at {formatTime(exchangeRate.lastUpdated)}
          </p>
        </div>

        {/* Currency Balances */}
        <Tabs defaultValue="EUR" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="EUR">
              🇪🇺 EUR
            </TabsTrigger>
            <TabsTrigger value="MAD">
              🇲🇦 MAD
            </TabsTrigger>
          </TabsList>

          <TabsContent value="EUR" className="space-y-4 mt-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Euro Balance</p>
              <p className="text-4xl font-bold">€{eurBalance.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                ≈ {formatCurrency(eurToMad, "MAD")}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Total Value in EUR</h4>
              <div className="rounded-lg border p-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">EUR Balance</span>
                  <span className="font-semibold">€{eurBalance.toFixed(2)}</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm text-muted-foreground">MAD → EUR</span>
                  <span className="font-semibold">€{madToEur.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">
                    €{totalInEur.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="MAD" className="space-y-4 mt-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Moroccan Dirham Balance</p>
              <p className="text-4xl font-bold">د.م.{madBalance.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                ≈ {formatCurrency(madToEur, "EUR")}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Total Value in MAD</h4>
              <div className="rounded-lg border p-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">MAD Balance</span>
                  <span className="font-semibold">د.م.{madBalance.toFixed(2)}</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm text-muted-foreground">EUR → MAD</span>
                  <span className="font-semibold">د.م.{eurToMad.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">
                    د.م.{totalInMad.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Conversion */}
        <div className="rounded-lg border p-3 space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Quick Conversions
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-muted-foreground">100 EUR</div>
            <div className="font-semibold text-right">
              {(100 * exchangeRate.rate).toFixed(2)} MAD
            </div>
            <div className="text-muted-foreground">1,000 MAD</div>
            <div className="font-semibold text-right">
              {(1000 / exchangeRate.rate).toFixed(2)} EUR
            </div>
          </div>
        </div>

        {/* Exchange Rate Alert */}
        {Math.abs(exchangeRate.change24h) > 0.3 && (
          <div className="rounded-lg border border-yellow-500 bg-yellow-50 dark:bg-yellow-950 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Exchange Rate Alert
                </p>
                <p className="text-yellow-800 dark:text-yellow-200 mt-1">
                  EUR/MAD has changed by {exchangeRate.change24h > 0 ? "+" : ""}
                  {exchangeRate.change24h.toFixed(2)}% in the last 24 hours
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
