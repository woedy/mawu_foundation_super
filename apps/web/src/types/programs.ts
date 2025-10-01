export type ProgramCategory =
  | 'Education'
  | 'Health'
  | 'Water & Sanitation'
  | 'Economic Empowerment'
  | 'IT & Digital Literacy'
  | 'Community Development';

export type ProgramFocus = 'pan-africa' | 'volta';

export type ProgramImpactMetric = {
  label: string;
  value: string;
  description?: string;
  trend?: string;
};

export type ProgramCallToAction = {
  label: string;
  href: string;
  tone: 'primary' | 'secondary';
  description?: string;
};

export type ProgramDetail = {
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
};

export type RegionFocus = {
  id: ProgramFocus;
  name: string;
  hero: {
    image: string;
    alt: string;
  };
  description: string;
  priorities: string[];
  stats: { label: string; value: string }[];
};

export type ProgramFilter = ProgramCategory | 'All';

export type ProgramsPayload = {
  categories: ProgramCategory[];
  programs: ProgramDetail[];
  regions: RegionFocus[];
  impactMetrics: ProgramImpactMetric[];
};

export type ProgramRegion = RegionFocus;
export type ProgramMetric = ProgramImpactMetric;
