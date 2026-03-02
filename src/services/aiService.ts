import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true // Essential for frontend-only demo
});

export interface Note {
    id: string; // Changed to string for Supabase UUID
    title: string;
    content: string;
    modified: string;
    user_id?: string;
    folder_id?: string | null;
}

export interface Folder {
    id: string;
    name: string;
    noteIds: string[]; // Changed to string array for Supabase UUIDs
}

export const classifyNotesIntoFolders = async (notes: Note[], existingFolderNames: string[] = []): Promise<Folder[]> => {
    if (notes.length === 0) return [];

    const prompt = `
    You are a professional knowledge management assistant for "Note.ai".
    Objective: Organize the provided notes into a clean, logical folder structure.
    
    Existing Folders: ${existingFolderNames.length > 0 ? existingFolderNames.join(', ') : 'None yet'}
    
    Notes to process:
    ${notes.map(n => `- ID: ${n.id}, Title: "${n.title || 'Untitled'}", Content: "${n.content.replace(/<[^>]*>/g, '').substring(0, 150)}..."`).join('\n')}

    Rules:
    1. PRIORITY: If a note fits into one of the "Existing Folders", you MUST use that folder name.
    2. INTELLIGENCE: Group related notes (e.g., "React Hooks" and "Vite Setup" both belong in "Development").
    3. MINIMALISM: Do not create too many folders. Aim for 3-5 broad categories unless more are strictly necessary.
    4. FORMAT: Respond ONLY with a valid JSON array of folder objects.
    5. SCHEMA: Each object must have "id" (string), "name" (string), and "noteIds" (string array).
    
    Example:
    [
      {"id": "auto-1", "name": "Work", "noteIds": ["uuid-1", "uuid-2"]},
      {"id": "auto-2", "name": "Personal", "noteIds": ["uuid-3"]}
    ]
  `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are an elite organizational AI that excels at categorizing information with high precision.' },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' },
            temperature: 0.1, // Low temperature for consistent categorization
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) throw new Error('No content from Groq');

        const parsed = JSON.parse(responseContent);
        const folders = Array.isArray(parsed) ? parsed : (parsed.folders || []);

        // Ensure we only return folders that actually have notes
        return folders.filter((f: Folder) => f.noteIds && f.noteIds.length > 0);
    } catch (error) {
        console.error('AI Classification error:', error);
        return [];
    }
};
