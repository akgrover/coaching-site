import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

const CALENDLY_URL = "https://calendly.com/varkeyv";

// ─── Palette (reference) ──────────────────────────────────────────────────────
// lavender-bg    #f8f4ff  main background
// lavender-mid   #f1ecfb  alternate sections
// lavender-card  #ede6f8  card surfaces
// lavender-bdr   #d4c8ed  borders
// lavender-acc   #a891d4  accent purple
// gold           #c9a96e  champagne gold
// gold-dk        #a88040  darker gold for text
// plum-dark      #2a1f3d  headings
// plum-mid       #4a3a6a  body text
// plum-muted     #8070a0  secondary text / labels

const EASE = { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const;

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────
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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ ...EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Portrait ─────────────────────────────────────────────────────────────────
function Portrait() {
  return (
    <div className="relative select-none">
      <div
        className="w-72 md:w-80 rounded-[32px] overflow-hidden"
        style={{
          aspectRatio: "4/5",
          border: "1px solid #d4c8ed",
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}varkey.jpeg`}
          alt="Varkey Varghese"
          className="w-full h-full object-cover object-top"
        />
      </div>
      {/* gold frame glow */}
      <div
        className="absolute inset-0 rounded-[32px] pointer-events-none"
        style={{
          border: "1.5px solid rgba(201,169,110,0.28)",
          boxShadow: "0 0 40px rgba(201,169,110,0.14), 0 8px 32px rgba(168,145,212,0.10)",
        }}
      />
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-14 h-px ${className}`}
      style={{
        background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
      }}
    />
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ onCTA }: { onCTA: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...EASE, delay: 0.08 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? {
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 1px 24px rgba(168,145,212,0.08), 0 0 0 1px rgba(212,200,237,0.4)",
            }
          : {}
      }
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span
          className="text-[#2a1f3d] text-xl font-semibold tracking-wide"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Varkey Varghese
        </span>

        <div className="hidden md:flex gap-8 text-sm text-[#8070a0] font-normal">
          {[
            ["Philosophy", "#philosophy"],
            ["Working Together", "#working-together"],
            ["Connect", "#connect"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="hover:text-[#2a1f3d] transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        <button
          onClick={onCTA}
          className="text-sm font-medium px-5 py-2 rounded-full transition-all duration-200"
          style={{
            border: "1px solid rgba(201,169,110,0.55)",
            color: "#a88040",
            boxShadow: "0 0 16px rgba(201,169,110,0.08)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(201,169,110,0.08)";
            e.currentTarget.style.borderColor = "rgba(201,169,110,0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "";
            e.currentTarget.style.borderColor = "rgba(201,169,110,0.55)";
          }}
        >
          Let's Talk
        </button>
      </div>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onCTA }: { onCTA: () => void }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{
        background: "linear-gradient(170deg, #f8f4ff 0%, #f2ecfb 55%, #ece4f8 100%)",
      }}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-16 right-8 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(201,169,110,0.09) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-12 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168,145,212,0.10) 0%, transparent 70%)",
        }}
      />

      <motion.div
        style={{ opacity }}
        className="max-w-5xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center w-full"
      >
        {/* Text */}
        <motion.div style={{ y: textY }}>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE, delay: 0.1 }}
            className="text-[#a88040] text-xs font-medium tracking-[0.22em] uppercase mb-5"
          >
            Life &amp; Transformation Coaching
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE, delay: 0.18 }}
            className="text-5xl md:text-[3.6rem] font-semibold text-[#2a1f3d] leading-[1.08] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            There is nothing{" "}
            <em className="not-italic text-[#7a5fa0]">broken</em>{" "}
            in you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE, delay: 0.26 }}
            className="text-[#6a5880] text-lg leading-relaxed mb-10 max-w-md"
          >
            Sometimes we simply need a quiet, held space to listen to ourselves
            again. I'm here to walk that path alongside you — with full presence,
            deep partnership, and complete trust in who you already are.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE, delay: 0.33 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onCTA}
              className="px-8 py-4 rounded-full text-white font-medium text-base"
              style={{
                background: "linear-gradient(135deg, #c9a96e 0%, #b8903a 100%)",
                boxShadow:
                  "0 4px 28px rgba(201,169,110,0.30), 0 0 0 1px rgba(201,169,110,0.18)",
              }}
            >
              Let's have a conversation
            </motion.button>

            <motion.a
              href="#philosophy"
              whileHover={{ scale: 1.02 }}
              className="px-8 py-4 rounded-full border text-[#6a5880] font-medium text-base hover:text-[#2a1f3d] transition-colors duration-200 text-center"
              style={{ borderColor: "#d4c8ed" }}
            >
              My approach →
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Portrait */}
        <motion.div style={{ y: imageY }} className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...EASE, delay: 0.22 }}
          >
            <Portrait />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] text-[#a891d4] tracking-[0.25em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-8"
          style={{
            background: "linear-gradient(to bottom, #a891d4, transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}

// ─── Philosophy ───────────────────────────────────────────────────────────────
function Philosophy() {
  const pillars = [
    {
      symbol: "◈",
      title: "You are whole.",
      body: "I don't arrive to our sessions with a script to fix you. I come believing — completely — that you already carry within you everything you need. My role is to help you access it.",
    },
    {
      symbol: "◉",
      title: "We walk as partners.",
      body: "This is not a teacher and student. It's a partnership of equals. You bring your life; I bring my full presence. Together, we find what's true and what's calling you forward.",
    },
    {
      symbol: "◎",
      title: "I am fully here.",
      body: "Deep presence isn't a technique — it's a commitment. I listen to what you say, to what you don't say, and to what stirs beneath. I stay with you, without rushing, until something shifts.",
    },
  ];

  return (
    <section id="philosophy" className="bg-white py-28">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="text-center mb-20">
          <p className="text-[#a88040] text-xs font-medium tracking-[0.22em] uppercase mb-4">
            The Philosophy
          </p>
          <h2
            className="text-4xl md:text-5xl font-semibold text-[#2a1f3d] leading-[1.12] mb-6 max-w-2xl mx-auto"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            A Co-Active approach — because this is your life, not mine.
          </h2>
          <p className="text-[#6a5880] text-lg leading-relaxed max-w-xl mx-auto">
            Co-Active coaching is built on a simple, profound truth: the answers
            aren't in me. They're in you. My work is to hold the space where those
            answers can finally be heard.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-7">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div
                className="rounded-3xl p-8 h-full"
                style={{
                  background: "#f8f4ff",
                  border: "1px solid #e8e0f5",
                  boxShadow:
                    "0 0 0 1px rgba(201,169,110,0.06), 0 4px 28px rgba(168,145,212,0.06)",
                }}
              >
                <div className="text-3xl mb-5 opacity-70" style={{ color: "#c9a96e" }}>
                  {p.symbol}
                </div>
                <h3
                  className="text-xl font-semibold text-[#2a1f3d] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {p.title}
                </h3>
                <p className="text-[#6a5880] leading-relaxed text-sm">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pranic Healing ───────────────────────────────────────────────────────────
function PranicHealing() {
  return (
    <section
      className="py-24"
      style={{
        background: "linear-gradient(170deg, #f1ecfb 0%, #ede6f8 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto px-6 text-center">
        <Reveal>
          <GoldDivider className="mx-auto mb-8" />

          <p className="text-[#a88040] text-xs font-medium tracking-[0.22em] uppercase mb-5">
            A Quiet Foundation
          </p>

          <h2
            className="text-3xl md:text-4xl font-semibold text-[#2a1f3d] mb-7 leading-[1.18]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            There is more to a person than what can be spoken.
          </h2>

          <p className="text-[#6a5880] text-lg leading-relaxed mb-6">
            Alongside my coaching practice, I draw quietly on Pranic Healing — an
            energetic approach to wellbeing that works at the level of what we carry
            without words. I don't impose this on our sessions; rather, it informs
            how I listen, how I hold space, and why clients often describe leaving
            our conversations feeling lighter and more themselves than when they
            arrived.
          </p>

          <p
            className="text-[#8070a0] leading-relaxed"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
          >
            "Healing is less about adding something new, and more about clearing
            what has gathered in the way."
          </p>

          <GoldDivider className="mx-auto mt-8" />
        </Reveal>
      </div>
    </section>
  );
}

// ─── Working Together ─────────────────────────────────────────────────────────
function WorkingTogether() {
  const experiences = [
    {
      number: "01",
      title: "A first conversation.",
      body: "We begin with a single, unhurried conversation — no agenda, no evaluation. You share what's on your mind and what you're longing for, and I simply listen to what's alive in you right now. There is no commitment required, and no wrong way to start. This session is completely free.",
    },
    {
      number: "02",
      title: "Making space to think.",
      body: "When we decide to work together, we meet regularly — usually once a week or fortnight — in sessions that are entirely yours. We follow what matters to you. Some weeks that's a major life decision; others, a single sentence you can't stop thinking about. The thread is always yours to hold.",
    },
    {
      number: "03",
      title: "Going as deep as you need.",
      body: "Some of the most meaningful work happens gradually, in the slow accumulation of honest conversations over months. Others arrive at a moment of clarity in a single afternoon. I don't have a prescribed path for you. We move at the pace your life asks for — and not a moment faster.",
    },
  ];

  return (
    <section id="working-together" className="bg-white py-28">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="mb-20">
          <p className="text-[#a88040] text-xs font-medium tracking-[0.22em] uppercase mb-4">
            Working Together
          </p>
          <h2
            className="text-4xl md:text-5xl font-semibold text-[#2a1f3d] leading-[1.12] max-w-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            There are no packages here. Only our time, and what we make of it.
          </h2>
        </Reveal>

        <div>
          {experiences.map((exp, i) => (
            <Reveal key={exp.title} delay={i * 0.08}>
              <div
                className="group grid md:grid-cols-[88px_1fr] gap-8 py-10 border-b"
                style={{ borderColor: "#ede6f8" }}
              >
                <div
                  className="text-5xl font-light leading-none transition-colors duration-300"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#d4c8ed",
                  }}
                >
                  {exp.number}
                </div>
                <div>
                  <h3
                    className="text-2xl font-semibold text-[#2a1f3d] mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {exp.title}
                  </h3>
                  <p className="text-[#6a5880] leading-relaxed max-w-xl">
                    {exp.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Connect / CTA ────────────────────────────────────────────────────────────
function Connect({
  formRef,
}: {
  formRef: React.RefObject<HTMLElement | null>;
}) {
  const [mode, setMode] = useState<"message" | "book">("message");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  const set =
    (k: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
    if (accessKey) {
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: accessKey,
            name: values.name,
            email: values.email,
            message: values.message,
          }),
        });
      } catch (_) {
        // fail silently — still show success to visitor
      }
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  const openCalendly = () => {
    window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
  };

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      if (formRef)
        (formRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [formRef]
  );

  const fieldCls = [
    "w-full rounded-2xl px-5 py-4 text-sm text-[#2a1f3d] bg-white",
    "placeholder:text-[#b8aed0] transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-[#a891d4]/20",
  ].join(" ");
  const inputCls = fieldCls;

  const cardStyle = {
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(212,200,237,0.6)",
    boxShadow: "0 0 0 1px rgba(201,169,110,0.08), 0 12px 48px rgba(168,145,212,0.10)",
  };

  return (
    <section
      id="connect"
      ref={setRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f1ecfb 0%, #e8e0f5 100%)" }}
    >
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,145,212,0.12) 0%, transparent 70%)" }} />

      <div className="max-w-lg mx-auto px-6 relative">
        <Reveal className="text-center mb-10">
          <GoldDivider className="mx-auto mb-7" />
          <p className="text-[#a88040] text-xs font-medium tracking-[0.22em] uppercase mb-4">
            Begin Here
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#2a1f3d] mb-5 leading-[1.12]"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Let's have a conversation.
          </h2>
          <p className="text-[#6a5880] text-lg leading-relaxed">
            No commitment, no pressure. Just a quiet beginning — wherever you are right now.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Mode toggle */}
          {!submitted && (
            <div className="flex rounded-2xl p-1 mb-6"
              style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(212,200,237,0.5)" }}>
              {(["message", "book"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  style={mode === m ? {
                    background: "rgba(255,255,255,0.95)",
                    color: "#2a1f3d",
                    boxShadow: "0 2px 12px rgba(168,145,212,0.14), 0 0 0 1px rgba(201,169,110,0.15)",
                  } : { color: "#8070a0" }}
                >
                  {m === "message" ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      Write to me
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="4" width="18" height="18" rx="3" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      Book a call
                    </>
                  )}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="thanks"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={EASE}
                className="rounded-3xl p-10 text-center"
                style={cardStyle}
              >
                <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #f8f4ff, #ede6f8)",
                    border: "1.5px solid rgba(201,169,110,0.38)", boxShadow: "0 0 24px rgba(201,169,110,0.14)" }}>
                  <svg className="w-6 h-6" fill="none" stroke="#c9a96e" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-[#2a1f3d] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Thank you, {values.name.split(" ")[0]}.
                </h3>
                <p className="text-[#6a5880] leading-relaxed">
                  I'll be in touch personally — and I look forward to our conversation.
                </p>
              </motion.div>
            ) : mode === "message" ? (
              <motion.form key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={EASE}
                onSubmit={handleSubmit}
                className="rounded-3xl p-8 space-y-4"
                style={cardStyle}
              >
                <div>
                  <label className="block text-[#8070a0] text-xs font-medium tracking-[0.12em] uppercase mb-2">
                    Your Name
                  </label>
                  <input type="text" required value={values.name} onChange={set("name")}
                    placeholder="How should I address you?" className={inputCls}
                    style={{ border: "1px solid #d4c8ed" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#a891d4"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#d4c8ed"; }} />
                </div>
                <div>
                  <label className="block text-[#8070a0] text-xs font-medium tracking-[0.12em] uppercase mb-2">
                    Email Address
                  </label>
                  <input type="email" required value={values.email} onChange={set("email")}
                    placeholder="Where should I reach you?" className={inputCls}
                    style={{ border: "1px solid #d4c8ed" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#a891d4"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#d4c8ed"; }} />
                </div>
                <div>
                  <label className="block text-[#8070a0] text-xs font-medium tracking-[0.12em] uppercase mb-2">
                    What's on your mind?
                  </label>
                  <textarea rows={4} value={values.message} onChange={set("message")}
                    placeholder="Share as much or as little as you'd like. There's no right way to begin…"
                    className={`${fieldCls} resize-none`}
                    style={{ border: "1px solid #d4c8ed" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#a891d4"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#d4c8ed"; }} />
                </div>
                <div className="pt-2">
                  <motion.button type="submit" disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.97 }}
                    className="w-full py-4 rounded-2xl text-white font-medium text-sm disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg, #c9a96e 0%, #b8903a 100%)",
                      boxShadow: "0 4px 24px rgba(201,169,110,0.30), 0 0 0 1px rgba(201,169,110,0.18)" }}>
                    {submitting ? "Sending…" : "Send message"}
                  </motion.button>
                </div>
                <p className="text-center text-[#b8aed0] text-xs leading-relaxed pt-1">
                  Everything shared is held with care and complete confidentiality.
                </p>
              </motion.form>
            ) : (
              <motion.div key="book"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={EASE}
                className="rounded-3xl p-8 text-center"
                style={cardStyle}
              >
                <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #f8f4ff, #ede6f8)",
                    border: "1.5px solid rgba(201,169,110,0.28)", boxShadow: "0 0 20px rgba(201,169,110,0.10)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="3" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2a1f3d] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Book a discovery call
                </h3>
                <p className="text-[#6a5880] text-sm leading-relaxed mb-7">
                  A free 30-minute conversation — no agenda, no pitch. Just a chance
                  to meet, and to see if working together feels right.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openCalendly}
                  className="w-full py-4 rounded-2xl text-white font-medium text-sm"
                  style={{ background: "linear-gradient(135deg, #c9a96e 0%, #b8903a 100%)",
                    boxShadow: "0 4px 24px rgba(201,169,110,0.30), 0 0 0 1px rgba(201,169,110,0.18)" }}>
                  Choose a time
                </motion.button>
                <p className="text-[#b8aed0] text-xs mt-4">
                  Powered by Calendly — opens in a small overlay.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#2a1f3d" }} className="py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span
              className="text-white/90 text-lg font-semibold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Varkey Varghese
            </span>
            <p className="text-white/30 text-xs mt-1">
              Spiritual &amp; Life Coach
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-white/35">
            <a
              href="mailto:hello@varkeyvarghese.com"
              className="hover:text-white/65 transition-colors duration-200"
            >
              hello@varkeyvarghese.com
            </a>
            <span className="hidden sm:block text-white/15">·</span>
            <a href="#" className="hover:text-white/65 transition-colors duration-200">
              LinkedIn
            </a>
            <span className="hidden sm:block text-white/15">·</span>
            <a href="#" className="hover:text-white/65 transition-colors duration-200">
              Instagram
            </a>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-center text-white/20 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          &copy; 2026 Varkey Varghese. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const ctaRef = useRef<HTMLElement>(null);
  const scrollToForm = () =>
    ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="antialiased" style={{ fontFamily: "'Lato', sans-serif" }}>
      <Nav onCTA={scrollToForm} />
      <Hero onCTA={scrollToForm} />
      <Philosophy />
      <PranicHealing />
      <WorkingTogether />
      <Connect formRef={ctaRef} />
      <Footer />
    </div>
  );
}
