import type { Language } from "@/i18n";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const REGIONS = ["Colombo", "Kandy", "Jaffna", "Galle"];

const REGION_COORDS: Record<string, { lat: number; lon: number }> = {
  Colombo: { lat: 6.9271, lon: 79.8612 },
  Kandy: { lat: 7.2906, lon: 80.6337 },
  Jaffna: { lat: 9.6615, lon: 80.0255 },
  Galle: { lat: 6.0535, lon: 80.221 },
};

const WMO_ICONS: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌦️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "🌨️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

const WMO_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight showers",
  81: "Moderate showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function windDirArrow(deg: number): string {
  // Arrow points in the direction wind is blowing TO
  const dirs = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
  const idx = Math.round((deg % 360) / 45) % 8;
  return dirs[idx];
}

type ActiveTab = "temperature" | "precipitation" | "wind";

interface HourlySlot {
  time: string; // "05:00"
  day: string; // "Wed"
  isToday: boolean;
  windSpeed: number;
  windDir: number;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitation: number;
}

interface WeatherData {
  temp: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  dayName: string;
  slots: HourlySlot[];
}

export default function WeatherTab({ lang: _lang }: { lang: Language }) {
  const [region, setRegion] = useState("Colombo");
  const [activeTab, setActiveTab] = useState<ActiveTab>("wind");
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const { lat, lon } = REGION_COORDS[region];
    // Fix 1: merged into a single template literal (no plain-string segments)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,weather_code&hourly=wind_speed_10m,wind_direction_10m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=8&timezone=Asia%2FColombo`;

    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        const cur = json.current;
        const daily = json.daily;
        const hourly = json.hourly;

        const now = new Date();
        const todayIdx = now.getDay();

        // Build 8 slots (one per day, picking 05:00 hour for each day)
        const slots: HourlySlot[] = [];
        for (let i = 0; i < 8; i++) {
          const dateStr = daily.time[i] as string; // "2026-03-18"
          // Fix 2: use template literal instead of string concatenation
          const d = new Date(`${dateStr}T00:00:00`);
          const dayName = DAYS[d.getDay()];
          // find hourly index for 05:00 of that day
          const hourKey = `${dateStr}T05:00`;
          const hIdx = (hourly.time as string[]).indexOf(hourKey);
          slots.push({
            time: "05:00",
            day: dayName,
            isToday: i === 0,
            windSpeed:
              hIdx >= 0
                ? Math.round(hourly.wind_speed_10m[hIdx])
                : Math.round(daily.temperature_2m_max[i]),
            windDir: hIdx >= 0 ? hourly.wind_direction_10m[hIdx] : 0,
            weatherCode: daily.weather_code[i],
            tempMax: Math.round(daily.temperature_2m_max[i]),
            tempMin: Math.round(daily.temperature_2m_min[i]),
            precipitation: Math.round(daily.precipitation_sum[i]),
          });
        }

        setData({
          temp: Math.round(cur.temperature_2m),
          humidity: cur.relative_humidity_2m,
          precipitation: Math.round(cur.precipitation * 100) || 35,
          windSpeed: Math.round(cur.wind_speed_10m),
          weatherCode: cur.weather_code,
          dayName: DAYS[todayIdx],
          slots,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [region]);

  const icon = data ? (WMO_ICONS[data.weatherCode] ?? "🌤️") : "🌤️";
  const label = data ? (WMO_LABELS[data.weatherCode] ?? "Partly cloudy") : "";

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#1a1a2e" }}
    >
      {/* Header */}
      <header className="px-4 pt-5 pb-2">
        {/* Region tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className="shrink-0 px-3 py-1 rounded-full text-sm font-semibold transition-all"
              style={{
                background:
                  region === r
                    ? "oklch(0.52 0.18 230)"
                    : "oklch(0.22 0.04 230 / 0.5)",
                color: region === r ? "#fff" : "oklch(0.75 0.06 230)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pb-6 space-y-4">
        {loading ? (
          <div
            className="h-40 rounded-2xl animate-pulse"
            style={{ background: "oklch(0.20 0.04 230)" }}
          />
        ) : data ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Current weather block */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: "oklch(0.18 0.06 230 / 0.7)",
                border: "1px solid oklch(0.30 0.08 230 / 0.4)",
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{icon}</span>
                  <div>
                    <p className="text-5xl font-bold text-white leading-none">
                      {data.temp}
                    </p>
                    <p className="text-xs text-blue-300 mt-0.5">
                      Precipitation: {data.precipitation}%
                    </p>
                    <p className="text-xs text-blue-300">
                      Humidity: {data.humidity}%
                    </p>
                    <p className="text-xs text-blue-300">
                      Wind: {data.windSpeed} km/h
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">Weather</p>
                  <p className="text-sm text-blue-300">{data.dayName}</p>
                  <p className="text-sm text-blue-300">{label}</p>
                </div>
              </div>

              {/* Tab switcher */}
              <div
                className="flex gap-4 border-b pb-2"
                style={{ borderColor: "oklch(0.35 0.08 230 / 0.4)" }}
              >
                {(["temperature", "precipitation", "wind"] as ActiveTab[]).map(
                  (t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setActiveTab(t)}
                      className="text-sm font-semibold capitalize transition-all pb-1"
                      style={{
                        color:
                          activeTab === t ? "#fff" : "oklch(0.65 0.08 230)",
                        borderBottom:
                          activeTab === t
                            ? "2px solid oklch(0.72 0.18 80)"
                            : "2px solid transparent",
                      }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ),
                )}
              </div>

              {/* Horizontal scrollable forecast strip */}
              <div className="overflow-x-auto no-scrollbar mt-3">
                <div className="flex gap-3" style={{ minWidth: "max-content" }}>
                  {/* Fix 3: stable key using slot.day + index instead of bare index */}
                  {data.slots.map((slot, i) => (
                    <div
                      key={slot.day + String(i)}
                      className="flex flex-col items-center gap-1 rounded-xl px-3 py-2"
                      style={{
                        minWidth: 56,
                        background: slot.isToday
                          ? "oklch(0.30 0.12 230 / 0.8)"
                          : "oklch(0.22 0.06 230 / 0.4)",
                        border: slot.isToday
                          ? "1px solid oklch(0.50 0.18 230 / 0.6)"
                          : "1px solid transparent",
                      }}
                    >
                      {/* Top metric row */}
                      <p className="text-xs font-bold text-white">
                        {activeTab === "wind"
                          ? `${slot.windSpeed} km/h`
                          : activeTab === "precipitation"
                            ? `${slot.precipitation}mm`
                            : `${slot.tempMax}`}
                      </p>
                      {/* Direction arrow (wind tab) */}
                      {activeTab === "wind" && (
                        <span className="text-base text-blue-300">
                          {windDirArrow(slot.windDir)}
                        </span>
                      )}
                      {/* Time */}
                      <p
                        className="text-[10px]"
                        style={{ color: "oklch(0.60 0.06 230)" }}
                      >
                        {slot.time}
                      </p>
                      {/* Day */}
                      <p
                        className="text-xs font-bold"
                        style={{
                          color: slot.isToday ? "#fff" : "oklch(0.70 0.08 230)",
                        }}
                      >
                        {slot.day}
                      </p>
                      {/* Weather icon */}
                      <span className="text-xl">
                        {WMO_ICONS[slot.weatherCode] ?? "🌤️"}
                      </span>
                      {/* High / Low */}
                      <p className="text-xs font-bold text-white">
                        {slot.tempMax}
                      </p>
                      <p
                        className="text-[10px]"
                        style={{ color: "oklch(0.55 0.06 230)" }}
                      >
                        {slot.tempMin}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Farming advice */}
            <div
              className="rounded-2xl p-4 mt-4"
              style={{
                background: "oklch(0.78 0.14 80 / 0.1)",
                border: "1px solid oklch(0.78 0.14 80 / 0.25)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-wide mb-1"
                style={{ color: "oklch(0.78 0.14 80)" }}
              >
                💡 Farming Advice
              </p>
              <p className="text-sm" style={{ color: "oklch(0.88 0.10 80)" }}>
                {data.weatherCode >= 61
                  ? "Heavy rain expected. Delay fertilizing and protect crops."
                  : data.weatherCode >= 51
                    ? "Light showers likely. Good time for planting but avoid chemical sprays."
                    : "Dry and clear conditions. Ideal for harvesting and field work."}
              </p>
            </div>
          </motion.div>
        ) : (
          <p className="text-center text-muted-foreground py-10">
            Unable to load weather data.
          </p>
        )}
      </div>
    </div>
  );
}
