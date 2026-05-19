import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentPersona } from "@/lib/persona-session";

/* Landing — sign-in or redirect to the persona's landing path.
   Server component; the persona cookie decides which way to route. */

export default async function Landing() {
  const persona = await getCurrentPersona();
  if (persona) redirect(persona.landingPath);
  return <LoginForm />;
}
