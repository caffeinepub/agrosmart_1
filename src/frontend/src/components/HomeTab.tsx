import type { Language } from "@/i18n";
import { Bell, Home } from "lucide-react";
import { motion } from "motion/react";

type Tab =
  | "home"
  | "disease"
  | "weather"
  | "market"
  | "fertilizer"
  | "tips"
  | "profile";

interface HomeTabProps {
  lang: Language;
  setLang: (l: Language) => void;
  setActiveTab: (tab: Tab) => void;
}

const LANG_LABELS: Record<Language, string> = {
  en: "EN",
  si: "සිං",
  ta: "தமி",
};

export default function HomeTab({ lang, setLang, setActiveTab }: HomeTabProps) {
  const actions: {
    label: string;
    emoji: string;
    tab: Tab;
    variant: "emerald" | "gold";
  }[] = [
    { label: "Scan Crop", emoji: "📷", tab: "disease", variant: "emerald" },
    { label: "Weather", emoji: "☁️", tab: "weather", variant: "emerald" },
    { label: "Market Prices", emoji: "🛒", tab: "market", variant: "gold" },
    { label: "Farming Tips", emoji: "💬", tab: "tips", variant: "gold" },
  ];

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
            <Home className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-base font-display font-bold text-foreground">
            Home Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 rounded-full"
            style={{ background: "oklch(0.22 0.04 145)" }}
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex gap-1">
            {(["en", "si", "ta"] as Language[]).map((l) => (
              <button
                key={l}
                type="button"
                data-ocid={`lang.${l}.button`}
                onClick={() => setLang(l)}
                className="px-2 py-0.5 text-[10px] font-bold rounded-full transition-all"
                style={{
                  background:
                    lang === l ? "oklch(0.78 0.14 80)" : "oklch(0.22 0.06 145)",
                  color:
                    lang === l ? "oklch(0.12 0.04 80)" : "oklch(0.65 0.05 145)",
                }}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4 flex-1">
        {/* Weather summary — gold-tinted */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: "oklch(0.78 0.14 80 / 0.08)",
            border: "1px solid oklch(0.78 0.14 80 / 0.2)",
          }}
        >
          <span className="text-3xl">☀️</span>
          <div>
            <p
              className="font-display font-bold text-base"
              style={{ color: "oklch(0.88 0.12 80)" }}
            >
              Today&apos;s Weather: 32°C
            </p>
            <p className="text-sm" style={{ color: "oklch(0.68 0.08 80)" }}>
              Sunny • Colombo Region
            </p>
          </div>
        </motion.div>

        {/* Crop Health card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          <div
            className="h-28 relative"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.35 0.14 145) 0%, oklch(0.22 0.10 145) 100%)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
              🌿
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
              <p className="text-white font-display font-bold text-sm">
                Crop Health
              </p>
              <p className="text-white/70 text-xs">
                Scan your plants for early detection
              </p>
            </div>
          </div>
          <div className="p-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">
              📸 Scan Your Plants
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("disease")}
              className="text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.52 0.18 145), oklch(0.40 0.15 145))",
                color: "oklch(0.98 0 0)",
              }}
            >
              Start Scan
            </button>
          </div>
        </motion.div>

        {/* Market Price card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          <div
            className="h-20 relative flex items-center px-4 gap-3"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.42 0.10 65) 0%, oklch(0.30 0.09 60) 100%)",
            }}
          >
            <span className="text-3xl">🌾</span>
            <div>
              <p className="text-white font-display font-bold">Market Price</p>
              <p
                className="text-sm font-bold"
                style={{ color: "oklch(0.92 0.14 80)" }}
              >
                Rice — LKR 185/kg
              </p>
            </div>
          </div>
        </motion.div>

        {/* 2×2 Action Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {actions.map((action) => (
            <button
              key={action.tab}
              type="button"
              data-ocid={`home.${
                action.tab === "disease"
                  ? "scan_crop"
                  : action.tab === "tips"
                    ? "tips"
                    : action.tab
              }.button`}
              onClick={() => setActiveTab(action.tab)}
              className="py-4 px-3 rounded-2xl font-display font-bold text-sm text-white flex flex-col items-center gap-2 transition-transform active:scale-95"
              style={{
                background:
                  action.variant === "emerald"
                    ? "linear-gradient(135deg, oklch(0.52 0.18 145), oklch(0.40 0.15 145))"
                    : "linear-gradient(135deg, oklch(0.78 0.14 80), oklch(0.68 0.13 75))",
                color:
                  action.variant === "gold"
                    ? "oklch(0.12 0.04 80)"
                    : "oklch(0.98 0 0)",
                boxShadow:
                  action.variant === "emerald"
                    ? "0 4px 16px oklch(0.52 0.18 145 / 0.25)"
                    : "0 4px 16px oklch(0.78 0.14 80 / 0.25)",
              }}
            >
              <span className="text-2xl">{action.emoji}</span>
              {action.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer
        className="py-3 text-center mt-4"
        style={{ borderTop: "1px solid oklch(0.25 0.06 145)" }}
      >
        <p className="text-[10px]" style={{ color: "oklch(0.40 0.04 145)" }}>
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="underline"
            style={{ color: "oklch(0.50 0.05 145)" }}
            target="_blank"
            rel="noreferrer"
          >
            Built with caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
