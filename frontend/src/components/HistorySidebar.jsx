import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';

export default function HistorySidebar({ isOpen, onClose, history, fetchHistory, onLoadPastResearch, onDeleteHistoryItem }) {
  // Fetch history when sidebar opens
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Unknown date';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} className="text-emerald-400" />;
      case 'running': return <Clock size={14} className="text-violet-400 icon-spin" />;
      case 'error': return <AlertCircle size={14} className="text-red-400" />;
      default: return <Clock size={14} className="text-gray-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="history-overlay"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="history-sidebar"
          >
            <div className="history-header">
              <h3 className="history-title">
                <History size={18} />
                Research History
              </h3>
              <button onClick={onClose} className="history-close-btn" aria-label="Close History">
                <X size={20} />
              </button>
            </div>
            
            <div className="history-list">
              {history.length === 0 ? (
                <div className="history-empty">
                  No previous research found. Start a new research topic to see it here!
                </div>
              ) : (
                history.map((item) => (
                  <motion.button
                    key={item.run_id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="history-item"
                    onClick={() => {
                      onLoadPastResearch(item.run_id);
                      onClose();
                    }}
                  >
                    <div className="history-item-header">
                      <span className="history-item-date">{formatDate(item.created_at)}</span>
                      <div className="history-item-status">
                        {getStatusIcon(item.status)}
                        <span style={{ 
                          color: item.status === 'completed' ? 'var(--accent-emerald)' : 
                                 item.status === 'running' ? 'var(--accent-violet)' : 
                                 item.status === 'error' ? '#ef4444' : 'var(--text-muted)'
                        }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="history-item-topic">
                      {item.topic}
                    </div>
                    <button 
                      className="history-item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item.run_id);
                      }}
                      title="Delete this chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
