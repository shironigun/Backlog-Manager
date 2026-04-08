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
