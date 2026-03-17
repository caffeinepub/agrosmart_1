import DiseaseTab from "@/components/DiseaseTab";
import FertilizerTab from "@/components/FertilizerTab";
import HomeTab from "@/components/HomeTab";
import KnowledgeTab from "@/components/KnowledgeTab";
import MarketTab from "@/components/MarketTab";
import ProfileTab from "@/components/ProfileTab";
import WeatherTab from "@/components/WeatherTab";
import { Toaster } from "@/components/ui/sonner";
import type { Language } from "@/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BarChart3,
  BookOpen,
  Camera,
  CloudSun,
  Home,
  Sprout,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

type Tab =
  | "home"
  | "disease"
  | "weather"
  | "market"
  | "fertilizer"
  | "tips"
  | "profile";

const TABS: {
  id: Tab;
  icon: React.ReactNode;
  label: string;
  ocid: string;
}[] = [
  {
    id: "home",
    icon: <Home className="w-5 h-5" />,
    label: "Home",
    ocid: "nav.home.tab",
  },
  {
    id: "disease",
    icon: <Camera className="w-5 h-5" />,
    label: "Scan",
    ocid: "nav.disease.tab",
  },
  {
    id: "weather",
    icon: <CloudSun className="w-5 h-5" />,
    label: "Weather",
    ocid: "nav.weather.tab",
  },
  {
    id: "market",
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Market",
    ocid: "nav.market.tab",
  },
  {
    id: "fertilizer",
    icon: <Sprout className="w-5 h-5" />,
    label: "Fertilizer",
    ocid: "nav.fertilizer.tab",
  },
  {
    id: "tips",
    icon: <BookOpen className="w-5 h-5" />,
    label: "Tips",
    ocid: "nav.tips.tab",
  },
  {
    id: "profile",
    icon: <User className="w-5 h-5" />,
    label: "Profile",
    ocid: "nav.profile.tab",
  },
];

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 40% 40%, oklch(0.28 0.12 145) 0%, oklch(0.10 0.04 145) 100%)",
      }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-5xl border border-white/15 shadow-xl premium-glow">
          🌱
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">
            AgroSmart
          </h1>
          <p
            className="mt-1 font-body text-base"
            style={{ color: "oklch(0.78 0.14 80)" }}
          >
            AI Farmer Assistant
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-1.5 mt-4"
        >
          <span className="text-white/50 text-sm font-body">Loading</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "oklch(0.78 0.14 80)",
                animation: `dots-blink 1.4s ${i * 0.2}s infinite ease-in-out`,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [lang, setLang] = useState<Language>("en");
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      </AnimatePresence>

      {!showSplash && (
        <div className="min-h-screen flex flex-col bg-background">
          {/* Main content */}
          <main className="flex-1 overflow-y-auto pb-20">
            <div className="max-w-[390px] mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  {activeTab === "home" && (
                    <HomeTab
                      lang={lang}
                      setLang={setLang}
                      setActiveTab={setActiveTab}
                    />
                  )}
                  {activeTab === "disease" && <DiseaseTab lang={lang} />}
                  {activeTab === "weather" && <WeatherTab lang={lang} />}
                  {activeTab === "market" && <MarketTab lang={lang} />}
                  {activeTab === "fertilizer" && <FertilizerTab lang={lang} />}
                  {activeTab === "tips" && <KnowledgeTab lang={lang} />}
                  {activeTab === "profile" && (
                    <ProfileTab lang={lang} setLang={setLang} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* Bottom Nav — dark glass */}
          <nav
            className="fixed bottom-0 left-0 right-0 z-20 border-t"
            style={{
              background: "oklch(0.14 0.04 145 / 0.95)",
              borderColor: "oklch(0.25 0.06 145)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="max-w-[390px] mx-auto flex">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    data-ocid={tab.ocid}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors"
                    style={{
                      color: isActive
                        ? "oklch(0.78 0.14 80)"
                        : "oklch(0.45 0.06 145)",
                    }}
                  >
                    <div
                      className="p-1.5 rounded-xl transition-colors"
                      style={{
                        background: isActive
                          ? "oklch(0.78 0.14 80 / 0.12)"
                          : "transparent",
                      }}
                    >
                      {tab.icon}
                    </div>
                    <span className="text-[9px] font-semibold leading-none">
                      {tab.label}
                    </span>
                    {isActive && (
                      <span
                        className="w-1 h-1 rounded-full mt-0.5"
                        style={{ background: "oklch(0.78 0.14 80)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      )}

      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
