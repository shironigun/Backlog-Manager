export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// File format for backlog data
export interface BacklogFileData {
  version: string;
  exportedAt: string;
  developers: any[];
  tickets: any[];
}

// Save data to file using File System Access API with fallback
export async function saveToFile(developers: any[], tickets: any[]): Promise<{ success: boolean; error?: string }> {
  const data: BacklogFileData = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    developers,
    tickets
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });

  try {
    // Try File System Access API (Chrome, Edge)
    if ('showSaveFilePicker' in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: `backlog-data-${new Date().toISOString().split('T')[0]}.json`,
        types: [{
          description: 'JSON File',
          accept: { 'application/json': ['.json'] }
        }]
      });
      
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      
      return { success: true };
    } else {
      // Fallback for Firefox, Safari
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backlog-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return { success: true };
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { success: false, error: 'Save cancelled' };
    }
    console.error('Error saving file:', error);
    return { success: false, error: error.message || 'Failed to save file' };
  }
}

// Load data from file using File System Access API with fallback
export async function loadFromFile(): Promise<{ success: boolean; data?: BacklogFileData; error?: string }> {
  try {
    let fileContent: string;

    // Try File System Access API (Chrome, Edge)
    if ('showOpenFilePicker' in window) {
      const [handle] = await (window as any).showOpenFilePicker({
        types: [{
          description: 'JSON File',
          accept: { 'application/json': ['.json'] }
        }],
        multiple: false
      });
      
      const file = await handle.getFile();
      fileContent = await file.text();
    } else {
      // Fallback for Firefox, Safari
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json,.json';
      
      fileContent = await new Promise((resolve, reject) => {
        input.onchange = async (e: any) => {
          const file = e.target?.files?.[0];
          if (!file) {
            reject(new Error('No file selected'));
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          reader.onerror = () => {
            reject(new Error('Failed to read file'));
          };
          reader.readAsText(file);
        };
        
        input.click();
      });
    }

    const data = JSON.parse(fileContent) as BacklogFileData;
    
    // Validate data structure
    if (!data.developers || !data.tickets) {
      return { success: false, error: 'Invalid file format: missing developers or tickets' };
    }

    return { success: true, data };
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message === 'No file selected') {
      return { success: false, error: 'Load cancelled' };
    }
    console.error('Error loading file:', error);
    return { success: false, error: error.message || 'Failed to load file' };
  }
}

// Timeline calculation utilities
import { Ticket, Role } from './types';

export interface TimelineSummary {
  designer?: number;
  developer?: number;
  qa?: number;
  total: number;
  current?: {
    role: Role;
    days: number;
  };
}

// Calculate days between two dates
export function calculateDays(startDate: string | null | undefined, endDate: string | null | undefined): number {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

// Get timeline summary showing days spent in each phase
export function getTimelineSummary(ticket: Ticket): TimelineSummary {
  const summary: TimelineSummary = { total: 0 };
  
  // Calculate from assignment history if available
  if (ticket.assignmentHistory && ticket.assignmentHistory.length > 0) {
    const roleMap: Record<string, number> = {};
    
    ticket.assignmentHistory.forEach(assignment => {
      const days = calculateDays(assignment.assignedAt, assignment.completedAt);
      const roleKey = assignment.role.toLowerCase() as 'designer' | 'developer' | 'qa';
      roleMap[roleKey] = (roleMap[roleKey] || 0) + days;
    });
    
    summary.designer = roleMap.designer;
    summary.developer = roleMap.developer;
    summary.qa = roleMap.qa;
  } else {
    // Fallback: calculate from phase dates
    if (ticket.designStartDate) {
      summary.designer = calculateDays(ticket.designStartDate, ticket.designEndDate);
    }
    if (ticket.devStartDate) {
      summary.developer = calculateDays(ticket.devStartDate, ticket.devResolvedDate);
    }
    if (ticket.testStartDate) {
      summary.qa = calculateDays(ticket.testStartDate, ticket.testEndDate);
    }
  }
  
  summary.total = (summary.designer || 0) + (summary.developer || 0) + (summary.qa || 0);
  
  // If ticket is currently assigned, add current phase info
  if (ticket.devId && ticket.currentPhase && ticket.currentPhase !== 'Released') {
    const roleMap: Record<string, Role> = {
      'Design': 'Designer',
      'Development': 'Developer',
      'QA': 'QA'
    };
    
    const currentRole = roleMap[ticket.currentPhase];
    if (currentRole) {
      // Find the current assignment start date
      let currentStart: string | undefined;
      if (ticket.assignmentHistory && ticket.assignmentHistory.length > 0) {
        const currentAssignment = ticket.assignmentHistory.find(a => !a.completedAt);
        currentStart = currentAssignment?.assignedAt;
      } else {
        // Fallback to phase dates
        if (ticket.currentPhase === 'Design') currentStart = ticket.designStartDate;
        if (ticket.currentPhase === 'Development') currentStart = ticket.devStartDate;
        if (ticket.currentPhase === 'QA') currentStart = ticket.testStartDate;
      }
      
      summary.current = {
        role: currentRole,
        days: calculateDays(currentStart, null)
      };
    }
  }
  
  return summary;
}

// Get current phase duration (for active tickets)
export function getCurrentPhaseDuration(ticket: Ticket): number {
  if (!ticket.devId || !ticket.currentPhase) return 0;
  
  const summary = getTimelineSummary(ticket);
  return summary.current?.days || 0;
}

// Format timeline summary as readable text
export function formatTimelineSummary(ticket: Ticket): string {
  const summary = getTimelineSummary(ticket);
  const parts: string[] = [];
  
  if (summary.designer) parts.push(`🎨 ${summary.designer}d`);
  if (summary.developer) parts.push(`💻 ${summary.developer}d`);
  if (summary.qa) parts.push(`🧪 ${summary.qa}d`);
  
  return parts.join(' | ') || 'No timeline data';
}
