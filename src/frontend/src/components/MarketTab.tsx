import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInitMarket } from "@/hooks/useQueries";
import type { Language } from "@/i18n";
import {
  BookOpen,
  MapPin,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// ── Crop emoji map ────────────────────────────────────────────────────────────
const CROP_EMOJIS: Record<string, string> = {
  Paddy: "🌾",
  "Rice (Samba)": "🌾",
  Rice: "🌾",
  Tomato: "🍅",
  Tomatoes: "🍅",
  Coconut: "🥥",
  Banana: "🍌",
  "Banana (Embul)": "🍌",
  "Green Chilli": "🌶️",
  Chilli: "🌶️",
  Gotukola: "🥬",
  Tea: "🍃",
  Rubber: "🌳",
  Maize: "🌽",
  Onion: "🧅",
  Potato: "🥔",
  Pineapple: "🍍",
  Mango: "🥭",
  Cassava: "🫚",
  "Sweet Potato": "🍠",
  Brinjal: "🍆",
  Beans: "🫘",
  Cabbage: "🥬",
  Carrot: "🥕",
};

// ── Market price data (static research data) ─────────────────────────────────
interface CropPrice {
  cropName: string;
  pricePerKg: number;
  marketLocation: string;
  trendUp: boolean;
}

const MARKET_PRICES: Record<string, CropPrice> = {
  Paddy: {
    cropName: "Paddy",
    pricePerKg: 75,
    marketLocation: "Colombo Pettah",
    trendUp: true,
  },
  "Rice (Samba)": {
    cropName: "Rice (Samba)",
    pricePerKg: 185,
    marketLocation: "Colombo Pettah",
    trendUp: true,
  },
  Rice: {
    cropName: "Rice",
    pricePerKg: 160,
    marketLocation: "Colombo Pettah",
    trendUp: true,
  },
  Tomato: {
    cropName: "Tomato",
    pricePerKg: 220,
    marketLocation: "Kandy Market",
    trendUp: false,
  },
  Tomatoes: {
    cropName: "Tomatoes",
    pricePerKg: 220,
    marketLocation: "Kandy Market",
    trendUp: false,
  },
  Coconut: {
    cropName: "Coconut",
    pricePerKg: 95,
    marketLocation: "Galle Main Market",
    trendUp: true,
  },
  Banana: {
    cropName: "Banana",
    pricePerKg: 140,
    marketLocation: "Jaffna Market",
    trendUp: true,
  },
  "Banana (Embul)": {
    cropName: "Banana (Embul)",
    pricePerKg: 140,
    marketLocation: "Jaffna Market",
    trendUp: true,
  },
  "Green Chilli": {
    cropName: "Green Chilli",
    pricePerKg: 480,
    marketLocation: "Colombo Manning",
    trendUp: false,
  },
  Chilli: {
    cropName: "Chilli",
    pricePerKg: 460,
    marketLocation: "Colombo Manning",
    trendUp: false,
  },
  Gotukola: {
    cropName: "Gotukola",
    pricePerKg: 320,
    marketLocation: "Kandy Market",
    trendUp: true,
  },
  Tea: {
    cropName: "Tea",
    pricePerKg: 950,
    marketLocation: "Colombo Tea Auctions",
    trendUp: true,
  },
  Rubber: {
    cropName: "Rubber",
    pricePerKg: 410,
    marketLocation: "Colombo Rubber Market",
    trendUp: false,
  },
  Maize: {
    cropName: "Maize",
    pricePerKg: 65,
    marketLocation: "Dambulla Economic Centre",
    trendUp: true,
  },
  Onion: {
    cropName: "Onion",
    pricePerKg: 280,
    marketLocation: "Colombo Manning",
    trendUp: false,
  },
  Potato: {
    cropName: "Potato",
    pricePerKg: 190,
    marketLocation: "Nuwara Eliya Market",
    trendUp: true,
  },
  Pineapple: {
    cropName: "Pineapple",
    pricePerKg: 120,
    marketLocation: "Gampaha Market",
    trendUp: true,
  },
  Mango: {
    cropName: "Mango",
    pricePerKg: 230,
    marketLocation: "Colombo Manning",
    trendUp: true,
  },
  Cassava: {
    cropName: "Cassava",
    pricePerKg: 45,
    marketLocation: "Kurunegala Market",
    trendUp: false,
  },
  "Sweet Potato": {
    cropName: "Sweet Potato",
    pricePerKg: 85,
    marketLocation: "Dambulla Economic Centre",
    trendUp: true,
  },
  Brinjal: {
    cropName: "Brinjal",
    pricePerKg: 175,
    marketLocation: "Kandy Market",
    trendUp: false,
  },
  Beans: {
    cropName: "Beans",
    pricePerKg: 310,
    marketLocation: "Nuwara Eliya Market",
    trendUp: true,
  },
  Cabbage: {
    cropName: "Cabbage",
    pricePerKg: 90,
    marketLocation: "Nuwara Eliya Market",
    trendUp: false,
  },
  Carrot: {
    cropName: "Carrot",
    pricePerKg: 135,
    marketLocation: "Nuwara Eliya Market",
    trendUp: true,
  },
};

// ── Research data ─────────────────────────────────────────────────────────────
interface CropResearch {
  season: string;
  avgYield: string;
  storageLife: string;
  harvestTip: string;
  sellStrategy: string;
}

const CROP_RESEARCH: Record<string, CropResearch> = {
  Paddy: {
    season: "Maha (Oct–Feb) & Yala (Apr–Aug)",
    avgYield: "4–5 t/ha",
    storageLife: "6–12 months (dry)",
    harvestTip:
      "Harvest at 20–25% moisture. Sun-dry to below 14% before bagging to avoid mold.",
    sellStrategy:
      "Sell after 1–2 months post-harvest when market prices usually recover. Target government guaranteed prices at CWE purchase centres.",
  },
  "Rice (Samba)": {
    season: "Maha (Oct–Feb)",
    avgYield: "4.5–5.5 t/ha (milled)",
    storageLife: "Up to 1 year (milled, cool storage)",
    harvestTip:
      "Milling within 2 weeks of harvest improves quality. Check grain moisture before milling.",
    sellStrategy:
      "Premium Samba commands 20–30% more than Nadu. Target supermarkets and specialty rice retailers in Colombo for best margins.",
  },
  Rice: {
    season: "Maha (Oct–Feb) & Yala (Apr–Aug)",
    avgYield: "4–5 t/ha",
    storageLife: "6–12 months",
    harvestTip:
      "Harvest when 80% of grains are golden-yellow. Avoid harvesting in rainy weather.",
    sellStrategy:
      "Register with the Paddy Marketing Board for guaranteed price support. Bulk selling post-dry season typically yields better rates.",
  },
  Tomato: {
    season: "Oct–Jan (best), Apr–Jun (secondary)",
    avgYield: "20–30 t/ha",
    storageLife: "5–7 days (room temp)",
    harvestTip:
      "Harvest at the breaker stage (first colour change) for long-distance markets. Full-red for local markets only.",
    sellStrategy:
      "Avoid flooding the market during peak season. Partner with food processors or ketchup factories for bulk off-take at stable prices.",
  },
  Tomatoes: {
    season: "Oct–Jan (best), Apr–Jun (secondary)",
    avgYield: "20–30 t/ha",
    storageLife: "5–7 days (room temp)",
    harvestTip:
      "Harvest at the breaker stage for transport. Stagger plantings by 2-week intervals to smooth supply.",
    sellStrategy:
      "Avoid flooding market during peak season. Explore direct B2B sales to hotels and restaurants in Kandy or Colombo.",
  },
  Coconut: {
    season: "Year-round; peak harvest Aug–Oct",
    avgYield: "80–100 nuts/tree/year",
    storageLife: "1–2 months (mature nut)",
    harvestTip:
      "Harvest every 45–60 days. Climb only fully matured palms. Mark trees by date for systematic harvest cycles.",
    sellStrategy:
      "Desiccated coconut and coconut oil fetch 3–5× premium over raw nuts. Consider small-scale value addition or selling to coconut processing factories.",
  },
  Banana: {
    season: "Year-round; peak supply Nov–Jan",
    avgYield: "25–35 t/ha",
    storageLife: "10–14 days (green); 2–3 days (ripe)",
    harvestTip:
      "Harvest bunches when fingers are 75% full. Cut at early morning to reduce sap staining.",
    sellStrategy:
      "Supply to supermarket chains under contract for consistent pricing. Export-grade Embul Banana commands premium in Middle Eastern markets.",
  },
  "Banana (Embul)": {
    season: "Year-round; peak supply Nov–Jan",
    avgYield: "25–35 t/ha",
    storageLife: "10–14 days (green)",
    harvestTip:
      "Harvest bunches at 75% finger fullness. Transport carefully to avoid bruising — use padded crates.",
    sellStrategy:
      "Embul Banana is Sri Lanka's most popular variety. Premium pricing at Colombo supermarkets. Consider direct delivery to fruit shops.",
  },
  "Green Chilli": {
    season: "Jan–Mar, Jul–Sep",
    avgYield: "8–12 t/ha",
    storageLife: "7–10 days (cool); 2–3 days (ambient)",
    harvestTip:
      "Harvest early morning when dew dries. Avoid over-mature red fruits — they fetch lower prices. Handle with gloves.",
    sellStrategy:
      "Prices are volatile — monitor Pola and Manning Market daily rates. Dry excess into chilli powder for value addition and price stability.",
  },
  Chilli: {
    season: "Jan–Mar, Jul–Sep",
    avgYield: "8–12 t/ha",
    storageLife: "7–10 days (cool)",
    harvestTip:
      "Pick regularly every 5–7 days to encourage continuous fruiting. Mix green and red for blended market demand.",
    sellStrategy:
      "Dried red chilli sells at 5–8× the fresh price per kg. Sun or mechanical drying is a strong value-addition option.",
  },
  Gotukola: {
    season: "Year-round; best Oct–Feb (cooler months)",
    avgYield: "10–15 t/ha/year",
    storageLife: "2–3 days (cut)",
    harvestTip:
      "Harvest early morning when leaves are crisp and moisture is high. Bundle tightly in wet cloth for freshness during transport.",
    sellStrategy:
      "Supply directly to Colombo supermarkets and organic food stores for premium pricing. Bundle as 'Organic Gotukola' for 30–50% price uplift.",
  },
  Tea: {
    season: "Best quality: Jan–Mar (low-grown) & Jul–Sep (high-grown)",
    avgYield: "2,000–3,000 kg/ha/year (green leaf)",
    storageLife: "2 years (processed, airtight)",
    harvestTip:
      "Pluck 2-leaves-and-a-bud (2+1) every 7–10 days. Fine plucking improves quality grade and auction price significantly.",
    sellStrategy:
      "Register with a regional tea factory for guaranteed leaf purchase. Boutique organic tea processing can yield 10× returns for small growers.",
  },
  Rubber: {
    season: "Best tapping: Mar–Sep (dry weather)",
    avgYield: "1,500–2,000 kg/ha/year (dry rubber)",
    storageLife: "6–12 months (RSS sheets)",
    harvestTip:
      "Tap in early morning for maximum latex yield. Maintain 25° tapping angle. Rest trees every other day to prevent dryness.",
    sellStrategy:
      "RSS1/RSS2 grades command best prices. Join a rubber cooperative for better bulk pricing at the Colombo Rubber Exchange.",
  },
  Maize: {
    season: "Yala (May–Sep) primary; Maha secondary",
    avgYield: "5–7 t/ha",
    storageLife: "6–8 months (dry grain)",
    harvestTip:
      "Harvest when husks are dry and kernels are hard. Dry to below 13% moisture to prevent aflatoxin during storage.",
    sellStrategy:
      "Poultry and livestock feed mills (CML, Prima) are the largest buyers. Negotiate forward contracts before harvest for price certainty.",
  },
  Onion: {
    season: "Oct–Jan (big Bombay onion season)",
    avgYield: "15–25 t/ha",
    storageLife: "3–6 months (cured, dry store)",
    harvestTip:
      "Cure harvested onions in the field for 5–7 days before bagging. Proper curing extends shelf life significantly.",
    sellStrategy:
      "Sri Lanka imports large onion volumes — locally grown big onion commands a premium. Target wholesale Polas in Colombo and Kandy.",
  },
  Potato: {
    season: "Oct–Feb (main season in Nuwara Eliya/Badulla)",
    avgYield: "20–30 t/ha",
    storageLife: "3–6 months (cool, dark store)",
    harvestTip:
      "Leave potatoes in the ground 2 weeks after vines die to toughen skin for storage. Avoid harvesting in wet conditions.",
    sellStrategy:
      "Nuwara Eliya-grown potato is branded — use origin labeling. Supply to supermarket chains for better margins than wholesale Pola.",
  },
  Pineapple: {
    season: "Year-round; peak supply May–Jul",
    avgYield: "30–40 t/ha",
    storageLife: "3–5 days (ripe); 2 weeks (green)",
    harvestTip:
      "Harvest when the base turns golden yellow and gives a hollow sound when tapped. Cut with 5 cm stem attached.",
    sellStrategy:
      "Export-grade pineapples to Middle East and EU markets command premium prices. Partner with NEDA-registered exporters in Gampaha area.",
  },
  Mango: {
    season: "Apr–Jul (main season)",
    avgYield: "10–20 t/ha (mature trees)",
    storageLife: "1–2 weeks (ambient)",
    harvestTip:
      "Harvest at full maturity (specific gravity > 1.02). Handle carefully to avoid sap burns which cause black spotting on skin.",
    sellStrategy:
      "Willard mango for export and Karthakolomban for local premium markets. Direct sales to Colombo fruit importers yield 40% better than Pola.",
  },
  Cassava: {
    season: "Year-round; best planted at Maha onset",
    avgYield: "25–40 t/ha",
    storageLife: "2–3 days (fresh roots)",
    harvestTip:
      "Harvest at 8–12 months for best starch content. Process within 24 hours of harvest to prevent post-harvest deterioration.",
    sellStrategy:
      "Chips, flour, and starch products command 3–5× premium over fresh roots. Target starch factories in Kurunegala and Puttalam for bulk fresh sales.",
  },
  "Sweet Potato": {
    season: "Oct–Mar (best for Dambulla highland types)",
    avgYield: "15–25 t/ha",
    storageLife: "1–2 months (cured)",
    harvestTip:
      "Cure freshly harvested sweet potatoes at 30°C / 85% humidity for 5 days to heal skin and convert starch to sugar.",
    sellStrategy:
      "Orange-flesh varieties command premium in health food markets. Supply to bakeries and restaurants for value-added product lines.",
  },
  Brinjal: {
    season: "Year-round; best Oct–Feb",
    avgYield: "20–30 t/ha",
    storageLife: "5–7 days (ambient)",
    harvestTip:
      "Harvest every 3–4 days when fruit is glossy and before seeds harden. Regular picking encourages plant to produce more fruit.",
    sellStrategy:
      "Purple long brinjal has consistently higher demand than round type. Direct supply to Colombo supermarkets avoids middleman margin loss.",
  },
  Beans: {
    season: "Oct–Jan, Apr–Jun (Nuwara Eliya/Badulla)",
    avgYield: "8–12 t/ha",
    storageLife: "5–7 days (ambient); 2 weeks (cool)",
    harvestTip:
      "Pick at pencil-stage before seeds bulge. Harvest every 2–3 days for maximum yield and quality retention.",
    sellStrategy:
      "Supermarket quality beans require uniform size and no blemish. Pre-pack in 250 g bags for direct supermarket supply — 35% price premium over wholesale.",
  },
  Cabbage: {
    season: "Oct–Mar (peak in hill country)",
    avgYield: "30–50 t/ha",
    storageLife: "2–4 weeks (field temp)",
    harvestTip:
      "Harvest when heads are firm and compact. Early morning harvest retains better quality during transit.",
    sellStrategy:
      "Avoid peak-season glut — stagger planting by 3-week intervals. Export to Maldives and Middle East markets through NEDA for premium pricing.",
  },
  Carrot: {
    season: "Oct–Feb (Nuwara Eliya/Badulla/Welimada)",
    avgYield: "25–40 t/ha",
    storageLife: "1–3 months (cool, humid)",
    harvestTip:
      "Harvest at 90–110 days. Pull a test carrot — shoulders should be 2–3 cm diameter. Leave tops on for market presentation.",
    sellStrategy:
      "Nuwara Eliya carrot brand is strong. Premium pricing at supermarkets with clean washing and grading. Export-grade to Maldives available through organised groups.",
  },
};

const GENERIC_RESEARCH: CropResearch = {
  season: "Consult local agricultural extension officer for season details",
  avgYield: "Varies by variety and soil condition",
  storageLife: "2–7 days typical; verify with local agent",
  harvestTip:
    "Harvest at full maturity during dry weather. Store in a cool, ventilated location away from direct sunlight.",
  sellStrategy:
    "Visit your nearest Dedicated Economic Centre (DEC) or weekly Pola for current market rates. Negotiate group selling with other farmers for better pricing.",
};

function getResearch(cropName: string): CropResearch {
  return CROP_RESEARCH[cropName] ?? GENERIC_RESEARCH;
}

function getPrice(cropName: string): CropPrice {
  return (
    MARKET_PRICES[cropName] ?? {
      cropName,
      pricePerKg: 150,
      marketLocation: "Nearest Economic Centre",
      trendUp: true,
    }
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MarketTab({ lang: _lang }: { lang: Language }) {
  const init = useInitMarket();
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [researchCrop, setResearchCrop] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: init mutation runs once on mount
  useEffect(() => {
    init.mutate();
  }, []);

  // Read farmer data from localStorage
  const farmerProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem("farmerProfile") ?? "{}");
    } catch {
      return {};
    }
  })();
  const farmerLocation: string = farmerProfile?.location ?? "Sri Lanka";

  const farmerCrops: string[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("farmer_crops") ?? "[]");
    } catch {
      return [];
    }
  })();

  const researchData = researchCrop ? getResearch(researchCrop) : null;
  const researchPrice = researchCrop ? getPrice(researchCrop) : null;

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
          <ShoppingBag className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-base font-display font-bold text-foreground">
          Market Prices
        </h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Location badge */}
        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "oklch(0.52 0.18 145 / 0.18)",
              border: "1px solid oklch(0.52 0.18 145 / 0.35)",
              color: "oklch(0.82 0.12 145)",
            }}
            data-ocid="market.location.panel"
          >
            <MapPin className="w-3 h-3" />
            <span>{farmerLocation}</span>
          </div>
        </div>

        {/* Crop list */}
        {farmerCrops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            data-ocid="market.empty_state"
            className="rounded-2xl p-6 text-center space-y-2"
            style={{
              background: "oklch(0.18 0.05 145)",
              border: "1px solid oklch(0.25 0.06 145)",
            }}
          >
            <p className="text-3xl">🌱</p>
            <p className="text-sm font-semibold text-foreground">
              No crops added yet
            </p>
            <p className="text-xs text-muted-foreground">
              Go to Profile → My Crops to add your crops and see their market
              prices here.
            </p>
          </motion.div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.18 0.05 145)",
              border: "1px solid oklch(0.25 0.06 145)",
            }}
          >
            {farmerCrops.map((cropName, i) => {
              const price = getPrice(cropName);
              const isExpanded = selectedCrop === cropName;
              return (
                <div key={cropName}>
                  {i > 0 && (
                    <div
                      className="h-px mx-4"
                      style={{ background: "oklch(0.25 0.06 145)" }}
                    />
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-left"
                      data-ocid={`market.price.item.${i + 1}`}
                      onClick={() =>
                        setSelectedCrop(isExpanded ? null : cropName)
                      }
                      style={{
                        background: isExpanded
                          ? "oklch(0.52 0.18 145 / 0.08)"
                          : "transparent",
                      }}
                    >
                      <span className="text-2xl w-8 text-center flex-shrink-0">
                        {CROP_EMOJIS[cropName] ?? "🌱"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {cropName}
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
                      {/* Research button */}
                      <button
                        type="button"
                        data-ocid={`market.price.open_modal_button.${i + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setResearchCrop(cropName);
                        }}
                        className="ml-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                          background: "oklch(0.78 0.14 80 / 0.12)",
                          border: "1px solid oklch(0.78 0.14 80 / 0.25)",
                        }}
                        title="Market Research"
                      >
                        <BookOpen
                          className="w-4 h-4"
                          style={{ color: "oklch(0.78 0.14 80)" }}
                        />
                      </button>
                    </button>

                    {/* Inline sell tip */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden px-4 pb-3"
                        >
                          <div
                            className="rounded-xl p-3 text-sm font-semibold"
                            style={{
                              background: price.trendUp
                                ? "oklch(0.52 0.18 145 / 0.1)"
                                : "oklch(0.55 0.22 25 / 0.1)",
                              border: price.trendUp
                                ? "1px solid oklch(0.52 0.18 145 / 0.2)"
                                : "1px solid oklch(0.55 0.22 25 / 0.2)",
                              color: price.trendUp
                                ? "oklch(0.72 0.18 145)"
                                : "oklch(0.72 0.22 25)",
                            }}
                          >
                            {price.trendUp
                              ? "✅ Good time to sell — prices are rising!"
                              : "⏳ Consider waiting — prices are falling."}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Research Modal */}
      <Dialog
        open={!!researchCrop}
        onOpenChange={(open) => !open && setResearchCrop(null)}
      >
        <DialogContent
          data-ocid="market.dialog"
          className="max-w-sm mx-auto rounded-2xl border-0 p-0 overflow-hidden"
          style={{
            background: "oklch(0.14 0.04 145)",
            border: "1px solid oklch(0.25 0.06 145)",
          }}
        >
          <DialogHeader className="px-5 pt-5 pb-3">
            <DialogTitle className="flex items-center gap-2 text-foreground font-display">
              <span className="text-2xl">
                {CROP_EMOJIS[researchCrop ?? ""] ?? "🌱"}
              </span>
              <span>{researchCrop} — Market Research</span>
            </DialogTitle>
          </DialogHeader>

          {researchData && researchPrice && (
            <div className="px-5 pb-6 space-y-4 max-h-[72vh] overflow-y-auto">
              {/* Price & trend */}
              <div
                className="rounded-xl p-3 flex items-center justify-between"
                style={{
                  background: "oklch(0.18 0.05 145)",
                  border: "1px solid oklch(0.25 0.06 145)",
                }}
              >
                <div>
                  <p className="text-xs text-muted-foreground">Current Price</p>
                  <p
                    className="text-xl font-bold font-display"
                    style={{ color: "oklch(0.78 0.14 80)" }}
                  >
                    LKR {researchPrice.pricePerKg}/kg
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    researchPrice.trendUp ? "text-primary" : "text-destructive"
                  }`}
                  style={{
                    background: researchPrice.trendUp
                      ? "oklch(0.52 0.18 145 / 0.15)"
                      : "oklch(0.55 0.22 25 / 0.15)",
                  }}
                >
                  {researchPrice.trendUp ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{researchPrice.trendUp ? "Rising" : "Falling"}</span>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Best Market",
                    value: researchPrice.marketLocation,
                    icon: "🏪",
                  },
                  { label: "Season", value: researchData.season, icon: "📅" },
                  {
                    label: "Average Yield",
                    value: researchData.avgYield,
                    icon: "⚖️",
                  },
                  {
                    label: "Storage Life",
                    value: researchData.storageLife,
                    icon: "📦",
                  },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3 space-y-1"
                    style={{
                      background: "oklch(0.18 0.05 145)",
                      border: "1px solid oklch(0.25 0.06 145)",
                    }}
                  >
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>{icon}</span> {label}
                    </p>
                    <p className="text-xs font-semibold text-foreground leading-snug">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Harvest tip */}
              <div
                className="rounded-xl p-3 space-y-1"
                style={{
                  background: "oklch(0.20 0.08 145 / 0.6)",
                  border: "1px solid oklch(0.40 0.12 145 / 0.4)",
                }}
              >
                <p
                  className="text-xs font-bold"
                  style={{ color: "oklch(0.72 0.18 145)" }}
                >
                  🌿 Harvest Tip
                </p>
                <p className="text-xs text-foreground leading-relaxed">
                  {researchData.harvestTip}
                </p>
              </div>

              {/* Selling strategy */}
              <div
                className="rounded-xl p-3 space-y-1"
                style={{
                  background: "oklch(0.20 0.08 80 / 0.25)",
                  border: "1px solid oklch(0.78 0.14 80 / 0.3)",
                }}
              >
                <p
                  className="text-xs font-bold"
                  style={{ color: "oklch(0.78 0.14 80)" }}
                >
                  💰 Selling Strategy
                </p>
                <p className="text-xs text-foreground leading-relaxed">
                  {researchData.sellStrategy}
                </p>
              </div>

              {/* Footer note */}
              <p
                className="text-xs text-center leading-relaxed"
                style={{ color: "oklch(0.55 0.04 145)" }}
              >
                Market data applicable near{" "}
                <span
                  className="font-semibold"
                  style={{ color: "oklch(0.65 0.08 145)" }}
                >
                  {farmerLocation}
                </span>
                . Visit your nearest Dedicated Economic Centre or Pola for live
                quotes.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
