export interface ProblemList {
  problems: Problem[];
  pageCount: number;
  currentCount: number;
  totalCount: number;
  difficulty: string;
}

export type Problem = {
  id: number;
  lmid: string;
  title: string;
  slug: string;
  tags: {
    label: string;
    slug: string;
  }[];
  active: boolean;
  difficulty: {
    level: string;
    name: string;
  };
  points: number;
  year: number;
  description: string;
  domjudgeID: string;
};
