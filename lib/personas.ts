export type PersonaId = "underwriter" | "approver" | "cpa" | "sales";
export type PersonaAccent = "indigo" | "amber" | "emerald" | "rose";

export type Persona = {
  id: PersonaId;
  name: string;
  email: string;
  password: string;
  role: string;
  tagline: string;
  landingPath: string;
  initials: string;
  accent: PersonaAccent;
};

export const PERSONAS: Record<PersonaId, Persona> = {
  underwriter: { id: "underwriter", name: "Kushagra Chawla", email: "kushagra.c@zetwerk.com", password: "underwriter", role: "Credit Underwriter", tagline: "Reviews documents, drafts the proposal note, sets the recommendation.", landingPath: "/inbox", initials: "KC", accent: "indigo" },
  approver:    { id: "approver",    name: "Sukesh P",         email: "sukesh.p@zetwerk.com",   password: "approver",    role: "Credit Approver / Head", tagline: "Reviews and signs off on proposals. Approves on mobile between meetings.", landingPath: "/inbox", initials: "SP", accent: "emerald" },
  cpa:         { id: "cpa",         name: "Manoj Kumar",      email: "manoj.k@zetwerk.com",    password: "cpa",         role: "Credit Process Associate", tagline: "Verifies documents are present and consistent before the underwriter sees them.", landingPath: "/inbox", initials: "MK", accent: "amber" },
  sales:       { id: "sales",       name: "Yash Prakash Thakkar", email: "yash.thakkar@zetwerk.com", password: "sales",   role: "BU Sales", tagline: "Originates credit requests for vendors in their business unit.", landingPath: "/inbox", initials: "YT", accent: "rose" },
};

export function getPersonaByEmail(email: string): Persona | null {
  const normalized = email.trim().toLowerCase();
  return Object.values(PERSONAS).find(p => p.email.toLowerCase() === normalized) ?? null;
}

export function getPersonaById(id: string | undefined | null): Persona | null {
  if (!id) return null;
  return PERSONAS[id as PersonaId] ?? null;
}

export const accentClasses: Record<PersonaAccent, { bg: string; border: string; text: string; fg: string }> = {
  indigo:  { bg: "bg-ai-soft",                border: "border-ai-border",                text: "text-ai",                fg: "bg-ai text-background" },
  amber:   { bg: "bg-signal-caution-bg",      border: "border-signal-caution/40",        text: "text-signal-caution",    fg: "bg-signal-caution text-background" },
  emerald: { bg: "bg-signal-positive-bg",     border: "border-signal-positive/40",       text: "text-signal-positive",   fg: "bg-signal-positive text-background" },
  rose:    { bg: "bg-signal-blocking-bg",     border: "border-signal-blocking/40",       text: "text-signal-blocking",   fg: "bg-signal-blocking text-background" },
};
