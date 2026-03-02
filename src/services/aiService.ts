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

export const classifyNotesIntoFolders = async (notes: Note[]): Promise<Folder[]> => {
    if (notes.length === 0) return [];

    const prompt = `
    You are an intelligent note organizer for "Note.ai".
    Your task is to organize the following notes into meaningful folders based on their titles and content.
    
    Notes:
    ${notes.map(n => `- ID: ${n.id}, Title: "${n.title}", Content Preview: "${n.content.substring(0, 100)}..."`).join('\n')}

    Rules:
    1. Create a logical set of folders.
    2. Respond ONLY with a valid JSON array of folder objects.
    3. Each folder object MUST have: "id" (string), "name" (string), and "noteIds" (array of strings).
    4. Every note must belong to at least one folder.
    
    Example response format:
    [
      {"id": "f1", "name": "Work", "noteIds": ["uuid-1", "uuid-2"]},
      {"id": "f2", "name": "Personal", "noteIds": ["uuid-3"]}
    ]
  `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' },
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) throw new Error('No content returned from Groq');

        // Some models wrap in a parent object even if asked for array, handle that
        const parsed = JSON.parse(responseContent);
        return Array.isArray(parsed) ? parsed : (parsed.folders || []);
    } catch (error) {
        console.error('Error with Groq classification:', error);
        // Return a fallback "Uncategorized" folder if AI fails
        return [{
            id: 'default',
            name: 'All Notes',
            noteIds: notes.map(n => n.id)
        }];
    }
};
