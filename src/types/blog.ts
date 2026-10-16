export type Category = 
  | 'Startup Success Stories'
  | 'Business Ideas'
  | 'Marketing Strategies'
  | 'Entrepreneurship'
  | 'AI for Startups'
  | 'Business Case Studies';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  createdAt: string;
  content: string;
  likes: number;
}

export interface ArticleSection {
  heading: string;
  content: string; // Markdown / prose
  quote?: {
    text: string;
    citation: string;
  };
  metricsTable?: {
    headers: string[];
    rows: (string | number)[][];
    caption?: string;
  };
  keyTakeaway?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: Category;
  readTime: string;
  publishedDate: string;
  featured: boolean;
  trendingRank?: number;
  author: Author;
  coverImage: string;
  coverCaption?: string;
  summary: string;
  tags: string[];
  sections: ArticleSection[];
  initialClaps: number;
  comments: Comment[];
}

export interface GeneratedIdea {
  conceptName: string;
  tagline: string;
  problemStatement: string;
  targetCustomer: string;
  valueProposition: string;
  monetizationModel: string;
  expectedGrossMargin: string;
  mvpLaunchPlan: {
    week: string;
    goal: string;
  }[];
  recommendedTechStack: string[];
  unfairAdvantage: string;
  potentialRisksAndMitigations: string;
  dateGenerated?: string;
}
