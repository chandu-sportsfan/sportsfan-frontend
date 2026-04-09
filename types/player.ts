export interface PlayerStats {
  runs: string;
  sr: string;
  avg: string;
}

export interface PlayerOverview {
  debut: string;
  specialization: string;
  dob: string;
  matches: string;
}

export interface SeasonStats {
  year: string;
  runs: string;
  strikeRate: string;
  average: string;
  fifties: number;
  hundreds: number;
  highestScore: string;
  fours: number;
  sixes: number;
  award: string;
  awardSub: string;
  wickets: number;
  bowlingAvg: string;
  economy: string;
  bowlingSR: string;
  bestBowling: string;
  threeWicketHauls: string;
  fiveWicketHauls: string;
  foursConceded: string;
  sixesConceded: string;
}

export interface CareerInsight {
  title: string;
  description: string;
}

export interface MediaItem {
  title: string;
  views: string;
  time: string;
  thumbnail: string;
}

export interface Player {
  name: string;
  team: string;
  battingStyle: string;
  bowlingStyle: string;
  avatar: string;
  about: string;
  stats: PlayerStats;
  overview: PlayerOverview;
  season: SeasonStats;
  insights: CareerInsight[];
  strengths: string[];
  media: MediaItem[];
}