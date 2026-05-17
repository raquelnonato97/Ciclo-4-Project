export interface Task {
  id: string;
  title: string;
  details: string;
  createdAt: string;
  completedAt: string | null;
}