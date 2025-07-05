// Purpose matching algorithm utilities

export interface User {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
  location: string;
  purposes: string[];
  interests: string[];
  connections: number;
  sessions: number;
  reviews: number;
  level: string;
}

export interface MatchScore {
  user: User;
  score: number;
  reasons: string[];
}

// Purpose compatibility matrix - defines how well different purposes work together
const purposeCompatibility: Record<string, Record<string, number>> = {
  findMentor: {
    findMentee: 0.9,
    collaborate: 0.7,
    network: 0.8,
    learn: 0.6,
    share: 0.8,
    startup: 0.7,
    job: 0.6,
    freelance: 0.5,
    investment: 0.4,
    social: 0.5,
    creative: 0.6,
    tech: 0.8,
    business: 0.7,
  },
  findMentee: {
    findMentor: 0.9,
    collaborate: 0.6,
    network: 0.7,
    learn: 0.8,
    share: 0.6,
    startup: 0.5,
    job: 0.7,
    freelance: 0.6,
    investment: 0.3,
    social: 0.4,
    creative: 0.5,
    tech: 0.7,
    business: 0.6,
  },
  collaborate: {
    findMentor: 0.7,
    findMentee: 0.6,
    network: 0.8,
    learn: 0.7,
    share: 0.9,
    startup: 0.8,
    job: 0.6,
    freelance: 0.8,
    investment: 0.5,
    social: 0.6,
    creative: 0.9,
    tech: 0.8,
    business: 0.7,
  },
  network: {
    findMentor: 0.8,
    findMentee: 0.7,
    collaborate: 0.8,
    learn: 0.6,
    share: 0.7,
    startup: 0.7,
    job: 0.8,
    freelance: 0.7,
    investment: 0.6,
    social: 0.8,
    creative: 0.6,
    tech: 0.7,
    business: 0.8,
  },
  learn: {
    findMentor: 0.6,
    findMentee: 0.8,
    collaborate: 0.7,
    network: 0.6,
    share: 0.8,
    startup: 0.5,
    job: 0.7,
    freelance: 0.6,
    investment: 0.4,
    social: 0.5,
    creative: 0.7,
    tech: 0.8,
    business: 0.6,
  },
  share: {
    findMentor: 0.8,
    findMentee: 0.6,
    collaborate: 0.9,
    network: 0.7,
    learn: 0.8,
    startup: 0.6,
    job: 0.5,
    freelance: 0.7,
    investment: 0.4,
    social: 0.6,
    creative: 0.8,
    tech: 0.7,
    business: 0.6,
  },
  startup: {
    findMentor: 0.7,
    findMentee: 0.5,
    collaborate: 0.8,
    network: 0.7,
    learn: 0.5,
    share: 0.6,
    job: 0.4,
    freelance: 0.6,
    investment: 0.9,
    social: 0.5,
    creative: 0.7,
    tech: 0.8,
    business: 0.9,
  },
  job: {
    findMentor: 0.6,
    findMentee: 0.7,
    collaborate: 0.6,
    network: 0.8,
    learn: 0.7,
    share: 0.5,
    startup: 0.4,
    freelance: 0.5,
    investment: 0.3,
    social: 0.6,
    creative: 0.5,
    tech: 0.7,
    business: 0.8,
  },
  freelance: {
    findMentor: 0.5,
    findMentee: 0.6,
    collaborate: 0.8,
    network: 0.7,
    learn: 0.6,
    share: 0.7,
    startup: 0.6,
    job: 0.5,
    investment: 0.4,
    social: 0.5,
    creative: 0.8,
    tech: 0.7,
    business: 0.6,
  },
  investment: {
    findMentor: 0.4,
    findMentee: 0.3,
    collaborate: 0.5,
    network: 0.6,
    learn: 0.4,
    share: 0.4,
    startup: 0.9,
    job: 0.3,
    freelance: 0.4,
    social: 0.3,
    creative: 0.4,
    tech: 0.6,
    business: 0.8,
  },
  social: {
    findMentor: 0.5,
    findMentee: 0.4,
    collaborate: 0.6,
    network: 0.8,
    learn: 0.5,
    share: 0.6,
    startup: 0.5,
    job: 0.6,
    freelance: 0.5,
    investment: 0.3,
    creative: 0.6,
    tech: 0.5,
    business: 0.6,
  },
  creative: {
    findMentor: 0.6,
    findMentee: 0.5,
    collaborate: 0.9,
    network: 0.6,
    learn: 0.7,
    share: 0.8,
    startup: 0.7,
    job: 0.5,
    freelance: 0.8,
    investment: 0.4,
    social: 0.6,
    tech: 0.6,
    business: 0.5,
  },
  tech: {
    findMentor: 0.8,
    findMentee: 0.7,
    collaborate: 0.8,
    network: 0.7,
    learn: 0.8,
    share: 0.7,
    startup: 0.8,
    job: 0.7,
    freelance: 0.7,
    investment: 0.6,
    social: 0.5,
    creative: 0.6,
    business: 0.7,
  },
  business: {
    findMentor: 0.7,
    findMentee: 0.6,
    collaborate: 0.7,
    network: 0.8,
    learn: 0.6,
    share: 0.6,
    startup: 0.9,
    job: 0.8,
    freelance: 0.6,
    investment: 0.8,
    social: 0.6,
    creative: 0.5,
    tech: 0.7,
  },
};

