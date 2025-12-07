export interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
  createdAt: number;
}

export enum FilterType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface AIPromptResponse {
  tasks: string[];
}
