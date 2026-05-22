import { notFound } from "next/navigation";

/* /astra route removed from the live site. Originally this page rendered
   the Astra microsite index (Indemn demo). The original implementation is
   preserved in git history and can be restored by reverting this file. */
export default function AstraIndex() {
  notFound();
}
