export type ProgramCategory =
  | 'Education'
  | 'Health'
  | 'Water & Sanitation'
  | 'Economic Empowerment'
  | 'Community Development';

export type ProgramFocus = 'pan-africa' | 'volta';

export interface ProgramImpactMetric {
  label: string;
  value: string;
  description?: string;
  trend?: string;
}

export interface ProgramCallToAction {
  label: string;
  href: string;
  tone: 'primary' | 'secondary';
  description?: string;
}

export interface ProgramDetail {
  slug: string;
  title: string;
  category: ProgramCategory;
  focus: ProgramFocus;
  summary: string;
  excerpt: string;
  heroImage: string;
  spotlightStatistic: string;
  highlightQuote: {
    quote: string;
    attribution: string;
  };
  outcomes: string[];
  narrative: string[];
  gallery: { src: string; alt: string }[];
  ctas: ProgramCallToAction[];
}

export interface RegionFocus {
  id: ProgramFocus;
  name: string;
  hero: {
    image: string;
    alt: string;
  };
  description: string;
  priorities: string[];
  stats: { label: string; value: string }[];
}

export interface ProgramsPayload {
  categories: ProgramCategory[];
  programs: ProgramDetail[];
  regions: RegionFocus[];
  impactMetrics: ProgramImpactMetric[];
}

export const categories: ProgramCategory[] = [
  'Education',
  'Health',
  'Water & Sanitation',
  'Economic Empowerment',
  'Community Development'
];

