// Type Definitions
export type Status = "New" | "Active" | "Blocked" | "Discussion Required" | "Resolved" | "Tested" | "Waiting for Release" | "Closed";
export type TicketType = "Story" | "Feature" | "Task" | "Epic" | "Defect";
export type Priority = "High" | "Medium" | "Low";
export type Role = "Developer" | "QA" | "Designer";
export type Phase = "Design" | "Development" | "QA" | "Released";

export interface Developer {
  id: string;
  name: string;
  role: Role;
}

export interface AssignmentHistory {
  role: Role;
  devId: string;
  devName: string;
  assignedAt: string;
  completedAt: string | null;
}

export interface Ticket {
  id: string;
  devId: string | null;
  title: string;
  description: string;
  acceptanceCriteria: string;
  adoLink: string;
  type: TicketType;
  status: Status;
  priority: Priority;
  dueDate: string;
  sprint: string;
  createdAt: string;
  // Timeline tracking
  currentPhase?: Phase;
  assignmentHistory?: AssignmentHistory[];
  designStartDate?: string;
  designEndDate?: string;
  devStartDate?: string;
  devResolvedDate?: string;
  testStartDate?: string;
  testEndDate?: string;
  releaseDate?: string;
}

export interface TicketForm {
  title: string;
  description: string;
  acceptanceCriteria: string;
  adoLink: string;
  type: TicketType;
  status: Status;
  priority: Priority;
  dueDate: string;
  sprint: string;
}

// Constants
export const STATUSES: Status[] = ["New","Active","Blocked","Discussion Required","Resolved","Tested","Waiting for Release","Closed"];
export const TYPES: TicketType[] = ["Story","Feature","Task","Epic","Defect"];
export const PRIORITIES: Priority[] = ["High","Medium","Low"];
export const ROLES: Role[] = ["Developer","QA","Designer"];
export const STATUS_COLORS: Record<Status, string> = {
  "New":"#6366f1",
  "Active":"#3b82f6",
  "Blocked":"#ef4444",
  "Discussion Required":"#f59e0b",
  "Resolved":"#10b981",
  "Tested":"#06b6d4",
  "Waiting for Release":"#8b5cf6",
  "Closed":"#6b7280"
};
export const PRIO_COLORS: Record<Priority, string> = {
  "High":"#ef4444",
  "Medium":"#f59e0b",
  "Low":"#22c55e"
};
export const TYPE_ICONS: Record<TicketType, string> = {
  "Story":"📖",
  "Feature":"✨",
  "Task":"✅",
  "Epic":"🎯",
  "Defect":"🐛"
};
export const PHASE_COLORS: Record<Phase, string> = {
  "Design":"#ec4899",
  "Development":"#6366f1",
  "QA":"#06b6d4",
  "Released":"#10b981"
};
export const ROLE_ICONS: Record<Role, string> = {
  "Designer":"🎨",
  "Developer":"💻",
  "QA":"🧪"
};
