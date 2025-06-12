import { PbdPrinciple, NielsenHeuristic, BadgeLevel } from '@/types/database';

// Privacy by Design Principles (Cavoukian's 7 Foundational Principles)
export const PBD_PRINCIPLES: PbdPrinciple[] = [
  { 
    id: 'proactive', 
    name: 'Proactive not Reactive', 
    abbr: 'P1',
    description: 'Privacy measures are anticipatory and preventive, not reactive and remedial.'
  },
  { 
    id: 'default', 
    name: 'Privacy as the Default', 
    abbr: 'P2',
    description: 'Maximum privacy protection is delivered without requiring action by the individual.'
  },
  { 
    id: 'embedded', 
    name: 'Privacy Embedded into Design', 
    abbr: 'P3',
    description: 'Privacy is incorporated into the design and architecture as a core component.'
  },
  { 
    id: 'positive', 
    name: 'Full Functionality - Positive-Sum', 
    abbr: 'P4',
    description: 'Privacy does not come at the expense of functionality. All interests are accommodated.'
  },
  { 
    id: 'security', 
    name: 'End-to-End Security', 
    abbr: 'P5',
    description: 'Data is secure throughout its entire lifecycle from collection to destruction.'
  },
  { 
    id: 'visibility', 
    name: 'Visibility and Transparency', 
    abbr: 'P6',
    description: 'All stakeholders can verify that privacy practices operate according to stated promises.'
  },
  { 
    id: 'respect', 
    name: 'Respect for User Privacy', 
    abbr: 'P7',
    description: 'User interests are kept paramount and privacy defaults, appropriate notice, and empowerment are provided.'
  }
];

// Nielsen's 10 Usability Heuristics
export const NIELSEN_HEURISTICS: NielsenHeuristic[] = [
  { 
    id: 'visibility', 
    name: 'Visibility of system status', 
    abbr: 'H1',
    description: 'The system should always keep users informed about what is going on through appropriate feedback.'
  },
  { 
    id: 'match', 
    name: 'Match between system and real world', 
    abbr: 'H2',
    description: 'The system should speak the users\' language with familiar words, phrases, and concepts.'
  },
  { 
    id: 'control', 
    name: 'User control and freedom', 
    abbr: 'H3',
    description: 'Users often perform actions by mistake and need clearly marked emergency exits.'
  },
  { 
    id: 'consistency', 
    name: 'Consistency and standards', 
    abbr: 'H4',
    description: 'Users should not have to wonder whether different words, situations, or actions mean the same thing.'
  },
  { 
    id: 'prevention', 
    name: 'Error prevention', 
    abbr: 'H5',
    description: 'Good design prevents problems from occurring in the first place.'
  },
  { 
    id: 'recognition', 
    name: 'Recognition rather than recall', 
    abbr: 'H6',
    description: 'Minimize memory load by making objects, actions, and options visible.'
  },
  { 
    id: 'flexibility', 
    name: 'Flexibility and efficiency of use', 
    abbr: 'H7',
    description: 'Accelerators may speed up interaction for expert users while remaining invisible to novice users.'
  },
  { 
    id: 'aesthetic', 
    name: 'Aesthetic and minimalist design', 
    abbr: 'H8',
    description: 'Interfaces should not contain information that is irrelevant or rarely needed.'
  },
  { 
    id: 'recovery', 
    name: 'Help users recognize, diagnose, and recover from errors', 
    abbr: 'H9',
    description: 'Error messages should be expressed in plain language and constructively suggest a solution.'
  },
  { 
    id: 'help', 
    name: 'Help and documentation', 
    abbr: 'H10',
    description: 'Documentation should be easy to search, focused on the user\'s task, and list concrete steps.'
  }
];

// Badge System for Contributors
export const BADGE_LEVELS: BadgeLevel[] = [
  { level: 1, name: 'Privacy Pioneer', icon: 'shield-check', required_contributions: 1 },
  { level: 2, name: 'Guardian', icon: 'shield-star', required_contributions: 5 },
  { level: 3, name: 'Sentinel', icon: 'shield-badge', required_contributions: 10 },
  { level: 4, name: 'Master Investigator', icon: 'shield-crown', required_contributions: 25 },
];

// Helper functions
export function getPbdPrincipleByAbbr(abbr: string): PbdPrinciple | undefined {
  return PBD_PRINCIPLES.find(principle => principle.abbr === abbr);
}

export function getNielsenHeuristicByAbbr(abbr: string): NielsenHeuristic | undefined {
  return NIELSEN_HEURISTICS.find(heuristic => heuristic.abbr === abbr);
}

export function getPbdPrincipleById(id: string): PbdPrinciple | undefined {
  return PBD_PRINCIPLES.find(principle => principle.id === id);
}

export function getNielsenHeuristicById(id: string): NielsenHeuristic | undefined {
  return NIELSEN_HEURISTICS.find(heuristic => heuristic.id === id);
}

export function getBadgeLevel(contributionCount: number): BadgeLevel {
  const sortedLevels = BADGE_LEVELS.sort((a, b) => b.required_contributions - a.required_contributions);
  return sortedLevels.find(level => contributionCount >= level.required_contributions) || BADGE_LEVELS[0];
}

export function getBadgeLevelByName(name: string): BadgeLevel | undefined {
  return BADGE_LEVELS.find(level => level.name === name);
}