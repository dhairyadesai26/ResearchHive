import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionHeading from '@/components/SectionHeading';
import { PIPELINE_AGENTS } from '@/data/constants';

export default function Pipeline() {
  return (
    <section id="how-it-works" className="section pipeline-section">
      <div className="container">
        <SectionHeading
          badge="How It Works"
          title="The Research Pipeline"
          subtitle="Four AI agents work in sequence to produce comprehensive research reports automatically."
        />

        <div className="pipeline-grid">
          {PIPELINE_AGENTS.map((agent, i) => {
            const Icon = agent.icon;

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="pipeline-card"
              >
                {i < PIPELINE_AGENTS.length - 1 && (
                  <div className="pipeline-arrow">
                    <ArrowRight size={16} />
                  </div>
                )}

                <Card style={{ height: '100%' }}>
                  <CardContent>
                    <div className="pipeline-card-header">
                      <div className={`step-icon step-icon-${agent.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="pipeline-card-info">
                        <h3>{agent.title}</h3>
                        <Badge variant={agent.color} style={{ marginTop: '0.25rem' }}>Step {agent.step}</Badge>
                      </div>
                    </div>

                    <p className="pipeline-card-desc">
                      {agent.description}
                    </p>

                    <div className="pipeline-card-tools">
                      {agent.tools.map((tool) => (
                        <span key={tool} className="tool-tag">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
