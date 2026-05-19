"use server";

import { redirect } from "next/navigation";
import { getPersonaByEmail } from "@/lib/personas";
import { clearPersonaCookie, setPersonaCookie } from "@/lib/persona-session";

/* Server actions for the demo login.

   Constant-time guards are deliberately *not* used here — this is a
   demo, the passwords are printed on the login page. Phase 3's
   real Clerk integration introduces actual credential safety. */

export type SignInResult =
  | { ok: true; landingPath: string }
  | { ok: false; error: "missing-fields" | "unknown-user" | "wrong-password" };

export async function signIn(formData: FormData): Promise<SignInResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "missing-fields" };
  }

  const persona = getPersonaByEmail(email);
  if (!persona) {
    return { ok: false, error: "unknown-user" };
  }
  if (persona.password !== password) {
    return { ok: false, error: "wrong-password" };
  }

  await setPersonaCookie(persona.id);
  return { ok: true, landingPath: persona.landingPath };
}

export async function signOut(): Promise<void> {
  await clearPersonaCookie();
  redirect("/");
}
