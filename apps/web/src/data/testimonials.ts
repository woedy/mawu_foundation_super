export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  highlight: string;
  avatar: string;
  segment: "donor" | "volunteer" | "beneficiary";
}

export const testimonials: Testimonial[] = [
  {
    id: "donor-ama",
    name: "Ama Owusu",
    role: "Recurring Donor Circle Host",
    location: "Accra, Ghana",
    segment: "donor",
    highlight:
      "Within six months my circle funded two solar labs now serving 180 learners.",
    quote:
      "What keeps me giving is the radical transparency. Every month I join live field briefings and watch our contributions unlock opportunities our families dreamt about for generations.",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "volunteer-kwesi",
    name: "Kwesi Adum",
    role: "Community Health Volunteer",
    location: "Sogakope, Ghana",
    segment: "volunteer",
    highlight:
      "Our mobile clinic now reaches eight river communities every week.",
    quote:
      "I joined as a data volunteer but stayed because neighbours now receive care without leaving their fishing shifts. We log outcomes on tablets and see improvements in real time.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "beneficiary-esinam",
    name: "Esinam Agbeko",
    role: "Creative Economy Studio Apprentice",
    location: "Kpando, Ghana",
    segment: "beneficiary",
    highlight:
      "My designs now ship with every Mawu tote, funding tuition for three cousins.",
    quote:
      "We co-create products with designers worldwide. The revenue-share model means we finally save, invest, and keep storytelling rooted in our communities.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
];
