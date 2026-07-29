import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EXAMPLE_TOPICS } from '@/data/constants';

export default function ResearchInput({ onSubmit, status, onCancel }) {
  const [topic, setTopic] = useState('');
  const isRunning = status === 'running';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim() && !isRunning) {
      onSubmit(topic.trim());
    }
  };

  const selectExample = (example) => {
    setTopic(example);
  };

  return (
    <section id="research" className="section research-section">
      <div className="container-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="research-header"
        >
          <h2>
            <Sparkles size={20} className="text-primary" />
            Start Your Research
          </h2>
          <p>Enter any topic and our AI agents will research it for you in real-time.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="research-form"
        >
          <div className="research-input-wrapper">
            <Input
              type="text"
              placeholder="Enter a research topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isRunning}
            />
            {topic && !isRunning && (
              <button
                type="button"
                onClick={() => setTopic('')}
                className="research-clear-btn"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {isRunning ? (
            <Button type="button" variant="secondary" size="lg" onClick={onCancel}>
              <X size={16} />
              <span style={{ marginLeft: '4px' }}>Cancel</span>
            </Button>
          ) : (
            <Button type="submit" variant="primary" size="lg" disabled={!topic.trim()}>
              <Send size={16} />
              <span style={{ marginLeft: '4px' }}>Research</span>
            </Button>
          )}
        </motion.form>

        {status === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="examples-section"
          >
            <p className="examples-label">Try an example:</p>
            <div className="examples-grid">
              {EXAMPLE_TOPICS.map((ex) => (
                <button
                  key={ex}
                  onClick={() => selectExample(ex)}
                  className="example-chip"
                >
                  {ex}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
