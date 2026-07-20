import {
  Shield,
  Bug,
  Radar,
  Cloud,
  Scale,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Phases                                                              */
/* ------------------------------------------------------------------ */

export type PhaseStatus = "active" | "locked" | "pending";

export interface Phase {
  id: number;
  title: string;
  status: PhaseStatus;
  focus: string[];
  project?: string;
  icon: LucideIcon;
}

export const PHASES: Phase[] = [
  {
    id: 0,
    title: "Foundation",
    status: "active",
    focus: ["CompTIA Security+ (SY0-701)", 'TryHackMe "Cyber Security 101"'],
    icon: Shield,
  },
  {
    id: 1,
    title: "AppSec & Web Security",
    status: "locked",
    focus: ["PortSwigger Web Security Academy", "OWASP Top 10"],
    project: "MarginFlow Hardening (RLS, Rate Limiting)",
    icon: Bug,
  },
  {
    id: 2,
    title: "OT/ICS Security",
    status: "locked",
    focus: ["IEC 62443", "ICS/SCADA basics"],
    icon: Radar,
  },
  {
    id: 3,
    title: "Cloud Security",
    status: "locked",
    focus: ["Microsoft SC-900 → AZ-104"],
    icon: Cloud,
  },
  {
    id: 4,
    title: "GRC Literacy",
    status: "pending",
    focus: ["NIST CSF 2.0", "ISO 27001"],
    icon: Scale,
  },
];

/* ------------------------------------------------------------------ */
/* SY0-701 exam domains (official exam weightings)                     */
/* ------------------------------------------------------------------ */

export interface Domain {
  id: string;
  code: string;
  name: string;
  weight: number;
  summary: string;
  topics: string[];
}

export const SY0701_DOMAINS: Domain[] = [
  {
    id: "1",
    code: "1.0",
    name: "General Security Concepts",
    weight: 12,
    summary:
      "The vocabulary of the trade: control categories, core security principles and the cryptographic building blocks everything else relies on.",
    topics: [
      "Security control categories & types",
      "CIA triad, non-repudiation, AAA",
      "Zero Trust concepts",
      "Physical security",
      "Cryptography: PKI, encryption, hashing, certificates",
    ],
  },
  {
    id: "2",
    code: "2.0",
    name: "Threats, Vulnerabilities & Mitigations",
    weight: 22,
    summary:
      "Who attacks, how they get in and what you do about it — threat actors, attack surfaces, vulnerability classes and mitigation techniques.",
    topics: [
      "Threat actors & motivations",
      "Attack surfaces & vectors",
      "Vulnerability types (app, OS, web, cloud, supply chain)",
      "Malware & indicators of malicious activity",
      "Mitigation techniques",
    ],
  },
  {
    id: "3",
    code: "3.0",
    name: "Security Architecture",
    weight: 18,
    summary:
      "Designing systems that are hard to break: infrastructure models, secure enterprise architecture, data protection and resilience.",
    topics: [
      "Architecture models: cloud, IaC, virtualization, IoT/OT",
      "Securing enterprise infrastructure",
      "Data protection concepts & strategies",
      "Resilience & recovery (HA, backups, DR)",
    ],
  },
  {
    id: "4",
    code: "4.0",
    name: "Security Operations",
    weight: 28,
    summary:
      "The biggest domain — day-to-day defense: hardening, vulnerability management, monitoring, IAM, incident response and automation.",
    topics: [
      "Hardening & baseline configuration",
      "Asset & vulnerability management",
      "Monitoring, logging & alerting",
      "Identity & access management",
      "Incident response & digital forensics",
      "Automation & orchestration",
    ],
  },
  {
    id: "5",
    code: "5.0",
    name: "Security Program Management & Oversight",
    weight: 20,
    summary:
      "The governance layer: risk management, third-party risk, compliance, audits and building a security-aware organization.",
    topics: [
      "Security governance (policies, standards, procedures)",
      "Risk management processes",
      "Third-party risk assessment",
      "Compliance & audits",
      "Security awareness practices",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* localStorage keys & progress helpers                                */
/* ------------------------------------------------------------------ */

export type Checklist = Record<string, boolean>;

export const CHECKLIST_STORAGE_KEY = "cyber-tracker.sy0701.checklist";

export const noteStorageKey = (domainId: string) =>
  `cyber-tracker.notes.sy0701.${domainId}`;

/** Phase 0 progress in %, weighted by official exam domain percentages. */
export function phase0Progress(checklist: Checklist): number {
  return SY0701_DOMAINS.reduce(
    (acc, d) => acc + (checklist[d.id] ? d.weight : 0),
    0
  );
}

/** Each of the 5 phases contributes 20% to the global roadmap. */
export function globalProgress(checklist: Checklist): number {
  return phase0Progress(checklist) / 5;
}
