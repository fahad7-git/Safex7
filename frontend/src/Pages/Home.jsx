import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#020617] text-white">

      {/* ================= HERO SECTION ================= */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">

        {/* Glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f172a,#020617)]"></div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-5xl md:text-6xl font-extrabold leading-tight"
        >
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Detect Phishing URLs
          </span>
          <br />
          Before Damage Happens
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 mt-8 max-w-2xl text-white/70 text-lg"
        >
          SAFE-X7 uses deep URL analysis, domain intelligence, and
          security heuristics to detect malicious and phishing links
          before they steal your data.
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 mt-12"
        >
          <Link to="/scan">
            <button className="px-12 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-2xl text-black font-semibold shadow-[0_0_40px_#22d3ee] transition">
              Start Scanning
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ================= WHAT IS PHISHING ================= */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-10 text-cyan-400"
        >
          What is Phishing?
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg leading-relaxed"
          >
            Phishing is a cyber attack where attackers impersonate
            trusted organizations using fake websites, emails, or
            messages to steal sensitive information like passwords,
            banking details, or OTPs.
            <br /><br />
            These attacks often look legitimate and exploit human
            psychology — urgency, fear, or rewards.
          </motion.p>

          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            alt="Phishing Attack"
            className="w-full max-w-sm mx-auto drop-shadow-2xl"
          />
        </div>
      </section>

      {/* ================= COMMON PHISHING METHODS ================= */}
      <section className="py-24 px-6 bg-[#020617]">
        <h2 className="text-4xl font-bold text-center text-purple-400 mb-16">
          How Attackers Trick You
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Fake Login Pages",
              text: "Attackers clone Google, Instagram, or banking sites to steal credentials."
            },
            {
              title: "Urgent Messages",
              text: "‘Your account will be blocked in 10 minutes’ — fear-driven clicks."
            },
            {
              title: "Shortened Links",
              text: "Malicious URLs hidden behind bit.ly or tinyurl links."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-[#020617] border border-white/10 rounded-2xl p-8 hover:border-cyan-400 transition"
            >
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                {item.title}
              </h3>
              <p className="text-white/70">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOW TO PROTECT ================= */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-green-400 mb-12">
          How to Protect Yourself
        </h2>

        <ul className="space-y-6 text-white/70 text-lg">
          <li>✔ Always verify URLs before clicking</li>
          <li>✔ Avoid links from unknown senders</li>
          <li>✔ Check domain spelling carefully</li>
          <li>✔ Use tools like SAFE-X7 before opening links</li>
        </ul>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 text-center bg-gradient-to-t from-black to-[#020617]">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-extrabold mb-8"
        >
          Scan Before You Click.
          <br />
          <span className="text-cyan-400">Stay One Step Ahead.</span>
        </motion.h2>

        <Link to="/scan">
          <button className="mt-6 px-14 py-5 bg-cyan-500 rounded-2xl text-black font-semibold shadow-[0_0_50px_#22d3ee] hover:bg-cyan-400 transition">
            Launch Scanner
          </button>
        </Link>

        <p className="mt-10 text-white/40 text-sm">
          Built with 🛡️ by <b>Fahad Mahfooz</b>
        </p>
      </section>
    </div>
  );
}
