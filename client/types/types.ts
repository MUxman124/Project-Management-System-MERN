export type UserRole = 'admin' | 'project_manager' | 'team_lead' | 'developer';

export interface Comment {
  text: string;
  createdAt: Date;
}

 export interface Project {
  _id: string;
  name: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed" | "On Hold";
  project_manager: User;
  team: User[];
  tasks: Task[];
  startDate: string;
  endDate: string; 
  tags: string[];
  category: "web" | "mobile" | "desktop" | "other";
  createdAt: string; 
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "developer" | "project_manager" | string;
  projects: string[];
  profilePicture: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Task {
  _id: string;
  name: string;
  description: string;
  dueDate: string;
  assignedTo: string; 
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  createdAt: string;
  updatedAt: string;
}
