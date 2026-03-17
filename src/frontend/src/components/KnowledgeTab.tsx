import { useAllArticles, useInitKnowledge } from "@/hooks/useQueries";
import type { Language } from "@/i18n";
import { t } from "@/i18n";
import { BookOpen, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const FALLBACK_ARTICLES = [
  {
    title: "Best Time to Transplant Rice Seedlings",
    content:
      "Rice seedlings should be transplanted 21-25 days after sowing when they are 15-20cm tall. The ideal time is early morning or late evening to avoid heat stress. Ensure field has 2-3cm standing water. Space plants 20cm apart in rows of 20cm.",
    language: "English",
    category: "Planting",
  },
  {
    title: "Drip Irrigation for Vegetable Gardens",
    content:
      "Drip irrigation saves 40-60% water compared to flood irrigation. Install main line, sub-main lines, and lateral pipes with drippers spaced 30cm apart. Water for 45-60 minutes twice daily during dry season.",
    language: "English",
    category: "Irrigation",
  },
  {
    title: "Organic Pest Control Using Neem",
    content:
      "Neem oil is one of the most effective organic pesticides. Mix 10ml cold-pressed neem oil with 1 liter water and 2-3 drops of dish soap. Spray on plants in early morning or evening. Repeat every 7-10 days.",
    language: "English",
    category: "Pest Control",
  },
  {
    title: "ගොවිතැනේ හොඳම කාලය",
    content:
      "ශ්‍රී ලංකාවේ ප්‍රධාන වගා කන්නය යල සහ මහ කන්නයන් දෙකෙකි. ඒ.ඩී 966 සහ සම්බා ජාතීන් බිජු වාරිමාර්ග ඉඩකඩ ඇති ප්‍රදේශ සඳහා ගැලපේ.",
    language: "Sinhala",
    category: "Planting",
  },
  {
    title: "வயல் நீர் மேலாண்மை",
    content:
      "நெல் வயலில் 5 செமீ தண்ணீர் நிலையை பராமரிக்கவும். நடவு செய்த 10 நாட்களில் வயலில் தண்ணீர் வடிக்கவும். இந்த முறையில் 30% தண்ணீர் சேமிக்கலாம்.",
    language: "Tamil",
    category: "Irrigation",
  },
  {
    title: "Composting for Soil Health",
    content:
      "Home composting improves soil fertility and reduces chemical fertilizer use. Collect kitchen waste, dry leaves, and crop residues. Ready compost is dark, crumbly, with earthy smell — ready in 2-3 months.",
    language: "English",
    category: "General",
  },
];

const QUICK_TIPS = [
  { label: "Planting Guide", emoji: "🌱", category: "Planting" },
  { label: "Pest Control", emoji: "🐛", category: "Pest Control" },
  { label: "Irrigation Tips", emoji: "💧", category: "Irrigation" },
  { label: "Harvesting Advice", emoji: "🌾", category: "General" },
];

const CATEGORIES = ["All", "Planting", "Irrigation", "Pest Control"];

export default function KnowledgeTab({ lang }: { lang: Language }) {
  const init = useInitKnowledge();
  const { data: articles, isLoading } = useAllArticles();
  const [category, setCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: init mutation runs once on mount
  useEffect(() => {
    init.mutate();
  }, []);

  const displayArticles =
    articles && articles.length > 0 ? articles : FALLBACK_ARTICLES;

  const filtered = displayArticles.filter((a) => {
    const catMatch = category === "All" || a.category === category;
    const langMatch =
      lang === "en"
        ? a.language === "English"
        : lang === "si"
          ? a.language === "Sinhala" || a.language === "English"
          : a.language === "Tamil" || a.language === "English";
    return catMatch && langMatch;
  });

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
          <BookOpen className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-base font-display font-bold text-foreground">
          Farming Tips
        </h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Quick tip rows */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.18 0.05 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          {QUICK_TIPS.map((tip, i) => (
            <div key={tip.label}>
              {i > 0 && (
                <div
                  className="h-px mx-4"
                  style={{ background: "oklch(0.25 0.06 145)" }}
                />
              )}
              <button
                type="button"
                onClick={() => setCategory(tip.category)}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
                style={{ color: "inherit" }}
              >
                <span className="text-xl w-8 text-center">{tip.emoji}</span>
                <span className="flex-1 font-semibold text-sm text-foreground">
                  {tip.label}
                </span>
                <ChevronRight className="w-4 h-4 text-primary" />
              </button>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div
          data-ocid="knowledge.category.tab"
          className="flex gap-2 overflow-x-auto pb-1"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
              style={{
                background:
                  category === cat
                    ? "oklch(0.52 0.18 145)"
                    : "oklch(0.20 0.06 145)",
                color:
                  category === cat ? "oklch(0.98 0 0)" : "oklch(0.65 0.05 145)",
                border:
                  category === cat
                    ? "1px solid oklch(0.52 0.18 145)"
                    : "1px solid oklch(0.28 0.06 145)",
              }}
            >
              {cat === "All"
                ? t(lang, "allCategories")
                : cat === "Planting"
                  ? t(lang, "planting")
                  : cat === "Irrigation"
                    ? t(lang, "irrigation")
                    : t(lang, "pestControl")}
            </button>
          ))}
        </div>

        {/* Articles */}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl"
                style={{ background: "oklch(0.18 0.05 145)" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="knowledge.empty_state"
            className="text-center py-10 text-muted-foreground"
          >
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No articles available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((article, i) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-ocid={`knowledge.article.item.${i + 1}`}
              >
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: "oklch(0.18 0.05 145)",
                    border: "1px solid oklch(0.25 0.06 145)",
                  }}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() =>
                      setExpanded(
                        expanded === article.title ? null : article.title,
                      )
                    }
                  >
                    <div className="px-4 py-3 flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ background: "oklch(0.52 0.18 145)" }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {article.category} • {article.language}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform mt-0.5 ${
                          expanded === article.title ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>
                  <AnimatePresence>
                    {expanded === article.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className="px-4 pb-3 pt-1"
                          style={{ background: "oklch(0.20 0.04 145)" }}
                        >
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {article.content}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Feature photo card */}
        <div
          className="rounded-2xl overflow-hidden relative h-36"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.30 0.14 145) 0%, oklch(0.20 0.10 145) 100%)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-15">
            🤲
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-white text-sm font-display font-bold">
              How to prevent pests in your crops ›
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
