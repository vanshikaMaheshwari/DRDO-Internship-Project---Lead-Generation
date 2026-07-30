// HPI 1.7-G
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Image } from '@/components/ui/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Cpu,
  Database,
  Globe,
  MapPin,
  Radio,
  Server,
  Shield,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

// --- CANONICAL DATA SOURCES ---
// Preserved from original code and expanded with strict adherence to the Data Fidelity Protocol.
// No new data entities are invented; we are visualizing the existing concepts.

const FEATURES_DATA = [
  {
    id: 'source-registry',
    icon: Database,
    title: 'Source Registry',
    description: 'Track domains, RSS feeds, and tender sites with trust scores.',
    link: '/sources',
    category: 'Ingestion'
  },
  {
    id: 'lead-management',
    icon: Target,
    title: 'Lead Management',
    description: 'Browse and filter discovered leads with intelligent scoring.',
    link: '/leads',
    category: 'Processing'
  },
  {
    id: 'executive-dashboard',
    icon: TrendingUp,
    title: 'Executive Dashboard',
    description: 'Monitor conversion funnels and performance metrics.',
    link: '/dashboard',
    category: 'Intelligence'
  },
  {
    id: 'geographic-routing',
    icon: MapPin,
    title: 'Geographic Routing',
    description: 'Automatic assignment to nearest regional offices.',
    link: '/leads',
    category: 'Action'
  },
  {
    id: 'real-time-signals',
    icon: Zap,
    title: 'Real-Time Signals',
    description: 'Instant detection of manufacturing and commissioning triggers.',
    link: '/leads',
    category: 'Ingestion'
  },
  {
    id: 'policy-safe',
    icon: Shield,
    title: 'Policy-Safe',
    description: 'Compliant crawling with full audit trails.',
    link: '/sources',
    category: 'Security'
  }
];

const SYSTEM_STATS = [
  { label: 'Active Sources', value: '247', trend: '+12%', icon: Globe },
  { label: 'Leads Discovered', value: '1,834', trend: '+28%', icon: Target },
  { label: 'Conversion Rate', value: '34.2%', trend: '+5.3%', icon: Activity },
  { label: 'Avg Response Time', value: '2.4h', trend: '-18%', icon: Zap }
];

const PROCESS_STEPS = [
  { step: '01', title: 'Monitor Sources', desc: 'Track domains, feeds, and tender sites', icon: Radio },
  { step: '02', title: 'Detect Signals', desc: 'Identify manufacturing and commissioning triggers', icon: Cpu },
  { step: '03', title: 'Score & Route', desc: 'Prioritize leads and assign to regional teams', icon: Server },
  { step: '04', title: 'Convert', desc: 'Sales officers engage with qualified prospects', icon: TrendingUp }
];

// --- UTILITY COMPONENTS ---

const SectionDivider = () => (
  <div className="w-full flex items-center justify-center py-12 opacity-30">
    <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-accent-teal to-transparent" />
    <div className="mx-4 text-accent-teal font-paragraph text-xs tracking-[0.2em]">///</div>
    <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-accent-teal to-transparent" />
  </div>
);

const GlowingOrb = ({ color = "teal", className = "" }: { color?: "teal" | "magenta", className?: string }) => (
  <div
    className={`absolute rounded-full blur-[100px] opacity-20 pointer-events-none ${className}`}
    style={{
      background: color === "teal" ? "#00FFFF" : "#FF00FF",
    }}
  />
);

// --- MAIN PAGE COMPONENT ---

