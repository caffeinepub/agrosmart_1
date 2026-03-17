import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAllPrices, useInitMarket } from "@/hooks/useQueries";
import type { Language } from "@/i18n";
import { t } from "@/i18n";
import {
  ChevronRight,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const CROP_EMOJIS: Record<string, string> = {
  "Rice (Samba)": "🌾",
  Tomato: "🍅",
  Coconut: "🥥",
  "Banana (Embul)": "🍌",
  "Green Chilli": "🌶️",
  Gotukola: "🥬",
};

const FALLBACK_PRICES = [
  {
    cropName: "Rice (Samba)",
    pricePerKg: 185,
    marketLocation: "Colombo Pettah",
    trendUp: true,
  },
  {
    cropName: "Tomato",
    pricePerKg: 220,
    marketLocation: "Kandy Market",
    trendUp: false,
  },
  {
    cropName: "Coconut",
    pricePerKg: 95,
    marketLocation: "Galle Main Market",
    trendUp: true,
  },
  {
    cropName: "Banana (Embul)",
    pricePerKg: 140,
    marketLocation: "Jaffna Market",
    trendUp: true,
  },
  {
    cropName: "Green Chilli",
    pricePerKg: 480,
    marketLocation: "Colombo Manning",
    trendUp: false,
  },
  {
    cropName: "Gotukola",
    pricePerKg: 320,
    marketLocation: "Kandy Market",
    trendUp: true,
  },
];

export default function MarketTab({ lang }: { lang: Language }) {
  const init = useInitMarket();
  const { data: prices, isLoading } = useAllPrices();
  const [qty, setQty] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: init mutation runs once on mount
  useEffect(() => {
    init.mutate();
  }, []);

  const displayPrices = prices && prices.length > 0 ? prices : FALLBACK_PRICES;
  const selectedPrice = displayPrices.find((p) => p.cropName === selectedCrop);

  const calcRevenue = () => {
    if (!selectedPrice || !qty) return;
    setRevenue(Number(qty) * selectedPrice.pricePerKg);
  };

  const getOcid = (i: number) => `market.price.item.${i + 1}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Minimal dark header */}
      <header className="px-5 pt-5 pb-3 flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: "oklch(0.52 0.18 145 / 0.2)",
            border: "1px solid oklch(0.52 0.18 145 / 0.3)",
          }}
        >
          <ShoppingBag className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-base font-display font-bold text-foreground">
          Market Prices
        </h1>
      </header>

      <div className="p-4 space-y-2">
        {isLoading ? (
          <div data-ocid="market.loading_state" className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl"
                style={{ background: "oklch(0.18 0.05 145)" }}
              />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.18 0.05 145)",
              border: "1px solid oklch(0.25 0.06 145)",
            }}
          >
            {displayPrices.map((price, i) => (
              <div key={price.cropName}>
                {i > 0 && (
                  <div
                    className="h-px mx-4"
                    style={{ background: "oklch(0.25 0.06 145)" }}
                  />
                )}
                <motion.button
                  type="button"
                  data-ocid={getOcid(i)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() =>
                    setSelectedCrop(
                      selectedCrop === price.cropName ? null : price.cropName,
                    )
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                  style={{
                    background:
                      selectedCrop === price.cropName
                        ? "oklch(0.52 0.18 145 / 0.08)"
                        : "transparent",
                  }}
                >
                  <span className="text-2xl w-8 text-center flex-shrink-0">
                    {CROP_EMOJIS[price.cropName] || "🌱"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {price.cropName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {price.marketLocation}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className="font-bold text-sm"
                      style={{ color: "oklch(0.78 0.14 80)" }}
                    >
                      LKR {price.pricePerKg}/kg
                    </p>
                    <div
                      className={`flex items-center gap-0.5 justify-end text-xs ${
                        price.trendUp ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {price.trendUp ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{price.trendUp ? "Rising" : "Falling"}</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                      selectedCrop === price.cropName ? "rotate-90" : ""
                    }`}
                  />
                </motion.button>
              </div>
            ))}
          </div>
        )}

        {/* Profit Estimator */}
        <div
          className="rounded-2xl p-4 space-y-3 mt-4"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          <p className="font-display font-bold text-foreground flex items-center gap-2">
            <span className="text-lg">📊</span> {t(lang, "profitEstimator")}
          </p>
          {selectedCrop ? (
            <div
              className="rounded-xl p-2.5 flex items-center gap-2"
              style={{
                background: "oklch(0.52 0.18 145 / 0.12)",
                border: "1px solid oklch(0.52 0.18 145 / 0.2)",
              }}
            >
              <span className="text-lg">
                {CROP_EMOJIS[selectedCrop] || "🌱"}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {selectedCrop}
              </span>
              <span className="text-xs text-muted-foreground">
                @ LKR {selectedPrice?.pricePerKg}/kg
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a crop above to estimate profit
            </p>
          )}
          <Input
            data-ocid="market.profit.input"
            type="number"
            placeholder={t(lang, "quantity")}
            value={qty}
            onChange={(e) => {
              setQty(e.target.value);
              setRevenue(null);
            }}
            className="h-11 rounded-xl border-border"
            style={{ background: "oklch(0.22 0.04 145)" }}
          />
          <Button
            data-ocid="market.profit.button"
            className="w-full h-11 rounded-xl font-semibold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.18 145), oklch(0.40 0.15 145))",
              color: "oklch(0.98 0 0)",
              boxShadow: "0 4px 16px oklch(0.52 0.18 145 / 0.25)",
            }}
            onClick={calcRevenue}
            disabled={!selectedCrop || !qty}
          >
            {t(lang, "calculate")}
          </Button>
          {revenue !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl p-3 text-center"
              style={{
                background: "oklch(0.78 0.14 80 / 0.12)",
                border: "1px solid oklch(0.78 0.14 80 / 0.25)",
              }}
            >
              <p className="text-xs text-muted-foreground">
                {t(lang, "totalRevenue")}
              </p>
              <p
                className="text-2xl font-bold font-display"
                style={{ color: "oklch(0.78 0.14 80)" }}
              >
                LKR {revenue.toLocaleString()}
              </p>
            </motion.div>
          )}
          {selectedPrice && (
            <div
              className={`rounded-xl p-3 text-sm font-semibold ${
                selectedPrice.trendUp ? "text-primary" : "text-destructive"
              }`}
              style={{
                background: selectedPrice.trendUp
                  ? "oklch(0.52 0.18 145 / 0.1)"
                  : "oklch(0.55 0.22 25 / 0.1)",
                border: selectedPrice.trendUp
                  ? "1px solid oklch(0.52 0.18 145 / 0.2)"
                  : "1px solid oklch(0.55 0.22 25 / 0.2)",
              }}
            >
              {selectedPrice.trendUp
                ? "✅ Good time to sell — prices are rising!"
                : "⏳ Consider waiting — prices are falling."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
