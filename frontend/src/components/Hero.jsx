import { motion } from 'framer-motion';
import ParticleCanvas from '@/components/ParticleCanvas';
import { useTypewriter } from '@/hooks/useTypewriter';

export default function Hero() {
  const { displayedText, isTyping } = useTypewriter('ResearchHive Pipeline', {
    speed: 45,
    delay: 500,
  });

  return (
    <section id="hero" className="hero">
      <ParticleCanvas />
      
      <div className="hero-overlay" />
      <div className="hero-glow" />

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-badge"
        >
          <span className="hero-badge-dot" />
          <span>Powered by LangChain + Mistral AI</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hero-title"
        >
          <span className="text-gradient">{displayedText}</span>
          {isTyping && <span className="hero-cursor" />}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="hero-subtitle"
        >
          Four AI agents working autonomously — searching, reading, writing, and critiquing — to
          produce comprehensive, quality-scored research reports on any topic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="hero-stats"
        >
          {[
            { value: '4', label: 'AI Agents' },
            { value: '6+', label: 'LLM Providers' },
            { value: '30+', label: 'Dependencies' },
            { value: '∞', label: 'Topics' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="hero-stat-value text-gradient">{stat.value}</div>
              <div className="hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