export default function HomePage() {
  // Scroll Progress for Global Parallax
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-dark-background text-light-foreground overflow-x-hidden selection:bg-accent-teal/30 selection:text-accent-teal">
      <Header />

      {/* GLOBAL BACKGROUND GRID */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute top-0 left-0 w-full h-[120%] bg-[radial-gradient(circle_800px_at_50%_200px,rgba(0,255,255,0.03),transparent)]"
        />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[95vh] flex flex-col justify-center items-center px-6 py-20 overflow-hidden">
        <GlowingOrb color="teal" className="top-[-10%] right-[-5%] w-[600px] h-[600px]" />
        <GlowingOrb color="magenta" className="bottom-[-10%] left-[-5%] w-[500px] h-[500px]" />

        <div className="relative z-10 w-full max-w-[100rem] mx-auto grid lg:grid-cols-12 gap-12 items-center">

          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-12 bg-accent-teal" />
              <span className="font-paragraph text-xs md:text-sm text-accent-teal tracking-[0.2em] uppercase">
                Web Intelligence Pipeline v2.0
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight text-light-foreground"
            >
              Precision <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-teal via-white to-accent-teal bg-[length:200%_auto] animate-gradient">
                Engineering
              </span> <br />
              for Intelligence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-paragraph text-base md:text-lg text-muted-gray-foreground/80 max-w-2xl leading-relaxed border-l-2 border-accent-teal/20 pl-6"
            >
              Transform complex public signals into actionable sales vectors.
              Our advanced system monitors, profiles, and routes opportunities with
              <span className="text-accent-teal"> algorithmic precision</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <Link to="/leads" className="group relative inline-flex items-center justify-center px-8 py-4 font-heading font-bold text-primary-foreground transition-all duration-200 bg-accent-teal border-2 border-accent-teal rounded-sm hover:bg-transparent hover:text-accent-teal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-teal">
                <span className="mr-2">Initialize Pipeline</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 -z-10 bg-accent-teal/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link to="/dashboard" className="group inline-flex items-center justify-center px-8 py-4 font-heading font-bold text-light-foreground transition-all duration-200 bg-transparent border border-muted-gray hover:border-accent-magenta rounded-sm focus:outline-none">
                <span className="mr-2 group-hover:text-accent-magenta transition-colors">View Dashboard</span>
                <Activity className="w-5 h-5 text-muted-gray group-hover:text-accent-magenta transition-colors" />
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual / HUD */}
          <div className="lg:col-span-5 relative perspective-1000">
            <motion.div
              initial={{ opacity: 0, rotateX: 10, rotateY: -10, scale: 0.9 }}
              animate={{ opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative z-10 bg-dark-background/60 backdrop-blur-xl border border-accent-teal/20 rounded-xl p-8 shadow-[0_0_50px_-12px_rgba(0,255,255,0.1)]"
            >
              {/* Decorative HUD Elements */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-teal" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-teal" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-teal" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-teal" />

              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-teal rounded-full animate-pulse" />
                  <span className="font-paragraph text-xs text-accent-teal tracking-widest">SYSTEM ONLINE</span>
                </div>
                <span className="font-paragraph text-xs text-muted-gray">SECURE CONNECTION</span>
              </div>

              <div className="space-y-6">
                {SYSTEM_STATS.map((stat, idx) => (
                  <div key={stat.label} className="group relative overflow-hidden rounded-lg bg-white/5 p-4 hover:bg-white/10 transition-colors border border-transparent hover:border-accent-teal/30">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-accent-teal/10 rounded text-accent-teal">
                          <stat.icon size={18} />
                        </div>
                        <div>
                          <p className="font-paragraph text-xs text-muted-gray-foreground/60 uppercase tracking-wider">{stat.label}</p>
                          <p className="font-heading text-2xl font-semibold text-light-foreground mt-1">{stat.value}</p>
                        </div>
                      </div>
                      <span className={`font-paragraph text-xs font-bold ${stat.trend.includes('+') ? 'text-accent-teal' : 'text-accent-magenta'}`}>
                        {stat.trend}
                      </span>
                    </div>
                    {/* Progress Bar Simulation */}
                    <div className="absolute bottom-0 left-0 h-1 bg-accent-teal/20 w-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.random() * 60 + 40}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + idx * 0.1 }}
                        className="h-full bg-accent-teal"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Background Abstract Graphic */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-30">
               <div className="w-full h-full border border-accent-teal/10 rounded-full animate-[spin_20s_linear_infinite]" />
               <div className="absolute inset-4 border border-accent-magenta/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: opacityFade }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-paragraph text-[10px] tracking-[0.3em] text-muted-gray uppercase">Scroll to Initialize</span>
          <div className="w-px h-12 bg-gradient-to-b from-accent-teal to-transparent" />
        </motion.div>
      </section>

      <SectionDivider />

      {/* --- STICKY PIPELINE SECTION --- */}
      <section className="relative w-full max-w-[120rem] mx-auto px-6 py-24">
        <div className="mb-20 md:text-center max-w-4xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            The Intelligence <span className="text-accent-teal">Pipeline</span>
          </h2>
          <p className="font-paragraph text-muted-gray-foreground/70 text-lg">
            A continuous loop of discovery, analysis, and action.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Sticky Navigation / Context */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
                <h3 className="font-heading text-2xl text-light-foreground mb-4">Core Modules</h3>
                <p className="font-paragraph text-sm text-muted-gray-foreground/60 mb-8">
                  Our architecture is built on three pillars: Ingestion, Processing, and Actionable Intelligence.
                </p>
                <div className="space-y-4">
                  {['Ingestion', 'Processing', 'Action'].map((stage, i) => (
                    <div key={stage} className="flex items-center gap-4 group cursor-default">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${i === 0 ? 'border-accent-teal text-accent-teal bg-accent-teal/10' : 'border-muted-gray text-muted-gray'}`}>
                        0{i + 1}
                      </div>
                      <span className={`font-heading text-lg ${i === 0 ? 'text-light-foreground' : 'text-muted-gray'}`}>{stage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Code Block */}
              <div className="hidden lg:block p-6 rounded-lg bg-black/40 border border-white/5 font-paragraph text-xs text-muted-gray overflow-hidden">
                <div className="flex gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
                <code className="block opacity-50">
                  {`> init_sequence(source_id)`}<br/>
                  {`> scanning_protocols... OK`}<br/>
                  {`> trust_score_calc... 98.4%`}<br/>
                  {`> lead_vector_identified`}<br/>
                  <span className="text-accent-teal animate-pulse">{`> awaiting_input_`}</span>
                </code>
              </div>
            </div>
          </div>

          {/* Scrolling Cards */}
          <div className="lg:col-span-8 space-y-8">
            {FEATURES_DATA.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* --- FULL BLEED IMAGE BREAK --- */}
      <section className="relative w-full h-[80vh] my-24 overflow-hidden group">
        <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-colors duration-700" />
        <Image
          src="https://static.wixstatic.com/media/bbfd4e_319342d2c5c24b03a3968e8f490b1355~mv2.png?originWidth=1280&originHeight=704"
          alt="Global Data Network Visualization"
          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl bg-dark-background/80 backdrop-blur-md p-12 border border-white/10 rounded-sm"
          >
            <Zap className="w-12 h-12 text-accent-teal mx-auto mb-6" />
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Real-Time Signal Detection
            </h2>
            <p className="font-paragraph text-lg text-light-foreground/80">
              From new plant commissions to solvent unit expansions, we catch the signals others miss.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- PROCESS FLOW (HORIZONTAL SCROLL CONCEPT) --- */}
      <section className="relative w-full max-w-[100rem] mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Operational <span className="text-accent-magenta">Logic</span>
            </h2>
            <p className="font-paragraph text-muted-gray-foreground/60 max-w-xl">
              How raw data becomes closed deals.
            </p>
          </div>
          <Link to="/leads" className="hidden md:flex items-center gap-2 text-accent-teal font-heading font-bold hover:text-white transition-colors">
            Start Exploring <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accent-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

              <div className="relative h-full bg-dark-background border border-white/10 p-8 rounded-xl hover:border-accent-teal/40 transition-colors duration-300 flex flex-col">
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-3 bg-white/5 rounded-lg text-accent-teal group-hover:bg-accent-teal group-hover:text-black transition-all duration-300">
                    <item.icon size={24} />
                  </div>
                  <span className="font-heading text-4xl text-white/5 font-bold group-hover:text-accent-teal/20 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold mb-3 text-light-foreground group-hover:text-accent-teal transition-colors">
                  {item.title}
                </h3>
                <p className="font-paragraph text-sm text-muted-gray-foreground/60 leading-relaxed mt-auto">
                  {item.desc}
                </p>

                {/* Connector Line (Visual only) */}
                {idx < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-accent-teal/50 to-transparent z-20" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative w-full py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-accent-teal/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1),transparent_70%)]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6 px-4 py-1 rounded-full border border-accent-magenta/30 bg-accent-magenta/10"
          >
            <span className="font-paragraph text-xs text-accent-magenta tracking-widest uppercase">System Ready</span>
          </motion.div>

          <h2 className="font-heading text-5xl md:text-7xl font-bold text-light-foreground mb-8 leading-tight">
            Ready to Deploy <br />
            <span className="text-accent-teal">Intelligence?</span>
          </h2>

          <p className="font-paragraph text-lg md:text-xl text-muted-gray-foreground/70 mb-12 max-w-2xl mx-auto">
            Join the network of precision-engineered sales teams.
            Start discovering qualified leads today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/leads">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-accent-teal text-black font-heading font-bold text-lg rounded-sm hover:bg-accent-teal/90 transition-colors"
              >
                Launch Dashboard
              </motion.button>
            </Link>
            <Link to="/sources">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-transparent border border-white/20 text-white font-heading font-bold text-lg rounded-sm hover:bg-white/5 transition-colors"
              >
                View Sources
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FeatureCard({ feature, index }: { feature: typeof FEATURES_DATA[0], index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={feature.link} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-dark-background border border-white/10 p-8 md:p-10 transition-all duration-300 hover:border-accent-teal/50 hover:shadow-[0_0_30px_-10px_rgba(0,255,255,0.15)]">

          {/* Hover Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent-teal group-hover:bg-accent-teal/10 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-light-foreground group-hover:text-accent-teal transition-colors" />
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-paragraph text-xs text-accent-teal uppercase tracking-wider">{feature.category}</span>
                <div className="h-px w-8 bg-white/10" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-light-foreground mb-2 group-hover:text-accent-teal transition-colors">
                {feature.title}
              </h3>
              <p className="font-paragraph text-muted-gray-foreground/60 leading-relaxed max-w-xl">
                {feature.description}
              </p>
            </div>

            <div className="flex-shrink-0 self-end md:self-center">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent-teal group-hover:border-accent-teal transition-all duration-300">
                <ChevronRight className="w-5 h-5 text-white group-hover:text-black transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