export const programs: ProgramDetail[] = [
  {
    slug: 'education-rising',
    title: 'Education Rising Labs',
    category: 'Education',
    focus: 'pan-africa',
    summary:
      'Connected learning labs blending solar-powered classrooms, digital curricula, and mentorship to unlock future-ready skills across the continent.',
    excerpt:
      'From Cape Coast to Kigali, Education Rising equips youth with STEAM pathways through solar classrooms and community-led mentorship.',
    heroImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
    spotlightStatistic: '18,450 learners enrolled in blended classrooms',
    highlightQuote: {
      quote:
        'When the solar hub arrived our students saw coding as a real option. They now teach their siblings what they learn each weekend.',
      attribution: 'Adjoa K., Headmistress — Cape Coast, Ghana'
    },
    outcomes: [
      '62 solar-powered learning labs deployed with local energy partners',
      'Continental mentor network connecting 480 professionals with classrooms',
      'Curriculum scholarships prioritising girls and students with disabilities'
    ],
    narrative: [
      'Education Rising Labs bring resilient infrastructure and inclusive pedagogy together. Each lab is co-designed with community boards to ensure cultural resonance and long-term stewardship.',
      'Students access hybrid curriculum modules in STEAM, creative arts, and entrepreneurship. Weekly mentor sessions pair them with industry leaders across Africa and the diaspora, creating real pathways to opportunity.',
      'Foundational to every deployment is local ownership—school leaders receive training in maintenance, curriculum facilitation, and alumni mobilisation to keep the ecosystem thriving.'
    ],
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=80',
        alt: 'Students collaborating around laptops in a classroom'
      },
      {
        src: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=900&q=80',
        alt: 'Solar panels powering a rural school'
      },
      {
        src: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80',
        alt: 'Mentor working with students in a lab environment'
      }
    ],
    ctas: [
      {
        label: 'Sponsor a Lab',
        href: '#donate',
        tone: 'primary',
        description: 'Fund equipment and facilitator training for an Education Rising site.'
      },
      {
        label: 'Mentor a Cohort',
        href: 'mailto:partnerships@mawu.org',
        tone: 'secondary',
        description: 'Share your expertise with emerging innovators across Africa.'
      }
    ]
  },
  {
    slug: 'volta-health-grid',
    title: 'Volta Health Grid',
    category: 'Health',
    focus: 'volta',
    summary:
      'Mobile clinics and telehealth corridors linking fishing villages and farming communities with preventative and maternal healthcare.',
    excerpt:
      'The Volta Health Grid keeps care within reach through mobile teams, drone diagnostics, and trusted community doulas.',
    heroImage: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=1600&q=80',
    spotlightStatistic: '5,200 patients receiving monthly continuity of care',
    highlightQuote: {
      quote:
        'Before the clinic boat we travelled two days for checkups. Now the nurses arrive every market day and my baby has never missed a visit.',
      attribution: 'Esi D., Mother — Anloga, Ghana'
    },
    outcomes: [
      'Three solar-powered clinic boats servicing 18 hard-to-reach communities',
      'Telehealth nodes enabling 24/7 specialist support for local nurses',
      'Maternal health fellowship training 60 doulas and midwives from Volta villages'
    ],
    narrative: [
      'The Volta Health Grid reimagines primary care delivery by combining mobile clinic boats, AI-assisted triage, and community doulas rooted in local trust.',
      'Each visit pairs preventative screenings with nutrition support, mental health circles, and referrals to regional hospitals when advanced care is required.',
      'Data insights feed back into district health planning, helping target resources while respecting community governance.'
    ],
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80',
        alt: 'Community members boarding a mobile clinic boat'
      },
      {
        src: 'https://images.unsplash.com/photo-1526250580230-69bdbfd64d97?auto=format&fit=crop&w=900&q=80',
        alt: 'Nurse providing maternal care to a patient'
      },
      {
        src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
        alt: 'Telehealth station inside a clinic'
      }
    ],
    ctas: [
      {
        label: 'Equip a Clinic Boat',
        href: '#donate',
        tone: 'primary',
        description: 'Underwrite diagnostics, medicines, and cold storage for a season.'
      },
      {
        label: 'Join the Health Collective',
        href: 'https://cal.com/mawu-foundation/partnerships',
        tone: 'secondary',
        description: 'Co-design lasting health infrastructure with Mawu teams.'
      }
    ]
  },
  {
    slug: 'water-sunrise-network',
    title: 'Water Sunrise Network',
    category: 'Water & Sanitation',
    focus: 'volta',
    summary:
      'Rainwater harvesting towers, community filtration kiosks, and youth-led maintenance guilds securing safe water access.',
    excerpt:
      'The Sunrise Network unlocks safe water through hybrid infrastructure and paid youth stewardship.',
    heroImage: 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&w=1600&q=80',
    spotlightStatistic: '11,700 households gaining reliable drinking water',
    highlightQuote: {
      quote:
        'We never imagined the rain could serve us year-round. Our youth guild now manages the tower and reinvests in scholarships.',
      attribution: 'Chief Kpodo, Community Elder — Sogakope, Ghana'
    },
    outcomes: [
      '28 modular harvesting towers with IoT sensors for proactive maintenance',
      'Community kiosks reducing water-borne illnesses by 63% within nine months',
      'Youth guild stipends funding local entrepreneurship and apprenticeships'
    ],
    narrative: [
      'Water Sunrise Network pairs elegant engineering with community entrepreneurship. Towers capture rainfall, filter it through multi-stage systems, and store reserves for the dry season.',
      'Youth guilds receive training in maintenance, financial literacy, and customer service. Revenue from sliding-scale kiosks supports scholarships and micro-grants.',
      'Our data dashboard shares water quality metrics with district assemblies, building transparency and resilience.'
    ],
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
        alt: 'Children collecting clean water from a community kiosk'
      },
      {
        src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
        alt: 'Rainwater harvesting tower at dusk'
      },
      {
        src: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80',
        alt: 'Youth guild maintaining filtration equipment'
      }
    ],
    ctas: [
      {
        label: 'Fund a Water Tower',
        href: '#donate',
        tone: 'primary',
        description: 'Support construction, training, and maintenance for a full season.'
      },
      {
        label: 'Explore Partnership',
        href: 'mailto:water@mawu.org',
        tone: 'secondary',
        description: 'Bring your organisation into the Sunrise Network consortium.'
      }
    ]
  },
  {
    slug: 'community-lightwork',
    title: 'Community Lightwork Studios',
    category: 'Economic Empowerment',
    focus: 'pan-africa',
    summary:
      'Creative entrepreneurship hubs pairing microfinance, design labs, and cooperative marketplaces to scale local ventures.',
    excerpt:
      'Lightwork Studios spark livelihoods via maker labs, cooperative capital, and continent-wide distribution partners.',
    heroImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1600&q=80',
    spotlightStatistic: '3,400 artisans growing income by an average of 41%',
    highlightQuote: {
      quote: 'We sold out our first pan-African collection within a week thanks to Mawu’s marketplace guild.',
      attribution: 'Noxolo M., Designer — Johannesburg, South Africa'
    },
    outcomes: [
      'Maker labs equipped with textile, ceramics, and digital fabrication tools',
      'Rotating capital funds providing low-interest growth loans to cooperatives',
      'Marketplace alliances connecting artisans with ethical global buyers'
    ],
    narrative: [
      'Lightwork Studios were born from listening to creative entrepreneurs seeking equitable pathways to scale. Each studio is rooted in local aesthetics while offering access to cutting-edge production tools.',
      'Business clinics mentor founders in branding, finance, and export readiness. Cooperative governance keeps ownership in community hands.',
      'Showcase events and digital marketplaces celebrate artisanship, telling the stories behind every piece and reinvesting profits locally.'
    ],
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80',
        alt: 'Artisan shaping clay in a studio'
      },
      {
        src: 'https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=900&q=80',
        alt: 'Designer reviewing textile patterns'
      },
      {
        src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
        alt: 'Market showcasing artisan goods'
      }
    ],
    ctas: [
      {
        label: 'Back a Creative Fellow',
        href: '#donate',
        tone: 'primary',
        description: 'Sponsor equipment, studio time, and business coaching for artisans.'
      },
      {
        label: 'Host a Pop-Up',
        href: 'https://cal.com/mawu-foundation/partnerships',
        tone: 'secondary',
        description: 'Bring Lightwork talent to your city through collaborative showcases.'
      }
    ]
  },
  {
    slug: 'volta-village-homes',
    title: 'Volta Village Homes',
    category: 'Community Development',
    focus: 'volta',
    summary:
      'Climate-smart housing cooperatives with shared childcare, food forests, and microgrids uplifting multi-generational families.',
    excerpt:
      'Village Homes weave together housing, childcare, and regenerative agriculture to strengthen family resilience.',
    heroImage: 'https://images.unsplash.com/photo-1507081323647-4d250478b919?auto=format&fit=crop&w=1600&q=80',
    spotlightStatistic: '420 families transitioning into resilient housing cooperatives',
    highlightQuote: {
      quote: 'Our homes now stay cool without generators and the food forest keeps the pantry full even during lean months.',
      attribution: 'Selorm A., Cooperative Member — Keta, Ghana'
    },
    outcomes: [
      'Passive-cooling homes reducing energy needs by 37%',
      'Community childcare collectives staffed by trained early childhood educators',
      'Agroforestry plots feeding households and providing surplus for market days'
    ],
    narrative: [
      'Volta Village Homes emerged from community listening circles seeking dignified housing without displacement. Designs honor local aesthetics while embedding green technologies.',
      'Each cooperative governs shared assets—from cold storage to community kitchens—through inclusive councils with youth and elder representation.',
      'Regenerative agriculture plots surround the homes, offering nutrition security and livelihood opportunities through agro-processing.'
    ],
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
        alt: 'Families gathering outside eco-friendly homes'
      },
      {
        src: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?auto=format&fit=crop&w=900&q=80',
        alt: 'Community members tending to a food forest'
      },
      {
        src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
        alt: 'Microgrid solar panels near a village'
      }
    ],
    ctas: [
      {
        label: 'Underwrite a Cooperative',
        href: '#donate',
        tone: 'primary',
        description: 'Help families unlock safe housing, childcare, and resilient food systems.'
      },
      {
        label: 'Design With Us',
        href: 'mailto:design@mawu.org',
        tone: 'secondary',
        description: 'Architects and planners can co-create the next generation of Village Homes.'
      }
    ]
  }
];

