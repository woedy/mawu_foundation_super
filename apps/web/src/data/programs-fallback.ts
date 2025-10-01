import type { ProgramsPayload } from '../types/programs';

export const fallbackProgramsPayload: ProgramsPayload = {
  categories: [
    'Education',
    'Health',
    'Water & Sanitation',
    'Economic Empowerment',
    'IT & Digital Literacy',
    'Community Development'
  ],
  regions: [
    {
      id: 'volta',
      name: 'Volta Region, Ghana',
      hero: {
        image:
          'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=1600&q=80',
        alt: 'Community members in Ghana smiling together outdoors'
      },
      description:
        'Seasonal focus on providing safe water, primary healthcare, and learning resources across riverine communities.',
      priorities: [
        'Install 12 solar-powered boreholes',
        'Launch mobile health outreaches to island villages',
        'Provide STEM learning kits for 1,500 students'
      ],
      stats: [
        { label: 'Communities Engaged', value: '26' },
        { label: 'Impact Ambassadors', value: '180+' },
        { label: 'Funding Need', value: '$450k' }
      ]
    },
    {
      id: 'pan-africa',
      name: 'Pan-African Vision',
      hero: {
        image:
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
        alt: 'Sunrise over the African continent'
      },
      description:
        'Long-term roadmap scaling proven interventions across West, East, and Southern Africa in partnership with local leaders.',
      priorities: [
        'Expand partner network across 15 countries',
        'Equip community responders with digital tools',
        'Co-design culturally grounded climate resilience programs'
      ],
      stats: [
        { label: 'Countries Engaged', value: '12' },
        { label: 'Community Projects', value: '64' },
        { label: 'Volunteers', value: '2,400' }
      ]
    }
  ],
  impactMetrics: [
    {
      label: 'Learners supported',
      value: '12,480',
      description: 'Books, tablets, and mentorship reaching students across Ghana, Nigeria, and Kenya',
      trend: '+18% YoY'
    },
    {
      label: 'Clinics equipped',
      value: '42',
      description: 'Primary care and maternal health facilities stocked with essential supplies',
      trend: '+9% YoY'
    },
    {
      label: 'Water access restored',
      value: '71,000+',
      description: 'People benefiting from boreholes, filtration systems, and rainwater harvesting'
    }
  ],
  programs: [
    {
      slug: 'volta-learning-labs',
      title: 'Volta Learning Labs',
      category: 'Education',
      focus: 'volta',
      summary:
        'Transforming riverside classrooms into digital hubs where students co-create climate-ready solutions.',
      excerpt:
        'Floating solar classrooms deliver STEM kits, tablets, and mentorship so island learners can thrive without leaving their communities.',
      heroImage:
        'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80',
      spotlightStatistic: '1,500 students receiving STEM kits in 2024',
      highlightQuote: {
        quote: 'My daughter now teaches her classmates how to code energy-saving lights.',
        attribution: 'Esi, parent and market trader'
      },
      outcomes: [
        'Deploy 6 floating solar classrooms with offline-first curriculum',
        'Train 40 local facilitators in inclusive STEM education',
        'Provide scholarships for 120 girls pursuing engineering fields'
      ],
      narrative: [
        'Volta Learning Labs retrofit river boats into mobile classrooms, bridging the digital divide for island communities.',
        'Community elders co-design each curriculum sprint to ensure cultural traditions and local languages remain central.',
        'Graduates join the Future Builders collective, receiving mentorship to prototype climate solutions for their villages.'
      ],
      gallery: [
        {
          src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
          alt: 'Students collaborating in a bright classroom'
        },
        {
          src: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
          alt: 'Volunteer mentor guiding students through a robotics project'
        }
      ],
      ctas: [
        {
          label: 'Fund a Learning Lab',
          href: '/donate?designation=learning-labs',
          tone: 'primary'
        },
        {
          label: 'Mentor Learners',
          href: '/get-involved/volunteer',
          tone: 'secondary',
          description: 'Share STEM expertise remotely or on-site.'
        }
      ]
    },
    {
      slug: 'riverine-health-bridge',
      title: 'Riverine Health Bridge',
      category: 'Health',
      focus: 'volta',
      summary:
        'Mobile clinics navigating the Volta River to deliver maternal care, telehealth, and emergency response.',
      excerpt:
        'Nurse navigators, solar refrigeration, and drone-supported lab samples bring modern care to hard-to-reach islands.',
      heroImage:
        'https://images.unsplash.com/photo-1498550744921-75f79806b8a7?auto=format&fit=crop&w=1600&q=80',
      spotlightStatistic: '820 maternal care visits completed since January',
      highlightQuote: {
        quote: 'We now receive prenatal check-ups without crossing dangerous waters.',
        attribution: 'Adjoa, fisher and expectant mother'
      },
      outcomes: [
        'Launch 3 mobile clinics with onboard ultrasound and pharmacy services',
        'Train 60 community health workers in remote diagnostics',
        'Establish emergency referral network with regional hospitals'
      ],
      narrative: [
        'Health Bridge vessels operate on hybrid solar engines to minimize emissions while traveling the river delta.',
        'Remote diagnostic kits sync with partner hospitals to provide same-day lab insights.',
        'Community health workers receive monthly stipends funded by recurring donors.'
      ],
      gallery: [
        {
          src: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
          alt: 'Healthcare worker providing maternal care'
        },
        {
          src: 'https://images.unsplash.com/photo-1529900748607-902dc7971e9d?auto=format&fit=crop&w=1200&q=80',
          alt: 'Medical team on a boat clinic preparing supplies'
        }
      ],
      ctas: [
        {
          label: 'Sponsor a Clinic Day',
          href: '/donate?designation=health-bridge',
          tone: 'primary'
        },
        {
          label: 'Join Medical Corps',
          href: '/get-involved/volunteer',
          tone: 'secondary',
          description: 'Volunteer specialists for short-term missions.'
        }
      ]
    },
    {
      slug: 'pan-african-water-guardians',
      title: 'Pan-African Water Guardians',
      category: 'Water & Sanitation',
      focus: 'pan-africa',
      summary:
        'Scaling solar boreholes, smart monitoring, and climate-resilient sanitation across drought-prone regions.',
      excerpt:
        'Guardians blend indigenous knowledge with IoT sensors to keep community water points safe, sustainable, and locally owned.',
      heroImage:
        'https://images.unsplash.com/photo-1568413612146-c687f9747846?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      spotlightStatistic: '71,000+ people with reliable drinking water',
      highlightQuote: {
        quote: 'For the first time we can track water levels before the dry season hits.',
        attribution: 'Naledi, Water Steward, Botswana'
      },
      outcomes: [
        'Install remote sensors across 140 boreholes with open dashboards',
        'Train 200 youth apprentices in pump maintenance',
        'Deploy eco-sanitation pilots in 20 peri-urban settlements'
      ],
      narrative: [
        'Regional innovation labs co-design new approaches with elders, youth, and engineers.',
        'Data cooperatives share usage analytics, improving funding transparency.',
        'Community-owned tariffs reinvest in stewardship jobs for women and youth.'
      ],
      gallery: [
        {
          src: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80',
          alt: 'Children collecting clean water from a borehole'
        },
        {
          src: 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&w=1200&q=80',
          alt: 'Technician inspecting a solar-powered water system'
        }
      ],
      ctas: [
        {
          label: 'Sponsor a Borehole',
          href: '/donate?designation=water-guardians',
          tone: 'primary'
        },
        {
          label: 'Explore Data Dashboard',
          href: '/transparency',
          tone: 'secondary'
        }
      ]
    },
    {
      slug: 'community-thrive-coalition',
      title: 'Community Thrive Coalition',
      category: 'Economic Empowerment',
      focus: 'pan-africa',
      summary:
        'Micro-grants, climate-smart agriculture, and creative industries incubators powering resilient livelihoods.',
      excerpt:
        'Coalition chapters blend finance literacy, regenerative farming, and artisan collectives so households can thrive.',
      heroImage:
        'https://images.unsplash.com/photo-1517959105821-eaf2591984b0?auto=format&fit=crop&w=1600&q=80',
      spotlightStatistic: '4,600 households with new income streams',
      highlightQuote: {
        quote: 'Our shea butter is now exported with traceability back to each cooperative.',
        attribution: 'Zainab, Co-op Lead, Northern Ghana'
      },
      outcomes: [
        'Seed 120 micro-enterprises with community-managed revolving funds',
        'Train 500 farmers on regenerative practices and soil health',
        'Launch online marketplace for ethical African-made goods'
      ],
      narrative: [
        'Entrepreneurs join design sprints pairing business mentors with cultural custodians.',
        'Digital finance tools provide transparent profit sharing and impact tracking.',
        'Creative labs celebrate storytelling, textiles, and culinary arts rooted in local heritage.'
      ],
      gallery: [
        {
          src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
          alt: 'Artisans collaborating on handcrafted textiles'
        },
        {
          src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
          alt: 'Farmers reviewing regenerative agriculture plans'
        }
      ],
      ctas: [
        {
          label: 'Back a Micro-Grant',
          href: '/donate?designation=thrive-coalition',
          tone: 'primary'
        },
        {
          label: 'Partner with a Cooperative',
          href: '/get-involved/partners',
          tone: 'secondary'
        }
      ]
    },
    {
      slug: 'digital-empowerment-labs',
      title: 'Digital Empowerment Labs',
      category: 'IT & Digital Literacy',
      focus: 'pan-africa',
      summary:
        'Bridging the digital divide with computer literacy training, coding bootcamps, and tech entrepreneurship programs.',
      excerpt:
        'Equipping youth and adults with essential digital skills for the modern economy through hands-on training in coding, digital marketing, and online entrepreneurship.',
      heroImage:
        'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      spotlightStatistic: '2,800 people trained in digital skills in 2024',
      highlightQuote: {
        quote: 'Learning to code changed my life. Now I can support my family through web development.',
        attribution: 'Kwame, Digital Lab Graduate, Accra'
      },
      outcomes: [
        'Establish 15 digital literacy centers across Ghana and Nigeria',
        'Train 5,000 youth in basic computer skills and internet safety',
        'Graduate 500 participants from coding and digital marketing bootcamps',
        'Launch 100 tech-enabled micro-businesses'
      ],
      narrative: [
        'Digital Empowerment Labs provide free access to computers, internet, and expert instruction in communities where technology access is limited.',
        'Our curriculum covers everything from basic computer literacy to advanced coding, web development, digital marketing, and e-commerce.',
        'Graduates receive mentorship and seed funding to launch tech-enabled businesses, from online shops to freelance digital services.',
        'We partner with tech companies to provide internship opportunities and job placement for top performers.'
      ],
      gallery: [
        {
          src: '/computer_literacy_di_d137182c.jpg',
          alt: 'Students learning computer skills in digital lab'
        },
        {
          src: '/computer_literacy_di_4a969b3f.jpg',
          alt: 'Instructor teaching coding to youth participants'
        }
      ],
      ctas: [
        {
          label: 'Fund Digital Training',
          href: '/donate?designation=digital-labs',
          tone: 'primary'
        },
        {
          label: 'Become a Tech Mentor',
          href: '/get-involved/volunteer',
          tone: 'secondary',
          description: 'Share your IT expertise with aspiring tech professionals.'
        }
      ]
    }
  ]
};