// Interest compatibility matrix
const interestCompatibility: Record<string, Record<string, number>> = {
  tech: {
    design: 0.8,
    startups: 0.9,
    ai: 0.9,
    networking: 0.7,
    art: 0.5,
    music: 0.4,
    gaming: 0.7,
    sports: 0.3,
    travel: 0.4,
    food: 0.3,
    writing: 0.6,
    ux: 0.9,
  },
  design: {
    tech: 0.8,
    startups: 0.7,
    ai: 0.6,
    networking: 0.6,
    art: 0.9,
    music: 0.7,
    gaming: 0.6,
    sports: 0.4,
    travel: 0.5,
    food: 0.6,
    writing: 0.7,
    ux: 0.9,
  },
  startups: {
    tech: 0.9,
    design: 0.7,
    ai: 0.8,
    networking: 0.8,
    art: 0.5,
    music: 0.4,
    gaming: 0.6,
    sports: 0.4,
    travel: 0.5,
    food: 0.4,
    writing: 0.6,
    ux: 0.7,
  },
  ai: {
    tech: 0.9,
    design: 0.6,
    startups: 0.8,
    networking: 0.7,
    art: 0.5,
    music: 0.4,
    gaming: 0.7,
    sports: 0.3,
    travel: 0.4,
    food: 0.3,
    writing: 0.5,
    ux: 0.7,
  },
  networking: {
    tech: 0.7,
    design: 0.6,
    startups: 0.8,
    ai: 0.7,
    art: 0.5,
    music: 0.5,
    gaming: 0.5,
    sports: 0.6,
    travel: 0.6,
    food: 0.6,
    writing: 0.6,
    ux: 0.6,
  },
  art: {
    tech: 0.5,
    design: 0.9,
    startups: 0.5,
    ai: 0.5,
    networking: 0.5,
    music: 0.8,
    gaming: 0.6,
    sports: 0.4,
    travel: 0.7,
    food: 0.6,
    writing: 0.7,
    ux: 0.7,
  },
  music: {
    tech: 0.4,
    design: 0.7,
    startups: 0.4,
    ai: 0.4,
    networking: 0.5,
    art: 0.8,
    gaming: 0.5,
    sports: 0.4,
    travel: 0.6,
    food: 0.5,
    writing: 0.6,
    ux: 0.5,
  },
  gaming: {
    tech: 0.7,
    design: 0.6,
    startups: 0.6,
    ai: 0.7,
    networking: 0.5,
    art: 0.6,
    music: 0.5,
    sports: 0.6,
    travel: 0.4,
    food: 0.4,
    writing: 0.5,
    ux: 0.6,
  },
  sports: {
    tech: 0.3,
    design: 0.4,
    startups: 0.4,
    ai: 0.3,
    networking: 0.6,
    art: 0.4,
    music: 0.4,
    gaming: 0.6,
    travel: 0.5,
    food: 0.5,
    writing: 0.4,
    ux: 0.4,
  },
  travel: {
    tech: 0.4,
    design: 0.5,
    startups: 0.5,
    ai: 0.4,
    networking: 0.6,
    art: 0.7,
    music: 0.6,
    gaming: 0.4,
    sports: 0.5,
    food: 0.7,
    writing: 0.6,
    ux: 0.5,
  },
  food: {
    tech: 0.3,
    design: 0.6,
    startups: 0.4,
    ai: 0.3,
    networking: 0.6,
    art: 0.6,
    music: 0.5,
    gaming: 0.4,
    sports: 0.5,
    travel: 0.7,
    writing: 0.5,
    ux: 0.4,
  },
  writing: {
    tech: 0.6,
    design: 0.7,
    startups: 0.6,
    ai: 0.5,
    networking: 0.6,
    art: 0.7,
    music: 0.6,
    gaming: 0.5,
    sports: 0.4,
    travel: 0.6,
    food: 0.5,
    ux: 0.6,
  },
  ux: {
    tech: 0.9,
    design: 0.9,
    startups: 0.7,
    ai: 0.7,
    networking: 0.6,
    art: 0.7,
    music: 0.5,
    gaming: 0.6,
    sports: 0.4,
    travel: 0.5,
    food: 0.4,
    writing: 0.6,
  },
};

