import { Search, BookOpen, PenTool, ShieldCheck, Brain, Zap, Globe, FileText,
  Settings, Layers, Database, Server, Cpu } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'research', label: 'Research' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'tech-stack', label: 'Tech Stack' },
];

export const PIPELINE_AGENTS = [
  {
    id: 'search',
    step: 1,
    title: 'Search Agent',
    icon: Search,
    color: 'violet',
    description: 'Searches the web using Tavily API to find the most relevant, reliable, and detailed information on any topic.',
    tools: ['Tavily API', 'LangChain'],
  },
  {
    id: 'reader',
    step: 2,
    title: 'Reader Agent',
    icon: BookOpen,
    color: 'cyan',
    description: 'Scrapes and extracts meaningful content from web pages identified by the Search Agent using BeautifulSoup.',
    tools: ['BeautifulSoup', 'Requests'],
  },
  {
    id: 'writer',
    step: 3,
    title: 'Writer Agent',
    icon: PenTool,
    color: 'pink',
    description: 'Synthesizes research into a structured, professional report with introduction, key findings, and sources.',
    tools: ['Gemini', 'LangChain'],
  },
  {
    id: 'critic',
    step: 4,
    title: 'Critic Agent',
    icon: ShieldCheck,
    color: 'emerald',
    description: 'Reviews and scores the report on a 10-point scale, identifying strengths and areas for improvement.',
    tools: ['Gemini', 'LangChain'],
  },
];

export const EXAMPLE_TOPICS = [
  'Latest breakthroughs in quantum computing 2025',
  'Impact of AI on healthcare diagnostics',
  'SpaceX Starship development progress',
  'Advances in CRISPR gene editing',
  'State of autonomous vehicles in 2025',
  'Nuclear fusion energy progress',
];

export const TECH_STACK = [
  {
    category: 'Core AI',
    icon: Brain,
    items: [
      { name: 'LangChain' },
      { name: 'LangGraph' },
    ],
  },
  {
    category: 'LLM Providers',
    icon: Cpu,
    items: [
      { name: 'Gemini' },
    ],
  },
  {
    category: 'Search & Scraping',
    icon: Globe,
    items: [
      { name: 'Tavily' },
      { name: 'BeautifulSoup' },
      { name: 'Requests' },
    ],
  },
  {
    category: 'Infrastructure',
    icon: Server,
    items: [
      { name: 'FastAPI' },
      { name: 'Uvicorn' },
    ],
  },
];
