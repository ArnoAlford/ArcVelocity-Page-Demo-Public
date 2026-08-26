import Image from "next/image";
import "./home.css";
import { CapabilityCardSlider } from "./components/CapabilityCardSlider";
import { DeferredImplementationPhoto } from "./components/DeferredImplementationPhoto";
import { DiagnoseDiagram } from "./components/DiagnoseDiagram";
import { DesktopCapabilityLinework } from "./components/DesktopCapabilityLinework";
import { EngagementModels } from "./components/EngagementModels";
import { HeroVideo } from "./components/HeroVideo";
import { LocalIndustrySelector } from "./components/LocalIndustrySelector";
import { ResultsPanelSlider } from "./components/ResultsPanelSlider";
import { ResultsMetrics } from "./components/ResultsMetrics";
import { WhoWeArePhotoSlider } from "./components/WhoWeArePhotoSlider";

const siteUrl = "https://arcvelocity.com";

const pillars = [
  {
    label: "Guided Motion",
    icon: <CompassIcon />
  },
  {
    label: "Overcome Obstacles",
    icon: <MountainIcon />
  },
  {
    label: "Deliver Impact",
    icon: <TargetIcon />
  }
];

const localSignals = [
  {
    title: "DFW-Based",
    text: "On-the-ground partnerships",
    icon: <TexasIcon />
  },
  {
    title: "Operator First",
    text: "Solutions built for real-world teams",
    icon: <PeopleIcon />
  },
  {
    title: "Workflow Fit",
    text: "Deep market knowledge",
    icon: <PinIcon />
  },
  {
    title: "Operational Results",
    text: "Outcomes that move your business",
    icon: <CrosshairIcon />
  }
];

const industries = [
  "Services",
  "Advisory Firms",
  "Field Operations",
  "Coordination-Heavy"
];

const whoWeArePhotos = [
  {
    title: "Local Workshop Stencil",
    imageSrc: "/images/who-we-are/meeting-dark.png",
    alt: "Line-art illustration of ArcVelocity working with a local team."
  }
];

const implementationSteps: Array<{
  title: string;
  text: string;
  imageSrc: string;
}> = [
  {
    title: "Visit",
    text: "We meet on-site to understand your environment, systems, and goals.",
    imageSrc: "/images/implementation/visit-icon-crop.png"
  },
  {
    title: "Install",
    text: "We deploy our hardware and configure AI for your use.",
    imageSrc: "/images/implementation/install-icon-crop.png"
  },
  {
    title: "Integrate",
    text: "We integrate with your tools and workflows - securely.",
    imageSrc: "/images/implementation/connect-icon-crop.png"
  },
  {
    title: "Transfer",
    text: "We train your team and refine together so AI works the way you do.",
    imageSrc: "/images/implementation/train-icon-crop.png"
  }
];

const localOperationsCards = [
  {
    title: "Services",
    imageSrc: "/images/built-for-work/service-businesses.png"
  },
  {
    title: "Advisory Firms",
    imageSrc: "/images/built-for-work/advisory-firms.png"
  },
  {
    title: "Field Operations",
    imageSrc: "/images/built-for-work/field-operations.png"
  },
  {
    title: "Coordination-Heavy",
    imageSrc: "/images/built-for-work/coordination-heavy-teams.png"
  }
];

const capabilityCards = [
  {
    number: "01",
    title: "Workflow\nAutomation",
    bullets: ["Intake & routing", "Task handoffs", "Automated follow-ups"],
    imageSrc: "/images/capabilities/workflow-automation-material.png",
    icon: <WorkflowIcon />
  },
  {
    number: "02",
    title: "Knowledge\nSystems",
    bullets: ["SOP retrieval", "Policy & docs search", "Version-aware answers"],
    imageSrc: "/images/capabilities/knowledge-systems-material-tight.png",
    icon: <StackIcon />
  },
  {
    number: "03",
    title: "AI Copilots",
    bullets: ["Email triage", "Drafts & responses", "Summaries & next steps"],
    imageSrc: "/images/capabilities/ai-copilots-material.png",
    icon: <SingleUserIcon />
  },
  {
    number: "04",
    title: "Reporting +\nOversight",
    bullets: ["Operational dashboards", "Approvals & audit trails", "Insight you can act on"],
    imageSrc: "/images/capabilities/reporting-oversight-material.png",
    icon: <PieIcon />
  }
];

