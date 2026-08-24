/* Testimonial records and the avatar-tint helper. Extracted from app/page.tsx
   so TestimonialsPanel and ScrollView share one list. Pure data. */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  /** Optional headshot path, e.g. "/images/testimonials/raissa.jpg".
      When present the avatar renders the photo; otherwise it falls back to the
      tinted-monogram avatar built from `initials`. */
  image?: string;
};

/** Deterministic hue (0-360) derived from initials so each person gets a
    stable, unique tint without us having to hand-pick colours. Used to softly
    tint the monogram avatar background when no headshot is present. */
export const hueFromInitials = (initials: string): number => {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = (hash * 31 + initials.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
};

export const testimonials: Testimonial[] = [
  { quote: "Arun possesses a remarkable understanding of user needs, seamlessly navigating between design strategy and hands-on execution. His strategic mindset significantly impacted our efforts to enhance retention metrics.", name: "Raissa Fichardo", role: "Director of UX", company: "FanCode", initials: "RF", image: "/images/testimonial/raissa-fichardo.webp" },
  { quote: "I was always impressed by his ability to simplify complex problems and create user-friendly designs. He's a thoughtful, strategic designer who balances business goals with user needs.", name: "Jeff Orshalick", role: "UX Design Manager", company: "Reputation", initials: "JO", image: "/images/testimonial/jeff-orshalick.avif" },
  { quote: "Arun has an exceptional understanding of design and the knack to draw relevant insights to identify the right problems. His business acumen combined with a user-first approach makes him an ideal UX lead.", name: "Vikas Kotian", role: "VP Product Design", company: "FanCode", initials: "VK", image: "/images/testimonial/vikas-kotian.jpeg" },
  { quote: "Arun embodies the core principles of exceptional UX research and design. Our collaboration on numerous uncertain projects highlighted his invaluable contributions. Arun not only drove the research but also championed the significance of user research.", name: "Nikhil Bhagya", role: "Product Manager", company: "Zetwerk", initials: "NB", image: "/images/testimonial/nikhil-bhagya.jpeg" },
  { quote: "During the short period we collaborated on the same project I noticed that Arun is very good at UX. As a developer I loved working on his vision. He was always very committed and focused. I was impressed by his UX and research skills.", name: "Bishal Biswas", role: "Engineer", company: "Atlassian", initials: "BB", image: "/images/testimonial/bishal-biswas.jpeg" },
];
