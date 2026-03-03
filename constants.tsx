
import React from 'react';
import { 
  Puzzle, 
  Search, 
  Brain, 
  Layers, 
  Shapes, 
  Target 
} from 'lucide-react';
import { Project, ProjectCategory } from './types';

export const COLORS = {
  yellow: '#F7DA21', // Spelling Bee
  green: '#6AAA64',  // Wordle
  purple: '#BC70AD', // Connections
  red: '#F05A5A',    // Letter Boxed
  blue: '#00B4D8',   // Tiles
  aqua: '#81C784',   // Vertex
  neutral: '#FAF9F6', // Paper
  border: 'rgba(0,0,0,0.08)'
};

// NYT Games-inspired graphics (maintained for subtle background layering)
const WordleGrid = () => (
  <div className="grid grid-cols-5 gap-1.5 w-28 opacity-20">
    {[...Array(20)].map((_, i) => (
      <div key={i} className={`h-5 w-5 rounded-sm ${i < 5 ? 'bg-black' : i < 10 ? 'bg-[#6AAA64]' : i < 15 ? 'bg-[#C9B458]' : 'bg-[#787C7E]'}`} />
    ))}
  </div>
);

const BeeHoneycomb = () => (
  <div className="relative w-24 h-24 opacity-20">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rotate-90 clip-path-hex" />
    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rotate-90 clip-path-hex" />
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rotate-90 clip-path-hex" />
    <div className="absolute top-1/4 left-2 w-8 h-8 bg-black rotate-90 clip-path-hex" />
    <div className="absolute top-1/4 right-2 w-8 h-8 bg-black rotate-90 clip-path-hex" />
    <div className="absolute bottom-1/4 left-2 w-8 h-8 bg-black rotate-90 clip-path-hex" />
    <div className="absolute bottom-1/4 right-2 w-8 h-8 bg-black rotate-90 clip-path-hex" />
  </div>
);

const ConnectionsPattern = () => (
  <div className="flex flex-col gap-2 w-28 opacity-20">
    <div className="h-4 w-full bg-black rounded-sm" />
    <div className="h-4 w-full bg-black rounded-sm opacity-80" />
    <div className="h-4 w-full bg-black rounded-sm opacity-60" />
    <div className="h-4 w-full bg-black rounded-sm opacity-40" />
  </div>
);

const TilesArt = () => (
  <div className="grid grid-cols-3 gap-1 w-24 opacity-20">
    {[...Array(9)].map((_, i) => (
      <div key={i} className={`h-6 w-6 border-2 border-black rounded-sm ${i % 2 === 0 ? 'bg-black' : 'bg-transparent'}`} />
    ))}
  </div>
);

export const PROJECTS: Project[] = [
  {
    id: 'spelling-bee-redesign',
    title: 'Patiently',
    description: 'AI-powered health infrastructure — founding designer, 2025.',
    category: ProjectCategory.UX_DESIGN,
    color: COLORS.yellow,
    icon: 'Brain',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    difficulty: 'Medium',
    skills: ['Health Structuring', 'Decision Architecture', 'AI UX'],
    content: ``
  },
  {
    id: 'superworld',
    title: 'Superworld',
    description: 'An AR real estate platform — buy, personalize, and monetize virtual land mapped to real-world locations.',
    category: ProjectCategory.PRODUCT_STRATEGY,
    color: COLORS.blue,
    icon: 'Layers',
    coverImage: '/cover-superworld.jpg',
    difficulty: 'Hard',
    skills: ['Cross-platform Design', 'Agile / Scrum', 'MVP Launch'],
    content: ``
  },
  {
    id: 'uniwell',
    title: 'Uniwell',
    description: 'A mobile app improving the treatment process for college students in the USA.',
    category: ProjectCategory.UX_DESIGN,
    color: COLORS.green,
    icon: 'Target',
    coverImage: '/cover-uniwell.jpg',
    difficulty: 'Medium',
    skills: ['PMF Validation', 'UX Strategy', 'Mobile Design'],
    content: ``
  },
  {
    id: '2d-moon',
    title: '2D Moon',
    description: 'A unique platform to display NFT owners\' collection and assets, and to socialize with other owners with similar interests.',
    category: ProjectCategory.UX_DESIGN,
    color: COLORS.purple,
    icon: 'Shapes',
    coverImage: '/cover-2dmoon.jpg',
    difficulty: 'Hard',
    skills: ['Innovative Design', 'Data-driven Design', 'End-to-end Ownership'],
    content: ``
  },
];

export const getIcon = (name: string, size = 24) => {
  switch (name) {
    case 'Puzzle': return <Puzzle size={size} />;
    case 'Search': return <Search size={size} />;
    case 'Brain': return <Brain size={size} />;
    case 'Layers': return <Layers size={size} />;
    case 'Shapes': return <Shapes size={size} />;
    case 'Target': return <Target size={size} />;
    default: return <Puzzle size={size} />;
  }
};

export const getGameGraphic = (id: string) => {
  switch (id) {
    case 'spelling-bee-redesign': return <BeeHoneycomb />;
    case 'wordle-analytics': return <WordleGrid />;
    case 'connections-system': return <ConnectionsPattern />;
    case 'tiles-craft': return <TilesArt />;
    default: return null;
  }
};
