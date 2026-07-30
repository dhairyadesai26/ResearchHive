import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Link, Copy, Check, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

function renderMarkdown(text) {
  if (!text) return '';
  if (typeof text !== 'string') {
    text = JSON.stringify(text, null, 2);
  }

  let html = text
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr />')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');

  html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  return `<p>${html}</p>`;
}

function extractUrls(text) {
  if (!text) return [];
  if (typeof text !== 'string') {
    text = JSON.stringify(text);
  }
  const urlRegex = /https?:\/\/[^\s\)\"<>]+/g;
  const matches = text.match(urlRegex) || [];
  return [...new Set(matches)];
}

function parseFeedback(text) {
  if (!text) return { score: null, strengths: [], improvements: [], verdict: '' };
  if (typeof text !== 'string') {
    text = JSON.stringify(text);
  }

  const scoreMatch = text.match(/Score:\s*(\d+)\/10/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

  const strengthsMatch = text.match(/Strengths?:\s*([\s\S]*?)(?=Areas|Improvements|One line|$)/i);
  const strengths = strengthsMatch
    ? strengthsMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim())
    : [];

  const improvementsMatch = text.match(/(?:Areas to Improve|Improvements?):\s*([\s\S]*?)(?=One line|Verdict|$)/i);
  const improvements = improvementsMatch
    ? improvementsMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim())
    : [];

  const verdictMatch = text.match(/(?:One line verdict|Verdict):\s*(.*)/i);
  const verdict = verdictMatch ? verdictMatch[1].trim() : '';

  return { score, strengths, improvements, verdict };
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" onClick={handleCopy}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span style={{ marginLeft: '4px' }}>{copied ? 'Copied' : 'Copy'}</span>
    </Button>
  );
}

function DownloadButton({ text, filename }) {
  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="ghost" onClick={handleDownload}>
      <Download size={14} />
      <span style={{ marginLeft: '4px' }}>Download</span>
    </Button>
  );
}

export default function ResultsPanel({ report, feedback, topic, status, onNewResearch }) {
  if (status !== 'completed' || (!report && !feedback)) return null;

  const parsedFeedback = parseFeedback(feedback);
  const urls = extractUrls(report);

  return (
    <div className="section results-section">
      <div className="container-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="report">
            <div className="results-header">
              <TabsList>
                <TabsTrigger value="report">
                  <FileText size={14} /> Report
                </TabsTrigger>
                <TabsTrigger value="feedback">
                  <MessageSquare size={14} /> Feedback
                </TabsTrigger>
                {urls.length > 0 && (
                  <TabsTrigger value="sources">
                    <Link size={14} /> Sources ({urls.length})
                  </TabsTrigger>
                )}
              </TabsList>

              <div className="results-actions">
                <CopyButton text={report} />
                <DownloadButton text={report} filename={`research-${topic?.replace(/\s+/g, '-')?.toLowerCase() || 'report'}.txt`} />
              </div>
            </div>

            <TabsContent value="report">
              <Card>
                <CardContent>
                  <div className="prose-report" dangerouslySetInnerHTML={{ __html: renderMarkdown(report) }} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardContent>
                  {parsedFeedback.score !== null && (
                    <div className="feedback-score">
                      <div className="feedback-score-value text-gradient">{parsedFeedback.score}/10</div>
                      <p className="feedback-score-label">Quality Score</p>
                    </div>
                  )}

                  <div className="feedback-grid">
                    {parsedFeedback.strengths.length > 0 && (
                      <div>
                        <h4 className="feedback-list-title" style={{ color: 'var(--accent-emerald)' }}>
                          <Check size={16} /> Strengths
                        </h4>
                        <ul className="feedback-list">
                          {parsedFeedback.strengths.map((s, i) => (
                            <li key={i} className="feedback-item">
                              <span className="feedback-dot feedback-dot-green" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {parsedFeedback.improvements.length > 0 && (
                      <div>
                        <h4 className="feedback-list-title" style={{ color: 'var(--accent-amber)' }}>
                          <MessageSquare size={16} /> Areas to Improve
                        </h4>
                        <ul className="feedback-list">
                          {parsedFeedback.improvements.map((s, i) => (
                            <li key={i} className="feedback-item">
                              <span className="feedback-dot feedback-dot-amber" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {parsedFeedback.verdict && (
                    <div className="feedback-verdict">
                      <h4>Verdict</h4>
                      <p>"{parsedFeedback.verdict}"</p>
                    </div>
                  )}

                  {parsedFeedback.score === null && (
                    <div className="prose-report" dangerouslySetInnerHTML={{ __html: renderMarkdown(feedback) }} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {urls.length > 0 && (
              <TabsContent value="sources">
                <Card>
                  <CardContent>
                    <ul className="sources-list">
                      {urls.map((url, i) => (
                        <li key={i} className="source-item">
                          <span className="source-number">{i + 1}</span>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="source-link">
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <button onClick={onNewResearch} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
               Start New Research
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
