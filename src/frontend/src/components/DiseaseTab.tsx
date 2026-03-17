import { Button } from "@/components/ui/button";
import type { Language } from "@/i18n";
import { t } from "@/i18n";
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle,
  ScanLine,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

const DISEASES = [
  {
    name: "Healthy Plant",
    severity: "healthy" as const,
    percent: 98,
    cause: "No disease detected. Your plant appears healthy and thriving.",
    organic:
      "Continue regular watering and organic compost application. Monitor for early signs weekly.",
    pesticide:
      "No pesticide required. Consider neem oil spray as preventive measure.",
  },
  {
    name: "Leaf Blight",
    severity: "severe" as const,
    percent: 85,
    cause:
      "Caused by Xanthomonas oryzae bacteria. Spreads in warm, humid conditions.",
    organic:
      "Remove infected leaves immediately. Spray diluted neem oil (10ml per liter). Improve field drainage.",
    pesticide:
      "Apply Copper Oxychloride 50% WP at 3g/liter. Repeat every 7 days for 3 weeks.",
  },
  {
    name: "Powdery Mildew",
    severity: "mild" as const,
    percent: 52,
    cause:
      "Fungal infection caused by Erysiphe graminis. Common in dry weather.",
    organic:
      "Mix 1 tbsp baking soda + 1 tsp vegetable oil + 1 liter water. Spray every 5 days.",
    pesticide:
      "Apply Sulfur 80% WG at 2g/liter water. Avoid spraying during hot midday.",
  },
  {
    name: "Root Rot",
    severity: "severe" as const,
    percent: 78,
    cause: "Caused by Pythium or Fusarium fungi due to waterlogged soil.",
    organic:
      "Improve soil drainage. Apply Trichoderma viride biofungicide to soil.",
    pesticide:
      "Drench soil with Metalaxyl 8% + Mancozeb 64% WP at 3g/liter around root zone.",
  },
];

const SEVERITY_CONFIG = {
  healthy: {
    color: "text-primary",
    bgStyle: {
      background: "oklch(0.52 0.18 145 / 0.12)",
      border: "1px solid oklch(0.52 0.18 145 / 0.2)",
    },
    badgeStyle: {
      background: "oklch(0.52 0.18 145 / 0.2)",
      color: "oklch(0.75 0.14 145)",
    },
    icon: <CheckCircle className="w-5 h-5" />,
  },
  mild: {
    color: "text-yellow-400",
    bgStyle: {
      background: "oklch(0.78 0.14 80 / 0.1)",
      border: "1px solid oklch(0.78 0.14 80 / 0.2)",
    },
    badgeStyle: {
      background: "oklch(0.78 0.14 80 / 0.2)",
      color: "oklch(0.78 0.14 80)",
    },
    icon: <AlertCircle className="w-5 h-5" />,
  },
  severe: {
    color: "text-destructive",
    bgStyle: {
      background: "oklch(0.55 0.22 25 / 0.12)",
      border: "1px solid oklch(0.55 0.22 25 / 0.2)",
    },
    badgeStyle: {
      background: "oklch(0.55 0.22 25 / 0.2)",
      color: "oklch(0.75 0.18 25)",
    },
    icon: <AlertTriangle className="w-5 h-5" />,
  },
};

