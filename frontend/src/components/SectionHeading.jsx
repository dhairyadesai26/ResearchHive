import { motion } from 'framer-motion';

export default function SectionHeading({ badge, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="section-heading"
    >
      {badge && (
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          <span>{badge}</span>
        </div>
      )}
      <h2 className="section-title">
        {title}
      </h2>
      {subtitle && (
        <p className="section-subtitle">
          {subtitle}
        </p>
      )}
      <div className="section-line" />
    </motion.div>
  );
}
