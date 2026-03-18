import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Language } from "@/i18n";
import {
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Settings,
  Sprout,
  Wifi,
  X,
} from "lucide-react";
import { useState } from "react";

interface ProfileTabProps {
  lang: Language;
  setLang: (l: Language) => void;
  farmerName: string;
  farmerLocation: string;
  onUpdateProfile: (name: string, location: string) => void;
}

const rowStyle = {
  background: "oklch(0.52 0.18 145 / 0.12)",
};

const SUGGESTED_CROPS = [
  "Paddy",
  "Tomatoes",
  "Coconut",
  "Tea",
  "Rubber",
  "Maize",
  "Chilli",
  "Onion",
  "Potato",
  "Banana",
  "Pineapple",
  "Mango",
  "Cassava",
  "Sweet Potato",
  "Brinjal",
  "Beans",
  "Cabbage",
  "Carrot",
];

export default function ProfileTab({
  lang,
  setLang,
  farmerName,
  farmerLocation,
  onUpdateProfile,
}: ProfileTabProps) {
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [cropsOpen, setCropsOpen] = useState(false);
  const [editName, setEditName] = useState(farmerName);
  const [editLocation, setEditLocation] = useState(farmerLocation);

  // Crops state — persisted to localStorage
  const [crops, setCrops] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("farmer_crops");
      return saved ? JSON.parse(saved) : ["Paddy", "Tomatoes"];
    } catch {
      return ["Paddy", "Tomatoes"];
    }
  });
  const [newCrop, setNewCrop] = useState("");

  function saveCrops(updated: string[]) {
    setCrops(updated);
    localStorage.setItem("farmer_crops", JSON.stringify(updated));
  }

  function addCrop(name: string) {
    const trimmed = name.trim();
    if (!trimmed || crops.includes(trimmed)) return;
    saveCrops([...crops, trimmed]);
    setNewCrop("");
  }

  function removeCrop(name: string) {
    saveCrops(crops.filter((c) => c !== name));
  }

  const langLabel = lang === "en" ? "English" : lang === "si" ? "සිංහල" : "தமிழ்";

  function openEdit() {
    setEditName(farmerName);
    setEditLocation(farmerLocation);
    setEditOpen(true);
  }

  function handleSaveProfile() {
    if (!editName.trim() || !editLocation.trim()) return;
    onUpdateProfile(editName.trim(), editLocation.trim());
    setEditOpen(false);
  }

  const divider = (
    <div className="h-px mx-4" style={{ background: "oklch(0.25 0.06 145)" }} />
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
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
        <button
          type="button"
          data-ocid="profile.farmer.button"
          onClick={openEdit}
          className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-opacity hover:opacity-90"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl border-2 flex-shrink-0"
            style={{
              background: "oklch(0.52 0.18 145 / 0.1)",
              borderColor: "oklch(0.52 0.18 145 / 0.3)",
            }}
          >
            👨‍🌾
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-foreground truncate">
              Farmer {farmerName}
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: "oklch(0.78 0.14 80)" }}
            >
              ✦ Premium Member
            </p>
          </div>
          <Pencil
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "oklch(0.78 0.14 80)" }}
          />
        </button>

        {/* Rows */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          {/* Location */}
          <button
            type="button"
            data-ocid="profile.location.button"
            onClick={openEdit}
            className="w-full px-4 py-3.5 flex items-center gap-3 transition-colors hover:bg-white/5"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={rowStyle}
            >
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span className="flex-1 text-left text-sm font-medium text-foreground">
              Location: {farmerLocation}
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          {divider}

          {/* My Crops */}
          <button
            type="button"
            data-ocid="profile.crops.button"
            onClick={() => setCropsOpen(true)}
            className="w-full px-4 py-3.5 flex items-center gap-3 transition-colors hover:bg-white/5"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={rowStyle}
            >
              <Sprout className="w-4 h-4 text-primary" />
            </div>
            <span className="flex-1 text-left text-sm font-medium text-foreground">
              My Crops:{" "}
              {crops.length === 0
                ? "None added"
                : crops.slice(0, 3).join(", ") +
                  (crops.length > 3 ? ` +${crops.length - 3}` : "")}
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          {divider}

          {/* Language */}
          <div
            data-ocid="profile.language.button"
            className="px-4 py-3.5 flex items-center gap-3"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={rowStyle}
            >
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">
              Language: {langLabel}
            </span>
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
                      lang === l ? "oklch(0.98 0 0)" : "oklch(0.65 0.05 145)",
                  }}
                >
                  {l === "en" ? "EN" : l === "si" ? "සිං" : "தமி"}
                </button>
              ))}
            </div>
          </div>

          {divider}

          {/* Notifications */}
          <div
            data-ocid="profile.notifications.switch"
            className="px-4 py-3.5 flex items-center gap-3"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={rowStyle}
            >
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">
              Notifications
            </span>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          {divider}

          {/* Offline Mode */}
          <div
            data-ocid="profile.offline.switch"
            className="px-4 py-3.5 flex items-center gap-3"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={rowStyle}
            >
              <Wifi className="w-4 h-4 text-primary" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">
              Offline Mode
            </span>
            <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
          </div>

          {divider}

          {/* Help & Support */}
          <button
            type="button"
            data-ocid="profile.help.button"
            onClick={() => setHelpOpen(true)}
            className="w-full px-4 py-3.5 flex items-center gap-3 transition-colors hover:bg-white/5"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={rowStyle}
            >
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            <span className="flex-1 text-left text-sm font-medium text-foreground">
              Help &amp; Support
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
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

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          data-ocid="profile.edit.dialog"
          className="max-w-[340px] rounded-2xl border-0 p-5"
          style={{
            background: "oklch(0.16 0.05 145)",
            border: "1px solid oklch(0.28 0.08 145)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-white/80">
                Name
              </Label>
              <Input
                data-ocid="profile.edit.name.input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-10 text-white placeholder:text-white/30"
                style={{
                  background: "oklch(0.15 0.04 145)",
                  borderColor: "oklch(0.28 0.08 145)",
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-white/80">
                Location
              </Label>
              <Input
                data-ocid="profile.edit.location.input"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="h-10 text-white placeholder:text-white/30"
                style={{
                  background: "oklch(0.15 0.04 145)",
                  borderColor: "oklch(0.28 0.08 145)",
                }}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                data-ocid="profile.edit.cancel_button"
                type="button"
                variant="ghost"
                onClick={() => setEditOpen(false)}
                className="flex-1 h-10 text-white/60 hover:text-white"
                style={{ background: "oklch(0.22 0.06 145)" }}
              >
                Cancel
              </Button>
              <Button
                data-ocid="profile.edit.save_button"
                type="button"
                onClick={handleSaveProfile}
                className="flex-1 h-10 font-bold border-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.52 0.18 145) 0%, oklch(0.60 0.15 80) 100%)",
                  color: "white",
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* My Crops Dialog */}
      <Dialog open={cropsOpen} onOpenChange={setCropsOpen}>
        <DialogContent
          data-ocid="profile.crops.dialog"
          className="max-w-[360px] rounded-2xl border-0 p-5"
          style={{
            background: "oklch(0.16 0.05 145)",
            border: "1px solid oklch(0.28 0.08 145)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              My Crops
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3 space-y-4">
            {/* Current crops */}
            {crops.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {crops.map((crop) => (
                  <span
                    key={crop}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      background: "oklch(0.52 0.18 145 / 0.18)",
                      border: "1px solid oklch(0.52 0.18 145 / 0.35)",
                      color: "oklch(0.88 0.08 145)",
                    }}
                  >
                    {crop}
                    <button
                      type="button"
                      onClick={() => removeCrop(crop)}
                      className="hover:opacity-70 transition-opacity"
                      aria-label={`Remove ${crop}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40 text-center py-2">
                No crops added yet.
              </p>
            )}

            {/* Add custom crop */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-wide">
                Add a crop
              </Label>
              <div className="flex gap-2">
                <Input
                  data-ocid="profile.crops.input"
                  placeholder="Crop name..."
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addCrop(newCrop);
                  }}
                  className="flex-1 h-9 text-white placeholder:text-white/30 text-sm"
                  style={{
                    background: "oklch(0.15 0.04 145)",
                    borderColor: "oklch(0.28 0.08 145)",
                  }}
                />
                <Button
                  data-ocid="profile.crops.add_button"
                  type="button"
                  onClick={() => addCrop(newCrop)}
                  className="h-9 px-3 font-bold border-0"
                  style={{
                    background: "oklch(0.52 0.18 145)",
                    color: "white",
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-wide">
                Suggestions
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_CROPS.filter((c) => !crops.includes(c))
                  .slice(0, 12)
                  .map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => addCrop(c)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-70"
                      style={{
                        background: "oklch(0.22 0.06 145)",
                        color: "oklch(0.70 0.08 145)",
                        border: "1px solid oklch(0.28 0.08 145)",
                      }}
                    >
                      + {c}
                    </button>
                  ))}
              </div>
            </div>

            <Button
              data-ocid="profile.crops.done_button"
              type="button"
              onClick={() => setCropsOpen(false)}
              className="w-full h-10 font-bold border-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.52 0.18 145) 0%, oklch(0.60 0.15 80) 100%)",
                color: "white",
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help & Support Dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent
          data-ocid="profile.help.dialog"
          className="max-w-[340px] rounded-2xl border-0 p-5"
          style={{
            background: "oklch(0.16 0.05 145)",
            border: "1px solid oklch(0.28 0.08 145)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display flex items-center gap-2">
              <HelpCircle
                className="w-5 h-5"
                style={{ color: "oklch(0.78 0.14 80)" }}
              />
              Help &amp; Support
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 space-y-4">
            <p className="text-sm text-white/70">For support, contact us at:</p>
            <a
              href="mailto:sesathranbandara@gmail.com"
              className="flex items-center gap-2 text-sm font-semibold"
              style={{ color: "oklch(0.78 0.14 80)" }}
            >
              <Mail className="w-4 h-4" />
              sesathranbandara@gmail.com
            </a>
            <Button
              data-ocid="profile.help.email.button"
              type="button"
              asChild
              className="w-full h-11 font-bold border-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.52 0.18 145) 0%, oklch(0.60 0.15 80) 100%)",
                color: "white",
              }}
            >
              <a href="mailto:sesathranbandara@gmail.com">
                <Mail className="w-4 h-4 mr-2" />
                Tap to Email
              </a>
            </Button>
            <Button
              data-ocid="profile.help.close_button"
              type="button"
              variant="ghost"
              onClick={() => setHelpOpen(false)}
              className="w-full h-10 text-white/50 hover:text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
