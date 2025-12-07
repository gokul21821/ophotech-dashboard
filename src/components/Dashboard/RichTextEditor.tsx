'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

export function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    immediatelyRender: false, // Fix SSR hydration mismatch
  });

  // Sync content when it changes (for edit mode)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    isActive: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-all duration-150 ${
        isActive
          ? 'bg-blue-800 text-white border border-blue-700 shadow-sm scale-105'
          : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:focus:border-none [&_.ProseMirror]:focus:ring-0 [&_.ProseMirror]:focus:shadow-none">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          disabled={disabled}
          title="Bold"
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          disabled={disabled}
          title="Italic"
        >
          <Italic size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          disabled={disabled}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          disabled={disabled}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          disabled={disabled}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          disabled={disabled}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          disabled={disabled}
          title="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          disabled={disabled}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href;
            let url = window.prompt('URL', previousUrl);

            if (url === null) {
              return;
            }

            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }

            // Add https:// if no protocol is specified
            if (url && !/^https?:\/\//i.test(url)) {
              url = 'https://' + url;
            }

            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}
          isActive={editor.isActive('link')}
          disabled={disabled}
          title="Link"
        >
          <LinkIcon size={18} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className={`p-4 min-h-[200px] focus:outline-none text-black [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:focus:border-none [&_.ProseMirror]:ring-0 [&_.ProseMirror]:focus:ring-0 [&_.ProseMirror]:shadow-none [&_.ProseMirror]:focus:shadow-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-black [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-black [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:text-black [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:text-black [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:text-black [&_li]:mb-1 [&_li]:text-black [&_p]:mb-4 [&_p]:last:mb-0 [&_p]:text-black [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
}
