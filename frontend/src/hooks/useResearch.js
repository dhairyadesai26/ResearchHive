import { useState, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const STEP_ORDER = ['search', 'reader', 'writer', 'critic'];

export function useResearch(session) {
  const [status, setStatus] = useState('idle');
  const [currentStep, setCurrentStep] = useState(null);
  const [steps, setSteps] = useState({
    search:  { status: 'waiting', title: 'Search Agent',  message: '', content: '' },
    reader:  { status: 'waiting', title: 'Reader Agent',  message: '', content: '' },
    writer:  { status: 'waiting', title: 'Writer Agent',  message: '', content: '' },
    critic:  { status: 'waiting', title: 'Critic Agent',  message: '', content: '' },
  });
  const [report, setReport] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState('');
  const [history, setHistory] = useState([]);
  const eventSourceRef = useRef(null);

  const resetState = () => {
    setSteps({
      search:  { status: 'waiting', title: 'Search Agent',  message: '', content: '' },
      reader:  { status: 'waiting', title: 'Reader Agent',  message: '', content: '' },
      writer:  { status: 'waiting', title: 'Writer Agent',  message: '', content: '' },
      critic:  { status: 'waiting', title: 'Critic Agent',  message: '', content: '' },
    });
    setReport('');
    setFeedback('');
    setError(null);
    setCurrentStep(null);
  };

  const startResearch = useCallback(async (researchTopic) => {
    if (!researchTopic?.trim()) return;

    resetState();
    setTopic(researchTopic);
    setStatus('running');

    try {
      const response = await fetch(`${API_BASE}/api/research`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ topic: researchTopic }),
      });

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errData = await response.json();
          if (errData && errData.detail) {
            errorMessage += ` - ${errData.detail}`;
          }
        } catch (e) {
        }
        throw new Error(errorMessage);
      }

      const { run_id } = await response.json();

      const eventSource = new EventSource(`${API_BASE}/api/research/${run_id}/stream?token=${session?.access_token}`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'step_start':
              setCurrentStep(data.step);
              setSteps((prev) => ({
                ...prev,
                [data.step]: {
                  ...prev[data.step],
                  status: 'running',
                  title: data.title || prev[data.step].title,
                  message: data.message || '',
                },
              }));
              break;

            case 'step_result':
              setSteps((prev) => ({
                ...prev,
                [data.step]: {
                  ...prev[data.step],
                  status: 'completed',
                  content: data.content || '',
                },
              }));
              break;

            case 'report':
              setReport(data.content || '');
              break;

            case 'feedback':
              setFeedback(data.content || '');
              break;

            case 'complete':
              setStatus('completed');
              setCurrentStep(null);
              eventSource.close();
              break;

            case 'error':
              setError(data.message || 'An unknown error occurred');
              setStatus('error');
              if (data.step) {
                setSteps((prev) => ({
                  ...prev,
                  [data.step]: {
                    ...prev[data.step],
                    status: 'error',
                    message: data.message || '',
                  },
                }));
              }
              eventSource.close();
              break;

            default:
              break;
          }
        } catch (e) {
          console.error('Failed to parse SSE event:', e);
        }
      };

      eventSource.onerror = () => {
        setError('Connection to server lost. Please check that the backend is running.');
        setStatus('error');
        eventSource.close();
      };
    } catch (err) {
      setError(err.message || 'Failed to connect to server');
      setStatus('error');
    }
  }, [session]);

  const cancelResearch = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setStatus('idle');
    resetState();
  }, []);

  const startNewResearch = useCallback(() => {
    cancelResearch();
  }, [cancelResearch]);

  const fetchHistory = useCallback(async () => {
    if (!session) return;
    try {
      const response = await fetch(`${API_BASE}/api/research`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data.runs || []);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, [session]);

  const loadPastResearch = useCallback(async (runId) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    
    resetState();
    setStatus('running');
    
    try {
      const response = await fetch(`${API_BASE}/api/research/${runId}`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (!response.ok) throw new Error('Failed to load past research');
      
      const data = await response.json();
      setTopic(data.topic);
      
      if (data.status === 'completed' || data.status === 'error') {
        if (data.results?.report) setReport(data.results.report);
        if (data.results?.feedback) setFeedback(data.results.feedback);
        
        setSteps(prev => {
          const newSteps = { ...prev };
          STEP_ORDER.forEach(step => {
            if (data.results && data.results[step]) {
              newSteps[step] = {
                ...newSteps[step],
                status: 'completed',
                content: data.results[step]
              };
            }
          });
          return newSteps;
        });
      }
      
      setStatus(data.status);
    } catch (err) {
      console.error(err);
      setError('Failed to load past research');
      setStatus('error');
    }
  }, [session]);
  const deleteHistoryItem = useCallback(async (runId) => {
    if (!session) return;
    try {
      const response = await fetch(`${API_BASE}/api/research/${runId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (response.ok) {
        await fetchHistory();
      }
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  }, [session, fetchHistory]);

  return {
    status,
    currentStep,
    steps,
    report,
    feedback,
    error,
    topic,
    history,
    startResearch,
    cancelResearch,
    startNewResearch,
    fetchHistory,
    loadPastResearch,
    deleteHistoryItem,
  };
}
