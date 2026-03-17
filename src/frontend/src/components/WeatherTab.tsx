import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInitWeather, useWeatherByRegion } from "@/hooks/useQueries";
import type { Language } from "@/i18n";
import { CloudSun, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const REGIONS = ["Colombo", "Kandy", "Jaffna", "Galle"];

const FORECAST_DAYS = [
  { day: "Tue", emoji: "☀️", high: 33, low: 26 },
  { day: "Wed", emoji: "⛅", high: 30, low: 25 },
  { day: "Thu", emoji: "🌧️", high: 28, low: 24 },
  { day: "Fri", emoji: "🌤️", high: 31, low: 25 },
];

const CHART_POINTS = [
  { x: 0, y: 40, label: "Mon" },
  { x: 80, y: 25, label: "Tue" },
  { x: 160, y: 30, label: "Wed" },
  { x: 240, y: 20, label: "Thu" },
];

function formatDate(time: bigint) {
  return new Date(Number(time) / 1_000_000).toLocaleDateString();
}

export default function WeatherTab({ lang: _lang }: { lang: Language }) {
  const [region, setRegion] = useState("Colombo");
  const init = useInitWeather();
  const { data: forecast, isLoading } = useWeatherByRegion(region);

  // biome-ignore lint/correctness/useExhaustiveDependencies: init mutation runs once on mount
  useEffect(() => {
    init.mutate();
  }, []);

  const temp = forecast ? String(forecast.temperature) : "32";
  const condition = forecast
    ? Number(forecast.rainfall) > 50
      ? "Rainy"
      : "Sunny"
    : "Sunny";
  const condEmoji = condition === "Rainy" ? "🌧️" : "☀️";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Minimal dark header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "oklch(0.52 0.18 145 / 0.2)",
              border: "1px solid oklch(0.52 0.18 145 / 0.3)",
            }}
          >
            <CloudSun className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-base font-display font-bold text-foreground">
            Weather Forecast
          </h1>
        </div>
        <button
          type="button"
          className="p-1.5 rounded-full"
          style={{ background: "oklch(0.22 0.04 145)" }}
        >
          <Save className="w-4 h-4 text-muted-foreground" />
        </button>
      </header>

      <div className="p-4 space-y-4">
        {/* Region selector */}
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger
            data-ocid="weather.region.select"
            className="w-full h-11 rounded-xl border-border text-foreground"
            style={{ background: "oklch(0.18 0.05 145)" }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Big weather card */}
        {isLoading ? (
          <div
            data-ocid="weather.loading_state"
            className="h-44 animate-pulse rounded-2xl"
            style={{ background: "oklch(0.18 0.05 145)" }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            data-ocid="weather.forecast.card"
            className="rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.25 0.14 230) 0%, oklch(0.18 0.12 250) 100%)",
            }}
          >
            <div className="p-5 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm opacity-80 font-semibold">{region}</p>
                  {forecast && (
                    <p className="text-xs opacity-60">
                      {formatDate(forecast.forecastDate)}
                    </p>
                  )}
                  <p className="text-6xl font-display font-bold mt-1">
                    {temp}°C
                  </p>
                  <p className="text-lg opacity-90 font-semibold mt-1">
                    {condEmoji} {condition}
                  </p>
                </div>
                <div className="text-6xl mt-2">{condEmoji}</div>
              </div>
              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-white/15 rounded-xl p-2 text-center">
                  <p className="text-xs opacity-70">Humidity</p>
                  <p className="font-bold text-sm">
                    {forecast ? String(forecast.humidity) : "72"}%
                  </p>
                </div>
                <div className="bg-white/15 rounded-xl p-2 text-center">
                  <p className="text-xs opacity-70">Rain</p>
                  <p className="font-bold text-sm">
                    {forecast ? String(forecast.rainfall) : "45"}mm
                  </p>
                </div>
                <div className="bg-white/15 rounded-xl p-2 text-center">
                  <p className="text-xs opacity-70">Wind</p>
                  <p className="font-bold text-sm">12 km/h</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4-day forecast */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wide mb-3"
            style={{ color: "oklch(0.52 0.18 145)" }}
          >
            4-Day Forecast
          </p>
          <div className="grid grid-cols-4 gap-2">
            {FORECAST_DAYS.map((d) => (
              <div
                key={d.day}
                className="flex flex-col items-center gap-1.5 rounded-xl p-2"
                style={{ background: "oklch(0.22 0.04 145)" }}
              >
                <p
                  className="text-xs font-bold"
                  style={{ color: "oklch(0.58 0.06 145)" }}
                >
                  {d.day}
                </p>
                <span className="text-xl">{d.emoji}</span>
                <p className="text-xs font-bold text-foreground">{d.high}°</p>
                <p
                  className="text-[10px]"
                  style={{ color: "oklch(0.45 0.05 145)" }}
                >
                  {d.low}°
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Advice banner — gold-tinted */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "oklch(0.78 0.14 80 / 0.1)",
            border: "1px solid oklch(0.78 0.14 80 / 0.2)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wide mb-1"
            style={{ color: "oklch(0.78 0.14 80)" }}
          >
            💡 Advice
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: "oklch(0.88 0.10 80)" }}
          >
            {forecast?.farmingTip ||
              "Best day to fertilize: Thursday. Avoid irrigation before rain on Wednesday."}
          </p>
        </div>

        {/* Simple sparkline */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wide mb-3"
            style={{ color: "oklch(0.52 0.18 145)" }}
          >
            Temperature Trend
          </p>
          <svg
            viewBox="0 0 240 60"
            className="w-full h-14"
            fill="none"
            aria-label="Temperature trend chart"
          >
            <title>Temperature Trend</title>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="oklch(0.52 0.18 145)"
                  stopOpacity="0.4"
                />
                <stop
                  offset="100%"
                  stopColor="oklch(0.52 0.18 145)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d="M 0 40 C 30 35, 60 20, 80 25 S 140 45, 160 30 S 200 10, 240 20"
              stroke="oklch(0.52 0.18 145)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 0 40 C 30 35, 60 20, 80 25 S 140 45, 160 30 S 200 10, 240 20 L 240 60 L 0 60 Z"
              fill="url(#tempGrad)"
            />
            {CHART_POINTS.map((p) => (
              <circle
                key={p.label}
                cx={p.x}
                cy={p.y}
                r="3"
                fill="oklch(0.52 0.18 145)"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
