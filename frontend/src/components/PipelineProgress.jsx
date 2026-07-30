import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { PIPELINE_AGENTS } from '@/data/constants';

const statusIcons = {
  waiting: Clock,
  running: Loader2,
  completed: Check,
  error: AlertCircle,
};

function TimelineStep({ agent, stepData, index, isLast }) {
  const AgentIcon = agent.icon;
  const StatusIcon = statusIcons[stepData.status];
  const isRunning = stepData.status === 'running';
  const isCompleted = stepData.status === 'completed';
  const isError = stepData.status === 'error';
  const isWaiting = stepData.status === 'waiting';

  const classNames = [
    'timeline-step',
    isRunning && 'is-running',
    isCompleted && 'is-completed',
    isError && 'is-error',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <div className="timeline-node-wrapper">
        <motion.div 
          className="timeline-node"
          initial={false}
          animate={{ scale: isRunning ? 1.15 : 1 }}
        >
          <AgentIcon size={24} className={isRunning ? 'timeline-spinner' : ''} />
        </motion.div>
        
        {!isLast && (isCompleted || isRunning) && (
          <div className="timeline-line-active" />
        )}
      </div>

      <div className="timeline-content">
        <motion.div 
          className="timeline-card"
          layout
        >
          <div className="timeline-header">
            <div className="timeline-title-row">
              <span className={`status-badge-${stepData.status} timeline-status-badge`}>
                Step {agent.step}
              </span>
              <h4 className="timeline-title">{agent.title}</h4>
            </div>
            
            <div className={`step-status-icon step-status-${stepData.status}`}>
              <StatusIcon size={20} className={isRunning ? 'timeline-spinner' : ''} />
            </div>
          </div>

          <AnimatePresence>
            {!isWaiting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="timeline-message-container"
              >
                {isRunning && stepData.message && (
                  <div className="timeline-message">
                    <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                    {stepData.message}
                  </div>
                )}
                {stepData.content && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="timeline-result"
                    style={{
                      marginTop: '0.75rem',
                      padding: '1rem',
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    {typeof stepData.content === 'string' 
                      ? stepData.content 
                      : JSON.stringify(stepData.content, null, 2)}
                  </motion.div>
                )}
                {isError && stepData.message && (
                  <div className="timeline-error-text">
                    {stepData.message}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default function PipelineProgress({ steps, status }) {
  if (status === 'idle') return null;

  return (
    <div className="section progress-section">
      <div className="container-md">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="progress-header"
        >
          <h3 className="progress-title">
            <span className={`status-dot status-dot-${status}`} />
            Live Research Pipeline
          </h3>
          <span className="progress-status">
            {status === 'running' && 'Agents are actively researching the topic...'}
            {status === 'completed' && 'Research successfully completed!'}
            {status === 'error' && 'An error occurred during the research process.'}
          </span>
        </motion.div>

        <div className="timeline-container">
          {PIPELINE_AGENTS.map((agent, i) => (
            <TimelineStep
              key={agent.id}
              agent={agent}
              stepData={steps[agent.id]}
              index={i}
              isLast={i === PIPELINE_AGENTS.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