const resultMetrics = [
  {
    value: "72%",
    label: "Fewer manual touchpoints",
    text: "Less repetitive handling. More time for higher-value work."
  },
  {
    value: "3.4x",
    label: "Faster turnaround",
    text: "From intake to completion, the workflow moves faster and with less drag."
  },
  {
    value: "81%",
    label: "Fewer dropped tasks",
    text: "Work stays visible, assigned, and moving."
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#business`,
      name: "ArcVelocity",
      url: siteUrl,
      image: `${siteUrl}/images/hero-poster.webp`,
      description:
        "Bedford-based AI implementation practice serving Dallas-Fort Worth businesses with supervised AI installed into real workflows.",
      email: "arcvelocity@runbox.biz",
      telephone: "+1-714-325-8213",
      areaServed: [
        "Bedford, Texas",
        "Dallas, Texas",
        "Fort Worth, Texas",
        "Arlington, Texas",
        "Irving, Texas",
        "Plano, Texas",
        "Frisco, Texas",
        "Richardson, Texas",
        "Grapevine, Texas",
        "Southlake, Texas"
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bedford",
        addressRegion: "TX",
        addressCountry: "US"
      },
      serviceType: [
        "AI implementation",
        "On-site AI implementation",
        "Workflow automation consulting",
        "AI workflow diagnostic",
        "Knowledge system implementation",
        "Reporting and oversight systems"
      ]
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service`,
      serviceType: "On-site AI implementation for business workflows",
      provider: {
        "@id": `${siteUrl}/#business`
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Dallas-Fort Worth, Texas"
      },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Operations-heavy small and midsize businesses"
      },
      description:
        "ArcVelocity diagnoses workflow bottlenecks and installs supervised AI into intake, approvals, follow-up, document-heavy work, reporting, and operational oversight."
    }
  ]
};

