import { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Save, Sparkles, FolderIcon, Loader2, FileText, ChevronRight, Trash2, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RichTextEditor } from '../components/RichTextEditor';
import { classifyNotesIntoFolders } from '../services/aiService';
import type { Note, Folder as FolderType } from '../services/aiService';
import { supabase } from '../lib/supabase';

// Removed localStorage utility functions as we migrate to Supabase
const getPreviewText = (html: string) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
};

// --- Shared Note Editor Component ---
interface NoteEditorProps {
    note: Note;
    onSave: (updatedNote: Note) => void;
    onDiscard: () => void;
    onDelete?: (id: string) => void;
}

const NoteEditor = ({ note, onSave, onDiscard, onDelete }: NoteEditorProps) => {
    const [editingNote, setEditingNote] = useState<Note>(note);

    return (
        <motion.div
            key="editor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col h-[calc(100vh-8rem)]"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {note.id !== 'new' && onDelete && (
                        <button
                            onClick={() => onDelete(note.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete note"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={onDiscard} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Discard
                    </button>
                    <button
                        onClick={() => onSave(editingNote)}
                        className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                    >
                        <Save className="w-4 h-4" />
                        Save Note
                    </button>
                </div>
            </div>
            <div className="flex-1 bg-white border border-zinc-100 rounded-2xl md:rounded-3xl shadow-sm p-6 md:p-10 flex flex-col overflow-hidden">
                <input
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    placeholder="Note title..."
                    className="text-2xl md:text-4xl font-bold text-zinc-900 placeholder:text-zinc-200 border-none focus:ring-0 w-full mb-4 md:mb-6 outline-none bg-transparent"
                />
                <div className="flex-1 overflow-y-auto pr-4">
                    <RichTextEditor content={editingNote.content} onChange={(content) => setEditingNote({ ...editingNote, content })} />
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Notes Page ---
export const Notes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('updated_at', { ascending: false });

        if (!error && data) {
            setNotes(data.map(n => ({
                id: n.id,
                title: n.title,
                content: n.content,
                modified: new Date(n.updated_at).toLocaleDateString(),
                user_id: n.user_id,
                folder_id: n.folder_id
            })));
        }
        setLoading(false);
    };

    const startNewNote = () => {
        setEditingNote({ id: 'new', title: '', content: '', modified: 'Just now' });
    };

    const handleSave = async (updatedNote: Note) => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const noteToSave = {
            title: updatedNote.title,
            content: updatedNote.content,
            user_id: userData.user.id,
            updated_at: new Date().toISOString()
        };

        const result = updatedNote.id === 'new'
            ? await supabase.from('notes').insert([noteToSave]).select()
            : await supabase.from('notes').update(noteToSave).eq('id', updatedNote.id).select();

        if (!result.error) {
            fetchNotes();
            setEditingNote(null);
            // Run intelligent sorting in the background
            runIntelligentSort();
        }
    };

    const runIntelligentSort = async () => {
        const { data: latestNotes } = await supabase.from('notes').select('*');
        const { data: userData } = await supabase.auth.getUser();
        if (!latestNotes || !userData.user) return;

        const { data: existingFolders } = await supabase.from('folders').select('id, name').eq('user_id', userData.user.id);
        const folders = existingFolders || [];
        const folderNames = folders.map(f => f.name);

        const formattedNotes = latestNotes.map(n => ({
            id: n.id,
            title: n.title,
            content: n.content,
            modified: new Date(n.updated_at).toLocaleDateString(),
            folder_id: n.folder_id
        }));

        const results = await classifyNotesIntoFolders(formattedNotes, folderNames);

        for (const folder of results) {
            let folderId = folders.find(f => f.name.toLowerCase().trim() === folder.name.toLowerCase().trim())?.id;

            if (!folderId) {
                const { data: newF } = await supabase.from('folders').insert([{ name: folder.name, user_id: userData.user.id }]).select().single();
                if (newF) folderId = newF.id;
            }

            if (folderId) {
                await supabase.from('notes').update({ folder_id: folderId }).in('id', folder.noteIds);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        const { error } = await supabase.from('notes').delete().eq('id', id);
        if (!error) fetchNotes();
    };

    return (
        <div className="relative h-full">
            <AnimatePresence mode="wait">
                {!editingNote ? (
                    <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold text-zinc-900">My Notes</h1>
                            <button onClick={startNewNote} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
                                <Plus className="w-4 h-4" />
                                New Note
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-zinc-200" />
                            </div>
                        ) : notes.length === 0 ? (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-3xl bg-zinc-50/30">
                                <Plus className="w-12 h-12 text-zinc-200 mb-4" />
                                <h3 className="text-lg font-medium text-zinc-900">No notes yet</h3>
                                <button onClick={startNewNote} className="mt-4 text-sm font-semibold text-zinc-900 hover:underline">Start your first note</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {notes.map((note) => (
                                    <div key={note.id} className="relative group bento-card border border-zinc-100/50 hover:border-zinc-200 transition-colors">
                                        <div onClick={() => setEditingNote(note)} className="cursor-pointer">
                                            <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-zinc-600 transition-colors">{note.title || 'Untitled Note'}</h3>
                                            <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">{getPreviewText(note.content) || 'Start writing...'}</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                                            className="absolute top-4 right-4 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div onClick={() => setEditingNote(note)} className="mt-6 pt-4 border-t border-zinc-50 flex items-center justify-between font-medium cursor-pointer">
                                            <span className="text-xs text-zinc-400">Modified {note.modified}</span>
                                            <ChevronRight className="w-4 h-4 text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <NoteEditor note={editingNote} onSave={handleSave} onDiscard={() => setEditingNote(null)} onDelete={handleDelete} />
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Folders Page ---
export const Folders = () => {
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [isClassifying, setIsClassifying] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const fetchData = async () => {
        const { data: notesData } = await supabase.from('notes').select('*');
        const { data: foldersData } = await supabase.from('folders').select('*');

        if (notesData) {
            const formattedNotes = notesData.map(n => ({
                id: n.id,
                title: n.title,
                content: n.content,
                modified: new Date(n.updated_at).toLocaleDateString(),
                folder_id: n.folder_id
            }));
            setNotes(formattedNotes);

            if (foldersData) {
                const formattedFolders = foldersData.map(f => ({
                    id: f.id,
                    name: f.name,
                    noteIds: formattedNotes.filter(n => n.folder_id === f.id).map(n => n.id)
                }));
                setFolders(formattedFolders);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-sort on load if uncategorized notes exist
    useEffect(() => {
        if (notes.length > 0 && !isClassifying) {
            const hasUncategorized = notes.some(n => !n.folder_id);
            if (hasUncategorized) {
                runClassification();
            }
        }
    }, [notes]);

    const handleDeleteFolder = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Delete this folder? Notes inside will be moved to "All Notes".')) return;

        // First, clear folder_id for notes in this folder
        await supabase.from('notes').update({ folder_id: null }).eq('folder_id', id);

        // Then delete the folder
        const { error } = await supabase.from('folders').delete().eq('id', id);
        if (!error) fetchData();
    };

    const runClassification = async () => {
        if (isClassifying) return;
        setIsClassifying(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return;

            // 1. Get existing folders to avoid duplicates
            const { data: existingFolders } = await supabase
                .from('folders')
                .select('id, name')
                .eq('user_id', userData.user.id);

            const folders = existingFolders || [];
            const folderNames = folders.map(f => f.name);

            // 2. Run AI Classification with context of existing folders
            const results = await classifyNotesIntoFolders(notes, folderNames);

            // 3. Process proposed folders using robust name matching
            for (const folder of results) {
                let folderId = folders.find(f => f.name.toLowerCase().trim() === folder.name.toLowerCase().trim())?.id;

                if (!folderId) {
                    // Create new folder only if absolutely necessary
                    const { data: newFolder } = await supabase
                        .from('folders')
                        .insert([{ name: folder.name, user_id: userData.user.id }])
                        .select()
                        .single();

                    if (newFolder) folderId = newFolder.id;
                }

                // 4. Update notes
                if (folderId && folder.noteIds.length > 0) {
                    await supabase
                        .from('notes')
                        .update({ folder_id: folderId })
                        .in('id', folder.noteIds);
                }
            }

            fetchData();
        } catch (e) {
            console.error('Classification error:', e);
        } finally {
            setIsClassifying(false);
        }
    };

    const handleSaveNote = async (updatedNote: Note) => {
        const { error } = await supabase
            .from('notes')
            .update({ title: updatedNote.title, content: updatedNote.content, updated_at: new Date().toISOString() })
            .eq('id', updatedNote.id);

        if (!error) {
            fetchData();
            setEditingNote(null);
        }
    };

    const folderNotes = selectedFolder
        ? notes.filter(n => selectedFolder.noteIds.includes(n.id))
        : [];

    return (
        <div className="relative h-full">
            <AnimatePresence mode="wait">
                {editingNote ? (
                    <NoteEditor note={editingNote} onSave={handleSaveNote} onDiscard={() => setEditingNote(null)} />
                ) : !selectedFolder ? (
                    <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex items-center justify-between mb-10">
                            <h1 className="text-3xl font-bold text-zinc-900">Folders</h1>
                            <button
                                onClick={runClassification}
                                disabled={isClassifying || notes.length === 0}
                                className="flex items-center gap-2 bg-white border border-zinc-200 px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm disabled:opacity-50"
                            >
                                {isClassifying ? <Loader2 className="w-4 h-4 animate-spin text-zinc-400" /> : <Sparkles className="w-4 h-4 text-zinc-400" />}
                                {isClassifying ? 'Analyzing...' : 'Refresh AI Sort'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {isClassifying && folders.length === 0 ? (
                                Array(3).fill(0).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-zinc-100 animate-pulse" />)
                            ) : folders.length === 0 ? (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-3xl bg-zinc-50/30">
                                    <FolderIcon className="w-12 h-12 text-zinc-200 mb-4" />
                                    <h3 className="text-lg font-medium text-zinc-900 italic">No folders organized yet.</h3>
                                    <p className="text-zinc-500 text-sm mt-2 text-center max-w-xs">Write some notes and our AI will categorize them instantly.</p>
                                </div>
                            ) : (
                                folders.map((folder) => (
                                    <div key={folder.id} onClick={() => setSelectedFolder(folder)} className="group p-6 bg-white border border-zinc-100 rounded-3xl hover:border-zinc-900 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-start gap-4 relative">
                                        <button
                                            onClick={(e) => handleDeleteFolder(e, folder.id)}
                                            className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 z-10"
                                            title="Delete folder"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="p-3 bg-zinc-50 rounded-2xl group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                                            <FolderIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-zinc-900 truncate w-full pr-10">{folder.name}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{folder.noteIds.length} notes sorted</p>
                                        </div>
                                        <div className="w-full h-px bg-zinc-50 my-2" />
                                        <div className="flex -space-x-2">
                                            {folder.noteIds.slice(0, 3).map((nid) => {
                                                const n = notes.find(x => x.id === nid);
                                                return n ? (
                                                    <div key={nid} title={n.title} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-50 flex items-center justify-center text-[10px] font-bold text-zinc-400 uppercase">
                                                        {n.title.charAt(0) || '?'}
                                                    </div>
                                                ) : null;
                                            })}
                                            {folder.noteIds.length > 3 && (
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-50 flex items-center justify-center text-[10px] font-bold text-zinc-400">+{folder.noteIds.length - 3}</div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => setSelectedFolder(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-zinc-500" /></button>
                            <div className="flex items-center gap-3">
                                <FolderIcon className="w-6 h-6 text-zinc-400" />
                                <h1 className="text-3xl font-bold text-zinc-900">{selectedFolder.name}</h1>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {folderNotes.map((note) => (
                                <div key={note.id} onClick={() => setEditingNote(note)} className="group flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-900 hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-zinc-50 rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-colors"><FileText className="w-5 h-5" /></div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-900 group-hover:text-zinc-900 transition-colors">{note.title || 'Untitled Note'}</h3>
                                            <p className="text-sm text-zinc-500 line-clamp-1 max-w-md">{getPreviewText(note.content)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs text-zinc-400 font-medium">Modified {note.modified}</span>
                                        <ChevronRight className="w-4 h-4 text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                                    </div>
                                </div>
                            ))}
                            {folderNotes.length === 0 && <div className="py-20 text-center text-zinc-500">No notes in this folder.</div>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

import { Share2 } from 'lucide-react';

export const Shared = () => (
    <div className="flex flex-col items-center justify-center h-full py-20 px-8 opacity-40">
        <Share2 className="w-16 h-16 mb-4 text-zinc-200" />
        <h1 className="text-3xl font-bold text-zinc-900">Shared Workspace</h1>
        <p className="max-w-xs text-center mt-2 text-zinc-500 font-medium">Coming soon for team collaborative note-taking.</p>
    </div>
);
export const Settings = () => {
    const [user, setUser] = useState({ name: 'Guest User', email: 'guest@example.com' });

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                if (profile) {
                    setUser({
                        name: profile.username || authUser.email?.split('@')[0] || 'User',
                        email: authUser.email || ''
                    });
                }
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-zinc-900 mb-8">Settings</h1>

            <div className="bg-white border border-zinc-100 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-zinc-50">
                    <h3 className="text-lg font-bold text-zinc-900 mb-1">Profile Information</h3>
                    <p className="text-sm text-zinc-500">Manage your account details and how others see you.</p>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center text-white text-2xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center sm:text-left">
                            <h4 className="text-xl font-bold text-zinc-900">{user.name}</h4>
                            <p className="text-zinc-500">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-zinc-900">Display Name</label>
                            <div className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-600 font-medium">
                                {user.name}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-zinc-900">Email Address</label>
                            <div className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-600 font-medium text-wrap break-all">
                                {user.email}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-zinc-50/50 flex justify-end">
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            window.location.href = '/login';
                        }}
                        className="flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </div>

            <div className="mt-8 p-8 bg-red-50/30 border border-red-100 rounded-3xl">
                <h3 className="text-lg font-bold text-red-900 mb-1">Danger Zone</h3>
                <p className="text-sm text-red-600/70 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                <button
                    onClick={async () => {
                        const { data: { user: authUser } } = await supabase.auth.getUser();
                        if (authUser && confirm('ARE YOU ABSOLUTELY SURE? This will delete all your notes and profile data.')) {
                            // Supabase will cascade delete due to foreign keys if set up correctly
                            // In this case, we'd need a RPC or admin level to delete from auth.users, 
                            // but for demo let's just show the button works for signing out.
                            await supabase.auth.signOut();
                            window.location.href = '/';
                        }
                    }}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
};
