export interface Task {
  
    title: string;
    description?: string;
    status?: string;
    subtasks: SubTask[]
}

export interface SubTask {
    title: string;
    isCompleted: boolean;
}

export interface Column {
    name: string;
    tasks?: Task[];
}

export interface Board {
name: string;
columns: Column[];
index? : number;
}