export default function Home() {
  return (
    <main className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="hero" id="home" aria-label="ArcVelocity hero">
        <HeroVideo />
        <div className="hero-vignette" aria-hidden="true" />

        <header className="shared-site-header shared-site-header-light shared-site-header-brand-only">
          <a
            aria-label="Visit the ArcVelocity website"
            className="shared-site-brand"
            href="https://arcvelocity.com/"
          >
            <span>Arc<wbr />Velocity</span>
          </a>
        </header>

        <div className="location-rail" aria-hidden="true">
          <span />
          <p>Dallas - Fort Worth</p>
        </div>

        <div className="hero-content">
          <h1>
            Install AI where
            <br />
            work gets <span>stuck</span>
          </h1>

          <p className="hero-kicker">DFW-based, hands-on AI implementation for real business workflows</p>
          <div className="fine-line" aria-hidden="true" />

          <p className="hero-copy">
            We come on site, find the handoff slowing the team down, and install
            a supervised AI workflow your people can run without us.
          </p>

          <a className="hero-cta textured-cta" href="https://arcvelocity.com/#engagement">
            Workflow Diagnostic
            <span aria-hidden="true" />
          </a>
        </div>

        <div className="proof-strip" aria-label="ArcVelocity principles">
          {pillars.map((pillar, index) => (
            <div className="proof-item" key={pillar.label}>
              {index > 0 ? <span className="divider" aria-hidden="true" /> : null}
              <span className="proof-icon" aria-hidden="true">
                {pillar.icon}
              </span>
              <span className="proof-label">{pillar.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="implementation-section" id="implementation" aria-label="On-site implementation">
        <DeferredImplementationPhoto />

        <div className="implementation-copy">
          <p className="section-kicker">On-Site Implementation</p>
          <div className="section-rule" aria-hidden="true" />

          <h2>
            We install AI
            <br />
            in the <em>real</em> world.
          </h2>

          <p>
            Our team comes to you. We install secure, supervised AI systems
            that fit your existing workflows, so your team can improve one real
            bottleneck without rebuilding how the business works.
          </p>

          <div className="implementation-steps" aria-label="Implementation process">
            {implementationSteps.map((step, index) => (
              <article className="implementation-step" key={step.title}>
                <div className="implementation-step-icon" aria-hidden="true">
                  <Image
                    src={step.imageSrc}
                    alt=""
                    width={256}
                    height={256}
                    sizes="(max-width: 900px) 44px, 76px"
                  />
                </div>
                {index < implementationSteps.length - 1 ? (
                  <span className="implementation-step-rail" aria-hidden="true" />
                ) : null}
                <h3>
                  <span>{index + 1}.</span> {step.title}
                </h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>

          <a className="implementation-cta" href="https://arcvelocity.com/blog/dfw-ai-implementation">
            See How On-Site Implementation Works
            <span aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="diagnose-section" id="diagnose" aria-label="Diagnose workflow bottlenecks">
        <DiagnoseDiagram />

        <div className="diagnose-copy">
          <p className="section-kicker">Diagnose the bottlenecks</p>
          <div className="section-rule" aria-hidden="true" />

          <h2>
            See where work is
            <br />
            actually getting stuck
          </h2>

          <p>
            ArcVelocity maps the handoffs, delays, approvals, and follow-up
            gaps inside your real workflow so you can see where work is
            stalling, what is getting missed, and where AI can help first.
          </p>

        </div>

        <div className="diagnose-footer-row">
          <p className="diagnose-footer diagnose-footer-left">
            Disconnected <span aria-hidden="true" /> Unclear <span aria-hidden="true" /> Delayed
          </p>

          <a className="implementation-cta diagnose-cta" href="https://arcvelocity.com/#engagement">
            See How the Diagnostic Works
            <span aria-hidden="true" />
          </a>

          <p className="diagnose-footer diagnose-footer-right">
            Connected <span aria-hidden="true" /> Clear <span aria-hidden="true" /> Accelerated
          </p>
        </div>
      </section>

      <section className="capabilities-section" id="capabilities" aria-label="AI capabilities ArcVelocity installs">
        <div className="capabilities-copy">
          <p className="section-kicker">Capabilities</p>
          <div className="section-rule" aria-hidden="true" />

          <h2>
            Where we
            <br />
            install AI
            <br />
            <em>first</em>
          </h2>

          <p>
            ArcVelocity is strongest where business workflows get delayed,
            dropped, or misrouted. We usually start with intake, approvals,
            follow-up, document-heavy work, and handoff-driven operational
            processes.
          </p>

          <a className="capabilities-cta" href="https://arcvelocity.com/workflow-diagnostic">
            See Where We Start
            <span aria-hidden="true" />
          </a>
        </div>

        <div className="capability-showcase">
          <DesktopCapabilityLinework />

          <CapabilityCardSlider cards={capabilityCards} />
        </div>
      </section>

      <section className="results-section" id="results" aria-label="Operational results">
        <div className="results-copy">
          <p className="section-kicker">Results</p>
          <div className="section-rule" aria-hidden="true" />

          <h2>
            Operational improvement <em>you can actually feel.</em>
          </h2>

          <p>The goal is work that moves faster, drops less often, and stays easier to see, assign, and manage.</p>
        </div>

        <ResultsMetrics metrics={resultMetrics} />

        <ResultsPanelSlider />
      </section>

      <section className="local-context" id="local" aria-label="DFW operations">
        <div className="local-map-art" aria-hidden="true" />

        <div className="local-copy">
          <p className="section-kicker">DFW-Rooted</p>
          <div className="section-rule" aria-hidden="true" />

          <h2>
            Designed for
            <br />
            real DFW
            <br />
            <em>operations.</em>
          </h2>

          <p>
            We work with Dallas-Fort Worth businesses that still rely on
            handoffs, approvals, inboxes, spreadsheets, and follow-through.
          </p>
          <p>
            That local context matters. It helps us design systems that fit how
            work actually moves here, not how a remote consultant imagines it
            should move.
          </p>
        </div>

        <div className="local-signals" aria-label="Local operating signals">
          {localSignals.map((signal, index) => (
            <div className="local-signal" key={signal.title}>
              {index > 0 ? <span className="signal-divider" aria-hidden="true" /> : null}
              <span className="signal-icon" aria-hidden="true">
                {signal.icon}
              </span>
              <h3>{signal.title}</h3>
              <p>{signal.text}</p>
            </div>
          ))}
        </div>

        <div className="industry-band">
          <h3>Built for coordination-heavy teams across industries</h3>
          <LocalIndustrySelector cards={localOperationsCards} industries={industries} />
        </div>

      </section>

      <section className="adoption-section" id="adoption" aria-label="Who we are">
        <div className="adoption-art" aria-hidden="true" />

        <div className="adoption-mobile-content">
          <div className="adoption-mobile-brand" aria-hidden="true">
            <Image
              src="/images/arcvelocity-logo-home.webp"
              alt=""
              width={360}
              height={102}
              loading="lazy"
              sizes="260px"
            />
          </div>

          <h2>Why ArcVelocity</h2>
          <div className="adoption-rule" aria-hidden="true" />
          <p className="adoption-subtitle">
            ArcVelocity is a Bedford-based AI implementation practice built
            around local accountability, hands-on installation, and practical
            workflow systems that teams can actually run.
          </p>

          <WhoWeArePhotoSlider photos={whoWeArePhotos} />
        </div>

        <div className="sr-only">
          Why ArcVelocity. ArcVelocity is a Bedford-based AI implementation
          practice built around local accountability, hands-on installation,
          and practical workflow systems that teams can actually run.
        </div>
      </section>

      <section className="engagement-section" id="engagement" aria-label="Pricing and engagement models">
        <div className="engagement-art" aria-hidden="true" />

        <div className="engagement-copy">
          <p className="section-kicker">How We Start</p>
          <h2>
            Choose the first
            <br />
            scope to <em>install.</em>
          </h2>
          <p>
            Start with the diagnostic, prove the first workflow, then expand
            the implementation with governance and training built in from day
            one.
          </p>
        </div>

        <EngagementModels />

        <aside className="engagement-helper">
          <span className="engagement-helper-icon" aria-hidden="true">
            <CalendarIcon />
          </span>
          <div>
            <h3>Not sure where to start?</h3>
            <p>We&apos;ll help you identify the first workflow worth fixing and the right scope to start with.</p>
          </div>
          <a className="engagement-helper-button" href="https://arcvelocity.com/workflow-diagnostic">
            Start with the Diagnostic
            <span aria-hidden="true">-&gt;</span>
          </a>
        </aside>
      </section>

      <section className="final-cta-section" id="contact" aria-label="Contact ArcVelocity">
        <span className="anchor-target" id="about" aria-hidden="true" />
        <div className="final-cta-art" aria-hidden="true" />

        <div className="final-cta-content">
          <div className="final-cta-brand" aria-hidden="true">
            <Image
              src="/images/arcvelocity-logo-home.webp"
              alt=""
              width={360}
              height={102}
              loading="lazy"
              sizes="260px"
            />
          </div>

          <h2>
            Ready to fix the workflow
            <br />
            that&apos;s slowing things down?
          </h2>

          <div className="final-cta-rule" aria-hidden="true" />

          <p>
            Tell us where work is getting delayed, dropped, or harder to manage
            than it should be. We’ll help confirm the first workflow worth
            diagnosing and the safest place to start.
          </p>

          <div className="final-next-steps" aria-label="What happens next">
            <h3>What happens next</h3>
            <ol>
              <li>We reply with 2-3 fit questions.</li>
              <li>Together we identify the workflow to diagnose.</li>
              <li>We map the first install path.</li>
            </ol>
          </div>

          <div className="final-cta-actions">
            <a className="hero-cta textured-cta final-primary" href="mailto:arcvelocity@runbox.biz?subject=Workflow%20Diagnostic%20Request">
              Start the Workflow Diagnostic
              <span aria-hidden="true" />
            </a>
            <a className="text-cta final-secondary" href="#capabilities">
              View Capabilities
            </a>
          </div>
        </div>

        <footer className="final-contact-rail">
          <p>Dallas <span>&bull;</span> Fort Worth <span>&bull;</span> Texas</p>
          <p>32.7767&deg; N, 96.7970&deg; W</p>
          <div className="final-contact-links">
            <a href="mailto:arcvelocity@runbox.biz">arcvelocity@runbox.biz</a>
            <span aria-hidden="true">&bull;</span>
            <a href="tel:+17143258213">(714) 325 8213</a>
            <span aria-hidden="true">&bull;</span>
            <a href="https://arcvelocity.com">arcvelocity.com</a>
          </div>
        </footer>
      </section>
    </main>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 42 42">
      <circle cx="21" cy="21" r="15" />
      <path d="M21 2v6M21 34v6M2 21h6M34 21h6" />
      <path d="m15 27 5-12 7-3-5 12-7 3Z" />
      <circle cx="21" cy="21" r="2" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true">
      <path d="M7 29h28" />
      <path d="M11 29 20 13l7 16" />
      <path d="M21 20h9v9" />
      <circle cx="21" cy="13" r="2.5" />
      <circle cx="30" cy="20" r="2.5" />
      <path d="M13 29v4h11" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true">
      <path d="m21 7 14 7-14 7-14-7 14-7Z" />
      <path d="m8 20 13 7 13-7" />
      <path d="m8 27 13 7 13-7" />
    </svg>
  );
}

function SingleUserIcon() {
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true">
      <circle cx="21" cy="14" r="6" />
      <path d="M10 34c1.2-7.6 5-11 11-11s9.8 3.4 11 11H10Z" />
    </svg>
  );
}

function PieIcon() {
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true">
      <path d="M21 6a15 15 0 1 0 15 15H21V6Z" />
      <path d="M25 6v11h11C35 11 31 7 25 6Z" />
    </svg>
  );
}

function MountainIcon() {
  return (
    <svg viewBox="0 0 58 34">
      <path d="M2 31h54L38 9 29 21 20 11 2 31Z" />
      <path d="m20 11 7 10 5-6M38 9l-6 7" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 42 42">
      <circle cx="21" cy="21" r="15" />
      <circle cx="21" cy="21" r="7" />
      <circle cx="21" cy="21" r="2" />
      <path d="M21 2v7M21 33v7M2 21h7M33 21h7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 42 42">
      <rect x="10" y="11" width="22" height="22" rx="1" />
      <path d="M15 7v8M27 7v8M10 18h22M15 23h3M20 23h3M25 23h3M15 28h3M20 28h3" />
    </svg>
  );
}

function TexasIcon() {
  return (
    <svg viewBox="0 0 64 64">
      <path d="M18 8h15l3 10 9-4 5 9 10 3-6 12-8-1-5 16-12-10-12-2 3-12-9-9 7-12Z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 42 42">
      <circle cx="21" cy="13" r="5" />
      <path d="M11 34c1-7 4-11 10-11s9 4 10 11" />
      <circle cx="10" cy="17" r="4" />
      <path d="M3 33c1-5 3-8 8-9" />
      <circle cx="32" cy="17" r="4" />
      <path d="M39 33c-1-5-3-8-8-9" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 42 42">
      <path d="M21 38s11-11 11-22A11 11 0 0 0 10 16c0 11 11 22 11 22Z" />
      <circle cx="21" cy="16" r="4" />
    </svg>
  );
}

function CrosshairIcon() {
  return (
    <svg viewBox="0 0 42 42">
      <circle cx="21" cy="21" r="11" />
      <circle cx="21" cy="21" r="3" />
      <path d="M21 4v8M21 30v8M4 21h8M30 21h8" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true">
      <path d="m21 4 4.7 11.4 12.3 1-9.4 8 2.9 12-10.5-6.4-10.5 6.4 2.9-12-9.4-8 12.3-1L21 4Z" />
    </svg>
  );
}
