

export const ultraSecureDesignData = {
    title: "<span>Operational certainty</span> for every route",
    subtitle: "Detect risk early, prioritise by severity, and trigger follow-through automatically.",
    columns: 5,
    cells: [
        {
            type: "content" as const,
            number: "Hit the window, not the buffer",
            description: "Recalculate ETAs with traffic and energy context. Reassign to the nearest, healthiest vehicle. Keep customers updated automatically."
        },

        {
            type: "borderless-content" as const,
            number: "Cut cost per stop",
            description: "Reduce idling and deadhead miles. Balance routes by payload and dwell. Detect route drift early."
        },

        {
            type: "content" as const,
            number: "Payload-aware EV routing",
            description: "Predict range using payload, terrain, and weather. Optimise charging stops by availability and tariff. Avoid mid-route derates."
        },

        {
            type: "borderless-content" as const,
            number: "Cold chain you can prove",
            description: "Monitor temperature and door events continuously. Trigger excursion alerts early. Compile audit trails for claims and compliance."
        },

        {
            type: "content" as const,
            number: "Predictive maintenance between jobs",
            description: "Detect battery imbalance, overheating, and critical wear early. Use GuardianAI to schedule micro-service windows between routes."
        },

        {
            type: "borderless-content" as const,
            number: "PoD & claims—without the paper chase",
            description: "Package trip, sensor, and event context into evidence for faster FNOL and fewer disputes."
        },

    ]
};

export const featureStackCardData = {
    image: "/images/software.svg",
    label: "Platform overview",
    title: "A single pane of glass for your <span>logistics operations</span>",
    description: "Manage your entire fleet ecosystem from one intuitive dashboard. Datakrew integrates asset tracking, driver performance, and maintenance scheduling into a unified view.",
    features: [
        "Real-time GPS tracking and geofencing",
        "Driver compliance and safety scorecards",
        "Automated maintenance workflows",
        "Customizable reporting and analytics"
    ],
    ctaText: "Explore features",
    uri: "#"
};

export const completeYourIntelligenceData = {
    stackSectionHeader: "Complete your <span>tech stack</span>",
    stackSectionDescription: "Extend the power of Datakrew across your entire logistics organization with additional specialized modules.",
    stackDetails: {
        nodes: [
            {
                id: "driver-app",
                title: "Driver App",
                uri: "#",
                featuredImage: { node: { mediaItemUrl: "/images/driver-app.jpg" } }
            },
            {
                id: "dispatch-console",
                title: "Dispatch Console",
                uri: "#",
                featuredImage: { node: { mediaItemUrl: "/images/dispatch-console.jpg" } }
            },
            {
                id: "api-integrations",
                title: "API Integrations",
                uri: "#",
                featuredImage: { node: { mediaItemUrl: "/images/api-integrations.jpg" } }
            }
        ]
    }
};

export const quantifiedImpactData = {
    title: "Quantified",
    titleHighlight: "impact",
    description: "See how leading logistics and delivery networks are transforming their operations with Datakrew.",
    slides: [
        {
            image: { url: "/images/logistics-case-1.jpg", alt: "Logistics case study 1" },
            quote: "Datakrew helped us identify systematic routing inefficiencies, leading to a massive reduction in fuel expenses and late deliveries within just three months.",
            authorName: "Sarah Jenkins",
            authorTitle: "VP of Operations, Global Freight Co.",
            authorImage: { url: "/images/sarah-jenkins.jpg" },
            stats: [
                { value: "15%", label: "Fuel savings" },
                { value: "20+", label: "Hours saved weekly" }
            ],
            casestudyText: "Read full case study",
            casestudyHref: "#"
        },
        {
            image: { url: "/images/logistics-case-2.jpg", alt: "Logistics case study 2" },
            quote: "By catching engine faults before they became breakdowns, we've practically eliminated unplanned downtime for our last-mile delivery vans.",
            authorName: "David Chen",
            authorTitle: "Fleet Manager, QuickShip Logistics",
            authorImage: { url: "/images/david-chen.jpg" },
            stats: [
                { value: "99%", label: "Vehicle uptime" },
                { value: "3x", label: "ROI in first year" }
            ],
            casestudyText: "Read full case study",
            casestudyHref: "#"
        }
    ]
};

export const bgTitleDescriptionData = {
    title: "Ready to <span>optimize</span> your logistics network?",
    description: "Join hundreds of companies using Datakrew to turn fleet data into a competitive advantage.",
    backgroundImage: {
        url: "/images/cta-banner-bg.jpg",
        alt: "Call to action background",
        width: 1440,
        height: 443
    },
    button: {
        label: "Book a demo today",
        url: "#",
        variant: "primary" as const
    }
};

export const contactStripData = {
    prefooterCtaBannerHeading: "Connect with our logistics experts",
    prefooterCtaBannerDescription: "We're here to help you design a solution tailored to your specific delivery challenges.",
    prefooterCtaBackgroundImage: { node: { mediaItemUrl: "/images/contact-strip-bg.jpg" } },
    prefooterBannerCtaButtons: [
        {
            buttonStyle: ["primary-btn"],
            buttonText: "Contact sales",
            buttonUrl: { url: "#" }
        }
    ]
};

export const faqData = {
    title: "Frequently Asked Questions",
    items: [
        {
            question: "How long does it take to install the ITUS Max devices?",
            answer: "Installation is plug-and-play for most vehicles using the OBD-II port, taking less than 5 minutes per vehicle. For heavy-duty trucks requiring CAN bus integration, installation typically takes 15-30 minutes."
        },
        {
            question: "Does Datakrew integrate with our existing transport management system (TMS)?",
            answer: "Yes, Datakrew offers robust APIs and pre-built integrations with major TMS and ERP platforms, allowing seamless data flow into your existing logistics workflows."
        },
        {
            question: "How do the AI Fleet Agents prioritize alerts?",
            answer: "Our AI agents use predictive modeling to score events by severity and operational impact. Critical issues like severe engine faults or imminent safety risks are surfaced immediately, while minor inefficiencies are aggregated into weekly reports."
        }
    ]
};
