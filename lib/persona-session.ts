import { cookies } from "next/headers";
import { getPersonaById, type Persona, type PersonaId } from "./personas";

export const PERSONA_COOKIE = "uw-persona";
const ONE_WEEK = 60 * 60 * 24 * 7;

export async function getCurrentPersona(): Promise<Persona | null> {
  const store = await cookies();
  const id = store.get(PERSONA_COOKIE)?.value;
  return getPersonaById(id);
}

export async function setPersonaCookie(id: PersonaId): Promise<void> {
  const store = await cookies();
  store.set(PERSONA_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK,
  });
}

export async function clearPersonaCookie(): Promise<void> {
  const store = await cookies();
  store.delete(PERSONA_COOKIE);
}
