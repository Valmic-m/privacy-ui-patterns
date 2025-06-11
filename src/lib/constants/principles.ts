export const PBD_PRINCIPLES = [
  { 
    id: 'proactive', 
    name: 'Proactive not Reactive', 
    abbr: 'P1',
    description: 'Privacy measures should anticipate and prevent privacy invasions before they occur, not wait for them to happen.'
  },
  { 
    id: 'default', 
    name: 'Privacy as the Default', 
    abbr: 'P2',
    description: 'Privacy protection should be built into systems by default, without requiring action from the user.'
  },
  { 
    id: 'embedded', 
    name: 'Privacy Embedded into Design', 
    abbr: 'P3',
    description: 'Privacy should be considered as an essential component of system design, not an add-on.'
  },
  { 
    id: 'positive', 
    name: 'Full Functionality - Positive-Sum', 
    abbr: 'P4',
    description: 'Privacy should not come at the expense of functionality; both can be achieved.'
  },
  { 
    id: 'security', 
    name: 'End-to-End Security', 
    abbr: 'P5',
    description: 'Security measures should protect data throughout its entire lifecycle.'
  },
  { 
    id: 'visibility', 
    name: 'Visibility and Transparency', 
    abbr: 'P6',
    description: 'All stakeholders should be assured that data practices are operating according to stated promises.'
  },
  { 
    id: 'respect', 
    name: 'Respect for User Privacy', 
    abbr: 'P7',
    description: 'User interests should be prioritized with strong privacy defaults and user-friendly options.'
  }
];

export const NIELSEN_HEURISTICS = [
  { 
    id: 'visibility', 
    name: 'Visibility of system status', 
    abbr: 'H1',
    description: 'The system should always keep users informed about what is going on.'
  },
  { 
    id: 'match', 
    name: 'Match between system and real world', 
    abbr: 'H2',
    description: 'The system should speak the users\' language and follow real-world conventions.'
  },
  { 
    id: 'control', 
    name: 'User control and freedom', 
    abbr: 'H3',
    description: 'Users should be able to undo and redo actions and have clearly marked emergency exits.'
  },
  { 
    id: 'consistency', 
    name: 'Consistency and standards', 
    abbr: 'H4',
    description: 'Users should not have to wonder whether different words or actions mean the same thing.'
  },
  { 
    id: 'prevention', 
    name: 'Error prevention', 
    abbr: 'H5',
    description: 'Design should prevent problems from occurring in the first place.'
  },
  { 
    id: 'recognition', 
    name: 'Recognition rather than recall', 
    abbr: 'H6',
    description: 'Instructions should be visible or easily retrievable, minimizing memory load.'
  },
  { 
    id: 'flexibility', 
    name: 'Flexibility and efficiency of use', 
    abbr: 'H7',
    description: 'Design should cater to both inexperienced and experienced users.'
  },
  { 
    id: 'aesthetic', 
    name: 'Aesthetic and minimalist design', 
    abbr: 'H8',
    description: 'Interfaces should not contain irrelevant or rarely needed information.'
  },
  { 
    id: 'recovery', 
    name: 'Help users recognize, diagnose, and recover from errors', 
    abbr: 'H9',
    description: 'Error messages should be expressed in plain language and suggest solutions.'
  },
  { 
    id: 'help', 
    name: 'Help and documentation', 
    abbr: 'H10',
    description: 'Documentation should be easy to search, focused on user tasks, and list concrete steps.'
  }
];

export const BADGE_LEVELS = {
  1: { name: 'Privacy Pioneer', icon: 'shield-check', color: 'bronze' },
  5: { name: 'Guardian', icon: 'shield-star', color: 'silver' },
  10: { name: 'Sentinel', icon: 'shield-badge', color: 'gold' },
  25: { name: 'Master Investigator', icon: 'shield-crown', color: 'platinum' }
};

export function getBadgeLevel(contributionCount: number) {
  if (contributionCount >= 25) return BADGE_LEVELS[25];
  if (contributionCount >= 10) return BADGE_LEVELS[10];
  if (contributionCount >= 5) return BADGE_LEVELS[5];
  return BADGE_LEVELS[1];
}