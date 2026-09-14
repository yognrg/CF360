import type {
  Database,
  Format,
  LanguageVariant,
  Metric,
  MonitoringKpi,
  Request,
  Template,
  TemplateSpecs,
  User,
} from "@/lib/types";
import { computeTotal } from "@/lib/scoring";

/** Timestamps are relative to seed time so "2h ago" style labels stay sensible. */
const NOW = Date.now();
const iso = (msAgo: number) => new Date(NOW - msAgo).toISOString();
const MIN = 60_000;
const HR = 60 * MIN;
const DAY = 24 * HR;

const offerReelSpecs: TemplateSpecs = {
  resolution: "1080 x 1920",
  duration: "15s",
  editable_layers: 8,
  text_slots: 4,
  image_slots: 2,
  brand_locked: true,
};

export function buildSeed(): Database {
  // ── Users ────────────────────────────────────────────────────────────────
  const users: User[] = [
    {
      id: "u_param",
      name: "Param Joshi",
      email: "param.joshi@bajajfinserv.in",
      role: "raiser",
      avatar_url: null,
      created_at: iso(120 * DAY),
    },
    {
      id: "u_sushant",
      name: "Sushant Singh",
      email: "sushant.singh@bajajfinserv.in",
      role: "producer",
      avatar_url: null,
      created_at: iso(120 * DAY),
    },
    {
      id: "u_admin",
      name: "Aditi Rao",
      email: "aditi.rao@bajajfinserv.in",
      role: "admin",
      avatar_url: null,
      created_at: iso(120 * DAY),
    },
    {
      id: "u_sneha",
      name: "Sneha R",
      email: "sneha.r@bajajfinserv.in",
      role: "producer",
      avatar_url: null,
      created_at: iso(120 * DAY),
    },
    {
      id: "u_amit",
      name: "Amit K",
      email: "amit.k@bajajfinserv.in",
      role: "producer",
      avatar_url: null,
      created_at: iso(120 * DAY),
    },
    {
      id: "u_ravi",
      name: "Ravi T",
      email: "ravi.t@bajajfinserv.in",
      role: "producer",
      avatar_url: null,
      created_at: iso(120 * DAY),
    },
  ];

  // ── Requests (pipeline rows) ──────────────────────────────────────────────
  const requests: Request[] = [
    {
      id: "r_12847",
      cf_id: "CF-12847",
      vid_id: "VID-24601",
      product: "Gold Loan",
      category: "Secured Loans",
      landing_url: "bajajfinserv.in/gold-loan",
      stage: "pre_production",
      priority: "high",
      status_label: "In Progress",
      format_name: "Offer Reel",
      owner_id: "u_param",
      created_at: iso(3 * DAY),
      updated_at: iso(2 * HR),
    },
    {
      id: "r_12846",
      cf_id: "CF-12846",
      vid_id: "VID-24600",
      product: "Personal Loan",
      category: "Unsecured Loans",
      landing_url: "bajajfinserv.in/personal-loan",
      stage: "lead_review",
      priority: "medium",
      status_label: "Awaiting approval",
      format_name: "How-to Video",
      owner_id: "u_sneha",
      created_at: iso(4 * DAY),
      updated_at: iso(5 * HR),
    },
    {
      id: "r_12844",
      cf_id: "CF-12844",
      vid_id: "VID-24598",
      product: "Home Loan",
      category: "Secured Loans",
      landing_url: "bajajfinserv.in/home-loan",
      stage: "publishing",
      priority: "low",
      status_label: "Published",
      format_name: "Overview",
      owner_id: "u_amit",
      created_at: iso(6 * DAY),
      updated_at: iso(1 * DAY),
    },
    {
      id: "r_12841",
      cf_id: "CF-12841",
      vid_id: "VID-24595",
      product: "Business Loan",
      category: "Unsecured Loans",
      landing_url: "bajajfinserv.in/business-loan",
      stage: "production",
      priority: "high",
      status_label: "Rendering",
      format_name: "Feature & Benefits",
      owner_id: "u_param",
      created_at: iso(5 * DAY),
      updated_at: iso(1 * DAY),
    },
    {
      id: "r_12839",
      cf_id: "CF-12839",
      vid_id: "VID-24593",
      product: "Insurance",
      category: "Protection",
      landing_url: "bajajfinserv.in/insurance",
      stage: "monitoring",
      priority: "medium",
      status_label: "Live",
      format_name: "Testimonial",
      owner_id: "u_ravi",
      created_at: iso(9 * DAY),
      updated_at: iso(2 * DAY),
    },
    {
      id: "r_12836",
      cf_id: "CF-12836",
      vid_id: "VID-24590",
      product: "Credit Card",
      category: "Cards",
      landing_url: "bajajfinserv.in/credit-card",
      stage: "pre_production",
      priority: "low",
      status_label: "In Progress",
      format_name: "Eligibility",
      owner_id: "u_sneha",
      created_at: iso(3 * DAY),
      updated_at: iso(3 * DAY),
    },
  ];

  // ── Brief for CF-12847 ────────────────────────────────────────────────────
  const briefs = [
    {
      id: "b_12847",
      request_id: "r_12847",
      source: "auto_filled" as const,
      product_info: {
        product: "Gold Loan",
        category: "Secured Loans",
        landing_url: "bajajfinserv.in/gold-loan",
        key_usps: [
          "Instant approval 5 min",
          "9.50% interest",
          "Up to ₹2 Crore",
          "Minimal docs",
          "Doorstep service",
        ],
      },
      seo_info: {
        meta_title:
          "Gold Loan - Apply Online at Low Interest Rates | Bajaj Finserv",
        meta_description:
          "Get instant gold loan at attractive interest rates. Quick disbursal.",
        keywords: ["gold loan", "gold loan online", "bajaj finserv gold loan"],
      },
      audio_intelligence: {
        target_geography: "Pan India, Tier 1-2-3",
        audience: "Gold owners, 25-55",
        tone: "Conversational, urgency",
        top_performer: "Demo + UGC 340%",
      },
    },
  ];

  // ── Formats (format library) ──────────────────────────────────────────────
  const formats: Format[] = [
    {
      id: "f_offer_reel",
      name: "Offer Reel",
      aspect_ratio: "9:16",
      duration_range: "15-30s",
      badge: "Recommended",
      reference_video_url: "Gold_Loan_OfferReel_Ref_v2.mp4",
      adobe_files: [
        { name: "OfferReel_v4.mogrt", type: "Motion template", size_bytes: 2_516_582 },
        { name: "OfferReel_v4.prproj", type: "Premiere project", size_bytes: 8_493_465 },
      ],
      specs: offerReelSpecs,
      usage_guidelines: {
        when_to_use:
          "Time-sensitive offers, festive campaigns, flash sales, cashback.",
        structure:
          "Hook (0-3s) → Offer reveal (3-8s) → Key terms (8-12s) → CTA (12-15s)",
        best_platforms:
          "Homepage banners, Bajaj Mall category pages, Video Wall.",
        tone: "Urgent, FOMO-driven. Numbers prominent. Hinglish for Tier 2-3.",
      },
      dos: [
        "Lead with the offer amount in the first 2 seconds",
        "Use bold, high-contrast text overlays for numbers",
        "Include validity date or 'limited period' tag",
        "End with a single clear CTA",
      ],
      donts: [
        "Never show an offer without the T&C disclaimer frame",
        "Don't use competitor brand names or comparisons",
        "Avoid text-heavy frames, max 8 words per screen",
        "Never skip the Bajaj Finserv logo lock-up",
      ],
    },
    {
      id: "f_howto",
      name: "How-to Video",
      aspect_ratio: "9:16",
      duration_range: "30-60s",
      badge: "Popular",
      reference_video_url: "PersonalLoan_HowTo_Ref_v1.mp4",
      adobe_files: [
        { name: "HowTo_v3.mogrt", type: "Motion template", size_bytes: 3_040_870 },
      ],
      specs: { ...offerReelSpecs, duration: "45s", text_slots: 6, image_slots: 3 },
      usage_guidelines: {
        when_to_use: "Step-by-step product education and application walkthroughs.",
        structure: "Problem (0-5s) → Steps (5-45s) → CTA (45-60s)",
        best_platforms: "YouTube, in-app help, Bajaj Mall product pages.",
        tone: "Clear, instructional, reassuring.",
      },
      dos: [
        "Number each step on screen",
        "Show the actual product UI",
        "Keep each step under 8 seconds",
      ],
      donts: ["Don't assume prior knowledge", "Avoid jargon without explanation"],
    },
    {
      id: "f_feature",
      name: "Feature & Benefits",
      aspect_ratio: "9:16",
      duration_range: "15-30s",
      badge: null,
      reference_video_url: null,
      adobe_files: [],
      specs: { ...offerReelSpecs, duration: "20s", text_slots: 5 },
      usage_guidelines: {
        when_to_use: "Highlight 3-4 differentiating product benefits.",
        structure: "Hook → Benefit 1-3 → CTA",
        best_platforms: "Homepage, category pages, Video Wall.",
        tone: "Confident, benefit-led.",
      },
      dos: ["Pair each benefit with an icon", "Keep to 3-4 benefits max"],
      donts: ["Don't list features without the customer benefit"],
    },
    {
      id: "f_overview",
      name: "Overview Video",
      aspect_ratio: "16:9",
      duration_range: "45-90s",
      badge: null,
      reference_video_url: null,
      adobe_files: [],
      specs: { ...offerReelSpecs, resolution: "1920 x 1080", duration: "60s", text_slots: 8 },
      usage_guidelines: {
        when_to_use: "Full product overview for landing pages and YouTube.",
        structure: "Intro → What it is → Who it's for → How to apply → CTA",
        best_platforms: "YouTube, landing pages.",
        tone: "Informative, brand-forward.",
      },
      dos: ["Open with the core value proposition"],
      donts: ["Don't exceed 90 seconds"],
    },
    {
      id: "f_eligibility",
      name: "Eligibility Criteria",
      aspect_ratio: "9:16",
      duration_range: "15-30s",
      badge: null,
      reference_video_url: null,
      adobe_files: [],
      specs: { ...offerReelSpecs, duration: "20s" },
      usage_guidelines: {
        when_to_use: "Communicate who qualifies and required documents.",
        structure: "Hook → Criteria → Docs → CTA",
        best_platforms: "Category pages, in-app.",
        tone: "Direct, factual.",
      },
      dos: ["Show criteria as a checklist"],
      donts: ["Never overstate eligibility"],
    },
    {
      id: "f_buying_guide",
      name: "Buying Guide",
      aspect_ratio: "16:9",
      duration_range: "60-120s",
      badge: null,
      reference_video_url: null,
      adobe_files: [],
      specs: { ...offerReelSpecs, resolution: "1920 x 1080", duration: "90s", text_slots: 10 },
      usage_guidelines: {
        when_to_use: "Educational comparison and decision-making content.",
        structure: "Context → Options → Recommendation → CTA",
        best_platforms: "YouTube, blog embeds.",
        tone: "Helpful, unbiased.",
      },
      dos: ["Compare objectively"],
      donts: ["Don't push a single option too hard"],
    },
    {
      id: "f_testimonial",
      name: "Customer Testimonial",
      aspect_ratio: "9:16",
      duration_range: "20-40s",
      badge: null,
      reference_video_url: null,
      adobe_files: [],
      specs: { ...offerReelSpecs, duration: "30s" },
      usage_guidelines: {
        when_to_use: "Build trust with real customer stories.",
        structure: "Problem → Experience → Result → CTA",
        best_platforms: "Instagram, Video Wall, homepage.",
        tone: "Authentic, warm, UGC-style.",
      },
      dos: ["Use real customers with consent", "Keep it unscripted"],
      donts: ["Never fabricate testimonials", "Don't over-produce"],
    },
  ];

  // ── Templates (template library) ──────────────────────────────────────────
  const templates: Template[] = [
    {
      id: "t_offer_reel",
      format_id: "f_offer_reel",
      name: "Offer Reel",
      badge: "Recommended",
      videos_count: 234,
      duration_range: "15-30s",
      specs: offerReelSpecs,
      reference_video_url: "Gold_Loan_OfferReel_Ref_v2.mp4",
      adobe_files: [
        { name: "OfferReel_v4.mogrt", type: "Motion template", size_bytes: 2_516_582 },
        { name: "OfferReel_v4.prproj", type: "Premiere project", size_bytes: 8_493_465 },
      ],
    },
    {
      id: "t_howto",
      format_id: "f_howto",
      name: "How to Video",
      badge: "Popular",
      videos_count: 189,
      duration_range: "30-60s",
      specs: { ...offerReelSpecs, duration: "45s" },
      reference_video_url: null,
      adobe_files: [],
    },
    {
      id: "t_feature",
      format_id: "f_feature",
      name: "Feature & Benefits",
      badge: null,
      videos_count: 156,
      duration_range: "15-30s",
      specs: { ...offerReelSpecs, duration: "20s" },
      reference_video_url: null,
      adobe_files: [],
    },
    {
      id: "t_overview",
      format_id: "f_overview",
      name: "Overview Video",
      badge: null,
      videos_count: 98,
      duration_range: "45-90s",
      specs: { ...offerReelSpecs, resolution: "1920 x 1080", duration: "60s" },
      reference_video_url: null,
      adobe_files: [],
    },
    {
      id: "t_eligibility",
      format_id: "f_eligibility",
      name: "Eligibility Criteria",
      badge: null,
      videos_count: 145,
      duration_range: "15-30s",
      specs: { ...offerReelSpecs, duration: "20s" },
      reference_video_url: null,
      adobe_files: [],
    },
    {
      id: "t_buying_guide",
      format_id: "f_buying_guide",
      name: "Buying Guides",
      badge: null,
      videos_count: 68,
      duration_range: "60-120s",
      specs: { ...offerReelSpecs, resolution: "1920 x 1080", duration: "90s" },
      reference_video_url: null,
      adobe_files: [],
    },
  ];

  // ── Prompt for CF-12847 ───────────────────────────────────────────────────
  const promptScores = {
    compliment: 92,
    brand: 85,
    hook: 80,
    template: 78,
    usp: 88,
    platform: 90,
  };
  const { total: promptTotal, passed: promptPassed } = computeTotal(promptScores);
  const prompts = [
    {
      id: "p_12847",
      request_id: "r_12847",
      text: "Create a 15s vertical Offer Reel for Bajaj Finserv Gold Loan. Lead with the benefit (instant approval, 9.50% interest). Hinglish tone, urgency-driven. End with CTA 'Apply Now'. Lock brand colours and logo. Include T&C disclaimer frame. Max 8 words per screen.",
      scores: promptScores,
      total_score: promptTotal,
      passed: promptPassed,
      version: 1,
      created_at: iso(3 * HR),
    },
  ];

  // ── Script for CF-12847 ───────────────────────────────────────────────────
  const scripts = [
    {
      id: "s_12847",
      request_id: "r_12847",
      regenerations_used: 2, // "Regenerations left: 1 of 3"
      beats: [
        {
          beat: "Hook · 0-3s",
          visual: "Locker opens, gold glints",
          voiceover: "“Tumhara gold pada hai locker mein…”",
          duration: 3,
        },
        {
          beat: "Offer · 3-8s",
          visual: "Bold text overlay 9.50%",
          voiceover: "“Bajaj Finserv Gold Loan - 9.50%…”",
          duration: 5,
        },
        {
          beat: "Benefit · 8-12s",
          visual: "Approval UI, 5-min timer",
          voiceover: "“5 minute mein approval, minimal docs”",
          duration: 4,
        },
        {
          beat: "CTA · 12-15s",
          visual: "Apply Now button, logo lock-up",
          voiceover: "“Abhi apply karein - link in bio”",
          duration: 3,
        },
      ],
    },
  ];

  // ── Assets for CF-12847 ───────────────────────────────────────────────────
  const assets = [
    {
      id: "a_12847_main",
      request_id: "r_12847",
      file_url: null,
      duration_seconds: 15,
      size_bytes: null,
      resolution: "1080 x 1920",
      status: "generated" as const,
    },
  ];

  // ── Language variants for CF-12847 ────────────────────────────────────────
  const language_variants: LanguageVariant[] = [
    { id: "lv_hi", request_id: "r_12847", language: "Hindi", localization: "Source", status: "master", voiceover_url: null, duration_seconds: 15, updated_at: iso(2 * HR) },
    { id: "lv_ta", request_id: "r_12847", language: "Tamil", localization: "Dubbed", status: "ready", voiceover_url: null, duration_seconds: 15, updated_at: iso(1 * HR) },
    { id: "lv_te", request_id: "r_12847", language: "Telugu", localization: "Dubbed", status: "ready", voiceover_url: null, duration_seconds: 15, updated_at: iso(1 * HR) },
    { id: "lv_mr", request_id: "r_12847", language: "Marathi", localization: "Subtitled", status: "ready", voiceover_url: null, duration_seconds: 15, updated_at: iso(40 * MIN) },
    { id: "lv_bn", request_id: "r_12847", language: "Bengali", localization: "Dubbed", status: "generating", voiceover_url: null, duration_seconds: null, updated_at: iso(1 * MIN) },
    { id: "lv_kn", request_id: "r_12847", language: "Kannada", localization: "Subtitled", status: "generating", voiceover_url: null, duration_seconds: null, updated_at: iso(1 * MIN) },
    { id: "lv_gu", request_id: "r_12847", language: "Gujarati", localization: null, status: "queued", voiceover_url: null, duration_seconds: null, updated_at: iso(1 * MIN) },
    { id: "lv_pa", request_id: "r_12847", language: "Punjabi", localization: null, status: "queued", voiceover_url: null, duration_seconds: null, updated_at: iso(1 * MIN) },
  ];

  // ── Publications for CF-12847 (already-published history) ──────────────────
  const publications = [
    { id: "pub_home", request_id: "r_12847", destination: "Homepage Banner", scheduled_at: null, status: "published" as const },
    { id: "pub_mall", request_id: "r_12847", destination: "Bajaj Mall Category", scheduled_at: null, status: "published" as const },
    { id: "pub_yt", request_id: "r_12847", destination: "YouTube Shorts", scheduled_at: null, status: "published" as const },
    { id: "pub_wall", request_id: "r_12847", destination: "Video Wall", scheduled_at: null, status: "published" as const },
  ];

  // ── Metrics for CF-12847 ──────────────────────────────────────────────────
  const languageMetrics: Metric[] = [
    { id: "m_hi", request_id: "r_12847", kind: "language", variant_label: "Hindi", platform: "All", views: 486_000, ctr: 5.2, watch_through: 78, conversions: 4120, captured_at: iso(1 * DAY) },
    { id: "m_ta", request_id: "r_12847", kind: "language", variant_label: "Tamil", platform: "All", views: 212_000, ctr: 4.8, watch_through: 74, conversions: 1680, captured_at: iso(1 * DAY) },
    { id: "m_te", request_id: "r_12847", kind: "language", variant_label: "Telugu", platform: "All", views: 198_000, ctr: 4.5, watch_through: 72, conversions: 1510, captured_at: iso(1 * DAY) },
    { id: "m_mr", request_id: "r_12847", kind: "language", variant_label: "Marathi", platform: "All", views: 164_000, ctr: 4.1, watch_through: 69, conversions: 980, captured_at: iso(1 * DAY) },
    { id: "m_bn", request_id: "r_12847", kind: "language", variant_label: "Bengali", platform: "All", views: 112_000, ctr: 3.9, watch_through: 66, conversions: 650, captured_at: iso(1 * DAY) },
  ];
  const channelMetrics: Metric[] = [
    { id: "mc_home", request_id: "r_12847", kind: "channel", variant_label: "Homepage Banner", platform: "Homepage Banner", views: 520_000, ctr: 5.0, watch_through: 75, conversions: 0, captured_at: iso(1 * DAY) },
    { id: "mc_mall", request_id: "r_12847", kind: "channel", variant_label: "Bajaj Mall Category", platform: "Bajaj Mall Category", views: 310_000, ctr: 4.6, watch_through: 71, conversions: 0, captured_at: iso(1 * DAY) },
    { id: "mc_yt", request_id: "r_12847", kind: "channel", variant_label: "YouTube Shorts", platform: "YouTube Shorts", views: 264_000, ctr: 4.4, watch_through: 68, conversions: 0, captured_at: iso(1 * DAY) },
    { id: "mc_wall", request_id: "r_12847", kind: "channel", variant_label: "Video Wall", platform: "Video Wall", views: 146_000, ctr: 4.2, watch_through: 70, conversions: 0, captured_at: iso(1 * DAY) },
  ];

  const monitoring_kpis: MonitoringKpi[] = [
    { id: "k_views", request_id: "r_12847", label: "Total Views", value: "1.24M", delta: "+18.2%", direction: "up", sub: "vs last period" },
    { id: "k_ctr", request_id: "r_12847", label: "Click-through Rate", value: "4.7%", delta: "+0.6%", direction: "up", sub: "vs last period" },
    { id: "k_conv", request_id: "r_12847", label: "Conversions", value: "8,940", delta: "+12.1%", direction: "up", sub: "vs last period" },
    { id: "k_watch", request_id: "r_12847", label: "Avg Watch Time", value: "11.3s", delta: "-1.4%", direction: "down", sub: "vs last period" },
  ];

  return {
    users,
    requests,
    briefs,
    formats,
    templates,
    prompts,
    scripts,
    assets,
    language_variants,
    publications,
    metrics: [...languageMetrics, ...channelMetrics],
    monitoring_kpis,
  };
}