export const regions: RegionFocus[] = [
  {
    id: 'pan-africa',
    name: 'Pan-African Network',
    hero: {
      image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
      alt: 'Satellite view of the African continent at dusk'
    },
    description:
      'Mawu Foundation designs continent-scale blueprints in partnership with grassroots organisations, governments, and creative collectives spanning 14 countries.',
    priorities: [
      'Scale Education Rising Labs into East and Southern Africa',
      'Expand Lightwork Studios cooperative marketplaces',
      'Publish open-source toolkits for policy and community adoption'
    ],
    stats: [
      { label: 'Countries engaged', value: '14' },
      { label: 'Active partner orgs', value: '63' },
      { label: 'Continental fellows', value: '280' }
    ]
  },
  {
    id: 'volta',
    name: 'Volta Region, Ghana',
    hero: {
      image: 'https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&fit=crop&w=1600&q=80',
      alt: 'Lush landscape of the Volta Region in Ghana'
    },
    description:
      'Our seasonal spotlight channels resources into Volta communities along the coast and inland valleys, co-creating health, water, education, and housing solutions with local leaders.',
    priorities: [
      'Strengthen the Volta Health Grid mobile clinic schedule',
      'Commission additional Water Sunrise towers before the dry season',
      'Complete phase two of Village Homes cooperatives in Keta and Akatsi'
    ],
    stats: [
      { label: 'Communities engaged', value: '26' },
      { label: 'Seasonal teammates', value: '140' },
      { label: 'Volunteer hours', value: '18K' }
    ]
  }
];

export const impactMetrics: ProgramImpactMetric[] = [
  {
    label: 'Lives directly impacted',
    value: '52,690',
    trend: '+18% vs. last quarter',
    description: 'Individuals accessing education, health, housing, and water services.'
  },
  {
    label: 'Local jobs sustained',
    value: '1,420',
    trend: '+9% vs. last quarter',
    description: 'Community members employed through co-ops, clinics, and youth guilds.'
  },
  {
    label: 'Infrastructure projects active',
    value: '87',
    trend: '+12 new this season',
    description: 'Schools, clinics, water systems, and housing sites currently operating.'
  },
  {
    label: 'Stories documented',
    value: '134',
    trend: 'New field reports weekly',
    description: 'First-person updates published across our impact storytelling channels.'
  }
];

export const programsPayload: ProgramsPayload = {
  categories,
  programs,
  regions,
  impactMetrics
};
