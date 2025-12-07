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
          class: 'text-[#D9751E] hover:text-[#c1651a] underline font-medium',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    immediatelyRender: false,
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
      className={`p-2.5 rounded-lg transition-all duration-150 flex items-center justify-center ${
        isActive
          ? 'bg-[#D9751E] text-white shadow-md'
          : 'hover:bg-[#FFF6EB] text-[#3A4A5F] hover:text-[#D9751E]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );

  const Separator = () => <div className="w-px h-6 bg-[#fcd5ac] mx-1" />;

  return (
    <div className="border border-[#fcd5ac] rounded-2xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gradient-to-r from-white to-[#FFF6EB] border-b border-[#fcd5ac] p-4 flex flex-wrap gap-2">
        {/* Text Formatting */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={disabled}
            title="Bold (Ctrl+B)"
          >
            <Bold size={18} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={disabled}
            title="Italic (Ctrl+I)"
          >
            <Italic size={18} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            disabled={disabled}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon size={18} />
          </ToolbarButton>
        </div>

        <Separator />

        {/* Headings */}
        <div className="flex gap-1">
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
        </div>

        <Separator />

        {/* Lists */}
        <div className="flex gap-1">
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
        </div>

        <Separator />

        {/* Link */}
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
        className={`p-4 min-h-[300px] max-h-[500px] overflow-y-auto focus:outline-none text-[#0B1B2B] [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:focus:border-none [&_.ProseMirror]:ring-0 [&_.ProseMirror]:focus:ring-0 [&_.ProseMirror]:shadow-none [&_.ProseMirror]:focus:shadow-none [&_.ProseMirror]:min-h-[300px] [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-[#0B1B2B] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-[#0B1B2B] [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:text-[#0B1B2B] [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:text-[#3A4A5F] [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:text-[#3A4A5F] [&_li]:mb-1 [&_li]:text-[#3A4A5F] [&_p]:mb-4 [&_p]:last:mb-0 [&_p]:text-[#3A4A5F] [&_p]:leading-relaxed [&_a]:text-[#D9751E] [&_a]:hover:text-[#c1651a] [&_a]:underline [&_a]:font-medium ${
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
        }`}
      />
    </div>
  );
}