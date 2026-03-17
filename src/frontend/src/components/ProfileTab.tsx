import { Switch } from "@/components/ui/switch";
import type { Language } from "@/i18n";
import {
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  MapPin,
  Settings,
  Sprout,
  Wifi,
} from "lucide-react";
import { useState } from "react";

interface ProfileTabProps {
  lang: Language;
  setLang: (l: Language) => void;
}

export default function ProfileTab({ lang, setLang }: ProfileTabProps) {
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const langLabel = lang === "en" ? "English" : lang === "si" ? "සිංහල" : "தமிழ்";

  const rows = [
    {
      icon: <MapPin className="w-4 h-4 text-primary" />,
      label: "Location: Kandy",
      type: "chevron" as const,
      ocid: "profile.location.button",
    },
    {
      icon: <Sprout className="w-4 h-4 text-primary" />,
      label: "My Crops: Paddy, Tomatoes",
      type: "chevron" as const,
      ocid: "profile.crops.button",
    },
    {
      icon: <Globe className="w-4 h-4 text-primary" />,
      label: `Language: ${langLabel}`,
      type: "lang" as const,
      ocid: "profile.language.button",
    },
    {
      icon: <Bell className="w-4 h-4 text-primary" />,
      label: "Notifications",
      type: "toggle-notif" as const,
      ocid: "profile.notifications.switch",
    },
    {
      icon: <Wifi className="w-4 h-4 text-primary" />,
      label: "Offline Mode",
      type: "toggle-offline" as const,
      ocid: "profile.offline.switch",
    },
    {
      icon: <HelpCircle className="w-4 h-4 text-primary" />,
      label: "Help & Support",
      type: "chevron" as const,
      ocid: "profile.help.button",
    },
  ];

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
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-base font-display font-bold text-foreground">
          Profile &amp; Settings
        </h1>
      </header>

      <div className="p-4 space-y-3">
        {/* Avatar row */}
        <div
          data-ocid="profile.farmer.button"
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl border-2"
            style={{
              background: "oklch(0.52 0.18 145 / 0.1)",
              borderColor: "oklch(0.52 0.18 145 / 0.3)",
            }}
          >
            👨‍🌾
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-foreground">
              Farmer Saman Perera
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: "oklch(0.78 0.14 80)" }}
            >
              ✦ Premium Member
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Rows */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          {rows.map((row, i) => (
            <div key={row.ocid}>
              {i > 0 && (
                <div
                  className="h-px mx-4"
                  style={{ background: "oklch(0.25 0.06 145)" }}
                />
              )}
              <div
                data-ocid={row.ocid}
                className="px-4 py-3.5 flex items-center gap-3 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.52 0.18 145 / 0.12)" }}
                >
                  {row.icon}
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">
                  {row.label}
                </span>
                {row.type === "chevron" && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                {row.type === "lang" && (
                  <div className="flex gap-1">
                    {(["en", "si", "ta"] as Language[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLang(l)}
                        className="px-2 py-0.5 text-[10px] font-bold rounded-full transition-all"
                        style={{
                          background:
                            lang === l
                              ? "oklch(0.52 0.18 145)"
                              : "oklch(0.22 0.06 145)",
                          color:
                            lang === l
                              ? "oklch(0.98 0 0)"
                              : "oklch(0.65 0.05 145)",
                        }}
                      >
                        {l === "en" ? "EN" : l === "si" ? "සිං" : "தமி"}
                      </button>
                    ))}
                  </div>
                )}
                {row.type === "toggle-notif" && (
                  <Switch
                    data-ocid="profile.notifications.switch"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                )}
                {row.type === "toggle-offline" && (
                  <Switch
                    data-ocid="profile.offline.switch"
                    checked={offlineMode}
                    onCheckedChange={setOfflineMode}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Version info */}
        <p className="text-center text-xs text-muted-foreground pt-2">
          AgroSmart v2.0 • AI Farmer Assistant
        </p>
      </div>

      {/* Footer */}
      <footer
        className="mt-auto py-3 text-center"
        style={{ borderTop: "1px solid oklch(0.20 0.04 145)" }}
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
