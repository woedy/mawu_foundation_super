export interface TransparencyResource {
  id: string;
  title: string;
  description: string;
  category: 'Financials' | 'Governance' | 'Partners';
  year: string;
  url: string;
}


export const transparencyResources: TransparencyResource[] = [
  {
    id: 'fy2023-impact-report',
    title: 'FY2023 Impact & Financial Report',
    description:
      'Audited statements, independent reviews, and programmatic spending covering our operations across Africa.',
    category: 'Financials',
    year: '2023',
    url: 'https://mawufoundation.org/reports/fy2023-impact.pdf'
  },
  {
    id: 'governance-charter',
    title: 'Governance Charter & Board Directory',
    description:
      'Bylaws, safeguarding policies, and board & advisory council roster with biographies and terms of service.',
    category: 'Governance',
    year: 'Updated Q3 2024',
    url: 'https://mawufoundation.org/transparency/governance-charter.pdf'
  },
  {
    id: 'volta-partnership-ledger',
    title: 'Volta Region Partner & Vendor Ledger',
    description:
      'All local cooperatives, artisans, clinics, and municipal offices contracted for our current Volta initiatives.',
    category: 'Partners',
    year: '2024 Season',
    url: 'https://mawufoundation.org/transparency/volta-partners.pdf'
  }
];
