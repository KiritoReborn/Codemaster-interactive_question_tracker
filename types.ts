export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Status = 'Todo' | 'Revision' | 'Solved';

export interface Question {
  id: string;
  title: string;
  url: string;
  difficulty: Difficulty;
  status: Status;
  isBookmarked?: boolean;
  note?: string;
  description?: string;
}

export interface SubTopic {
  id: string;
  title: string;
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  subTopics: SubTopic[];
  isExpanded?: boolean;
}

export interface SheetData {
  topics: Topic[];
}