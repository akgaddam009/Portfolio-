import { notFound } from "next/navigation";

/* /system route removed from the live site. Originally this page rendered
   the "Portfolio Design Language" article (tokens, motion vocab, interaction
   patterns). The original implementation is preserved in git history and
   can be restored by reverting this file. */
export default function SystemPage() {
  notFound();
}