/**
 * Calculate match score between two users based on their purposes and interests
 */
export function calculateMatchScore(user1: User, user2: User): MatchScore {
  let totalScore = 0;
  const reasons: string[] = [];
  
  // Purpose compatibility (40% of total score)
  const purposeScore = calculatePurposeCompatibility(user1.purposes, user2.purposes);
  totalScore += purposeScore * 0.4;
  
  if (purposeScore > 0.7) {
    reasons.push('High purpose compatibility');
  } else if (purposeScore > 0.5) {
    reasons.push('Good purpose alignment');
  }
  
  // Interest compatibility (30% of total score)
  const interestScore = calculateInterestCompatibility(user1.interests, user2.interests);
  totalScore += interestScore * 0.3;
  
  if (interestScore > 0.7) {
    reasons.push('Shared interests');
  } else if (interestScore > 0.5) {
    reasons.push('Some common interests');
  }
  
  // Experience level compatibility (20% of total score)
  const experienceScore = calculateExperienceCompatibility(user1, user2);
  totalScore += experienceScore * 0.2;
  
  if (experienceScore > 0.7) {
    reasons.push('Complementary experience levels');
  }
  
  // Location compatibility (10% of total score)
  const locationScore = calculateLocationCompatibility(user1.location, user2.location);
  totalScore += locationScore * 0.1;
  
  if (locationScore > 0.8) {
    reasons.push('Same location');
  } else if (locationScore > 0.5) {
    reasons.push('Nearby locations');
  }
  
  return {
    user: user2,
    score: Math.round(totalScore * 100),
    reasons,
  };
}

function calculatePurposeCompatibility(purposes1: string[], purposes2: string[]): number {
  if (purposes1.length === 0 || purposes2.length === 0) return 0;
  
  let totalCompatibility = 0;
  let comparisons = 0;
  
  for (const purpose1 of purposes1) {
    for (const purpose2 of purposes2) {
      const compatibility = purposeCompatibility[purpose1]?.[purpose2] || 0;
      totalCompatibility += compatibility;
      comparisons++;
    }
  }
  
  return comparisons > 0 ? totalCompatibility / comparisons : 0;
}

