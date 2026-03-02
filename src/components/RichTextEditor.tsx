import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Code } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MenuButton = ({
    onClick,
    isActive,
    children,
    title
}: {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    title?: string;
}) => (
    <button
        type="button"
        title={title}
        onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        }}
        className={`p-2 rounded-lg transition-all duration-75 flex items-center justify-center min-w-[36px] min-h-[36px] ${isActive
            ? 'bg-zinc-900 text-white shadow-md scale-105 active:scale-95'
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200'
            }`}
    >
        {children}
    </button>
);

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
    // Local state to force React re-render when Tiptap state changes
    const [, setSelectionCount] = useState(0);

    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        // Force re-render on any interaction to update button colors
        onSelectionUpdate: () => setSelectionCount(c => c + 1),
        onTransaction: () => setSelectionCount(c => c + 1),
        editorProps: {
            attributes: {
                class: 'prose prose-zinc max-w-none focus:outline-none min-h-[400px] text-base md:text-lg text-zinc-600 leading-relaxed p-5 md:p-8 bg-white',
            },
        },
    });

    // Sync content if it changes externally
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    const toggleBold = () => editor.chain().focus().toggleBold().run();
    const toggleItalic = () => editor.chain().focus().toggleItalic().run();
    const toggleH1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
    const toggleH2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
    const toggleBullet = () => editor.chain().focus().toggleBulletList().run();
    const toggleOrdered = () => editor.chain().focus().toggleOrderedList().run();
    const toggleQuote = () => editor.chain().focus().toggleBlockquote().run();
    const toggleCode = () => editor.chain().focus().toggleCode().run();

    return (
        <div className="flex flex-col h-full border border-zinc-100 rounded-3xl overflow-hidden bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-50/80 border-b border-zinc-100 sticky top-0 z-20 backdrop-blur-md">
                <MenuButton onClick={toggleBold} isActive={editor.isActive('bold')} title="Bold">
                    <Bold className="w-4 h-4" />
                </MenuButton>
                <MenuButton onClick={toggleItalic} isActive={editor.isActive('italic')} title="Italic">
                    <Italic className="w-4 h-4" />
                </MenuButton>
                <MenuButton onClick={toggleCode} isActive={editor.isActive('code')} title="Code">
                    <Code className="w-4 h-4" />
                </MenuButton>

                <div className="w-px h-6 bg-zinc-200 mx-1" />

                <MenuButton onClick={toggleH1} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
                    <Heading1 className="w-4 h-4" />
                </MenuButton>
                <MenuButton onClick={toggleH2} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
                    <Heading2 className="w-4 h-4" />
                </MenuButton>

                <div className="w-px h-6 bg-zinc-200 mx-1" />

                <MenuButton onClick={toggleBullet} isActive={editor.isActive('bulletList')} title="Bullet List">
                    <List className="w-4 h-4" />
                </MenuButton>
                <MenuButton onClick={toggleOrdered} isActive={editor.isActive('orderedList')} title="Ordered List">
                    <ListOrdered className="w-4 h-4" />
                </MenuButton>
                <MenuButton onClick={toggleQuote} isActive={editor.isActive('blockquote')} title="Blockquote">
                    <Quote className="w-4 h-4" />
                </MenuButton>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};
