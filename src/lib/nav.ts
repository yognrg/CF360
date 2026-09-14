import type { Capability } from "@/lib/auth";

export interface NavItem {
  href: string;
  label: string;
  /** lucide-react icon name (resolved in the SideNav). */
  icon:
    | "LayoutGrid"
    | "SquarePen"
    | "Video"
    | "CircleCheckBig"
    | "Globe"
    | "Send"
    | "Activity";
  /** Capability required to see this item. */
  cap: Capability;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/pipeline", label: "Pipeline", icon: "LayoutGrid", cap: "view_pipeline" },
  { href: "/pre-production/brief", label: "Pre-production", icon: "SquarePen", cap: "act_pipeline" },
  { href: "/production", label: "Production", icon: "Video", cap: "act_pipeline" },
  { href: "/lead-review", label: "Lead Review", icon: "CircleCheckBig", cap: "act_pipeline" },
  { href: "/vernacular", label: "Vernacular", icon: "Globe", cap: "act_pipeline" },
  { href: "/publishing", label: "Publishing", icon: "Send", cap: "act_pipeline" },
  { href: "/monitoring", label: "Monitoring", icon: "Activity", cap: "act_pipeline" },
];
