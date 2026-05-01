import { useRef, useState, useCallback } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

// ─── Palette ──────────────────────────────────────────────────────────────────
// bg-deep    #1e1b4b  night-sky indigo (main background)
// bg-surface #252260  slightly lighter indigo (cards)
// bg-raised  #2d2a6e  borders, elevated elements
// gold       #c9943a  warm gold accent
// gold-lt    #e8b96a  lighter gold highlights
// indigo-lt  #818cf8  light indigo for secondary text accents
// cream      #fdf6e3  warm cream (main text)
// cream-muted #a9a6c5 muted lavender-gray (body copy)
// border     #2d2a5e  subtle border

// ─── Shared transition ────────────────────────────────────────────────────────
const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;
const EASE = { duration: 0.65, ease: [0.22, 1, 0.36, 1] } as const;

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────
// Uses direct animate objects (not variants+custom) to avoid the framer-motion
// v11 + React 18 issue where custom-function variants sometimes don't re-run.
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ ...EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Mouse-tracking 3-D tilt hook ────────────────────────────────────────────
function use3dTilt(strength = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(rawY, { stiffness: 200, damping: 20 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      rawY.set(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * strength);
      rawX.set(-((e.clientY - r.top - r.height / 2) / (r.height / 2)) * strength);
    },
    [rawX, rawY, strength]
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave };
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ onCTA }: { onCTA: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1e1b4b]/90 backdrop-blur-md border-b border-[#2d2a5e]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span
          className="text-[#e8b96a] font-semibold text-lg tracking-wide"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Elena Hart
        </span>
        <div className="hidden md:flex gap-8 text-sm text-[#a9a6c5] font-medium">
          {[["My Story", "#my-story"], ["Insights", "#insights"], ["FAQ", "#faq"]].map(
            ([label, href]) => (
              <a key={label} href={href} className="hover:text-[#fdf6e3] transition-colors duration-200">
                {label}
              </a>
            )
          )}
        </div>
        <button
          onClick={onCTA}
          className="text-sm font-semibold px-5 py-2.5 rounded-full bg-[#c9943a] text-[#1e1b4b] hover:bg-[#e8b96a] transition-colors duration-200 shadow-lg shadow-[#c9943a]/20"
        >
          Start Your Journey
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onCTA }: { onCTA: () => void }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: orbs move faster than text — creates depth stack
  const orbY1 = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const textY  = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "32%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.65], [1, 0.95]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center bg-[#1e1b4b] overflow-hidden pt-16">
      {/* Ambient glow orbs */}
      <motion.div style={{ y: orbY1 }}
        className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full bg-[#c9943a]/10 blur-3xl pointer-events-none" />
      <motion.div style={{ y: orbY2 }}
        className="absolute -bottom-24 -left-48 w-[500px] h-[500px] rounded-full bg-[#818cf8]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 w-96 h-96 rounded-full bg-[#c9943a]/5 blur-3xl pointer-events-none" />

      <motion.div
        style={{ opacity, scale }}
        className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center w-full"
      >
        {/* Text — slowest parallax layer */}
        <motion.div style={{ y: textY }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE, delay: 0 }}
            className="text-[#c9943a] text-sm font-semibold tracking-widest uppercase mb-4"
          >
            Life Coaching
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#fdf6e3] leading-[1.1] mb-6"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            You already have the answers.{" "}
            <span className="text-[#e8b96a]">Let&apos;s find them together.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE, delay: 0.18 }}
            className="text-[#a9a6c5] text-lg leading-relaxed mb-10 max-w-md"
          >
            I help thoughtful people move through uncertainty, rediscover their
            direction, and build lives that feel genuinely theirs — not just
            impressive on paper.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE, delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onCTA}
              className="px-8 py-4 rounded-full bg-[#c9943a] text-[#1e1b4b] font-bold text-base shadow-xl shadow-[#c9943a]/25 hover:bg-[#e8b96a] transition-colors duration-200"
            >
              Start Your Journey
            </motion.button>
            <motion.a
              href="#my-story"
              whileHover={{ scale: 1.02 }}
              className="px-8 py-4 rounded-full border border-[#2d2a6e] text-[#a9a6c5] font-semibold text-base hover:border-[#c9943a]/50 hover:text-[#fdf6e3] transition-colors duration-200 text-center"
            >
              Learn About Me
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE, delay: 0.33 }}
            className="mt-12 flex gap-10"
          >
            {[["200+", "Lives Transformed"], ["8+", "Years Experience"], ["Free", "First Session"]].map(
              ([stat, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-[#e8b96a]">{stat}</p>
                  <p className="text-xs text-[#a9a6c5] mt-1">{label}</p>
                </div>
              )
            )}
          </motion.div>
        </motion.div>

        {/* Image — slightly faster parallax = sits in front */}
        <motion.div style={{ y: imageY }} className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...EASE, delay: 0.15 }}
            className="relative"
          >
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-3xl bg-gradient-to-br from-[#252260] to-[#2d2a6e] flex items-center justify-center overflow-hidden border border-[#2d2a5e] shadow-2xl shadow-[#c9943a]/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c9943a]/8 via-transparent to-[#818cf8]/8" />
              <div
                className="w-28 h-28 rounded-full bg-gradient-to-br from-[#c9943a] to-[#e8b96a] flex items-center justify-center text-[#1e1b4b] text-4xl font-bold shadow-2xl z-10"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                EH
              </div>
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-6 bg-[#252260] border border-[#2d2a5e] rounded-2xl px-4 py-3 shadow-xl"
            >
              <p className="text-xs text-[#a9a6c5]">First session</p>
              <p className="text-sm font-bold text-[#c9943a]">Completely Free</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const avatarRotateY = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  return (
    <section id="my-story" ref={sectionRef} className="bg-[#19173d] py-28 border-t border-[#2d2a5e]">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <Reveal>
          <div className="flex justify-center md:justify-start">
            <div style={{ perspective: "900px" }}>
              <motion.div style={{ rotateY: avatarRotateY }} className="relative">
                <div
                  className="w-64 h-64 rounded-full bg-gradient-to-br from-[#c9943a] to-[#e8b96a] flex items-center justify-center text-[#1e1b4b] text-6xl font-bold shadow-2xl shadow-[#c9943a]/20"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  EH
                </div>
                <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full bg-[#818cf8]/15 border-4 border-[#19173d]" />
                <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-[#c9943a]/15 border-4 border-[#19173d]" />
              </motion.div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal delay={0.05}>
            <p className="text-[#c9943a] text-sm font-semibold tracking-widest uppercase mb-3">My Story</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl font-bold text-[#fdf6e3] mb-6 leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
              I&apos;ve sat in that same seat of uncertainty.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-[#a9a6c5] leading-relaxed mb-4">
              A decade ago, I had what looked like a successful life — a demanding career, a packed
              calendar, and a quiet, persistent feeling that none of it was quite right. I didn&apos;t
              need more information. I needed someone to help me listen to myself.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#a9a6c5] leading-relaxed mb-4">
              That experience sent me into deep training in transformational coaching. I became certified
              through the International Coaching Federation (ICF), trained in positive psychology at the
              University of Pennsylvania, and have since worked with hundreds of professionals,
              entrepreneurs, and creatives across four continents.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="text-[#a9a6c5] leading-relaxed mb-8">
              My approach is direct but deeply human. I won&apos;t hand you a five-step framework. I will
              ask the questions that cut through the noise — and stay with you until clarity arrives.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-3">
              {["ICF Certified", "PCC Credential", "Penn-Trained"].map((b) => (
                <div key={b} className="px-4 py-2 rounded-full bg-[#c9943a]/10 text-[#e8b96a] text-xs font-semibold border border-[#c9943a]/25">
                  {b}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
const POSTS = [
  {
    tag: "Clarity",
    title: "Why You're Not Stuck — You're Just in Between",
    excerpt: "The uncomfortable middle ground between who you were and who you're becoming isn't a sign that something has gone wrong. It's the sign that something important is underway.",
    date: "April 12, 2026",
  },
  {
    tag: "Identity",
    title: "The Stories We Tell Ourselves — and How to Edit Them",
    excerpt: "Every decision you make is shaped by a narrative you inherited long before you could question it. Coaching begins the moment you realize you can rewrite it.",
    date: "March 28, 2026",
  },
  {
    tag: "Purpose",
    title: "Success Without Meaning Is Just a Very Busy Life",
    excerpt: "Achievement and fulfillment are not the same thing. If your calendar is full and your soul still feels empty, this piece is for you.",
    date: "March 5, 2026",
  },
];

function BlogCard({ post, delay }: { post: (typeof POSTS)[0]; delay: number }) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = use3dTilt(9);
  const glareX = useTransform(rotateY, [-9, 9], ["0%", "100%"]);
  const glareY = useTransform(rotateX, [9, -9], ["0%", "100%"]);

  return (
    <Reveal delay={delay} className="h-full">
      <div style={{ perspective: "900px" }} className="h-full">
        <motion.article
          ref={ref}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          whileHover={{ z: 16 }}
          transition={SPRING}
          className="relative bg-[#252260] rounded-2xl border border-[#2d2a5e] overflow-hidden group cursor-pointer h-full flex flex-col shadow-lg hover:shadow-[#c9943a]/10 hover:shadow-2xl transition-shadow duration-300"
        >
          {/* Specular glare that follows tilt */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(232,185,106,0.10) 0%, transparent 60%)` }}
          />
          {/* Gold accent bar */}
          <div className="h-1 bg-gradient-to-r from-[#c9943a] to-[#e8b96a]/40" />
          <div className="p-8 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#c9943a]">{post.tag}</span>
              <span className="text-xs text-[#a9a6c5]/50">{post.date}</span>
            </div>
            <h3
              className="text-xl font-bold text-[#fdf6e3] mb-3 leading-snug group-hover:text-[#e8b96a] transition-colors duration-200"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {post.title}
            </h3>
            <p className="text-[#a9a6c5] text-sm leading-relaxed flex-1">{post.excerpt}</p>
            <div className="mt-6 pt-5 border-t border-[#2d2a5e]">
              <span className="text-sm font-semibold text-[#c9943a] group-hover:text-[#e8b96a] transition-colors">Read More</span>
            </div>
          </div>
        </motion.article>
      </div>
    </Reveal>
  );
}

function Blog() {
  return (
    <section id="insights" className="bg-[#1e1b4b] py-28 border-t border-[#2d2a5e]">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-14">
          <p className="text-[#c9943a] text-sm font-semibold tracking-widest uppercase mb-3">Insights & Resources</p>
          <h2 className="text-4xl font-bold text-[#fdf6e3] leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
            Words to help you think more clearly.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {POSTS.map((post, i) => <BlogCard key={post.title} post={post} delay={i * 0.08} />)}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "What is coaching?", a: "Coaching is a structured, forward-looking partnership designed to help you gain clarity, build on your strengths, and take meaningful action toward what matters most to you. Unlike consulting, a coach doesn't tell you what to do — I help you discover what you already know, overcome the barriers in your way, and design a life that genuinely fits who you are." },
  { q: "Why should you listen to me as a Coach?", a: "Because I'm not offering you borrowed wisdom from a book I once read. I've navigated profound personal uncertainty, retrained from the ground up, and spent eight years doing this work with real people across vastly different life circumstances. I'm ICF certified, trained in positive psychology, and — more importantly — I've sat exactly where you're sitting now. That shapes how I listen." },
  { q: "How is coaching different from therapy?", a: "Therapy typically explores the past to heal what has been wounded. Coaching focuses primarily on the present and future — on where you are, where you want to go, and what's getting in the way. Both are valuable. Coaching is not a substitute for clinical mental health treatment, and if I believe therapy would serve you better, I'll say so honestly." },
  { q: "What can I expect in our first session?", a: "The first session is a conversation, not a performance. We'll explore what brought you here, what's working, what isn't, and what you're genuinely hoping for. You won't be evaluated or assessed. There are no wrong answers. By the end, you'll leave with at least one new perspective on your situation — and a clear sense of whether working together feels right." },
];

function FAQItem({ faq, index }: { faq: (typeof FAQS)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={index * 0.06}>
      <div className="border-b border-[#2d2a5e] last:border-0">
        <button onClick={() => setOpen((o) => !o)} className="w-full flex items-start gap-4 py-6 text-left group">
          <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border border-[#c9943a]/30 flex items-center justify-center text-[#c9943a]/60 text-xs font-bold group-hover:border-[#c9943a] group-hover:text-[#c9943a] transition-colors">
            {open ? "−" : "+"}
          </span>
          <span className="text-lg font-semibold text-[#fdf6e3] group-hover:text-[#e8b96a] transition-colors leading-snug" style={{ fontFamily: "'Georgia', serif" }}>
            {faq.q}
          </span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="pb-6 pl-10 text-[#a9a6c5] leading-relaxed">{faq.a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

function FAQ() {
  return (
    <section id="faq" className="bg-[#19173d] py-28 border-t border-[#2d2a5e]">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal className="mb-14">
          <p className="text-[#c9943a] text-sm font-semibold tracking-widest uppercase mb-3">Common Questions</p>
          <h2 className="text-4xl font-bold text-[#fdf6e3] leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
            Honest answers before we begin.
          </h2>
        </Reveal>
        {FAQS.map((faq, i) => <FAQItem key={faq.q} faq={faq} index={i} />)}
      </div>
    </section>
  );
}

// ─── Intake Form ──────────────────────────────────────────────────────────────
function IntakeForm({ formRef }: { formRef: React.RefObject<HTMLElement | null> }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "center center"] });
  const panelRotateX = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const panelY = useTransform(scrollYProgress, [0, 1], [50, 0]);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", story: "", current: "" });

  const set = (k: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }));

  const setRefs = useCallback((node: HTMLElement | null) => {
    (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node;
    if (formRef) (formRef as React.MutableRefObject<HTMLElement | null>).current = node;
  }, [formRef]);

  const inputCls = "w-full bg-[#19173d] border border-[#2d2a5e] text-[#fdf6e3] placeholder:text-[#a9a6c5]/40 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#c9943a] transition-colors";

  return (
    <section id="intake" ref={setRefs} className="bg-[#1e1b4b] py-28 relative overflow-hidden border-t border-[#2d2a5e]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#c9943a]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#818cf8]/8 blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 relative">
        <Reveal><p className="text-[#c9943a] text-sm font-semibold tracking-widest uppercase mb-3">Tell Me Your Story</p></Reveal>
        <Reveal delay={0.07}>
          <h2 className="text-4xl font-bold text-[#fdf6e3] mb-4 leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
            This is a safe space. Start wherever feels right.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="text-[#a9a6c5] mb-10 leading-relaxed">
            Everything you share here is strictly confidential. This form is just for us — it helps me understand where you are before we speak.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div style={{ perspective: "1200px" }}>
            <motion.div style={{ rotateX: panelRotateX, y: panelY, transformOrigin: "top center" }}>
              {!submitted ? (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="bg-[#252260] border border-[#2d2a5e] rounded-2xl p-8 shadow-2xl shadow-[#c9943a]/5">
                  {/* Progress bar */}
                  <div className="flex gap-2 mb-8">
                    {[1, 2].map((s) => (
                      <div key={s} className={`h-0.5 rounded-full flex-1 transition-all duration-500 ${s <= step ? "bg-[#c9943a]" : "bg-[#2d2a5e]"}`} />
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }} className="space-y-5">
                        <div>
                          <label className="block text-[#a9a6c5] text-sm font-medium mb-2">Your Name</label>
                          <input type="text" required value={values.name} onChange={set("name")} placeholder="How should I address you?" className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-[#a9a6c5] text-sm font-medium mb-2">Email Address</label>
                          <input type="email" required value={values.email} onChange={set("email")} placeholder="Where should I reach you?" className={inputCls} />
                        </div>
                        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          onClick={() => { if (values.name && values.email) setStep(2); }}
                          className="w-full py-4 rounded-xl bg-[#c9943a] text-[#1e1b4b] font-bold text-sm hover:bg-[#e8b96a] transition-colors shadow-lg shadow-[#c9943a]/20">
                          Continue
                        </motion.button>
                      </motion.div>
                    )}
                    {step === 2 && (
                      <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }} className="space-y-5">
                        <div>
                          <label className="block text-[#a9a6c5] text-sm font-medium mb-2">What is your story?</label>
                          <textarea required rows={4} value={values.story} onChange={set("story")} placeholder="Share as much or as little as you'd like. There's no right way to begin..." className={`${inputCls} resize-none`} />
                        </div>
                        <div>
                          <label className="block text-[#a9a6c5] text-sm font-medium mb-2">What are you currently going through?</label>
                          <textarea required rows={4} value={values.current} onChange={set("current")} placeholder="What brought you here today? A decision, a transition, a feeling you can't quite name..." className={`${inputCls} resize-none`} />
                        </div>
                        <div className="bg-[#c9943a]/8 border border-[#c9943a]/20 rounded-xl p-5 text-sm text-[#a9a6c5] leading-relaxed">
                          Share your story with me. I&apos;ll reach out via email with personal insights on how coaching can help you navigate this — plus,{" "}
                          <span className="text-[#e8b96a] font-semibold">your first exploratory session is entirely free.</span>
                        </div>
                        <div className="flex gap-3">
                          <button type="button" onClick={() => setStep(1)}
                            className="px-5 py-4 rounded-xl border border-[#2d2a5e] text-[#a9a6c5] text-sm hover:text-[#fdf6e3] hover:border-[#c9943a]/40 transition-colors">
                            Back
                          </button>
                          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            className="flex-1 py-4 rounded-xl bg-[#c9943a] text-[#1e1b4b] font-bold text-sm hover:bg-[#e8b96a] transition-colors shadow-lg shadow-[#c9943a]/20">
                            Send My Story
                          </motion.button>
                        </div>
                        <p className="text-center text-[#a9a6c5]/40 text-xs">Your responses are safe, private, and strictly confidential.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              ) : (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12 bg-[#252260] border border-[#2d2a5e] rounded-2xl p-8">
                  <div className="w-16 h-16 rounded-full bg-[#c9943a]/15 border-2 border-[#c9943a] flex items-center justify-center mx-auto mb-6">
                    <svg className="w-7 h-7 text-[#c9943a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#fdf6e3] mb-3" style={{ fontFamily: "'Georgia', serif" }}>
                    Thank you, {values.name.split(" ")[0]}.
                  </h3>
                  <p className="text-[#a9a6c5] leading-relaxed max-w-md mx-auto">
                    I&apos;ve received your story. I&apos;ll read it carefully and reach out personally within 48 hours — and to schedule your free session.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#19173d] border-t border-[#2d2a5e] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[#a9a6c5]/50 text-sm">&copy; 2026 Elena Hart Coaching. All rights reserved.</span>
        <div className="flex gap-6 text-sm text-[#a9a6c5]/40">
          <a href="#" className="hover:text-[#a9a6c5] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#a9a6c5] transition-colors">Terms</a>
          <a href="mailto:hello@elenahart.coach" className="hover:text-[#a9a6c5] transition-colors">hello@elenahart.coach</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const formRef = useRef<HTMLElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="font-sans antialiased bg-[#1e1b4b] text-[#fdf6e3]">
      <Nav onCTA={scrollToForm} />
      <Hero onCTA={scrollToForm} />
      <About />
      <Blog />
      <FAQ />
      <IntakeForm formRef={formRef} />
      <Footer />
    </div>
  );
}
