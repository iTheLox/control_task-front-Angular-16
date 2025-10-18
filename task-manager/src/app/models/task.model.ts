export interface Task {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  owner_id: number;
  created_at?: string;
  completed_at?: string | null;
}

export interface TaskResponse {
  success: boolean;
  tasks?: Task[];
  task?: Task;
  message?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  owner_id: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}