function calculateInterestCompatibility(interests1: string[], interests2: string[]): number {
  if (interests1.length === 0 || interests2.length === 0) return 0;
  
  let totalCompatibility = 0;
  let comparisons = 0;
  
  for (const interest1 of interests1) {
    for (const interest2 of interests2) {
      const compatibility = interestCompatibility[interest1.toLowerCase()]?.[interest2.toLowerCase()] || 0;
      totalCompatibility += compatibility;
      comparisons++;
    }
  }
  
  return comparisons > 0 ? totalCompatibility / comparisons : 0;
}

function calculateExperienceCompatibility(user1: User, user2: User): number {
  // Calculate experience level based on connections, sessions, and reviews
  const exp1 = user1.connections + user1.sessions * 2 + user1.reviews * 3;
  const exp2 = user2.connections + user2.sessions * 2 + user2.reviews * 3;
  
  const diff = Math.abs(exp1 - exp2);
  const maxExp = Math.max(exp1, exp2);
  
  // Prefer complementary experience levels (mentor-mentee relationships)
  // but also allow for peer relationships
  if (diff === 0) return 0.8; // Same level
  if (diff <= maxExp * 0.3) return 0.9; // Complementary levels
  if (diff <= maxExp * 0.6) return 0.7; // Some difference
  return 0.4; // Very different levels
}

function calculateLocationCompatibility(location1: string, location2: string): number {
  if (location1 === location2) return 1.0;
  
  // Extract city and state/country
  const city1 = location1.split(',')[0]?.trim().toLowerCase();
  const city2 = location2.split(',')[0]?.trim().toLowerCase();
  
  if (city1 === city2) return 0.9;
  
  // Check if same state/country
  const region1 = location1.split(',')[1]?.trim().toLowerCase();
  const region2 = location2.split(',')[1]?.trim().toLowerCase();
  
  if (region1 && region2 && region1 === region2) return 0.7;
  
  return 0.3; // Different locations
}

/**
 * Find best matches for a user from a list of potential matches
 */
export function findBestMatches(user: User, potentialMatches: User[], maxResults: number = 10): MatchScore[] {
  const matches = potentialMatches
    .filter(match => match.id !== user.id) // Exclude self
    .map(match => calculateMatchScore(user, match))
    .filter(match => match.score > 30) // Only show matches above 30%
    .sort((a, b) => b.score - a.score);
  
  return matches.slice(0, maxResults);
}

/**
 * Get purpose suggestions based on user's interests and current purposes
 */
export function getPurposeSuggestions(user: User): string[] {
  const suggestions: string[] = [];
  const currentPurposes = new Set(user.purposes);
  
  // Analyze interests to suggest relevant purposes
  const interests = user.interests.map(i => i.toLowerCase());
  
  if (interests.includes('tech') || interests.includes('ai') || interests.includes('ux')) {
    if (!currentPurposes.has('tech')) suggestions.push('tech');
    if (!currentPurposes.has('learn')) suggestions.push('learn');
  }
  
  if (interests.includes('startups')) {
    if (!currentPurposes.has('startup')) suggestions.push('startup');
    if (!currentPurposes.has('investment')) suggestions.push('investment');
  }
  
  if (interests.includes('design') || interests.includes('art') || interests.includes('creative')) {
    if (!currentPurposes.has('creative')) suggestions.push('creative');
    if (!currentPurposes.has('collaborate')) suggestions.push('collaborate');
  }
  
  if (interests.includes('networking')) {
    if (!currentPurposes.has('network')) suggestions.push('network');
    if (!currentPurposes.has('social')) suggestions.push('social');
  }
  
  // Add general suggestions if user has few purposes
  if (user.purposes.length < 3) {
    if (!currentPurposes.has('network')) suggestions.push('network');
    if (!currentPurposes.has('learn')) suggestions.push('learn');
  }
  
  return suggestions.slice(0, 3); // Return top 3 suggestions
} 