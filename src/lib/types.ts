/** Domain model for CF360. snake_case fields mirror the data-store rows. */

export type Role = "raiser" | "producer" | "admin";

export type Stage =
  | "pipeline"
  | "pre_production"
  | "production"
  | "lead_review"
  | "vernacular"
  | "publishing"
  | "monitoring";

export const STAGE_ORDER: Stage[] = [
  "pipeline",
  "pre_production",
  "production",
  "lead_review",
  "vernacular",
  "publishing",
  "monitoring",
];

export const STAGE_LABELS: Record<Stage, string> = {
  pipeline: "Pipeline",
  pre_production: "Pre-production",
  production: "Production",
  lead_review: "Lead Review",
  vernacular: "Vernacular",
  publishing: "Publishing",
  monitoring: "Monitoring",
};

export type Priority = "high" | "medium" | "low";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar_url: string | null;
  created_at: string;
}

export interface Request {
  id: string;
  cf_id: string; // e.g. CF-12847
  vid_id: string;
  product: string;
  category: string;
  landing_url: string;
  stage: Stage;
  priority: Priority;
  status_label: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Brief {
  id: string;
  request_id: string;
  product_info: Record<string, unknown>;
  seo_info: Record<string, unknown>;
  audio_intelligence: Record<string, unknown>;
  source: "auto_filled" | "manual";
}

export interface Format {
  id: string;
  name: string;
  aspect_ratio: string; // e.g. 9:16
  duration_range: string;
  usage_guidelines: Record<string, unknown>;
  dos: string[];
  donts: string[];
}

export interface TemplateSpecs {
  resolution: string;
  duration: string;
  editable_layers: number;
  text_slots: number;
  image_slots: number;
  brand_locked: boolean;
}

export interface Template {
  id: string;
  format_id: string;
  name: string;
  specs: TemplateSpecs;
  reference_video_url: string | null;
  adobe_files: { name: string; size_bytes: number; type: string }[];
}

export interface PromptScores {
  compliment: number;
  brand: number;
  hook: number;
  template: number;
  usp: number;
  platform: number;
}

export interface Prompt {
  id: string;
  request_id: string;
  text: string;
  scores: PromptScores;
  total_score: number;
  passed: boolean;
  version: number;
  created_at: string;
}

export interface ScriptBeat {
  beat: string;
  visual: string;
  voiceover: string;
  duration: number; // seconds
}

export interface Script {
  id: string;
  request_id: string;
  beats: ScriptBeat[];
  regenerations_used: number; // max 3
}

export type AssetStatus = "generating" | "generated" | "failed";

export interface Asset {
  id: string;
  request_id: string;
  file_url: string | null;
  duration_seconds: number | null;
  size_bytes: number | null;
  resolution: string | null;
  status: AssetStatus;
}

export type VariantStatus =
  | "master"
  | "ready"
  | "generating"
  | "queued"
  | "failed";

export interface LanguageVariant {
  id: string;
  request_id: string;
  language: string;
  status: VariantStatus;
  voiceover_url: string | null;
  duration_seconds: number | null;
}

export type PublicationStatus = "scheduled" | "published" | "failed";

export interface Publication {
  id: string;
  request_id: string;
  destination: string; // homepage, video_wall, youtube, instagram
  scheduled_at: string | null;
  status: PublicationStatus;
}

export interface Metric {
  id: string;
  request_id: string;
  variant_label: string;
  platform: string;
  views: number;
  ctr: number;
  watch_through: number;
  conversions: number;
  captured_at: string;
}

export interface Database {
  users: User[];
  requests: Request[];
  briefs: Brief[];
  formats: Format[];
  templates: Template[];
  prompts: Prompt[];
  scripts: Script[];
  assets: Asset[];
  language_variants: LanguageVariant[];
  publications: Publication[];
  metrics: Metric[];
}
