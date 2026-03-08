export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#020617] to-black text-white px-6 py-20">

      {/* ===== HERO ===== */}
      <section className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          About SAFE-X7
        </h1>

        <p className="mt-6 text-white/70 text-lg">
          SAFE-X7 is a competition-grade phishing URL detection platform designed
          to help users identify malicious links before they cause damage.
        </p>
      </section>

      {/* ===== WHAT IS PHISHING ===== */}
      <section className="max-w-5xl mx-auto mt-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-cyan-400">
            What is Phishing?
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            Phishing is a cyber attack where attackers impersonate trusted
            organizations using fake websites, emails, or messages to steal
            sensitive information such as passwords, banking credentials, and
            OTPs.
          </p>
          <p className="mt-4 text-white/70 leading-relaxed">
            These attacks exploit human psychology — urgency, fear, curiosity,
            or rewards — making them one of the most dangerous and successful
            cyber threats today.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <ul className="space-y-4 text-white/80">
            <li>⚠️ Fake banking & payment pages</li>
            <li>⚠️ Malicious shortened URLs</li>
            <li>⚠️ Look-alike domains</li>
            <li>⚠️ Social engineering attacks</li>
          </ul>
        </div>
      </section>

      {/* ===== HOW SAFE-X WORKS ===== */}
      <section className="max-w-6xl mx-auto mt-24">
        <h2 className="text-3xl font-bold text-center text-cyan-400">
          How SAFE-X7 Works
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition"
            >
              <h3 className="text-xl font-semibold text-cyan-300">
                {step.title}
              </h3>
              <p className="mt-3 text-white/70 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY SAFE-X ===== */}
      <section className="max-w-5xl mx-auto mt-24 text-center">
        <h2 className="text-3xl font-bold text-cyan-400">
          Why SAFE-X7?
        </h2>
        <p className="mt-6 text-white/70">
          Unlike basic URL checkers, SAFE-X7 focuses on deep analysis,
          explainability, and user awareness — making cybersecurity accessible
          to everyone.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <Badge text="Deep URL Analysis" />
          <Badge text="Explainable Results" />
          <Badge text="Competition-Ready UI" />
          <Badge text="Cybersecurity Focused" />
        </div>
      </section>

      {/* ===== CREATOR ===== */}
      <section className="max-w-4xl mx-auto mt-28">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 text-center">
          <h3 className="text-2xl font-bold">
            Made by <span className="text-cyan-400">Fahad Mahfooz</span>
          </h3>
          <p className="mt-3 text-white/70">
            Cybersecurity Student • Full-Stack Developer • Security Enthusiast
          </p>

          <p className="mt-4 text-white/60 text-sm">
            Built as part of a competitive cybersecurity project to demonstrate
            modern frontend design, security awareness, and phishing detection
            concepts.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ===== DATA ===== */
const steps = [
  {
    title: "URL Input",
    desc: "User submits a website URL for analysis."
  },
  {
    title: "Deep Inspection",
    desc: "The system evaluates domain structure, patterns, and security signals."
  },
  {
    title: "Risk Assessment",
    desc: "The URL is classified with clear indicators and explanations."
  }
];

/* ===== COMPONENTS ===== */
function Badge({ text }) {
  return (
    <span className="px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-sm">
      {text}
    </span>
  );
}

