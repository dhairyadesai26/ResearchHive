import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import SectionHeading from '@/components/SectionHeading';
import { TECH_STACK } from '@/data/constants';

export default function TechStack() {
  return (
    <section id="tech-stack" className="section tech-section">
      <div className="container">
        <SectionHeading
          badge="Technology"
          title="Built With the Best"
          subtitle="A curated stack of cutting-edge technologies powering the research pipeline."
        />

        <div className="tech-grid">
          {TECH_STACK.map((category, ci) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: ci * 0.08 }}
              >
                <div className="tech-category-header">
                  <div className="tech-icon">
                    <Icon size={14} />
                  </div>
                  <h3 className="tech-category-name">{category.category}</h3>
                </div>

                <div className="tech-tags">
                  {category.items.map((item, ii) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: ci * 0.08 + ii * 0.04 }}
                    >
                      <Badge variant="outline">
                        {item.name}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