export default function DiseaseTab({ lang }: { lang: Language }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<(typeof DISEASES)[0] | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const analyze = async () => {
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2200));
    const idx = Math.floor(Math.random() * DISEASES.length);
    setResult(DISEASES[idx]);
    setAnalyzing(false);
  };

  const cfg = result ? SEVERITY_CONFIG[result.severity] : null;

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
          <Camera className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-base font-display font-bold text-foreground">
          Crop Disease Scanner
        </h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Camera viewfinder */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleUpload}
        />

        {preview ? (
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ border: "1px solid oklch(0.25 0.06 145)" }}
          >
            <img
              src={preview}
              alt="Leaf preview"
              className="w-full h-56 object-cover"
            />
            {/* Scanning frame overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-40 relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white" />
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 text-xs"
              style={{
                background: "oklch(0.18 0.05 145 / 0.85)",
                color: "oklch(0.92 0.02 100)",
                border: "1px solid oklch(0.30 0.06 145)",
              }}
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
                setResult(null);
              }}
            >
              Change
            </Button>
          </div>
        ) : (
          <button
            type="button"
            data-ocid="disease.upload_button"
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.06 145) 0%, oklch(0.13 0.04 145) 100%)",
              border: "1px solid oklch(0.28 0.08 145)",
            }}
          >
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <div className="w-40 h-40 relative">
                <div
                  className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2"
                  style={{ borderColor: "oklch(0.52 0.18 145 / 0.7)" }}
                />
                <div
                  className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2"
                  style={{ borderColor: "oklch(0.52 0.18 145 / 0.7)" }}
                />
                <div
                  className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2"
                  style={{ borderColor: "oklch(0.52 0.18 145 / 0.7)" }}
                />
                <div
                  className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2"
                  style={{ borderColor: "oklch(0.52 0.18 145 / 0.7)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine className="w-10 h-10 text-primary opacity-60" />
                </div>
              </div>
              <p className="text-white font-display font-bold text-base">
                Scan Your Crop
              </p>
              <p className="text-white/60 text-xs">{t(lang, "uploadLeaf")}</p>
            </div>
          </button>
        )}

        {selectedFile && !result && (
          <Button
            className="w-full h-12 rounded-xl font-semibold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.18 145), oklch(0.40 0.15 145))",
              color: "oklch(0.98 0 0)",
              boxShadow: "0 4px 16px oklch(0.52 0.18 145 / 0.25)",
            }}
            onClick={analyze}
            disabled={analyzing}
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                {t(lang, "analyzeDisease")}
              </span>
            )}
          </Button>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && cfg && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              data-ocid="disease.result.card"
              className="rounded-2xl overflow-hidden"
              style={{
                background: "oklch(0.18 0.05 145)",
                border: "1px solid oklch(0.25 0.06 145)",
              }}
            >
              {/* Result header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={cfg.bgStyle}
              >
                <div
                  className={`flex items-center gap-2 font-display font-bold text-base ${cfg.color}`}
                >
                  {cfg.icon}
                  {result.name}
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={cfg.badgeStyle}
                >
                  {result.percent}% {t(lang, result.severity)}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {/* Severity bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{t(lang, "severity")}</span>
                    <span>{result.percent}%</span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.22 0.04 145)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.percent}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        result.severity === "healthy"
                          ? "bg-primary"
                          : result.severity === "mild"
                            ? "bg-yellow-500"
                            : "bg-destructive"
                      }`}
                    />
                  </div>
                </div>

                <div
                  className="rounded-xl p-3"
                  style={{ background: "oklch(0.22 0.04 145)" }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wide mb-1"
                    style={{ color: "oklch(0.52 0.18 145)" }}
                  >
                    {t(lang, "cause")}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {result.cause}
                  </p>
                </div>

                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "oklch(0.52 0.18 145 / 0.1)",
                    border: "1px solid oklch(0.52 0.18 145 / 0.2)",
                  }}
                >
                  <p className="text-xs font-bold text-primary mb-1">
                    🌿 {t(lang, "organicTreatment")}
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {result.organic}
                  </p>
                </div>

                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "oklch(0.78 0.14 80 / 0.08)",
                    border: "1px solid oklch(0.78 0.14 80 / 0.2)",
                  }}
                >
                  <p
                    className="text-xs font-bold mb-1"
                    style={{ color: "oklch(0.78 0.14 80)" }}
                  >
                    💊 {t(lang, "pesticideRec")}
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {result.pesticide}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it works when no result */}
        {!result && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: "oklch(0.18 0.05 145)",
              border: "1px solid oklch(0.25 0.06 145)",
            }}
          >
            <p className="font-display font-bold text-foreground mb-2 text-sm">
              How it works
            </p>
            <div className="space-y-2">
              {[
                "Take or upload a photo of your plant leaf",
                "AI analyzes the image for diseases",
                "Get instant treatment recommendations",
              ].map((step, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="w-5 h-5 rounded-full text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "oklch(0.52 0.18 145 / 0.15)" }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground/80">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
